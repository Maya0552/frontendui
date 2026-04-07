import Row from "react-bootstrap/Row"

import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormCardCapsule } from "./DigitalFormCardCapsule"
import { DigitalFormMediumCard } from "./DigitalFormMediumCard"
import { DigitalFormSectionLargeContent, DigitalFormSections } from "../../DigitalFormSectionGQLModel/Components/DigitalFormSectionLargeContent"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DigitalFormSectionButton } from "../../DigitalFormSectionGQLModel/Components/DigitalFormSectionCUDButton"
import { PlusLg } from "react-bootstrap-icons"


// Pomocné: je sekce repeatable?
function isRepeatableSection(section) {
    const fs = section.formSection || {};
    return !!(fs.repeatable || (fs.repeatableMin ?? 1) > 1);
}

// // Opraví backref parentu na všech okamžitých dětech (bez mutace původních)
// function relinkParentOnChildren(parent) {
//     let changed = false;
//     const fixed = parent.sections.map(c => {
//         if (c.section === parent) return c;
//         changed = true;
//         return { ...c, section: parent };
//     });
//     return changed ? { ...parent, sections: fixed } : parent;
// }

// // Opraví backref submission v celém podstromu (bez mutace původních)
// function relinkSubmissionDeep(section, submission) {
//     let anyChanged = false;

//     const kids = section.sections.map(child => {
//         const childWithSub = (child.submission === submission) ? child : { ...child, submission };
//         const fixed = relinkSubmissionDeep(childWithSub, submission);
//         if (fixed !== child) anyChanged = true;
//         return fixed;
//     });

//     if (anyChanged || section.submission !== submission) {
//         return { ...section, submission, sections: kids };
//     }
//     return section;
// }

/**
 * DOPLNÍ data do submission stromu (immutably).
 * - repeatable sekce očekávají pole; položka pro danou sekci se bere podle section.index
 * - nerepeatable sekce očekávají objekt
 * - fields se párují přes getFieldKey
 * - neznámé klíče v datech ignoruje
 *
 * @param {object} submission  strom z CreateSubmissionFromDigitalForm
 * @param {object} data        JSON ve formátu z extractSubmissionData(...)
 * @param {object} [options]
 * @param {(f:object)=>string} [options.getFieldKey]   výběr klíče fieldu v datech
 * @param {(s:object)=>string} [options.getSectionKey] výběr klíče sekce v datech
 * @param {(field:any, raw:any)=>any} [options.coerceValue] přetypování hodnot (např. na číslo/ISO)
 * @param {boolean} [options.clearMissing=false] když v datech chybí klíč, vynulovat field (""), jinak ponechat
 * @returns {object} nový submission (nebo původní reference, pokud nic nezměněno)
 */
export function applySubmissionData(
    submission,
    data,
    {
        getFieldKey = (f) => f.field?.name ?? `ChybejiciJmeno ${f.field?.id}`,
        getSectionKey = (s) => s.formSection?.name ?? `ChybejiciJmeno ${s.formSection?.id}`,
        coerceValue = (field, raw) => raw,
        clearMissing = false,
    } = {}
) {
    if (!submission || !data) return submission;

    // Rekurze: vyrobí případně novou sekci s doplněnými hodnotami
    function fillSection(section, sectionData) {
        let changed = false;

        // 1) fields
        const newFields = section.fields.map(f => {
            const key = getFieldKey(f);
            if (sectionData && Object.prototype.hasOwnProperty.call(sectionData, key)) {
                const next = coerceValue(f, sectionData[key]);
                if (next !== f.value) {
                    changed = true;
                    return { ...f, value: next }; // backref na section opravíme až po sestavení sekce
                }
                return f;
            } else if (clearMissing && f.value !== "") {
                changed = true;
                return { ...f, value: "" };
            }
            return f;
        });

        // 2) children
        const newChildren = section.sections.map(child => {
            const groupKey = getSectionKey(child);
            const groupData = sectionData ? sectionData[groupKey] : undefined;

            const childData = isRepeatableSection(child)
                ? (Array.isArray(groupData) ? groupData[child.index ?? 0] : undefined)
                : groupData;

            const filled = fillSection(child, childData);
            if (filled !== child) changed = true;
            return filled;
        });

        if (!changed) return section;

        // 3) slož novou sekci + oprav backrefy
        let newSection = { ...section, fields: newFields, sections: newChildren };

        // nastav section backref na nového parenta na všech dětech
        newSection = relinkParentOnChildren(newSection);

        // nastav child.field.section backref na novou sekci (jen pro změněné fieldy)
        newSection.fields = newSection.fields.map(f =>
            (f.section === newSection ? f : { ...f, section: newSection })
        );

        return newSection;
    }

    // A) pro každý root vyhledej jeho data a aplikuj
    let rootsChanged = false;
    const newRoots = submission.sections.map(root => {
        const key = getSectionKey(root);
        const dataForRoot = isRepeatableSection(root)
            ? (Array.isArray(data[key]) ? data[key][root.index ?? 0] : undefined)
            : data[key];

        const filled = fillSection(root, dataForRoot);
        if (filled !== root) rootsChanged = true;
        return filled;
    });

    if (!rootsChanged) return submission;

    // B) nový submission se změněnými rooty + oprav submission backrefy v podstromech
    let newSubmission = { ...submission, sections: newRoots };
    newSubmission.sections = newSubmission.sections.map(r => relinkSubmissionDeep(r, newSubmission));

    return newSubmission;
}

