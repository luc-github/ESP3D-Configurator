import { canShowField } from "./visibility"
import { mcuPinDefaults, defaultPinRoles } from "./mcuPinDefaults"

const forEachField = (configuration, getValueId, visitor) => {
    if (!configuration) return
    Object.keys(configuration).forEach((section) => {
        const groups = configuration[section]
        if (!Array.isArray(groups)) return
        groups.forEach((group) => {
            if (group.type !== "group" || !Array.isArray(group.value)) return
            if (!canShowField(group.depend, getValueId)) return
            group.value.forEach((field) => {
                if (!canShowField(field.depend, getValueId)) return
                visitor(field, section)
            })
        })
    })
}

const resolveEffectivePin = (field, getValueId) => {
    if (!field.ispin) return null
    const raw = field.value
    if (raw != "-1") return String(raw)
    if (!field.usedefault) return null
    const role = defaultPinRoles[field.id]
    if (!role) return null
    const mcu = getValueId("targetmcu")
    const defs = mcuPinDefaults[mcu]
    if (!defs || defs[role] === undefined) return null
    return String(defs[role])
}

const describePinAssignment = (field, effective) => {
    if (field.value == "-1" && field.usedefault && effective) {
        return `Default (GPIO ${effective})`
    }
    if (field.value == "-1") {
        return "None"
    }
    return `GPIO ${field.value}`
}

const collectPinUsages = (configuration, getValueId) => {
    const usages = []
    forEachField(configuration, getValueId, (field, section) => {
        const effective = resolveEffectivePin(field, getValueId)
        if (!effective) return
        usages.push({
            section,
            id: field.id,
            label: field.label,
            raw: field.value,
            effective,
            description: describePinAssignment(field, effective),
        })
    })
    return usages
}

const auditPinConflicts = (configuration, getValueId) => {
    const usages = collectPinUsages(configuration, getValueId)
    const byGpio = new Map()
    usages.forEach((usage) => {
        if (!byGpio.has(usage.effective)) {
            byGpio.set(usage.effective, [])
        }
        byGpio.get(usage.effective).push(usage)
    })
    const conflicts = []
    byGpio.forEach((entries, gpio) => {
        if (entries.length > 1) {
            conflicts.push({ gpio, entries })
        }
    })
    return { usages, conflicts }
}

export {
    resolveEffectivePin,
    collectPinUsages,
    auditPinConflicts,
    describePinAssignment,
}
