// ---------- util ----------
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

function detectScalarType(v, { detectDates = true } = {}) {
    if (v === null || v === undefined) return "string";
    const t = typeof v;
    if (t === "number") return "number";
    if (t === "boolean") return "boolean";
    if (t === "string") {
        if (detectDates) {
            // jednoduchá heuristika na ISO (YYYY-MM-DD nebo ISO datetime)
            const isDate = /^\d{4}-\d{2}-\d{2}$/.test(v);
            const isDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v);
            if (isDateTime) return "datetime";
            if (isDate) return "date";
        }
        return "string";
    }
    return "string";
}

function makeField(name, type, order) {
    return {
        __typename: "DigitalFormField",
        id: uid(),
        name,
        key: name,
        type,      // "string" | "number" | "boolean" | "date" | "datetime"
        order: order ?? 0,
    };
}

function makeSection(name, { repeatableMin = 1, repeatable = false, order = 0, meta = {} } = {}) {
    return {
        __typename: "DigitalFormSection",
        id: uid(),
        name,
        key: name,
        order,
        repeatableMin,
        repeatable,
        sections: [],
        fields: [],
        meta, // volitelný prostor (např. { arrayOfPrimitive:true, valueFieldKey:"value" })
    };
}

// ---------- inference z JSON ----------
/**
 * Z „ukázkového“ JSONu vyrobí DigitalForm (s kořenovou sekcí).
 * - Kořen: jedna sekce `rootName`, do ní se vloží top-level fieldy/sekce.
 * - Siblings předpokládáme homogenní.
 */
export function buildDigitalFormFromJson(sample, {
    rootName = "__root__",
    detectDates = true,
    arrayPrimitiveFieldKey = "value",   // název fieldu uvnitř sekce pro pole primitiv
} = {}) {
    const root = makeSection(rootName, { repeatableMin: 1, repeatable: false });

    const fillSectionFromObject = (section, obj) => {
        let order = 0;
        for (const [k, v] of Object.entries(obj ?? {})) {
            if (Array.isArray(v)) {
                // Array → repeatable sekce
                const arr = v;
                const child = makeSection(k, { repeatable: true, repeatableMin: arr.length, order: order++ });

                // prázdné nebo pole primitiv?
                const firstNonNull = arr.find(x => x !== null && x !== undefined);
                if (firstNonNull === undefined) {
                    // nevíme typ, dáme jeden "value" field jako string (uživatel může doplnit)
                    child.fields.push(makeField(arrayPrimitiveFieldKey, "string", 0));
                    child.meta = { ...child.meta, arrayOfPrimitive: true, valueFieldKey: arrayPrimitiveFieldKey };
                } else if (typeof firstNonNull !== "object") {
                    // array primitiv
                    const ft = detectScalarType(firstNonNull, { detectDates });
                    child.fields.push(makeField(arrayPrimitiveFieldKey, ft, 0));
                    child.meta = { ...child.meta, arrayOfPrimitive: true, valueFieldKey: arrayPrimitiveFieldKey };
                } else {
                    // array objektů → rozlož podle prvku
                    // (předpoklad: homogenní; bereme první non-null objekt)
                    fillSectionFromObject(child, firstNonNull);
                }

                section.sections.push(child);
                continue;
            }

            if (v && typeof v === "object") {
                // vnořený objekt → nevrepeatovatelná sekce
                const child = makeSection(k, { repeatable: false, repeatableMin: 1, order: order++ });
                fillSectionFromObject(child, v);
                section.sections.push(child);
                continue;
            }

            // primitivum → field
            const ft = detectScalarType(v, { detectDates });
            section.fields.push(makeField(k, ft, order++));
        }
        return section;
    };

    fillSectionFromObject(root, sample);

    // Zformujeme "DigitalForm" obal (pokud ho používáš)
    return {
        __typename: "DigitalForm",
        id: uid(),
        name: "Inferred Form",
        sections: [root],
        fields: [],  // kořenové fieldy jsou uvnitř root sekce
    };
}
