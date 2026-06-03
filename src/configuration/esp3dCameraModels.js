/**
 * Camera models supported by ESP3D (from esp3d/src/include/esp3d_defines.h).
 * Keep in sync with tmp/esp3d when updating firmware reference.
 */
const esp3dCameraModels = [
    { value: "CAMERA_MODEL_CUSTOM", label: "Custom", mcus: ["esp32", "esp32s2", "esp32s3"] },
    { value: "CAMERA_MODEL_ESP_EYE", label: "ESP-Eye", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_M5STACK_PSRAM", label: "M5Stack", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_M5STACK_V2_PSRAM", label: "M5Stack V2", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_M5STACK_WIDE", label: "M5Stack Wide", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_AI_THINKER", label: "AI Thinker (ESP32-Cam)", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_WROVER_KIT", label: "Wrover Kit", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_ESP32_CAM_BOARD", label: "Espressif ESP32 Cam Board", mcus: ["esp32"] },
    { value: "CAMERA_MODEL_ESP32S2_CAM_BOARD", label: "Espressif ESP32-S2 Cam Board", mcus: ["esp32s2"] },
    { value: "CAMERA_MODEL_ESP32S3_CAM_LCD", label: "Espressif ESP32-S3 Cam LCD", mcus: ["esp32s3"] },
    { value: "CAMERA_MODEL_ESP32S3_EYE", label: "ESP32-S3 Eye", mcus: ["esp32s3"] },
    { value: "CAMERA_MODEL_XIAO_ESP32S3", label: "Seeed Xiao ESP32-S3 Sense", mcus: ["esp32s3"] },
    { value: "CAMERA_MODEL_UICPAL_ESP32S3", label: "UICPAL ESP32-S3", mcus: ["esp32s3"] },
]

export { esp3dCameraModels }
