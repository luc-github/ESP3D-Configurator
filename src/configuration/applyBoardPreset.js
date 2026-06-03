import { syncCameraPinsForModel } from "./cameraPins"

const forEachField = (configuration, visitor) => {
    if (!configuration) return
    Object.keys(configuration).forEach((section) => {
        const groups = configuration[section]
        if (!Array.isArray(groups)) return
        groups.forEach((group) => {
            if (group.type === "group" && Array.isArray(group.value)) {
                group.value.forEach((field) => visitor(field, section, group))
            }
        })
    })
}

const setFieldValueById = (configuration, fieldId, value) => {
    let found = false
    forEachField(configuration, (field) => {
        if (field.id === fieldId) {
            field.value = value
            found = true
        }
    })
    return found
}

const applyBoardPreset = (configuration, preset) => {
    const unknown = []
    const values = preset.values || {}
    let applied = 0
    Object.entries(values).forEach(([fieldId, value]) => {
        if (setFieldValueById(configuration, fieldId, value)) {
            applied += 1
        } else {
            unknown.push(fieldId)
        }
    })
    if (values.cameratype && values.cameratype !== "-1") {
        syncCameraPinsForModel(configuration, values.cameratype)
    }
    return { applied, unknown, presetId: preset.id }
}

const getBoardPresetById = (presets, id) =>
    presets.find((preset) => preset.id === id)

export { applyBoardPreset, setFieldValueById, getBoardPresetById, forEachField }