/**
 * Vyextrahuje čistá data ze Submission stromu.
 * - repeatable sekce => pole; index určuje pozici
 * - nerepeatable => objekt
 * - fields => { [fieldName]: value }
 *
 * @param {object} submission  výstup z CreateSubmissionFromDigitalForm
 * @param {object} [options]
 * @param {(f:object)=>string} [options.getFieldKey]   jak pojmenovat field (default: field.name || field.key || field.id)
 * @param {(s:object)=>string} [options.getSectionKey] jak pojmenovat sekci (default: formSection.name || key || id)
 * @param {(group:Array<object>)=>boolean} [options.isRepeatableGroup] rozhodne, jestli skupinu sekcí vrátit jako pole
 * @param {*} [options.fillMissing=null] hodnota pro neobsazené indexy v poli (null/undefined)
 * @returns {object} čistá data
 */
export function extractSubmissionData(
    submission,
    {
        getFieldKey = (f) => f.field?.name ?? `ChybejiciJmeno ${f.field?.id}`,
        getSectionKey = (s) => s.formSection?.name ?? `ChybejiciJmeno ${s.formSection?.id}`,
        isRepeatableGroup = (group) =>
            (group[0]?.formSection?.repeatable) || ((group[0]?.formSection?.repeatableMin ?? 1) > 1),
        fillMissing = null,
    } = {}
) {
    // Zpracuj jednu sekci na plain objekt
    const sectionToValue = (section) => {
        // 1) fields -> { key: value }
        const fieldsObj = {};
        for (const f of section.fields || []) {
            const k = getFieldKey(f);
            fieldsObj[k] = f.value;
        }

        // 2) děti seskup podle typu (formSection.id); ulož i label klíč pro výstup
        const groupsByTypeId = new Map();
        for (const child of section.sections || []) {
            const typeId = child.formSection?.id ?? getSectionKey(child);
            if (!groupsByTypeId.has(typeId)) {
                groupsByTypeId.set(typeId, { propKey: getSectionKey(child), items: [] });
            }
            groupsByTypeId.get(typeId).items.push(child);
        }

        // 3) pro každou skupinu vytvoř buď objekt, nebo pole
        const childrenObj = {};
        for (const { propKey, items } of groupsByTypeId.values()) {
            if (isRepeatableGroup(items)) {
                // pole, pozice podle submissionSection.index
                const maxIndex = Math.max(...items.map((s) => s.index ?? 0), 0);
                const arr = Array(maxIndex + 1).fill(fillMissing);
                for (const s of items) {
                    arr[s.index ?? 0] = sectionToValue(s);
                }
                childrenObj[propKey] = arr;
            } else {
                // jediná položka => objekt
                childrenObj[propKey] = sectionToValue(items[0]);
            }
        }

        // 4) spoj fields + děti
        return { ...fieldsObj, ...childrenObj };
    };

    // Kořeny submission.sections mohou obsahovat víc typů – seskup stejně jako u dětí
    const rootGroups = new Map();
    for (const root of submission.sections || []) {
        const typeId = root.formSection?.id ?? getSectionKey(root);
        if (!rootGroups.has(typeId)) {
            rootGroups.set(typeId, { propKey: getSectionKey(root), items: [] });
        }
        rootGroups.get(typeId).items.push(root);
    }

    const out = {};
    for (const { propKey, items } of rootGroups.values()) {
        if (isRepeatableGroup(items)) {
            const maxIndex = Math.max(...items.map((s) => s.index ?? 0), 0);
            const arr = Array(maxIndex + 1).fill(fillMissing);
            for (const s of items) arr[s.index ?? 0] = sectionToValue(s);
            out[propKey] = arr;
        } else {
            out[propKey] = sectionToValue(items[0]);
        }
    }

    return out;
}

