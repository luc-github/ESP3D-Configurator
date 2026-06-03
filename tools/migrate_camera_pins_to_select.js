/**
 * One-shot: camera GPIO fields → type select + ispin (string values).
 * Usage: node tools/migrate_camera_pins_to_select.js
 */

const fs = require("fs")
const path = require("path")

const devicesPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "tabs",
    "devices.json"
)

const data = JSON.parse(fs.readFileSync(devicesPath, "utf8"))

const migrateCameraPins = (groups) => {
    let count = 0
    groups.forEach((group) => {
        if (group.id !== "camerapins" || !Array.isArray(group.value)) return
        group.value.forEach((field) => {
            field.type = "select"
            field.ispin = true
            const v = field.value
            field.value =
                v === -1 || v === "-1" ? "-1" : String(v)
            count++
        })
    })
    return count
}

const n = migrateCameraPins(data)
fs.writeFileSync(devicesPath, JSON.stringify(data, null, 4) + "\n")
console.log(`Migrated ${n} camera pin fields to select+ispin`)
