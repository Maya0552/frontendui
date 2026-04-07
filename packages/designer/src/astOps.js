// astOps.js
import { Kind } from "graphql";
import {
    getSafeScalarFieldNames,
    getFieldDef,
    unwrapType,
    isExpandingNamedType,
    isLeafNamedType,
    hasRequiredArgs,
} from "./schemaUtils.js";
import { addEdge, wouldCreateCycle } from "./depGraph.js";

function makeName(value) {
    return { kind: Kind.NAME, value };
}

export function makeEmptyDocument(operationName = "Read") {
    return {
        kind: Kind.DOCUMENT,
        definitions: [
            {
                kind: Kind.OPERATION_DEFINITION,
                operation: "query",
                name: makeName(operationName),
                variableDefinitions: [],
                directives: [],
                selectionSet: { kind: Kind.SELECTION_SET, selections: [] },
            },
        ],
    };
}

export function findOperation(document, operationName) {
    return document.definitions.find(
        (d) =>
            d.kind === Kind.OPERATION_DEFINITION &&
            (operationName ? d.name?.value === operationName : true)
    );
}

export function upsertFragment(document, fragmentName, typeName) {
    const exists = document.definitions.find(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION && d.name.value === fragmentName
    );
    if (exists) return document;

    const frag = {
        kind: Kind.FRAGMENT_DEFINITION,
        name: makeName(fragmentName),
        typeCondition: {
            kind: Kind.NAMED_TYPE,
            name: makeName(typeName),
        },
        directives: [],
        selectionSet: { kind: Kind.SELECTION_SET, selections: [] },
    };

    return {
        ...document,
        definitions: [...document.definitions, frag],
    };
}

export function getFragment(document, fragmentName) {
    return document.definitions.find(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION && d.name.value === fragmentName
    );
}

export function setFragmentSelectionSet(document, fragmentName, newSelectionSet) {
    return {
        ...document,
        definitions: document.definitions.map((d) => {
            if (d.kind === Kind.FRAGMENT_DEFINITION && d.name.value === fragmentName) {
                return { ...d, selectionSet: newSelectionSet };
            }
            return d;
        }),
    };
}

export function ensureFieldSelected(selectionSet, fieldName) {
    const exists = selectionSet.selections.some(
        (s) => s.kind === Kind.FIELD && s.name.value === fieldName
    );
    if (exists) return selectionSet;

    return {
        ...selectionSet,
        selections: [
            ...selectionSet.selections,
            {
                kind: Kind.FIELD,
                name: makeName(fieldName),
                arguments: [],
                directives: [],
                selectionSet: null,
            },
        ],
    };
}

export function removeField(selectionSet, fieldName) {
    return {
        ...selectionSet,
        selections: selectionSet.selections.filter(
            (s) => !(s.kind === Kind.FIELD && s.name.value === fieldName)
        ),
    };
}

export function ensureFragmentSpread(selectionSet, fragmentName) {
    const exists = selectionSet.selections.some(
        (s) => s.kind === Kind.FRAGMENT_SPREAD && s.name.value === fragmentName
    );
    if (exists) return selectionSet;

    return {
        ...selectionSet,
        selections: [
            ...selectionSet.selections,
            { kind: Kind.FRAGMENT_SPREAD, name: makeName(fragmentName), directives: [] },
        ],
    };
}

export function removeFragmentSpread(selectionSet, fragmentName) {
    return {
        ...selectionSet,
        selections: selectionSet.selections.filter(
            (s) => !(s.kind === Kind.FRAGMENT_SPREAD && s.name.value === fragmentName)
        ),
    };
}

export function ensureInlineSelectionSetForField(selectionSet, fieldName, inlineSelections) {
    // create or update Field.selectionSet
    const outSelections = selectionSet.selections.map((s) => {
        if (s.kind !== Kind.FIELD || s.name.value !== fieldName) return s;

        return {
            ...s,
            selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: inlineSelections,
            },
        };
    });

    // If field not present, add it with selectionSet
    const exists = selectionSet.selections.some(
        (s) => s.kind === Kind.FIELD && s.name.value === fieldName
    );

    if (!exists) {
        outSelections.push({
            kind: Kind.FIELD,
            name: makeName(fieldName),
            arguments: [],
            directives: [],
            selectionSet: { kind: Kind.SELECTION_SET, selections: inlineSelections },
        });
    }

    return { ...selectionSet, selections: outSelections };
}

export function buildLeafInlineSelections(schema, typeName) {
    const names = getSafeScalarFieldNames(schema, typeName);
    return names.map((n) => ({
        kind: Kind.FIELD,
        name: makeName(n),
        arguments: [],
        directives: [],
        selectionSet: null,
    }));
}

export function autoSelectSafeScalarsInFragment(schema, document, fragmentName, typeName) {
    const frag = getFragment(document, fragmentName);
    if (!frag) return document;

    const safeNames = getSafeScalarFieldNames(schema, typeName);
    let ss = frag.selectionSet;

    for (const name of safeNames) {
        // __typename is meta field; ok in objects/interfaces/unions
        ss = ensureFieldSelected(ss, name);
    }

    return setFragmentSelectionSet(document, fragmentName, ss);
}

