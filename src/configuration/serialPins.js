/**
 * Serial GPIO overrides (ESP3D esp3d_pins.h).
 * -1 = board default for the UART selected in ESP_SERIAL_OUTPUT / bridge port.
 */

const MAIN_SERIAL_PINS = [
    { id: "ESP_RX_PIN", label: "Main serial RX" },
    { id: "ESP_TX_PIN", label: "Main serial TX" },
]

const BRIDGE_SERIAL_PINS = [
    { id: "ESP_BRIDGE_RX_PIN", label: "Bridge serial RX" },
    { id: "ESP_BRIDGE_TX_PIN", label: "Bridge serial TX" },
]

const SERIAL_PIN_IDS = [
    ...MAIN_SERIAL_PINS.map((p) => p.id),
    ...BRIDGE_SERIAL_PINS.map((p) => p.id),
]

const emitPinOverride = (id, val) =>
    `#ifndef ${id}\n#define ${id} ${val}\n#endif  // ${id}\n`

const collectPinOverrides = (pins, getValueId) => {
    let lines = ""
    pins.forEach(({ id }) => {
        const val = getValueId(id)
        if (val === undefined || val === "" || val == -1) return
        lines += emitPinOverride(id, val)
    })
    return lines
}

const formatSerialPinDefines = (getValueId) => {
    const bridgeActive = getValueId("serialBridge") === true

    let block =
        "\n/************************************\n" +
        "*\n* Serial GPIO overrides (main + bridge)\n" +
        "*\n* -1 = board default (not emitted; see esp3d_pins.h)\n" +
        "*\n************************************/\n"

    const mainLines = collectPinOverrides(MAIN_SERIAL_PINS, getValueId)
    const bridgeLines = bridgeActive
        ? collectPinOverrides(BRIDGE_SERIAL_PINS, getValueId)
        : ""

    if (!mainLines && !bridgeLines) return ""

    if (mainLines) block += mainLines

    if (bridgeLines) {
        block +=
            "#if defined(ESP_SERIAL_BRIDGE_OUTPUT)\n" +
            bridgeLines +
            "#endif  // ESP_SERIAL_BRIDGE_OUTPUT\n"
    }

    return block
}

export {
    MAIN_SERIAL_PINS,
    BRIDGE_SERIAL_PINS,
    SERIAL_PIN_IDS,
    emitPinOverride,
    formatSerialPinDefines,
}
