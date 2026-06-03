import { Version } from "../components/App/version"
import { applyBoardPreset, forEachField } from "./applyBoardPreset"

const SNAPSHOT_BEGIN = "ESP3D_CONFIG_SNAPSHOT_BEGIN"
const SNAPSHOT_END = "ESP3D_CONFIG_SNAPSHOT_END"
const SNAPSHOT_VERSION = 1

const collectConfigurationSnapshot = (configuration) => {
    const values = {}
    forEachField(configuration, (field) => {
        if (!field.id) return
        values[field.id] = field.value
    })
    return {
        version: SNAPSHOT_VERSION,
        generator: "ESP3D-Configurator",
        configuratorVersion: Version,
        values,
    }
}

const formatSnapshotComment = (snapshot) =>
    "\n\n/************************************\n" +
    " * ESP3D-Configurator settings snapshot\n" +
    " * Re-import: Features tab → Board preset → Import configuration.h\n" +
    " ************************************/\n" +
    `/* ${SNAPSHOT_BEGIN}\n` +
    `${JSON.stringify(snapshot, null, 2)}\n` +
    `${SNAPSHOT_END} */\n`

const parseSnapshotFromText = (text) => {
    const block = text.match(
        new RegExp(
            `${SNAPSHOT_BEGIN}\\s*([\\s\\S]*?)\\s*${SNAPSHOT_END}`,
            "m"
        )
    )
    if (!block) {
        return { ok: false, error: "no_snapshot" }
    }
    try {
        const parsed = JSON.parse(block[1].trim())
        const values = parsed.values ?? parsed
        if (!values || typeof values !== "object" || Array.isArray(values)) {
            return { ok: false, error: "invalid_format" }
        }
        return { ok: true, snapshot: { ...parsed, values } }
    } catch (e) {
        return { ok: false, error: "invalid_json", message: e.message }
    }
}

const snapshotImportErrorMessage = (parseResult) => {
    if (!parseResult || parseResult.ok) return ""
    switch (parseResult.error) {
        case "no_snapshot":
            return "No configurator snapshot in this file. Download configuration.h from this tool first (JSON block at end of file)."
        case "invalid_json":
            return parseResult.message
                ? `Snapshot JSON is corrupted or invalid (${parseResult.message}).`
                : "Snapshot JSON is corrupted or invalid."
        case "invalid_format":
            return "Snapshot format is invalid (missing values object)."
        default:
            return "Could not read configuration snapshot."
    }
}

const applyConfigurationSnapshot = (configuration, snapshot) => {
    const values = snapshot.values ?? snapshot
    const presetLike = { id: "import", values }
    const { applied, unknown } = applyBoardPreset(configuration, presetLike)
    return {
        applied,
        unknown,
        fieldCount: Object.keys(values).length,
    }
}

export {
    SNAPSHOT_BEGIN,
    SNAPSHOT_END,
    SNAPSHOT_VERSION,
    collectConfigurationSnapshot,
    formatSnapshotComment,
    parseSnapshotFromText,
    snapshotImportErrorMessage,
    applyConfigurationSnapshot,
}
