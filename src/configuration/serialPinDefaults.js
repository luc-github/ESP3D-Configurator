/**

 * Representative UART default GPIO when ESP_*_PIN is -1 (Arduino core / common devkits).

 * Used only for UI labels and pin-conflict tracking, not firmware pin assignment.

 */



import { SERIAL_PIN_IDS } from "./serialPins"
import { needsPsram } from "./psramReservedPins"



/** field id → config field that selects the UART */

const SERIAL_PORT_BY_FIELD = {

    ESP_RX_PIN: "serialport",

    ESP_TX_PIN: "serialport",

    ESP_BRIDGE_RX_PIN: "serialBridgeport",

    ESP_BRIDGE_TX_PIN: "serialBridgeport",

}



/**

 * MCU → USE_SERIAL_* → { rx, tx } (omit rx/tx when UART has no default on that line)

 */

const uartDefaultGpio = {

    esp32: {

        USE_SERIAL_0: { rx: 3, tx: 1 },

        USE_SERIAL_1: { rx: 9, tx: 10 },

        USE_SERIAL_2: { rx: 16, tx: 17 },

    },

    esp32s2: {

        USE_SERIAL_0: { rx: 44, tx: 43 },

        USE_SERIAL_1: { rx: 18, tx: 17 },

    },

    esp32s3: {

        USE_SERIAL_0: { rx: 44, tx: 43 },

        USE_SERIAL_1: { rx: 18, tx: 17 },

        USE_SERIAL_2: { rx: 8, tx: 9 },

    },

    esp32c3: {

        USE_SERIAL_0: { rx: 20, tx: 21 },

        USE_SERIAL_1: { rx: 18, tx: 19 },

    },

    esp32c6: {

        USE_SERIAL_0: { rx: 20, tx: 21 },

        USE_SERIAL_1: { rx: 18, tx: 19 },

    },

    esp8266: {

        USE_SERIAL_0: { rx: 3, tx: 1 },

        USE_SERIAL_1: { tx: 2 },

    },

    esp8285: {

        USE_SERIAL_0: { rx: 3, tx: 1 },

        USE_SERIAL_1: { tx: 2 },

    },

}



const isSerialPinField = (fieldId) => SERIAL_PIN_IDS.includes(fieldId)



const serialPinRole = (fieldId) =>

    fieldId.includes("_RX_") || fieldId.endsWith("_RX_PIN") ? "rx" : "tx"



const resolveSerialEffectivePin = (field, getValueId) => {

    if (!isSerialPinField(field.id)) return null

    if (field.value != "-1" && field.value != -1) {

        return String(field.value)

    }

    const portField = SERIAL_PORT_BY_FIELD[field.id]

    const port = getValueId(portField)

    if (!port || port === "-1") return null

    const mcu = getValueId("targetmcu")

    const role = serialPinRole(field.id)

    const uart = uartDefaultGpio[mcu]?.[port]

    if (!uart || uart[role] === undefined) return null
    const gpio = uart[role]
    if (
        mcu === "esp32" &&
        needsPsram(getValueId) &&
        (gpio === 16 || gpio === 17)
    ) {
        return null
    }
    return String(gpio)

}



export {

    SERIAL_PORT_BY_FIELD,

    uartDefaultGpio,

    isSerialPinField,

    resolveSerialEffectivePin,

}


