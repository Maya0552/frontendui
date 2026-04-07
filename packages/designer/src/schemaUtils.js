// schemaUtils.js
import {
    isNonNullType,
    isListType,
    isScalarType,
    isEnumType,
    isObjectType,
    isInterfaceType,
    isUnionType,
} from "graphql";

export function unwrapType(type) {
    // returns { namedType, namedTypeName, wrappers: { nonNull, list } }
    let t = type;
    let nonNull = false;
    let list = false;

    if (isNonNullType(t)) {
        nonNull = true;
        t = t.ofType;
    }
    if (isListType(t)) {
        list = true;
        t = t.ofType;
        if (isNonNullType(t)) t = t.ofType;
    }
    // t should now be named type
    return { namedType: t, namedTypeName: t.name, wrappers: { nonNull, list } };
}

export function hasRequiredArgs(field) {
    // required arg = NonNull AND no defaultValue
    const args = field?.args || [];
    return args.some((a) => isNonNullType(a.type) && a.defaultValue == null);
}

export function isExpandingNamedType(namedType) {
    return (
        isObjectType(namedType) ||
        isInterfaceType(namedType) ||
        isUnionType(namedType)
    );
}

export function isLeafNamedType(namedType) {
    return isScalarType(namedType) || isEnumType(namedType);
}

export function getFieldMapForType(schema, typeName) {
    const t = schema.getType(typeName);
    if (!t || !(isObjectType(t) || isInterfaceType(t))) return null;
    return t.getFields();
}

export function getSafeScalarFieldNames(schema, typeName) {
    const fields = getFieldMapForType(schema, typeName);
    if (!fields) return [];
    const names = [];

    for (const [name, field] of Object.entries(fields)) {
        const { namedType } = unwrapType(field.type);
        if (!isLeafNamedType(namedType)) continue;
        if (hasRequiredArgs(field)) continue;
        names.push(name);
    }

    // common convenience: include __typename for unions/interfaces/object navigation
    if (!names.includes("__typename")) names.unshift("__typename");
    return names;
}

export function getReturnNamedTypeNameOfField(schema, parentTypeName, fieldName) {
    const fields = getFieldMapForType(schema, parentTypeName);
    if (!fields) return null;
    const f = fields[fieldName];
    if (!f) return null;
    const { namedTypeName } = unwrapType(f.type);
    return namedTypeName;
}

export function getFieldDef(schema, parentTypeName, fieldName) {
    const fields = getFieldMapForType(schema, parentTypeName);
    if (!fields) return null;
    return fields[fieldName] || null;
}
