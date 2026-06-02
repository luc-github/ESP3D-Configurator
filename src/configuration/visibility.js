const matchDependRule = (rule, getValueId) => {
    const val = getValueId(rule.id)
    if (rule.value !== undefined) {
        return rule.value.includes(val)
    }
    if (rule.notvalue !== undefined) {
        return !rule.notvalue.includes(val)
    }
    return true
}

const evaluateDepend = (depend, getValueId) => {
    if (!depend) return true
    if (Array.isArray(depend)) {
        return depend.every((rule) => rule && matchDependRule(rule, getValueId))
    }
    return matchDependRule(depend, getValueId)
}

/**
 * Whether a group/field/option should be visible.
 * @param {object|object[]|undefined} depend
 * @param {function(string): *} getValueId
 * @param {{ resourceValue?: string, currentResourceValue?: string, reservedList?: { current: string[] } }} [options]
 */
const canShowField = (depend, getValueId, options = {}) => {
    const { resourceValue, currentResourceValue, reservedList } = options
    if (resourceValue && resourceValue != "-1" && reservedList) {
        if (
            resourceValue == currentResourceValue &&
            evaluateDepend(depend, getValueId)
        ) {
            return true
        }
        if (reservedList.current.includes(resourceValue)) {
            return false
        }
    }
    return evaluateDepend(depend, getValueId)
}

export { canShowField, evaluateDepend }
