// createDesignerState.js
import { buildClientSchema, print, isObjectType, isInterfaceType } from "graphql";
import { makeEmptyDocument, upsertFragment, autoSelectSafeScalarsInFragment, setRootFieldSelection } from "./astOps.js";
import { getFieldDef, unwrapType, isExpandingNamedType, hasRequiredArgs } from "./schemaUtils.js";

export function createDesignerState(introspectionJson, opts = {}) {
    const schema = buildClientSchema(introspectionJson.data ?? introspectionJson);

    return {
        schema,
        introspection: introspectionJson,
        operationName: opts.operationName || "Read",
        document: makeEmptyDocument(opts.operationName || "Read"),
        rootField: null,
        fragmentsByType: {},
        depGraph: {},
        policy: {
            cycleMode: opts.cycleMode || "leaf",
            maxDepth: opts.maxDepth ?? 2,
            autoSelectScalars: opts.autoSelectScalars !== false,
        },
        lastActionInfo: null,
    };
}

export function listRootQueryFields(state) {
    const queryType = state.schema.getQueryType();
    if (!queryType) return [];
    const fields = queryType.getFields();
    return Object.keys(fields);
}

export function setRootField(state, rootFieldName) {
    const queryType = state.schema.getQueryType();
    if (!queryType) return state;

    const fieldDef = getFieldDef(state.schema, queryType.name, rootFieldName);
    if (!fieldDef) return state;

    // If root field has required args, we still allow selecting it,
    // but it won't be "auto runnable" until args filled.
    const { namedType, namedTypeName } = unwrapType(fieldDef.type);
    const expands = isExpandingNamedType(namedType);

    // For leaf return types, we'd select the field directly (no fragment),
    // but your requirement says "always fragments". Leaf root is uncommon; handle anyway.
    const fragTypeName = expands ? namedTypeName : queryType.name;
    const fragName = expands ? `${fragTypeName}Fragment` : `QueryLeafFragment`;

    let document = state.document;
    document = upsertFragment(document, fragName, fragTypeName);

    // auto select safe scalars in fragment type
    if (expands && state.policy.autoSelectScalars) {
        document = autoSelectSafeScalarsInFragment(state.schema, document, fragName, fragTypeName);
    }

    // operation root selection
    document = setRootFieldSelection(document, state.operationName, rootFieldName, fragName);

    return {
        ...state,
        rootField: {
            name: rootFieldName,
            parentTypeName: queryType.name,
            returnTypeName: namedTypeName,
            hasRequiredArgs: hasRequiredArgs(fieldDef),
        },
        fragmentsByType: expands ? { ...state.fragmentsByType, [fragTypeName]: fragName } : { ...state.fragmentsByType },
        document,
        lastActionInfo: null,
    };
}

export function getOutput(state) {
    return {
        document: state.document,
        queryString: print(state.document),
    };
}
