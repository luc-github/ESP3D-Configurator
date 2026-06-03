/**
 * Validates src/configuration/tabs/*.json
 * - unique field ids across all tabs
 * - depend.id references point to existing ids
 * - JSON syntax
 *
 * Usage: node tools/validate_configuration.js
 */

const fs = require("fs")
const path = require("path")

const tabsDir = path.join(__dirname, "..", "src", "configuration", "tabs")
const errors = []
const warnings = []

const collectIds = (node, file, locations, ids) => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
        node.forEach((item, index) =>
            collectIds(item, file, `${locations}[${index}]`, ids)
        )
        return
    }
    if (typeof node.id === "string") {
        const entry = { file, location: locations }
        if (!ids.has(node.id)) ids.set(node.id, [])
        ids.get(node.id).push(entry)
    }
    if (node.value) collectIds(node.value, file, `${locations}.value`, ids)
    if (node.options) collectIds(node.options, file, `${locations}.options`, ids)
}

const rolesPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "pinUsageRoles.json"
)
let pinRoleRegistry = {}
let allowedPinRoles = []
try {
    const rolesDoc = JSON.parse(fs.readFileSync(rolesPath, "utf8"))
    pinRoleRegistry = rolesDoc.fields || {}
    allowedPinRoles = Object.keys(rolesDoc.taxonomy?.fieldRoles || {})
} catch (e) {
    errors.push(`pinUsageRoles.json: ${e.message}`)
}

const collectPinRoleFields = (node, file, locations, pinFields) => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
        node.forEach((item, index) =>
            collectPinRoleFields(item, file, `${locations}[${index}]`, pinFields)
        )
        return
    }
    if (typeof node.id === "string" && (node.ispin || pinRoleRegistry[node.id])) {
        pinFields.push({ id: node.id, file, location: locations, field: node })
    }
    if (node.value) collectPinRoleFields(node.value, file, `${locations}.value`, pinFields)
    if (node.options) collectPinRoleFields(node.options, file, `${locations}.options`, pinFields)
}

const collectDependIds = (node, file, locations, depends) => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
        node.forEach((item, index) =>
            collectDependIds(item, file, `${locations}[${index}]`, depends)
        )
        return
    }
    if (node.depend) {
        const deps = Array.isArray(node.depend) ? node.depend : [node.depend]
        deps.forEach((dep, index) => {
            if (dep && dep.id) {
                depends.push({
                    refId: dep.id,
                    file,
                    location: `${locations}.depend${Array.isArray(node.depend) ? `[${index}]` : ""}`,
                })
            }
        })
    }
    if (node.value) collectDependIds(node.value, file, `${locations}.value`, depends)
    if (node.options) collectDependIds(node.options, file, `${locations}.options`, depends)
}

const jsonFiles = fs
    .readdirSync(tabsDir)
    .filter((name) => name.endsWith(".json"))
    .sort()

const ids = new Map()
const depends = []
const pinFields = []

for (const file of jsonFiles) {
    const filePath = path.join(tabsDir, file)
    let data
    try {
        data = JSON.parse(fs.readFileSync(filePath, "utf8"))
    } catch (e) {
        errors.push(`${file}: invalid JSON — ${e.message}`)
        continue
    }
    if (!Array.isArray(data)) {
        errors.push(`${file}: root must be a JSON array of groups`)
        continue
    }
    collectIds(data, file, file, ids)
    collectDependIds(data, file, file, depends)
    collectPinRoleFields(data, file, file, pinFields)
}

for (const { id, file, location, field } of pinFields) {
    if (!field.pinRole) {
        errors.push(`${file} (${location}): "${id}" missing pinRole`)
        continue
    }
    if (!allowedPinRoles.includes(field.pinRole)) {
        errors.push(
            `${file} (${location}): "${id}" invalid pinRole "${field.pinRole}"`
        )
    }
    const spec = pinRoleRegistry[id]
    if (spec && field.pinRole !== spec.role) {
        errors.push(
            `${file} (${location}): "${id}" pinRole "${field.pinRole}" !== registry "${spec.role}"`
        )
    }
}

for (const registryId of Object.keys(pinRoleRegistry)) {
    if (!pinFields.some((p) => p.id === registryId)) {
        warnings.push(`pinUsageRoles.json: "${registryId}" has no tab field`)
    }
}