const CreateSubmissionSections = (
    digitalform, 
    digitalformsection={}, 
    digitalsubmission={}, 
    digitalsubmissionsection=null, 
    onChange=()=>null
) => { 
    const {repeatableMin=1} = digitalformsection
    const {sections=[], fields=[]} = digitalformsection
    const results = Array(repeatableMin).fill({}).map((item, index) => {
        const id = crypto.randomUUID()
        const result = {
            __typename: "DigitalSubmissionSection",
            id: id,
            index: index,
            formSection: digitalformsection,
            submission_id: digitalsubmission.id,
            sectionId: digitalsubmissionsection?.id, // or some default value
            section: digitalsubmissionsection,
            submission: digitalsubmissionsection?null: digitalsubmission,
            sections: [],
            fields: [],
            onChange: onChange,
        }
        result.fields = fields.map(digitalformfield => ({
            __typename: "DigitalSubmissionField",
                id: crypto.randomUUID(),
                field: digitalformfield,
                sectionId: id, // or some default value
                section: result,
                submissionId: digitalsubmission.id,
                value: "", // or some default value
                onChange: onChange
            }))
        return result
    })
    for(const result of results) {
        result.sections = sections.map(
            section => CreateSubmissionSections(digitalform, section, digitalsubmission, result, onChange)
        ).flat()
    }
    return results
}

const CreateSubmissionFromDigitalForm = (digitalform, data, onChange) => {
    const {sections=[]} = digitalform
    const result = {
        __typename: "DigitalSubmission",
        id: crypto.randomUUID(),
        form: digitalform,
        sections: [],
        fields: [],
        onChange: onChange,
    }
    result.sections = sections.map(section => CreateSubmissionSections(digitalform, section, result, null, onChange))
    result.sections = result.sections.flat()
    result.sections.forEach(
        section => section.submission = result // nastav zpětný odkaz na submission
    )
    console.log("CreateSubmissionFromDigitalForm", digitalform, data, result)
    return result
}

// vystoupej k root sekci
function climbToRoot(section) {
    let cur = section;
    while (cur?.section) cur = cur.section;
    return cur;
}

// oprav backrefy submission v celém podstromu
function relinkSubmissionDeep(section, submission) {
    let changed = false;

    const fixedChildren = section.sections.map(child => {
        // zajisti child.submission === submission
        const childWithSub = (child.submission === submission) ? child : { ...child, submission };
        const fixed = relinkSubmissionDeep(childWithSub, submission);
        if (fixed !== child) changed = true;
        return fixed;
    });

    if (changed || section.submission !== submission) {
        return {
            ...section,
            submission,
            sections: fixedChildren
        };
    }
    return section;
}

// oprav backrefy parent.section u všech okamžitých dětí (sourozenců)
function relinkParentOnChildren(parent) {
    const kids = parent.sections;
    let changed = false;
    const fixed = kids.map(k => {
        if (k.section === parent) return k;      // už OK
        changed = true;
        return { ...k, section: parent };
    });
    return changed ? { ...parent, sections: fixed } : parent;
}

export function ChangeField(field, value) {
    const leafSection = field.section;

    // 0) nic se nemění → vrať původní submission (z rootu)
    if (value === field.value) {
        const root = climbToRoot(leafSection);
        return root.submission;
    }

    // 1) uprav field v jeho sekci
    const updatedField = { ...field, value };
    const newFields = leafSection.fields.map(f => (f.id === field.id ? updatedField : f));
    let updatedSection = { ...leafSection, fields: newFields };
    updatedField.section = updatedSection; // backref na novou sekci

    // 2) bubluj nahoru: v každém rodiči vyměň potomka a oprav parent backrefy u všech dětí
    let parent = leafSection.section;
    while (parent) {
        const newChildren = parent.sections.map(s => (s.id === updatedSection.id ? updatedSection : s));
        let newParent = { ...parent, sections: newChildren };

        // oprav, aby všechny děti ukazovaly na newParent
        newParent = relinkParentOnChildren(newParent);

        // nastav backref dítěte na newParent
        updatedSection.section = newParent;

        // pokračuj o úroveň výš
        updatedSection = newParent;
        parent = parent.section;
    }

    // 3) máme nový root
    let rootSection = updatedSection;
    const oldSubmission = rootSection.submission;
    if (!oldSubmission) throw new Error("Missing submission on root section.");

    // 4) slož nové submission s novým rootem
    let newSubmission = {
        ...oldSubmission,
        sections: oldSubmission.sections.map(s => (s.id === rootSection.id ? rootSection : s)),
    };

    // 5) doreferencuj submission backrefy v celém podstromu rootu na newSubmission
    rootSection = relinkSubmissionDeep(rootSection, newSubmission);
    if (rootSection !== newSubmission.sections.find(s => s.id === rootSection.id)) {
        newSubmission = {
            ...newSubmission,
            sections: newSubmission.sections.map(s => (s.id === rootSection.id ? rootSection : s)),
        };
    }

    return newSubmission;
}

/**
 * A large card component for displaying detailed content and layout for an digitalform entity.
 *
 * This component wraps an `DigitalFormCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormLargeCard component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform entity.
 * @param {string} props.digitalform.name - The name or label of the digitalform entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormLargeCard digitalform={digitalformEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormLargeCard>
 */
