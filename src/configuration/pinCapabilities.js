/**
 * Per-MCU GPIO hardware capabilities (Espressif IDF restrictions + module wiring).
 * Used to filter pin pickers and validate assignments against pinRole.
 */

import { getPsramReservedGpios, needsPsram } from "./psramReservedPins"
import { getEffectivePinRole } from "./pinUsageRoles"

/** @typedef {{ input: boolean, output: boolean, adc: boolean, reserved: boolean, note?: string }} GpioCapability */

const inRange = (gpio, from, to) => gpio >= from && gpio <= to
const inList = (gpio, list) => list.includes(gpio)

/** Static rules per MCU (gpio 0–48). Dynamic PSRAM/SPI reserved merged in getGpioCapability. */
const mcuRules = {
    esp32: {
        flashBus: [6, 7, 8, 9, 10, 11],
        inputOnly: [34, 35, 36, 37, 38, 39],
        adc: [32, 33, 34, 35, 36, 37, 39],
    },
    esp8266: {
        maxGpio: 16,
        flashBus: [6, 7, 8, 9, 10, 11],
    },
    esp8285: {
        maxGpio: 16,
        flashBus: [6, 7, 8, 9, 10, 11],
    },
    esp32s2: {
        spiBus: [26, 27, 28, 29, 30, 31],
        inputOnly: [46],
    },
    esp32s3: {
        spiBus: [26, 27, 28, 29, 30, 31, 32],
        octalExtra: [33, 34, 35, 36, 37],
        inputOnly: [46],
    },
    esp32c3: {
        /** In-package flash on many C3 modules */
        flashBus: [11, 12, 13, 14, 15, 16],
    },
    esp32c6: {
        flashBus: [24, 25, 26, 27, 28, 29],
    },
}

const isOctalPsramProfile = (memoryType) =>
    memoryType === "dio_opi" ||
    memoryType === "qio_opi" ||
    memoryType === "opi_opi"

const buildStaticCapability = (mcu, gpio) => {
    const rules = mcuRules[mcu]
    if (!rules) {
        return { input: true, output: true, adc: false, reserved: false }
    }

    if (rules.maxGpio !== undefined && gpio > rules.maxGpio) {
        return {
            input: false,
            output: false,
            adc: false,
            reserved: true,
            note: "Not available on this MCU",
        }
    }

    let reserved = false
    let note

    if (rules.flashBus && inList(gpio, rules.flashBus)) {
        reserved = true
        note = "SPI flash bus"
    }
    if (rules.spiBus && inList(gpio, rules.spiBus)) {
        reserved = true
        note = "SPI flash / PSRAM"
    }

    const inputOnly = rules.inputOnly && inList(gpio, rules.inputOnly)
    const hasAdc = rules.adc && inList(gpio, rules.adc)

    return {
        input: true,
        output: !inputOnly && !reserved,
        adc: !!hasAdc,
        reserved,
        note,
    }
}

/**
 * @param {string} mcu
 * @param {number|string} gpio
 * @param {Function} getValueId
 * @returns {GpioCapability}
 */
const getGpioCapability = (mcu, gpio, getValueId) => {
    if (gpio === "-1" || gpio === "" || gpio === undefined || gpio === null) {
        return { input: true, output: true, adc: false, reserved: false }
    }
    const n = Number(gpio)
    if (!Number.isFinite(n)) {
        return { input: false, output: false, adc: false, reserved: true, note: "Invalid" }
    }

    let cap = buildStaticCapability(mcu, n)

    if (needsPsram(getValueId)) {
        if (mcu === "esp32" && inList(n, [16, 17])) {
            cap = { ...cap, reserved: true, output: false, note: "PSRAM (module)" }
        }
        if (
            (mcu === "esp32s2" || mcu === "esp32s3") &&
            inRange(n, 26, 31)
        ) {
            cap = { ...cap, reserved: true, output: false, note: "SPI flash / PSRAM" }
        }
        if (mcu === "esp32s3" && inRange(n, 26, 32)) {
            cap = { ...cap, reserved: true, output: false, note: "SPI flash / PSRAM" }
        }
        if (
            mcu === "esp32s3" &&
            isOctalPsramProfile(getValueId("memory_type")) &&
            inRange(n, 33, 37)
        ) {
            cap = { ...cap, reserved: true, output: false, note: "Octal flash / PSRAM" }
        }
    }

    const dynamicReserved = getPsramReservedGpios(getValueId)
    if (dynamicReserved.includes(String(n))) {
        cap = { ...cap, reserved: true, output: false, note: cap.note || "PSRAM / SPI bus" }
    }

    return cap
}

const roleAllowsCapability = (role, cap) => {
    if (cap.reserved) return false
    switch (role) {
        case "output":
            return cap.output
        case "input":
            return cap.input
        case "bidirectional":
            return cap.input && cap.output
        case "analog_input":
            return cap.input && cap.adc
        case "optional_gpio":
            return cap.input || cap.output
        default:
            return cap.input && cap.output
    }
}

const describeCapability = (cap) => {
    if (cap.reserved) return cap.note || "Reserved"
    if (cap.adc && !cap.output) return "Input / ADC only"
    if (!cap.output) return "Input only"
    if (!cap.input) return "Output only"
    return "Input / Output"
}

const rejectionMessage = (gpio, role, cap, mcu) => {
    const gpioLabel = gpio === "-1" ? "Default" : `GPIO ${gpio}`
    const roleLabel = role.replace(/_/g, " ")
    if (cap.reserved) {
        return `${gpioLabel} is reserved on ${mcu} (${cap.note || "module"})`
    }
    if (role === "analog_input" && !cap.adc) {
        return `${gpioLabel} has no ADC on ${mcu}`
    }
    if (role === "output" && !cap.output) {
        return `${gpioLabel} is input-only on ${mcu}`
    }
    if (role === "input" && !cap.input) {
        return `${gpioLabel} is output-only on ${mcu}`
    }
    if (role === "bidirectional" && (!cap.input || !cap.output)) {
        return `${gpioLabel} cannot be used as bidirectional on ${mcu} (${describeCapability(cap)})`
    }
    return `${gpioLabel} cannot be used as ${roleLabel} on ${mcu}`
}

/**
 * Whether a pin list option is allowed for this field.
 */
const isPinOptionAllowed = (field, optionValue, getValueId) => {
    if (optionValue === "-1") return true
    const role = getEffectivePinRole(field, getValueId)
    if (!role) return true
    const mcu = getValueId("targetmcu")
    const cap = getGpioCapability(mcu, optionValue, getValueId)
    return roleAllowsCapability(role, cap)
}

const validatePinAssignment = (field, getValueId) => {
    if (!field?.ispin && !field?.pinRole) return null
    const role = getEffectivePinRole(field, getValueId)
    if (!role || field.value == "-1" || field.value === -1) return null
    const mcu = getValueId("targetmcu")
    const cap = getGpioCapability(mcu, field.value, getValueId)
    if (roleAllowsCapability(role, cap)) return null
    return rejectionMessage(String(field.value), role, cap, mcu)
}

export {
    mcuRules,
    getGpioCapability,
    roleAllowsCapability,
    describeCapability,
    isPinOptionAllowed,
    validatePinAssignment,
}
