// QueryReadDesigner.jsx
import React, { useMemo, useState } from "react";
import { print, isObjectType, isInterfaceType, isUnionType } from "graphql";
import { createDesignerState, listRootQueryFields, setRootField, getOutput } from "./createDesignerState.js";
import { getFieldMapForType, unwrapType, isLeafNamedType, isExpandingNamedType, hasRequiredArgs } from "./schemaUtils.js";
import { toggleScalarInFragment, expandObjectFieldInFragment } from "./astOps.js";
import { formatCyclePath } from "./depGraph.js";

function getRootFragment(state) {
    if (!state.rootField) return null;
    const rt = state.rootField.returnTypeName;
    return state.fragmentsByType[rt] || null;
}

function getRootFragmentType(state) {
    if (!state.rootField) return null;
    return state.rootField.returnTypeName;
}

export default function QueryReadDesigner({ introspection, onChange, initialRootField }) {
    const [state, setState] = useState(() => {
        let s = createDesignerState(introspection, { operationName: "Read", cycleMode: "leaf" });
        if (initialRootField) s = setRootField(s, initialRootField);
        return s;
    });

    const rootFields = useMemo(() => listRootQueryFields(state), [state]);

    const rootFragName = getRootFragment(state);
    const rootTypeName = getRootFragmentType(state);

    const fields = useMemo(() => {
        if (!rootTypeName) return [];
        const fm = getFieldMapForType(state.schema, rootTypeName);
        if (!fm) return [];
        return Object.entries(fm).map(([name, def]) => {
            const { namedType } = unwrapType(def.type);
            return {
                name,
                kind: isLeafNamedType(namedType) ? "leaf" : isExpandingNamedType(namedType) ? "expand" : "other",
                requiredArgs: hasRequiredArgs(def),
                returnType: namedType.name,
            };
        });
    }, [state, rootTypeName]);

    const output = useMemo(() => getOutput(state), [state]);

    // emit change
    React.useEffect(() => {
        if (onChange) onChange({ ...output, state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [output.queryString]);

    function handleSelectRoot(e) {
        const name = e.target.value;
        const next = setRootField(state, name);
        setState(next);
    }

    function handleToggleField(f) {
        if (!rootFragName || !rootTypeName) return;

        if (f.kind === "leaf") {
            const next = toggleScalarInFragment(state.schema, state, rootTypeName, rootFragName, f.name);
            setState(next);
            return;
        }

        if (f.kind === "expand") {
            const next = expandObjectFieldInFragment(state.schema, state, rootTypeName, rootFragName, f.name);
            setState(next);
            return;
        }
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 12 }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Root query field</div>
                    <select value={state.rootField?.name || ""} onChange={handleSelectRoot} style={{ width: "100%" }}>
                        <option value="" disabled>
                            Select…
                        </option>
                        {rootFields.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                    {state.rootField?.hasRequiredArgs ? (
                        <div style={{ marginTop: 6, fontSize: 12 }}>
                            ⚠️ Root field has required args (designer will still build selections).
                        </div>
                    ) : null}
                </div>

                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    Fields for {rootTypeName ? <code>{rootTypeName}</code> : <span>(no root)</span>}
                </div>

                {!rootTypeName ? (
                    <div style={{ fontSize: 12, opacity: 0.8 }}>Choose a root field first.</div>
                ) : (
                    <div style={{ display: "grid", gap: 6 }}>
                        {fields.map((f) => (
                            <button
                                key={f.name}
                                onClick={() => handleToggleField(f)}
                                disabled={f.requiredArgs}
                                style={{
                                    textAlign: "left",
                                    padding: "8px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: "white",
                                    cursor: f.requiredArgs ? "not-allowed" : "pointer",
                                    opacity: f.requiredArgs ? 0.6 : 1,
                                }}
                                title={
                                    f.requiredArgs
                                        ? "Field has required args (blocked)."
                                        : f.kind === "expand"
                                            ? "Click to expand (fragment spread or leaf fallback if cycle)."
                                            : "Click to toggle scalar field."
                                }
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                    <span>
                                        {f.kind === "expand" ? "▸ " : f.kind === "leaf" ? "• " : "· "}
                                        <code>{f.name}</code>
                                    </span>
                                    <span style={{ fontSize: 12, opacity: 0.75 }}>
                                        → <code>{f.returnType}</code>
                                        {f.requiredArgs ? " (req args)" : ""}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {state.lastActionInfo?.blockedBy === "cycle" ? (
                    <div style={{ marginTop: 12, fontSize: 12, borderTop: "1px solid #eee", paddingTop: 10 }}>
                        <div style={{ fontWeight: 600 }}>Cycle guarded</div>
                        <div style={{ marginTop: 4 }}>
                            Added as <b>leaf fallback</b> (inline safe scalars).
                        </div>
                        <div style={{ marginTop: 6, opacity: 0.9 }}>
                            {formatCyclePath(state.lastActionInfo.cyclePath)}
                        </div>
                    </div>
                ) : state.lastActionInfo?.blockedBy === "requiredArgs" ? (
                    <div style={{ marginTop: 12, fontSize: 12, borderTop: "1px solid #eee", paddingTop: 10 }}>
                        <div style={{ fontWeight: 600 }}>Blocked</div>
                        <div style={{ marginTop: 4 }}>Field has required arguments.</div>
                    </div>
                ) : null}
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Query (printed)</div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{print(state.document)}</pre>
            </div>
        </div>
    );
}