export function setRootFieldSelection(document, operationName, rootFieldName, fragmentName) {
    const op = findOperation(document, operationName);
    if (!op) return document;

    // Replace operation selections with: rootField { ...fragmentName }
    const rootField = {
        kind: Kind.FIELD,
        name: makeName(rootFieldName),
        arguments: [],
        directives: [],
        selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
                { kind: Kind.FRAGMENT_SPREAD, name: makeName(fragmentName), directives: [] },
            ],
        },
    };

    const newOp = {
        ...op,
        selectionSet: { kind: Kind.SELECTION_SET, selections: [rootField] },
    };

    return {
        ...document,
        definitions: document.definitions.map((d) =>
            d === op ? newOp : d
        ),
    };
}

export function toggleScalarInFragment(schema, state, fragmentTypeName, fragmentName, fieldName) {
    const fieldDef = getFieldDef(schema, fragmentTypeName, fieldName);
    if (!fieldDef) return state;

    const { namedType } = unwrapType(fieldDef.type);
    if (!isLeafNamedType(namedType)) return state;
    if (hasRequiredArgs(fieldDef)) return state;

    const frag = getFragment(state.document, fragmentName);
    if (!frag) return state;

    const exists = frag.selectionSet.selections.some(
        (s) => s.kind === Kind.FIELD && s.name.value === fieldName
    );

    const newSS = exists
        ? removeField(frag.selectionSet, fieldName)
        : ensureFieldSelected(frag.selectionSet, fieldName);

    return {
        ...state,
        document: setFragmentSelectionSet(state.document, fragmentName, newSS),
    };
}

export function expandObjectFieldInFragment(schema, state, fromTypeName, fromFragmentName, fieldName) {
    const fieldDef = getFieldDef(schema, fromTypeName, fieldName);
    if (!fieldDef) return state;
    if (hasRequiredArgs(fieldDef)) {
        // blocked
        return {
            ...state,
            lastActionInfo: { blockedBy: "requiredArgs", fromFragmentName, fieldName },
        };
    }

    const { namedType, namedTypeName } = unwrapType(fieldDef.type);
    if (!isExpandingNamedType(namedType)) return state;

    // We use fragment-per-namedType
    const toTypeName = namedTypeName;
    const toFragmentName = state.fragmentsByType[toTypeName] || `${toTypeName}Fragment`;

    // Cycle check: would adding fromFrag -> toFrag create cycle?
    const check = wouldCreateCycle(state.depGraph, fromFragmentName, toFragmentName);

    let newDepGraph = state.depGraph;
    let newDocument = state.document;
    let lastActionInfo = null;

    // Ensure target fragment exists (even if leaf fallback, it's ok to have it)
    newDocument = upsertFragment(newDocument, toFragmentName, toTypeName);

    if (check.cycle) {
        // Leaf fallback: inline safe scalar selections for target type (no spread)
        const frag = getFragment(newDocument, fromFragmentName);
        if (!frag) return state;

        const inlineSelections = buildLeafInlineSelections(schema, toTypeName);

        const newSS = ensureInlineSelectionSetForField(
            frag.selectionSet,
            fieldName,
            inlineSelections
        );

        newDocument = setFragmentSelectionSet(newDocument, fromFragmentName, newSS);

        lastActionInfo = {
            blockedBy: "cycle",
            cyclePath: check.path,
            fromFragmentName,
            toFragmentName,
            fieldName,
            mode: "leaf",
        };

        // We do NOT add the edge since we avoided spread-based dependency
        return { ...state, document: newDocument, lastActionInfo };
    }

    // No cycle → add edge, put fragment spread under the field selection set:
    // We represent object expansion as selecting field { ...ToFragment }
    const fromFrag = getFragment(newDocument, fromFragmentName);
    if (!fromFrag) return state;

    // Ensure the field exists with selectionSet
    let ss = fromFrag.selectionSet;

    // Build / update field selection set to include fragment spread
    const updatedSelections = ss.selections.map((s) => {
        if (s.kind !== Kind.FIELD || s.name.value !== fieldName) return s;
        const innerSS = s.selectionSet || { kind: Kind.SELECTION_SET, selections: [] };
        const withSpread = ensureFragmentSpread(innerSS, toFragmentName);
        return { ...s, selectionSet: withSpread };
    });

    const fieldExists = ss.selections.some(
        (s) => s.kind === Kind.FIELD && s.name.value === fieldName
    );

    if (!fieldExists) {
        updatedSelections.push({
            kind: Kind.FIELD,
            name: makeName(fieldName),
            arguments: [],
            directives: [],
            selectionSet: ensureFragmentSpread(
                { kind: Kind.SELECTION_SET, selections: [] },
                toFragmentName
            ),
        });
    }

    const newSS = { ...ss, selections: updatedSelections };
    newDocument = setFragmentSelectionSet(newDocument, fromFragmentName, newSS);

    // Add edge and auto-select scalars in the target fragment
    newDepGraph = addEdge(newDepGraph, fromFragmentName, toFragmentName, fieldName);
    newDocument = autoSelectSafeScalarsInFragment(schema, newDocument, toFragmentName, toTypeName);

    return {
        ...state,
        depGraph: newDepGraph,
        fragmentsByType: { ...state.fragmentsByType, [toTypeName]: toFragmentName },
        document: newDocument,
        lastActionInfo,
    };
}
