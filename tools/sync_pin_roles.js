/**
 * Copies pinRole / pinRoleWhen from pinUsageRoles.json into tab JSON fields.
 * Usage: node tools/sync_pin_roles.js
 */

const fs = require("fs")
const path = require("path")

const tabsDir = path.join(__dirname, "..", "src", "configuration", "tabs")
const rolesPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "pinUsageRoles.json"
)

const rolesDoc = JSON.parse(fs.readFileSync(rolesPath, "utf8"))
const roleById = rolesDoc.fields
const allowedRoles = Object.keys(rolesDoc.taxonomy.fieldRoles)

const visitFields = (nodes, file, stats) => {
    if (!Array.isArray(nodes)) return
    nodes.forEach((node) => {
        if (!node || typeof node !== "object") return
        if (node.type === "group" && Array.isArray(node.value)) {
            visitFields(node.value, file, stats)
            return
        }
        if (typeof node.id !== "string") return
        const spec = roleById[node.id]
        if (!spec) return

        if (!allowedRoles.includes(spec.role)) {
            throw new Error(`${file}: ${node.id} invalid role ${spec.role}`)
        }
        if (node.pinRole !== spec.role) {
            node.pinRole = spec.role
            stats.updated++
        }
        if (spec.roleWhen?.sensortype) {
            const when = { dependId: "sensortype", map: spec.roleWhen.sensortype }
            if (JSON.stringify(node.pinRoleWhen) !== JSON.stringify(when)) {
                node.pinRoleWhen = when
                stats.whenUpdated++
            }
        } else if (node.pinRoleWhen) {
            delete node.pinRoleWhen
            stats.whenCleared++
        }
        stats.matched++
    })
}

let totalUpdated = 0
let totalMatched = 0

for (const file of fs.readdirSync(tabsDir).filter((n) => n.endsWith(".json"))) {
    const filePath = path.join(tabsDir, file)
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const stats = { updated: 0, matched: 0, whenUpdated: 0, whenCleared: 0 }
    visitFields(data, file, stats)
    if (stats.updated || stats.whenUpdated || stats.whenCleared) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + "\n")
    }
    totalUpdated += stats.updated
    totalMatched += stats.matched
    console.log(`${file}: ${stats.matched} fields, ${stats.updated} pinRole updated`)
}

console.log(`Done. ${totalMatched} fields, ${totalUpdated} pinRole writes.`)
