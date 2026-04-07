// digitalFormTree/shared.js

export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));

export const stableId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj || null));

export const headingIndex = (level) => clamp((level || 1) - 1, 0, 5);

// jednoduchý "obsahově stejné" pro arrays by id (zachovej jak to máš dnes)
export const sameByIdSet = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    const aset = new Set(a.map((x) => x?.id));
    for (const x of b) if (!aset.has(x?.id)) return false;
    return true;
};

export const normalizeFieldsForSection = (section, formSectionDef) => {
    const current = section?.fields || [];
    const defs = formSectionDef?.fields || [];

    const normalized = defs.map((fdef) => {
        const existing = current.find((x) => x?.formfield_id === fdef?.id);
        if (existing) return existing;

        return {
            id: stableId(),              // lokální ID (submissionfield může mít jiné)
            formfield_id: fdef?.id,
            value: "",
            // případně další defaulty
        };
    });

    const changed = !sameByIdSet(
        normalized.map((x) => ({ id: x?.formfield_id })),
        current.map((x) => ({ id: x?.formfield_id }))
    );

    return { normalized, changed };
};

export const normalizeSubsectionsForSection = (section, formSectionDef) => {
    const current = section?.sections || [];
    const defs = formSectionDef?.sections || [];

    const normalized = defs.map((sdef) => {
        const existing = current.find((x) => x?.formsection_id === sdef?.id);
        if (existing) return existing;

        return {
            id: stableId(),
            formsection_id: sdef?.id,
            name: sdef?.name,
            fields: [],
            sections: [],
        };
    });

    const changed = !sameByIdSet(
        normalized.map((x) => ({ id: x?.formsection_id })),
        current.map((x) => ({ id: x?.formsection_id }))
    );

    return { normalized, changed };
};
