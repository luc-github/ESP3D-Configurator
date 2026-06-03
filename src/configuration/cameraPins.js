import cameraPinMaps from "./cameraPinMaps.json"

const CAMERA_PIN_KEYS = Object.keys(cameraPinMaps.CAMERA_MODEL_CUSTOM)

const isCustomCameraModel = (model) => model === "CAMERA_MODEL_CUSTOM"

const getCameraPinMap = (model) => {
    if (!model || model === "-1") return null
    return cameraPinMaps[model] || null
}

const syncCameraPinsForModel = (configuration, model) => {
    const pins = getCameraPinMap(model)
    if (!pins || !configuration) return
    CAMERA_PIN_KEYS.forEach((key) => {
        if (pins[key] === undefined) return
        for (const section of Object.keys(configuration)) {
            const groups = configuration[section]
            if (!Array.isArray(groups)) continue
            for (const group of groups) {
                if (!Array.isArray(group.value)) continue
                for (const field of group.value) {
                    if (field.id === key) {
                        const v = pins[key]
                        field.value =
                            v === -1 || v === "-1" ? "-1" : String(v)
                    }
                }
            }
        }
    })
}

const formatCameraPinDefines = (configuration, getValueId) => {
    const model = getValueId("cameratype")
    if (!isCustomCameraModel(model)) return ""
    let block =
        "\n/************************************\n" +
        "*\n* Camera GPIO (CAMERA_MODEL_CUSTOM)\n" +
        "*\n* Custom camera GPIO overrides (configuration.h)\n" +
        "*\n************************************/\n"
    CAMERA_PIN_KEYS.forEach((key) => {
        const val = getValueId(key)
        if (
            val === undefined ||
            val === "" ||
            val == -1 ||
            val == "-1"
        ) {
            return
        }
        block += `#define ${key} ${val}\n`
    })
    return block
}

export {
    CAMERA_PIN_KEYS,
    cameraPinMaps,
    isCustomCameraModel,
    getCameraPinMap,
    syncCameraPinsForModel,
    formatCameraPinDefines,
}
