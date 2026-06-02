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

// Sections referenced by UI should have a matching JSON file
const stepsPath = path.join(__dirname, "..", "src", "pages", "config", "steps.js")
const stepsSource = fs.readFileSync(stepsPath, "utf8")
const sectionMatches = [...stepsSource.matchAll(/section:\s*"([^"]+)"/g)].map(
    (m) => m[1]
)
for (const section of sectionMatches) {
    if (section === "generate") continue
    const expected = `${section}.json`
    if (!jsonFiles.includes(expected) && section !== "default") {
        warnings.push(`configTabs section "${section}" has no ${expected}`)
    }
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
    `Configuration OK (${jsonFiles.length} tab files, ${idSet.size} unique field ids, ${depends.length} depend rules checked)`
)
