/**
 * GPIO lines tied to in-package / octal PSRAM (and SPI flash bus) per Espressif HW design.
 * Used for pin pickers and conflict audit — not emitted in configuration.h.
 *
 * @see https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/gpio.html
 */

const needsPsram = (getValueId) =>
    getValueId("has_psram") === true ||
    (getValueId("cameratype") && getValueId("cameratype") !== "-1")

const isOctalPsramProfile = (memoryType) =>
    memoryType === "dio_opi" ||
    memoryType === "qio_opi" ||
    memoryType === "opi_opi"

/** MCU → GPIO strings reserved when PSRAM is in use */
const psramGpioByMcu = {
    /** WROVER / modules with PSRAM: GPIO16 (CS), GPIO17 (SCLK) */
    esp32: ["16", "17"],
    /** SPI flash + PSRAM on module (ESP32-S2) */
    esp32s2: ["26", "27", "28", "29", "30", "31"],
    /** ESP32-S3R8 / octal variants: base SPI lines */
    esp32s3: ["26", "27", "28", "29", "30", "31", "32"],
    esp32c3: ["26", "27", "28", "29", "30", "31", "32"],
    esp32c6: ["26", "27", "28", "29", "30", "31", "32"],
}

const octalExtraGpioEsp32s3 = ["33", "34", "35", "36", "37"]

const getPsramReservedGpios = (getValueId) => {
    if (!needsPsram(getValueId)) return []
    const mcu = getValueId("targetmcu")
    const base = psramGpioByMcu[mcu]
    if (!base) return []
    if (mcu === "esp32s3" && isOctalPsramProfile(getValueId("memory_type"))) {
        return [...base, ...octalExtraGpioEsp32s3]
    }
    return [...base]
}

const psramPinUsages = (getValueId) =>
    getPsramReservedGpios(getValueId).map((gpio) => ({
        section: "features",
        id: "has_psram",
        label: "PSRAM",
        raw: "-1",
        effective: gpio,
        description: "Reserved by module PSRAM / SPI bus",
    }))

export {
    needsPsram,
    psramGpioByMcu,
    getPsramReservedGpios,
    psramPinUsages,
}
