import { canShowField } from "./visibility"
import { resolveEffectivePin } from "./pinConflicts"
import { getPsramReservedGpios } from "./psramReservedPins"

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
                visitor(field)
            })
        })
    })
}

const findDuplicateValues = (values) => {
    const counts = new Map()
    values.forEach((value) => {
        counts.set(value, (counts.get(value) || 0) + 1)
    })
    return [...counts.entries()]
        .filter(([, count]) => count > 1)
        .map(([value]) => value)
}

const buildReservedLists = (configuration, getValueId, excludeFieldId) => {
    const pins = []
    const ports = []
    forEachField(configuration, getValueId, (field) => {
        if (excludeFieldId && field.id === excludeFieldId) return
        if (field.ispin) {
            const effective = resolveEffectivePin(field, getValueId)
            if (effective) {
                pins.push(effective)
            } else if (field.value != "-1") {
                pins.push(String(field.value))
            }
        }
        if (field.isport && field.value != "-1") {
            ports.push(String(field.value))
        }
    })
    getPsramReservedGpios(getValueId).forEach((gpio) => pins.push(gpio))
    if (ports.length === 0) {
        ports.push("USE_SERIAL_0")
    }
    return { pins, ports }
}

const syncReservedResources = (
    configuration,
    getValueId,
    usedPinsList,
    usedPortsList
) => {
    const { pins, ports } = buildReservedLists(configuration, getValueId)
    usedPinsList.current = pins
    usedPortsList.current = ports
    return {
        duplicatePins: findDuplicateValues(pins),
        duplicatePorts: findDuplicateValues(ports),
    }
}

export {
    buildReservedLists,
    syncReservedResources,
    findDuplicateValues,
}