for (const [id, locations] of ids) {
    if (locations.length > 1) {
        const where = locations.map((l) => `${l.file} (${l.location})`).join("; ")
        errors.push(`duplicate id "${id}": ${where}`)
    }
}

const idSet = new Set(ids.keys())
for (const dep of depends) {
    if (!idSet.has(dep.refId)) {
        errors.push(
            `unknown depend.id "${dep.refId}" in ${dep.file} (${dep.location})`
        )
    }
}

// Sections referenced by UI should have a matching JSON file and index export
const stepsPath = path.join(__dirname, "..", "src", "pages", "config", "steps.js")
const indexPath = path.join(__dirname, "..", "src", "configuration", "index.js")
const stepsSource = fs.readFileSync(stepsPath, "utf8")
const indexSource = fs.readFileSync(indexPath, "utf8")
const sectionMatches = [...stepsSource.matchAll(/section:\s*"([^"]+)"/g)].map(
    (m) => m[1]
)
const indexSections = [
    ...indexSource.matchAll(/^\s+(\w+):\s+\w+Configuration/gm),
].map((m) => m[1])

for (const section of sectionMatches) {
    if (section === "generate") continue
    const expected = section === "default" ? "defaults.json" : `${section}.json`
    if (!jsonFiles.includes(expected)) {
        warnings.push(`configTabs section "${section}" has no ${expected}`)
    }
    if (!indexSections.includes(section)) {
        errors.push(
            `configTabs section "${section}" is missing from configuration/index.js`
        )
    }
}

if (!indexSections.includes("default")) {
    errors.push('configuration/index.js must export a "default" section')
}

const mcuDefaultsPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "mcuPinDefaults.js"
)
const mcuSource = fs.readFileSync(mcuDefaultsPath, "utf8")
const mcuKeys = [
    ...mcuSource.matchAll(/^\s+(esp32\w*|esp8266|esp8285):\s*\{/gm),
].map((m) => m[1])
const generatePath = path.join(
    __dirname,
    "..",
    "src",
    "tabs",
    "generate",
    "index.js"
)
const generateSource = fs.readFileSync(generatePath, "utf8")
for (const mcu of mcuKeys) {
    if (!generateSource.includes(`${mcu}:`)) {
        warnings.push(`mcuPinDefaults "${mcu}" has no matching section in generate/index.js`)
    }
    if (!generateSource.includes(`mcuPinDefaults.${mcu}`)) {
        warnings.push(
            `generate/index.js should spread mcuPinDefaults.${mcu} (single source for default GPIO)`
        )
    }
}

const presetsPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "boardPresets.json"
)
let presetCount = 0
try {
    const presets = JSON.parse(fs.readFileSync(presetsPath, "utf8"))
    if (!Array.isArray(presets)) {
        errors.push("boardPresets.json: root must be an array")
    } else {
        const presetIds = new Set()
        presets.forEach((preset, index) => {
            presetCount += 1
            if (!preset.id) {
                errors.push(`boardPresets[${index}]: missing id`)
                return
            }
            if (presetIds.has(preset.id)) {
                errors.push(`boardPresets: duplicate preset id "${preset.id}"`)
            }
            presetIds.add(preset.id)
            if (!preset.values || typeof preset.values !== "object") {
                errors.push(`boardPresets "${preset.id}": missing values object`)
                return
            }
            Object.keys(preset.values).forEach((fieldId) => {
                if (!idSet.has(fieldId)) {
                    errors.push(
                        `boardPresets "${preset.id}": unknown field id "${fieldId}"`
                    )
                }
            })
        })
    }
} catch (e) {
    errors.push(`boardPresets.json: ${e.message}`)
}

if (warnings.length) {
    console.warn("Warnings:")
    warnings.forEach((w) => console.warn(`  - ${w}`))
}

if (errors.length) {
    console.error("Configuration validation failed:")
    errors.forEach((e) => console.error(`  - ${e}`))
    process.exit(1)
}

console.log(
    `Configuration OK (${jsonFiles.length} tab files, ${presetCount} board presets, ${idSet.size} unique field ids, ${depends.length} depend rules checked)`
)
