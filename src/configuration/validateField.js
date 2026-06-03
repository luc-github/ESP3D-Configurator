import { canShowField } from "./visibility"
import { findDuplicateValues, buildReservedLists } from "./reservedResources"
import { auditPinConflicts, resolveEffectivePin } from "./pinConflicts"
import { validatePinAssignment } from "./pinCapabilities"

const validateField = (field, getValueId, configuration) => {
    const validation = {
        message: "",
        valid: true,
        modified: false,
    }
    if (!field || !canShowField(field.depend, getValueId)) {
        return validation
    }
    if (configuration && field.ispin) {
        const pinRoleMsg = validatePinAssignment(field, getValueId)
        if (pinRoleMsg) {
            return {
                message: pinRoleMsg,
                valid: false,
                modified: true,
            }
        }
        const effective = resolveEffectivePin(field, getValueId)
        if (effective) {
            const capMsg = validatePinAssignment(
                { ...field, value: effective },
                getValueId
            )
            if (capMsg) {
                return {
                    message: `Default resolves to ${capMsg}`,
                    valid: false,
                    modified: true,
                }
            }
            const { conflicts } = auditPinConflicts(configuration, getValueId)
            const conflict = conflicts.find((c) => c.gpio === effective)
            if (conflict) {
                const others = conflict.entries.filter((e) => e.id !== field.id)
                if (others.length) {
                    return {
                        message: `GPIO ${effective} conflicts with ${others[0].label} (${others[0].description})`,
                        valid: false,
                        modified: true,
                    }
                }
            }
        }
    }

    if (!field.setting) {
        return validation
    }
    if (field.type === "text" || field.type === "number") {
        const value = field.value
        if (value === "" || value === undefined || value === null) {
            return {
                message: "Value is required",
                valid: false,
                modified: true,
            }
        }
    }
    if (
        field.id &&
        (field.id.toLowerCase().includes("i2c") ||
            field.define === "DISPLAY_I2C_ADDR" ||
            field.define === "SENSOR_ADDR")
    ) {
        const value = String(field.value || "").trim()
        if (value && !/^0x[0-9a-fA-F]+$/.test(value)) {
            return {
                message: "Use hex format (e.g. 0x3c)",
                valid: false,
                modified: true,
            }
        }
    }
    if (configuration) {
        if (field.isport && field.value != "-1") {
            const { ports } = buildReservedLists(configuration, getValueId, field.id)
            const duplicates = findDuplicateValues(ports)
            if (duplicates.includes(String(field.value))) {
                return {
                    message: "This serial port is already used",
                    valid: false,
                    modified: true,
                }
            }
        }
    }
    return validation
}

export { validateField }
