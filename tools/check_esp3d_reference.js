/**
 * Compares configurator camera options with ESP3D firmware in tmp/esp3d.
 * Optional: run after dropping ESP3D sources into tmp/
 *
 * Usage: node tools/check_esp3d_reference.js
 */

const fs = require("fs")
const path = require("path")

const definesPath = path.join(
    __dirname,
    "..",
    "tmp",
    "esp3d",
    "src",
    "include",
    "esp3d_defines.h"
)
const devicesPath = path.join(
    __dirname,
    "..",
    "src",
    "configuration",
    "tabs",
    "devices.json"
)

if (!fs.existsSync(definesPath)) {
    console.log("ESP3D reference check skipped (tmp/esp3d not present)")
    process.exit(0)
}

const definesSource = fs.readFileSync(definesPath, "utf8")
const firmwareModels = [
    ...definesSource.matchAll(/#define (CAMERA_MODEL_\w+)\s+\d+/g),
].map((m) => m[1])

const devices = JSON.parse(fs.readFileSync(devicesPath, "utf8"))
const cameraGroup = devices.find((g) => g.id === "camera")
const cameratype = cameraGroup?.value?.find((f) => f.id === "cameratype")
const uiModels = (cameratype?.options || [])
    .map((o) => o.value)
    .filter((v) => v !== "-1")

const missingInUi = firmwareModels.filter((m) => !uiModels.includes(m))
const extraInUi = uiModels.filter((m) => !firmwareModels.includes(m))

let failed = false
if (missingInUi.length) {
    failed = true
    console.error("Camera models in firmware but missing in configurator UI:")
    missingInUi.forEach((m) => console.error(`  - ${m}`))
}
if (extraInUi.length) {
    failed = true
    console.error("Camera models in configurator UI but unknown in firmware:")
    extraInUi.forEach((m) => console.error(`  - ${m}`))
}

if (failed) {
    process.exit(1)
}

console.log(
    `ESP3D reference OK (${firmwareModels.length} firmware models, ${uiModels.length} in UI)`
)
