/**
 * MCU default GPIO numbers for SPI signals when a field uses value "-1" + usedefault.
 * Must stay aligned with src/tabs/generate/index.js sections.*.default*.
 */
const mcuPinDefaults = {
    esp32: {
        defaultMosi: 23,
        defaultMiso: 19,
        defaultSck: 18,
        defaultCs: 5,
        defaultSda: 21,
        defaultScl: 22,
    },
    esp32s2: {
        defaultMosi: 35,
        defaultMiso: 37,
        defaultSck: 36,
        defaultCs: 34,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp32s3: {
        defaultMosi: 11,
        defaultMiso: 13,
        defaultSck: 12,
        defaultCs: 10,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp32c3: {
        defaultMosi: 6,
        defaultMiso: 5,
        defaultSck: 4,
        defaultCs: 7,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp32c6: {
        defaultMosi: 6,
        defaultMiso: 5,
        defaultSck: 4,
        defaultCs: 7,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp8266: {
        defaultMosi: 13,
        defaultMiso: 12,
        defaultSck: 14,
        defaultCs: 15,
        defaultSda: 4,
        defaultScl: 5,
    },
    esp8285: {
        defaultMosi: 13,
        defaultMiso: 12,
        defaultSck: 14,
        defaultCs: 15,
        defaultSda: 4,
        defaultScl: 5,
    },
}

/** Field id → key in mcuPinDefaults[mcu] */
const defaultPinRoles = {
    sdmosipin: "defaultMosi",
    tftMOSIpin: "defaultMosi",
    ethernetspimosipin: "defaultMosi",
    sdmisopin: "defaultMiso",
    ethernetspimisopin: "defaultMiso",
    sdsckpin: "defaultSck",
    tftSCKpin: "defaultSck",
    ethernetspisckpin: "defaultSck",
    sdcspin: "defaultCs",
    tftCSpin: "defaultCs",
    ethernetspicspin: "defaultCs",
}

export { mcuPinDefaults, defaultPinRoles }
