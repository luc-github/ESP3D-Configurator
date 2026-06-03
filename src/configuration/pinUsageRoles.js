import rolesDoc from "./pinUsageRoles.json"

const FIELD_ROLES = rolesDoc.taxonomy.fieldRoles
const REGISTRY = rolesDoc.fields

/**
 * Effective pinRole for a field (honours pinRoleWhen on the field object).
 */
const getEffectivePinRole = (field, getValueId) => {
    if (!field?.pinRole) return null
    const when = field.pinRoleWhen
    if (when?.dependId && when.map && getValueId) {
        const key = getValueId(when.dependId)
        if (key && when.map[key]) return when.map[key]
    }
    return field.pinRole
}

export { FIELD_ROLES, REGISTRY, getEffectivePinRole }
