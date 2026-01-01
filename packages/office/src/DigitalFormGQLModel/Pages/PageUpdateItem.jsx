import React, { useMemo, useRef, useState, useCallback } from "react";

import { UpdateBody } from "../Mutations/Update"
import { PageItemBase } from "./PageBase"
import { SimpleCardCapsule, SimpleCardCapsuleRightCorner } from "../../../../_template/src/Base/Components";
import { Input } from "../../../../_template/src/Base/FormControls/Input";
import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col } from "../../../../_template/src/Base/Components/Col";
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog";
import { DesignButton as DesignFieldButton } from "../../DigitalFormFieldGQLModel/Mutations/Design";
import { DesignButton as DesignSectionButton } from "../../DigitalFormSectionGQLModel/Mutations/Design";
import { AsyncActionProvider, useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider";
import { DeleteAsyncAction as DeleteSectionAsyncAction, InsertAsyncAction as InsertSectionAsyncAction, ReadAsyncAction as ReadFormSectionAsyncAction, UpdateAsyncAction, UpdateAsyncAction as UpdateFormAsyncAction } from "../../DigitalFormSectionGQLModel/Queries";
import { useEffect } from "react";
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator";
import { DeleteAsyncAction as DeleteFieldAsyncAction, InsertAsyncAction as InsertFieldAsyncAction, ReadAsyncAction as ReadFormFieldAsyncAction } from "../../DigitalFormFieldGQLModel/Queries";
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";
import { DeleteButton as DeleteFormSectionButton } from "../../DigitalFormSectionGQLModel/Mutations/Delete";
import { UpdateButton } from "../../DigitalFormFieldGQLModel/Mutations/Update";
import { DeleteButton as DeleteFormFieldButton } from "../../DigitalFormFieldGQLModel/Mutations/Delete";
import { CreateButton as CreateFormSectionButton } from "../../DigitalFormSectionGQLModel/Mutations/Create";
import { CreateButton as CreateFormFieldButton } from "../../DigitalFormFieldGQLModel/Mutations/Create";


// const index = {
//   1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
//   2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
//   3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
//   4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
//   5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
//   6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
// };

// const UpdateFormSection = ({ item, data, level=2, index=0 }) => {
//     const {sections=[]} = item || {}
//     const {sections:s_sections=[{}]} = data || {}

//     const {fields=[]} = item || {}
//     const {field:s_fields=[{}]} = data || {}
//     const Heading = index[level] || index[6]
//     return (
//         <div className={"H"+level}>
//             {(index === 0) && <div>
//                 Form Section
//                 <Heading>{item?.label}/{item?.labelEn}({item?.name})</Heading>
//                 {item?.repeatableMin}-{item?.repeatableMax}, {item?.order}<br/>
//                 {item?.description}<br/>
//             </div>}
//             <div>
//                 Submission Sections
//                 {sections.map((s,i)=>(
//                     <UpdateFormSection key={s?.id} item={s} data={s_sections} index={i} level={level+1}/>
//                 ))}
//             </div>
//             <div>
//                 Submission Fields
//                 {fields.map(f => (
//                     <UpdateFieldWrap item={f} data={s_fields} />
//                 ))}
//             </div>
//         </div>
//     )
// }

// const UpdateField = ({ item, data={} }) => {
//     return (
//         <div>
//             {item?.label} / {item?.labelEn} ({item?.name}) [{item?.typeId}]<br/>
//             {data?.value}  <br/>
//         </div>
//     )
// }

// const UpdateFieldWrap = ({ item, data=[] }) => {
//     const filtered = data?.find(f => f?.sectionId === item?.id) || {}
//     return <UpdateField item={item} data={filtered} />
// }

// const UpdateSectionWrap = ({ item, data, index=0, level=2 }) => {
//     const filtered = data?.filter(s=>s?.formSection?.id === item?.id) || []
//     return (
//         <UpdateFormSection item={item} data={filtered} index={index} level={level} />
//     )
// }

// export const UpdateForm = ({ item, submission }) => {
//     const {sections=[]} = item || {}
//     const {sections: s_sections=[]} = submission || {}
//     return (<>
//         <h1>{item?.label}({item?.name})</h1>
//         {sections.map(s=><UpdateSectionWrap key={s?.id} item={s} data={s_sections} />)}
//     </>)
// }


/** =============================================================================
 *  Support utilities
 * ============================================================================= */

const ConfirmClickButton = ({ className, onClick = () => null, children, ...props }) => {
    const [state, setState] = useState(0)
    const handleCancel = () => setState(prev => 0)
    const handleProgress = () => setState(prev => 1)
    const handleConfirm = () => {
        setState(prev => 0)
        onClick()
    }
    return (<>
        {(state === 0) && (
            <button
                {...props}
                className={className ? className + " btn-outline-primary" : "btn btn-sm btn-outline-primary"}
                onClick={handleProgress}
            >
                {children}
            </button>
        )}
        {(state === 1) && (
            <button
                {...props}
                className={className ? className + " btn-warning" : "btn btn-sm btn-warning"}
                onClick={handleCancel}
            >
                {children}
            </button>
        )}
        {(state === 1) && (
            <button
                {...props}
                className={className ? className + " btn-danger" : "btn btn-sm btn-danger"}
                onClick={handleConfirm}
            >
                {children}
            </button>
        )}
    </>)
}

const TextDialog = ({ onOk = (value) => null, onCancel = () => null, value = "", ...props }) => {
    const [lastValue, SetLastValue] = useState(value)
    const handleCancel = () => {
        onCancel()
    }
    const handleOk = () => {
        onOk(lastValue)
    }
    const onChange = (e) => {
        const newValue = e?.target?.value
        console.log(newValue)
        SetLastValue(prev => newValue)
    }
    return (
        <Dialog {...props} onCancel={handleCancel} onOk={handleOk}>
            <Input className="form-control" value={lastValue} onChange={onChange} />
        </Dialog>
    )
}

const WrapWithDialog = ({
    children,
    id, name, value,
    onChange = (id, name, value) => null
}) => {
    const [state, setState] = useState(0)
    const handleClick = () => {
        setState(prev => 1)
    }
    const handleOk = (value) => {
        onChange(id, name, value)
        setState(prev => 0)
    }
    const handleCancel = () => {
        setState(prev => 0)
    }
    return (<>
        {(state === 1) && (
            <TextDialog value={value} onOk={handleOk} onCancel={handleCancel} />
        )}
        <span onClick={handleClick}>
            {children}
        </span>
    </>)
}

/** ---------- Headings ---------- */
const headingIndex = {
    1: (p) => <h1 {...p} />,
    2: (p) => <h2 {...p} />,
    3: (p) => <h3 {...p} />,
    4: (p) => <h4 {...p} />,
    5: (p) => <h5 {...p} />,
    6: (p) => <h6 {...p} />,
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** ---------- IDs ---------- */
const makeClientId = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random()
        .toString(36)
        .slice(2)}`;
};

/** ---------- Safe clone ----------
 *  Uses structuredClone if available; falls back to JSON clone.
 *  For your GQL models (plain objects) this is ok.
 */
const deepClone = (obj) => {
    if (typeof structuredClone === "function") return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
};

/** ---------- Debounce (for persistence) ---------- */
const useDebouncedCallback = (fn, delay = 600) => {
    const t = useRef(null);
    return useCallback(
        (...args) => {
            if (t.current) clearTimeout(t.current);
            t.current = setTimeout(() => fn(...args), delay);
        },
        [fn, delay]
    );
};

/** ---------- Model helpers ---------- */
const getFormSectionIdFromSubmissionSection = (ss) =>
    ss?.formSectionId ?? ss?.formSection?.id ?? null;

const getFieldIdFromSubmissionField = (sf) => sf?.fieldId ?? sf?.field?.id ?? null;

const getSectionIdFromSubmissionField = (sf) => sf?.sectionId ?? sf?.section?.id ?? null;

/** =============================================================================
 *  Selectors / builders
 * ============================================================================= */

/** Find submission section instances for a given form section definition.
 *  If none exist and dummy=true, create 1 (or repeatableMin for repeatable).
 */
const selectSubmissionSections = (submission, formSectionDef, dummy = false) => {
    const all = submission?.sections ?? [];
    const formSectionId = formSectionDef?.id ?? null;

    const found = all.filter((ss) => getFormSectionIdFromSubmissionSection(ss) === formSectionId);

    if (found.length > 0) return found;
    if (!dummy) return [];

    const min = formSectionDef?.repeatableMin ?? 0;
    const max = formSectionDef?.repeatableMax ?? 1;
    const repeatable = formSectionDef?.repeatable ?? (max > 1);

    const count = repeatable ? Math.max(1, min) : 1;

    return Array.from({ length: count }, () => ({
        __typename: "DigitalSubmissionSectionGQLModel",
        id: makeClientId(),
        formSectionId,
        fields: [],
        _dummy: true,
    }));
};

/** Prefer nested sectionInstance.fields, fallback to submission.fields */
const selectSubmissionField = (submission, sectionInstance, fieldDef) => {
    const all = sectionInstance?.fields ?? submission?.fields ?? [];
    const fieldId = fieldDef?.id ?? null;
    const sectionId = sectionInstance?.id ?? null;

    return all.find(
        (sf) => getFieldIdFromSubmissionField(sf) === fieldId && getSectionIdFromSubmissionField(sf) === sectionId
    );
};

/** Ensure the section instance exists in submission.sections and has an id. */
const ensureSectionInstanceInSubmission = (submission, sectionInstance, formSectionDef) => {
    const ensured = sectionInstance?.id
        ? sectionInstance
        : { ...sectionInstance, id: makeClientId() };

    const formSectionId = getFormSectionIdFromSubmissionSection(ensured) ?? formSectionDef?.id;

    const normalized = {
        __typename: "DigitalSubmissionSectionGQLModel",
        ...(ensured ?? {}),
        id: ensured?.id ?? makeClientId(),
        formSectionId,
        fields: ensured?.fields ?? [],
        _dummy: false,
    };

    const sections = submission?.sections ?? [];
    const idx = sections.findIndex((s) => s?.id === normalized.id);
    const nextSections = idx >= 0 ? sections.map((s, i) => (i === idx ? normalized : s)) : [...sections, normalized];

    return { nextSubmission: { ...submission, sections: nextSections }, ensuredSection: normalized };
};

/** Upsert a field value into BOTH:
 *  - submission.fields (global normalized)
 *  - submission.sections[].fields (nested, per your requirement)
 */
const upsertSubmissionFieldValue = (submission, sectionInstance, fieldDef, nextValue) => {
    const sectionId = sectionInstance?.id;
    const fieldId = fieldDef?.id;
    if (!sectionId || !fieldId) return submission;

    const globalFields = submission?.fields ?? [];
    const gIdx = globalFields.findIndex(
        (sf) => getSectionIdFromSubmissionField(sf) === sectionId && getFieldIdFromSubmissionField(sf) === fieldId
    );

    const nextField = {
        __typename: "DigitalSubmissionFieldGQLModel",
        ...(gIdx >= 0 ? globalFields[gIdx] : {}),
        id: gIdx >= 0 ? globalFields[gIdx]?.id : makeClientId(),
        sectionId,
        fieldId,
        value: nextValue,
        _dummy: false,
    };

    const nextGlobalFields =
        gIdx >= 0 ? globalFields.map((f, i) => (i === gIdx ? nextField : f)) : [...globalFields, nextField];

    // nested fields for the section
    const nextSections = (submission?.sections ?? []).map((s) => {
        if (s?.id !== sectionId) return s;
        const secFields = s?.fields ?? [];
        const sIdx = secFields.findIndex((sf) => getFieldIdFromSubmissionField(sf) === fieldId);
        const nextSecFields =
            sIdx >= 0 ? secFields.map((f, i) => (i === sIdx ? nextField : f)) : [...secFields, nextField];
        return { ...s, fields: nextSecFields };
    });

    return { ...submission, fields: nextGlobalFields, sections: nextSections };
};

/** =============================================================================
 *  Form definition tree helpers (designer actions)
 * ============================================================================= */

/** Walk formDef.sections tree and apply mutator when predicate matches */
const mutateSectionTree = (sections, predicate, mutator) => {
    if (!Array.isArray(sections)) return sections;
    return sections.map((s) => {
        const next = { ...s };
        if (predicate(next)) mutator(next);
        next.sections = mutateSectionTree(next.sections ?? [], predicate, mutator);
        return next;
    });
};

/** Remove a section from tree by id (recursively) */
const removeSectionFromTree = (sections, removeId) => {
    if (!Array.isArray(sections)) return [];
    return sections
        .filter((s) => s?.id !== removeId)
        .map((s) => ({ ...s, sections: removeSectionFromTree(s.sections ?? [], removeId) }));
};

/** Remove a field from all sections by field id */
const removeFieldFromTree = (sections, fieldId) => {
    if (!Array.isArray(sections)) return [];
    return sections.map((s) => ({
        ...s,
        fields: (s.fields ?? []).filter((f) => f?.id !== fieldId),
        sections: removeFieldFromTree(s.sections ?? [], fieldId),
    }));
};

/** Collect all descendant sectionDef ids from a sectionDef node (including itself) */
const collectSectionDefIds = (sectionDef) => {
    const out = new Set();
    const walk = (node) => {
        if (!node?.id) return;
        out.add(node.id);
        (node.sections ?? []).forEach(walk);
    };
    walk(sectionDef);
    return out;
};

/** Find a sectionDef node by id in the tree */
const findSectionDefById = (sections, id) => {
    for (const s of sections ?? []) {
        if (s?.id === id) return s;
        const child = findSectionDefById(s?.sections ?? [], id);
        if (child) return child;
    }
    return null;
};







const clampCount = (n, min, max) => {
    const lo = (min ?? 0);
    const hi = (max ?? Number.POSITIVE_INFINITY);
    return Math.max(lo, Math.min(hi, n));
};

const stableId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const normalizeFieldsForSection = (section, formSectionDef) => {
    const existing = section?.fields ?? [];
    const defFields = formSectionDef?.fields ?? [];

    // index existujících podle fieldId
    const byFieldId = new Map();
    for (const sf of existing) {
        const fid = sf?.fieldId;
        if (!fid) continue;
        // beru první; pokud jich je víc (data bug), zbytek se v "strict" režimu zahodí
        if (!byFieldId.has(fid)) byFieldId.set(fid, sf);
    }

    const next = defFields.map((fd) => {
        const fid = fd?.id;
        const found = byFieldId.get(fid);
        return found ?? {
            id: stableId(),
            sectionId: section?.id,
            submissionId: section?.submissionId,
            fieldId: fid,
            value: "",
        };
    });

    return next;
};

const normalizeSubsectionsForSection = (section, formSectionDef) => {
    const existing = section?.sections ?? [];
    const defSections = formSectionDef?.sections ?? [];

    // group existing by formSectionId (child definition)
    const bucket = new Map();
    for (const ss of existing) {
        const fsid = ss?.formSectionId;
        if (!fsid) continue;
        if (!bucket.has(fsid)) bucket.set(fsid, []);
        bucket.get(fsid).push(ss);
    }

    const out = [];

    for (const childDef of defSections) {
        const fsid = childDef?.id;
        const arr = bucket.get(fsid) ?? [];

        const min = childDef?.repeatableMin ?? 0;
        const max = childDef?.repeatableMax ?? 1;
        const repeatable = childDef?.repeatable ?? (max > 1);

        // kolik instancí chceme udržet
        const desired = repeatable ? clampCount(arr.length || min || 1, Math.max(1, min), max) : 1;

        // vezmi existující do desired
        const kept = arr.slice(0, desired).map((x) => ({
            ...x,
            // parent link
            sectionId: section?.id,
            submissionId: section?.submissionId,
            formSectionId: fsid,
            // default containers
            fields: x?.fields ?? [],
            sections: x?.sections ?? [],
        }));

        // doplň chybějící
        while (kept.length < desired) {
            kept.push({
                id: stableId(),
                sectionId: section?.id,
                submissionId: section?.submissionId,
                formSectionId: fsid,
                fields: [],
                sections: [],
            });
        }

        out.push(...kept);
    }

    return out;
};



















/** =============================================================================
 *  Components: UpdateField, UpdateFormSection, UpdateForm
 * ============================================================================= */

export const UpdateField = ({
    sectionDef,
    sectionInstance,
    fieldDef,
    submission,
    digital_submission_field,
    // onFieldValueChange,
    onSubmissionFieldChange,
    onRemoveField,
    mode = "design"
}) => {
    const submissionField = selectSubmissionField(submission, sectionInstance, fieldDef);
    const value = submissionField?.value ?? "";
    // const handleFieldDefChange = useCallback(())
    const {
        run: deleteField, error: errorDeleteField, loading: deletingField,
        // entity, data 
    } = useAsyncThunkAction(DeleteFieldAsyncAction, empty, { deferred: true })
    const handleDelete = useCallback(async () => {
        const result = await deleteField({
            id: fieldDef?.id,
            lastchange: fieldDef?.lastchange
        })
        onRemoveField()
    }, [deleteField, onRemoveField])

    const handleChange = (e) => {
        onSubmissionFieldChange({
            ...digital_submission_field,        // ← zachová id
            fieldId: fieldDef?.id,
            value: e.target.value,
        });
    };

    return (
        <SimpleCardCapsule
            className="border-start border-2 border-success"
            title={<>
                <strong>{fieldDef?.label ?? "------------"}</strong>{" "}
                {(mode === "design") && <small>{fieldDef?.name ?? "------------"}</small>}{" "}
                {fieldDef?.required ? <strong>*</strong> : null}
            </>}
            style={{ paddingLeft: 12, border: "none", borderLeftx: "2px solid #3a7900ff", }}
        >
            {(mode === "design") &&
                <SimpleCardCapsuleRightCorner>
                    <ConfirmClickButton className="btn btn-sm border-0" type="button" onClick={handleDelete} title="Remove field">
                        🗑
                    </ConfirmClickButton>
                </SimpleCardCapsuleRightCorner>
            }
            {/* {JSON.stringify(fieldDef)}
            <hr/>
            {JSON.stringify(sectionInstance)} */}

            <Input
                className="form-control" value={digital_submission_field?.value ?? value ?? ""}
                onChange={handleChange}
                placeholder="Enter value…"
            />
        </SimpleCardCapsule>
    );
};

const empty = {}
const dummy = () => { }
export const UpdateFormSection = ({
    formSectionDef,
    submission,
    level = 2,
    dummy = true,
    mode = "design",

    digital_submission_section = empty,
    // value events
    // onFieldValueChange=dummy,
    onSubmissionSectionChange = dummy,//onSubmissionSectionChange
    // // design events
    // onAddSubSection,
    // onRemoveSection,
    // onAddField,
    // onRemoveField,
    // handleFormItemDefChange=dummy
}) => {
    const sectionInstances = useMemo(
        () => selectSubmissionSections(submission, formSectionDef, dummy),
        [submission, formSectionDef, dummy]
    );

    const handleSubmissionFieldChange = useCallback((submission_field) => {
        const new_section = {
            ...digital_submission_section,
            id: digital_submission_section?.id,              // ← STABILNÍ
            fields: digital_submission_section?.fields || []
        };

        const new_submission_field = {
            ...submission_field,
            sectionId: new_section.id,                       // ← navázat na stabilní section.id
        };

        // upsert podle fieldId (ne podle submission_field.id!)
        const hasIdx = new_section.fields.findIndex(f => f?.fieldId === new_submission_field.fieldId);
        new_section.fields =
            hasIdx >= 0
                ? new_section.fields.map((f, i) => i === hasIdx ? { ...f, ...new_submission_field } : f)
                : [...new_section.fields, new_submission_field];

        onSubmissionSectionChange(new_section);
    }, [digital_submission_section, onSubmissionSectionChange]);

    const handleSubmissionSectionChange = useCallback((child) => {
        const parentId = digital_submission_section?.id ?? stableId();

        const normalizedChild = { ...child, sectionId: parentId };

        const new_section = {
            ...digital_submission_section,
            id: parentId,
            sections: digital_submission_section?.sections || [],
        };

        const idx = new_section.sections.findIndex(s => s?.id === normalizedChild.id);
        new_section.sections =
            idx >= 0
                ? new_section.sections.map((s, i) => i === idx ? normalizedChild : s)
                : [...new_section.sections, normalizedChild];

        onSubmissionSectionChange(new_section);
    }, [digital_submission_section, onSubmissionSectionChange]);

    const max = formSectionDef?.repeatableMax ?? 1;
    const repeatable = formSectionDef?.repeatable ?? (max > 1);
    const isErrorSingle = repeatable === false && sectionInstances.length > 1;

    const H = headingIndex[clamp(level, 1, 6)] ?? headingIndex[6];
    const {
        run: update, error: errorUpdate, loading: updating,
        // entity, data 
    } = useAsyncThunkAction(UpdateAsyncAction, empty, { deferred: true })
    const {
        run: insertSection, error: errorInsertSection, loading: creatingSection,
        // entity, data 
    } = useAsyncThunkAction(InsertSectionAsyncAction, empty, { deferred: true })
    const {
        run: deleteSection, error: errorDeleteSection, loading: deletingSection,
        // entity, data 
    } = useAsyncThunkAction(DeleteSectionAsyncAction, empty, { deferred: true })
    const {
        run: insertField, error: errorInsertField, loading: creatingField,
        // entity, data 
    } = useAsyncThunkAction(InsertFieldAsyncAction, empty, { deferred: true })
    const {
        run: deleteField, error: errorDeleteField, loading: deletingField,
        // entity, data 
    } = useAsyncThunkAction(DeleteFieldAsyncAction, empty, { deferred: true })

    const { reRead } = useGQLEntityContext()
    const onAddSubSection = useCallback(async (id) => {
        console.log("onAddSubSection", id)
        const itemid = crypto.randomUUID();
        const result = await insertSection({
            sectionId: formSectionDef?.id,
            id: itemid,
            formId: formSectionDef?.formId,
            name: "sekce",
            label: "Nová sekce",
            labelEn: "New section",
            description: `Sekce úrovně ${level}`,
            repeatableMin: 1,
            repeatableMax: 1,
            fields: [
                {
                    id: crypto.randomUUID(),
                    formSectionId: itemid,
                    formId: formSectionDef?.formId,
                    label: "Nová položka",
                    labelEn: "New field",
                    name: "field"
                }
            ]
        })
        console.log("onAddSubSection.result", result)
    }, [])
    const onRemoveSection = useCallback(async (e) => {
        console.log("onRemoveSection", e)
        const result = await deleteSection({
            id: formSectionDef?.id,
            lastchange: formSectionDef?.lastchange
        })
        console.log("onRemoveSection.result", result)
        reRead()
    }, [reRead])
    const onAddField = useCallback(async (e) => {
        console.log("onAddField", e)
        const itemid = crypto.randomUUID();
        const result = await insertField({
            formSectionId: formSectionDef?.id,
            id: itemid,
            formId: formSectionDef?.formId,
            name: "field",
            label: "Nová položka",
            labelEn: "New field",
        })
        console.log("onAddField.result", result)
    }, [])
    const onRemoveField = useCallback(async (e) => {
        console.log("onRemoveField", e)
        const result = {}
        console.log("onRemoveField.result", result)
        reRead()
    }, [reRead])


    useEffect(() => {
        // bezpečně: bez id nemá cenu normalizovat
        if (!digital_submission_section?.id || !formSectionDef?.id) return;

        const current = digital_submission_section;

        const normalized = {
            ...current,
            // jistota vazeb
            formSectionId: current?.formSectionId ?? formSectionDef?.id,
            fields: normalizeFieldsForSection(current, formSectionDef),
            sections: normalizeSubsectionsForSection(current, formSectionDef),
        };

        // velmi jednoduchá "changed" detekce:
        // - počet fields/sections
        // - set fieldIdů
        // - set (formSectionId, parent sectionId) u subsekcí
        const sameFields =
            (current?.fields?.length ?? 0) === (normalized.fields?.length ?? 0) &&
            (current?.fields ?? []).every((sf) =>
                normalized.fields.some((nf) => nf.fieldId === sf.fieldId && nf.sectionId === sf.sectionId)
            );

        const sameSections =
            (current?.sections?.length ?? 0) === (normalized.sections?.length ?? 0) &&
            (current?.sections ?? []).every((ss) =>
                normalized.sections.some((ns) => ns.id === ss.id || (ns.formSectionId === ss.formSectionId && ns.sectionId === ss.sectionId))
            );

        if (!sameFields || !sameSections) {
            onSubmissionSectionChange(normalized);
        }
    }, [digital_submission_section, formSectionDef, onSubmissionSectionChange]);





    return (
        <AsyncActionProvider item={formSectionDef} queryAsyncAction={ReadFormSectionAsyncAction} options={{ deferred: true }}>
            <AsyncStateIndicator error={errorUpdate} loading={updating} text="Ukládám" />
            <AsyncStateIndicator error={errorInsertSection} loading={creatingSection} text="Vytvářím sekci" />
            <AsyncStateIndicator error={errorDeleteSection} loading={deletingSection} text="Odstraňuji sekci" />
            <AsyncStateIndicator error={errorDeleteField} loading={deletingField} text="Odstraňuji položku" />

            <SimpleCardCapsule title={<>
                {(mode === "design") && (<>{formSectionDef?.label ?? formSectionDef?.name}{" "}</>)}
                {(mode === "design") && <small>({formSectionDef?.name})</small>}
            </>}
                // className="border-start border-danger ps-3"
                style={{ paddingLeft: 12, borderLeft: "2px solid #e02222ff" }}
            >
                {(mode === "design") &&
                    <SimpleCardCapsuleRightCorner>
                        <DesignSectionButton
                            className="btn btn-sm btn-outline-primary border-0"
                        >Pencil</DesignSectionButton>

                        <ConfirmClickButton className="btn btn-sm border-0" onClick={onAddSubSection}>
                            + Sekce  X
                        </ConfirmClickButton>
                        <ConfirmClickButton className="btn btn-sm border-0" onClick={onAddField}>
                            + Položka  X
                        </ConfirmClickButton>
                        <ConfirmClickButton className="btn btn-sm border-0" onClick={onRemoveSection}>
                            🗑
                        </ConfirmClickButton>
                    </SimpleCardCapsuleRightCorner>
                }
                <div>
                    <H>{formSectionDef?.label ?? "--NEOZNAČEN--"}</H>
                    {(mode === "design") && (<div>
                        repeat: {formSectionDef?.repeatableMin ?? "undef"}-
                        {formSectionDef?.repeatableMax ?? "undef"} ({repeatable ? "repeatable" : "single"})
                    </div>)}
                    {formSectionDef?.description ?? "--NEPOPSÁN--"}

                    <div>
                        {(formSectionDef?.fields || []).map(
                            form_field => {
                                const submission_fields = digital_submission_section?.fields || []
                                const filtered = submission_fields.filter(
                                    sf => sf?.fieldId === form_field?.id
                                )
                                if (filtered.length === 0) {
                                    const submission_field = {
                                        id: crypto.randomUUID(),
                                        sectionId: digital_submission_section?.id,
                                        submissionId: digital_submission_section?.submissionId,
                                        fieldId: form_field?.id,
                                        value: ""
                                    }
                                    return (
                                        <UpdateField
                                            key={form_field?.id}
                                            fieldDef={form_field}
                                            reRead={reRead}
                                            mode={mode}
                                            digital_submission_field={submission_field}
                                            onRemoveField={onRemoveField}
                                            onSubmissionFieldChange={handleSubmissionFieldChange}
                                        />
                                    )
                                } else {
                                    return (<div key={form_field?.id}>
                                        {filtered.map(submission_field =>
                                            <UpdateField
                                                key={submission_field?.id}
                                                fieldDef={form_field}
                                                reRead={reRead}
                                                mode={mode}
                                                digital_submission_field={submission_field}

                                                onRemoveField={onRemoveField}
                                                onSubmissionFieldChange={handleSubmissionFieldChange}
                                            />
                                        )}
                                    </div>)
                                }
                            }
                        )}
                        {(formSectionDef?.sections || []).map(
                            form_section => {
                                const submissionsections = digital_submission_section?.sections || []
                                const filtered = submissionsections.filter(
                                    s => s?.formSectionId === form_section?.id
                                )
                                if (filtered.length === 0) {
                                    const new_submission_section = {
                                        id: crypto.randomUUID(),
                                        sectionId: digital_submission_section?.id,
                                        submissionId: digital_submission_section?.submissionId,
                                        formSectionId: form_section?.id,
                                        fields: [],
                                        sections: []
                                    }
                                    return (
                                        <UpdateSectionWrap
                                            key={form_section?.id}
                                            formSectionDef={form_section}
                                            level={level + 1}
                                            dummy={dummy}
                                            mode={mode}
                                            digital_submission_sections={[new_submission_section]}
                                            onSubmissionSectionChange={handleSubmissionSectionChange}

                                        />
                                    )
                                } else {
                                    return (
                                        <UpdateSectionWrap
                                            key={form_section?.id}
                                            formSectionDef={form_section}
                                            level={level + 1}
                                            dummy={dummy}
                                            mode={mode}
                                            digital_submission_sections={filtered}
                                            onSubmissionSectionChange={handleSubmissionSectionChange}

                                        />
                                    )
                                }
                            }
                        )}
                    </div>
                </div>
            </SimpleCardCapsule>
        </AsyncActionProvider>
    );
};

const UpdateSectionWrap = ({
    digital_submission_sections,
    ...props
}) => {
    const { formSectionDef } = props
    if (digital_submission_sections.length === 0) {
        return <UpdateFormSection {...props} digital_submission_section={{
            id: crypto.randomUUID(),
            formSectionId: formSectionDef?.id,
            sections: [],
            fields: []
        }} />
    }
    return (<>
        {digital_submission_sections.map(
            digital_submission_section => <UpdateFormSection {...props} digital_submission_section={digital_submission_section} />
        )}
    </>)
}

const dummyFunc = () => { }
export const UpdateForm = ({
    item: initialFormDef,
    submission: initialSubmission,
    dummy = true,
    debug = true,

    /** Event hooks for your GraphQL mutations */
    onFormDefinitionChange = dummyFunc, // (nextFormDef, meta) => void
    onSubmissionChange = dummyFunc, // (nextSubmission, meta) => void
    onPersist = dummyFunc, // ({formDef, submission, meta}) => void (debounced)
}) => {
    // Master states
    const [_, setFormDef] = useState(() => deepClone(initialFormDef ?? {}));
    const formDef = initialFormDef
    const [mode, setMode] = useState("design")
    const [submission, setSubmission] = useState(() => ({
        ...(deepClone(initialSubmission ?? {})),
        sections: initialSubmission?.sections ?? [],
        fields: initialSubmission?.fields ?? [],
        ds: [],
    }));

    const [S, setS] = useState({})
    // useEffect(()=>{
    //     setFormDef(()=>deepClone(initialFormDef ?? {}))
    // },[initialFormDef, setFormDef])
    const persistDebounced = useCallback(useDebouncedCallback((nextFormDef, nextSubmission, meta) => {
        onPersist({ formDef: nextFormDef, submission: nextSubmission, meta });
        console.log("handleFieldValueChange", nextSubmission)
    }, 700), [useDebouncedCallback, onPersist]);

    /** ---------------------------
     *  Value changes (filling)
     * --------------------------- */
    const handleFieldValueChange = useCallback((sectionDef, sectionInstance, fieldDef, nextValue) => {
        setSubmission((prev) => {
            // ensure section instance exists in submission and has an id
            const { nextSubmission, ensuredSection } = ensureSectionInstanceInSubmission(prev, sectionInstance, sectionDef);

            // upsert field value into normalized + nested
            const next = upsertSubmissionFieldValue(nextSubmission, ensuredSection, fieldDef, nextValue);

            const meta = {
                kind: "submission.fieldValueChanged",
                formSectionId: sectionDef?.id,
                submissionSectionId: ensuredSection?.id,
                fieldId: fieldDef?.id,
                value: nextValue,
            };

            onSubmissionChange(next, meta);
            persistDebounced(formDef, next, meta);
            return next;
        });
    }, [setSubmission, ensureSectionInstanceInSubmission, onSubmissionChange, persistDebounced]);

    const handleSubmissionSectionChange = useCallback((submission_section) => {
        setSubmission(prev => {
            const { ds = [] } = prev
            const has = ds.find(s => s?.id === submission_section?.id)
            if (has) {
                const newds = ds.map(s => (s?.id === submission_section?.id) ? submission_section : s)
                return {
                    ...prev,
                    ds: newds
                }
            } else {
                return {
                    ...prev,
                    ds: [...ds, submission_section]
                }
            }
        })
        // console.log(submission_section)
    }, [])
    /** ---------------------------
     *  Designer changes (structure)
     * --------------------------- */


    const {
        run: insertSection, error: errorInsertSection, loading: creatingSection,
        // entity, data 
    } = useAsyncThunkAction(InsertSectionAsyncAction, empty, { deferred: true })

    const handleCreate = useCallback(async () => {
        const sectionid = crypto.randomUUID()
        const result = await insertSection({
            id: sectionid,
            formId: initialFormDef?.id,
            name: `sekce`,
            label: 'Sekce',
            repeatable: false,
            repeatableMin: 1,
            repeatableMax: 1,
            fields: [{
                id: crypto.randomUUID(),
                name: "field",
                label: "Položka"
            }]
        })
        console.log(result)
        return result
    }, [insertSection])

    // const handleCreate = () => null
    /** ---------------------------
     *  Render
     * --------------------------- */
    return (
        <Row>
            <Col>
                <SimpleCardCapsule title={formDef?.name ?? "Form"}>
                    <SimpleCardCapsuleRightCorner>
                        {mode === 'design' && (<ConfirmClickButton
                            onClick={handleCreate}
                            className="btn btn-sm border-0"
                        >
                            + Sekce
                        </ConfirmClickButton>)}
                        <button className="btn btn-success btn-sm border-0" onClick={() => setMode(prev => prev === 'design' ? 'view' : 'design')}>
                            {mode === 'design' ? 'design' : 'view'}
                        </button>
                    </SimpleCardCapsuleRightCorner>

                    <h1>{formDef?.name ?? "Form"}</h1>
                    {formDef?.description && "--NEVYPLNĚNO--"}
                    <div>
                        {(formDef?.sections ?? []).map((secDef) => {
                            const digital_submission_sections =
                                submission?.ds?.filter(s => s?.formSectionId === secDef?.id) || []
                            return (
                                <UpdateSectionWrap
                                    digital_submission_sections={digital_submission_sections}
                                    onSubmissionSectionChange={handleSubmissionSectionChange}
                                    key={secDef?.id}
                                    formSectionDef={secDef}
                                    submission={submission}
                                    level={2}
                                    dummy={dummy}
                                    mode={mode}
                                // onFieldValueChange={handleFieldValueChange}
                                />
                            )
                        })}
                    </div>
                </SimpleCardCapsule>
            </Col>
            {debug && (
                <Col>
                    <SimpleCardCapsule title="Draft submission">
                        <pre>{JSON.stringify(submission?.ds, null, 2)}</pre>
                    </SimpleCardCapsule>
                    <SimpleCardCapsule title="Draft submission">
                        <pre>{JSON.stringify(submission, null, 2)}</pre>
                    </SimpleCardCapsule>
                    <pre>{JSON.stringify(initialFormDef, null, 2)}</pre>
                </Col>)}
            {debug && (
                <Col>
                    <SimpleCardCapsule title="Draft form definition">
                        <pre>{JSON.stringify(formDef, null, 2)}</pre>
                    </SimpleCardCapsule>
                </Col>
            )}
        </Row>

    );
};





export const PageUpdateItem = ({
    SubPage = UpdateForm,
    ...props
}) => {
    return (
        <PageItemBase
            SubPage={SubPage}
            {...props}
        />
    )
}