export const DigitalFormLargeContent = ({digitalform, children}) => {
    // const digitalform = useSelector(state => state.items[old.id]);
    // const digitalform = old
    // console.log("DigitalFormLargeContent.render", digitalform?.sections)
    const {fields=[], sections=[]} = digitalform
    const filtered_sections = sections.filter(
        // section => section?.formId 
        section => section?.sectionId === null
    )
    const [activeSection, setActiveSection] = useState(filtered_sections?.[0])
    const [submissionData, setSubmissionData] = useState({})
    const [submission, setSubmission] = useState(null)
    const onChange = useCallback(
        (sf, value) => {
            sf.value = value // aktualizuj hodnotu v poli
            const changedSubmission = ChangeField(sf, value)
            console.log("DigitalFormLargeContent.onChange", sf, value)
            console.log("DigitalFormLargeContent.onChange", changedSubmission?.id, submission?.id)
            const data = extractSubmissionData(changedSubmission)
            setSubmissionData(data)
            setSubmission(changedSubmission)
        }, [digitalform]
    )
    useEffect(
        () => { 
            const result = CreateSubmissionFromDigitalForm(digitalform, submissionData, onChange);
            console.log("DigitalFormLargeContent: new submission", result)
            const data = extractSubmissionData(result)
            setSubmissionData(data)
            setSubmission(result)
        },
        [digitalform]
    )
    const onSectionSelect = (section) => () => setActiveSection(section)
    const onInsert = (freshDigitalFormSection) => {
        console.log("inserted", freshDigitalFormSection)
    }
    return (
        <> 
        {/* DigitalFormLargeContent<br /> */}
            {filtered_sections.map(
                section => <button key={section?.id} className="btn btn-sm btn-outline-success" onClick={onSectionSelect(section)}>{section?.name ?? "Nepojmenovaná sekce"}</button>
            )}
            <DigitalFormSectionButton
                operation="C" 
                className="btn btn-sm btn-outline-success"
                onDone={onInsert}
                digitalformsection={{
                    formId: digitalform.id,
                    id: crypto.randomUUID(),
                    name: "section",
                    label: "Nová sekce fomuláře",
                    labelEn: "New section",
                    description: "Popis / nápověda",
                    order: filtered_sections.lenght + 1,
                    repeatable: false,
                    repeatableMin: 1,
                    repeatableMax: 1
                }}
            >
                <PlusLg  /> Přidat sekci do formuláře
            </DigitalFormSectionButton>
            <br />
            <DigitalFormSections 
                digitalformsections={filtered_sections} 
                submissionsections={submission?.sections} 
            />
            
            <pre>DigitalFormLargeContent{JSON.stringify(submissionData, null, 4)}</pre>
            {/* <pre>DigitalFormLargeContent{JSON.stringify(removeCircularReferences(submission)?.sections, null, 4)}</pre> */}
            {/* <pre>DigitalFormLargeContent{JSON.stringify(submission?.sections[0], null, 4)}</pre> */}
            <pre>DigitalFormLargeContent{JSON.stringify(submission?.sections, getCircularReplacer(), 4)}</pre>
        </>
    )
}

function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (key === "section" || key === "submission") return undefined; // vynecháme reference na rodiče
        // if (typeof value === "object" && value !== null) {
        //     if (seen.has(value)) return "[Circular]";
        //     seen.add(value);
        // }
        if (typeof value === "function") return undefined; // zahodíme funkce (onChange ap.)
        return value;
    };
}

function removeCircularReferences(input, {
    circularPlaceholder = "[Circular]",
    keepFunctionsAs = null, // např. "[Function]" (null = vynechat)
} = {}) {
    if (input === null || typeof input !== "object") return input;

    const rootClone = Array.isArray(input) ? [] : {};
    const seen = new WeakSet();              // co už jsme navštívili
    const q = [{ src: input, dst: rootClone }];
    seen.add(input);

    while (q.length) {
        const { src, dst } = q.shift();

        // jen vlastní enumerable klíče (pro pole to dá indexy jako řetězce)
        const keys = Object.keys(src);
        for (const key of keys) {
            const value = src[key];

            if (typeof value === "function") {
                if (keepFunctionsAs !== null) dst[key] = keepFunctionsAs; // např. "[Function]"
                // jinak vynecháme
                continue;
            }

            if (value && typeof value === "object") {
                if (seen.has(value)) {
                    dst[key] = circularPlaceholder;
                } else {
                    const childClone = Array.isArray(value) ? [] : {};
                    dst[key] = childClone;
                    seen.add(value);
                    q.push({ src: value, dst: childClone });
                }
            } else {
                dst[key] = value; // primitiva
            }
        }
    }

    return rootClone;
}