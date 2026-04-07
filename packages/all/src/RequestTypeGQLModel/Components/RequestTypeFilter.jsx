import { Input, Label, Select, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { useEffect, useMemo, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { CQCol, CQRow } from "../../CQ";


// const onChange_ = ([filter, setFilter], onChange) => (subfilter) => {
//     if (!subfilter || typeof subfilter !== "object") return;
//     const [key] = Object.keys(subfilter);
//     if (!key) return;

//     // atomická podmínka: { field: { _op: value } }
//     if (!key.startsWith("_")) {
//         const field = key;
//         const opsObj = subfilter[field] || {};
//         const next = ensureAndConjunct(filter, field, opsObj);
//         setFilter(next);
//         onChange(next);           // posíláme vždy celé where
//         return;
//     }

//     // pokud přijde přímo _and/_or/_not, řeš dle své politiky
//     const next = { ...filter, ...subfilter };
//     setFilter(next);
//     onChange(next);
// };

export const StrFilter = ({ filter, onChange }) => {
    // Bezpečné rozbalení: filter = { fieldName: { op: value } }
    const [[name, opWithValDict] = ["", {}]] = Object.entries(filter || {});
    const [[op, value] = ["_ilike", ""]] = Object.entries(opWithValDict || {});

    const [operator, setOperator] = useState(op || "_ilike");
    const [operand, setOperand] = useState(value ?? "");

    const apply = useMemo(() => {
        if (!name) return () => {};
        return makeApplyFn(name, onChange);
    }, [name, onChange]);

    // Sync při změně incoming props.filter
    useEffect(() => {
        const [[n, dict] = ["", {}]] = Object.entries(filter || {});
        const [[o, v] = [operator, operand]] = Object.entries(dict || {});
        if (n) {
            if (o !== operator) setOperator(o || "_ilike");
            if ((v ?? "") !== operand) setOperand(v ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    function onChangeOperator(e) {
        if (!name) return;
        const nextOp = e?.target?.value || "";
        if (nextOp === operator) return;
        setOperator(nextOp);
        // prázdná volba operátoru => jen smaž starý
        if (!nextOp) {
            apply(operator, "", operator);  // remove previous op
            return;
        }
        apply(nextOp, operand, operator);   // přepnutí op (remove old, set new)
    }

    function onChangeOperand(e) {
        if (!name) return;
        const val = e?.target?.value ?? "";
        setOperand(val);
        if (!operator) return;              // bez operátoru neaplikujeme
        apply(operator, val);               // update / remove (při prázdné hodnotě)
    }

    return (
        <>
            <Label title={name}>
                <CQRow>
                    <CQCol xs={12} md={4}>
                        <Select
                            id={name}
                            className="form-control"
                            defaultValue={operator}
                            onChange={onChangeOperator}
                            onBlur={onChangeOperator}
                        >
                            <option value="">-- vyberte --</option>
                            <option value="_ilike">obsahuje</option>
                            {/* <option value="_eq">je přesně</option> */}
                            <option value="_ge">větší</option>
                            <option value="_le">menší</option>
                            <option value="_startsWith">začíná na</option>
                            <option value="_endsWith">končí na</option>
                        </Select>
                    </CQCol>
                    <CQCol xs={12} md={8}>
                        <Input
                            id={name}
                            className="form-control"
                            name="exact"
                            defaultValue={operand}
                            onChange={onChangeOperand}
                            onBlur={onChangeOperand}
                        />
                    </CQCol>
                </CQRow>
            </Label>
        </>
    );
};


export const NumberFilter = ({ filter, onChange, minValue, maxValue }) => {
    // Bezpečné rozbalení: filter = { fieldName: { op: value } }
    const [[name, opWithValDict] = ["", {}]] = Object.entries(filter || {});
    const [[op, value] = ["_ilike", ""]] = Object.entries(opWithValDict || {});

    const [operator, setOperator] = useState(op || "_ilike");
    const [operand, setOperand] = useState(value ?? "");

    const apply = useMemo(() => {
        if (!name) return () => {};
        return makeApplyFn(name, onChange);
    }, [name, onChange]);

    // Sync při změně incoming props.filter
    useEffect(() => {
        const [[n, dict] = ["", {}]] = Object.entries(filter || {});
        const [[o, v] = [operator, operand]] = Object.entries(dict || {});
        if (n) {
            if (o !== operator) setOperator(o || "_ilike");
            if ((v ?? "") !== operand) setOperand(v ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    function onChangeOperator(e) {
        if (!name) return;
        const nextOp = e?.target?.value || "";
        if (nextOp === operator) return;
        setOperator(nextOp);
        // prázdná volba operátoru => jen smaž starý
        if (!nextOp) {
            apply(operator, "", operator);  // remove previous op
            return;
        }
        apply(nextOp, operand, operator);   // přepnutí op (remove old, set new)
    }

    function onChangeOperand(e) {
        if (!name) return;
        const val = e?.target?.value ?? "";
        setOperand(val);
        if (!operator) return;              // bez operátoru neaplikujeme
        apply(operator, val);               // update / remove (při prázdné hodnotě)
    }

    return (
        <>
            <Label title={name}>
                <CQRow>
                    <CQCol xs={12} md={4}>
                        <Select
                            id={name}
                            className="form-control"
                            defaultValue={operator}
                            onChange={onChangeOperator}
                            onBlur={onChangeOperator}
                        >
                            <option value="">-- vyberte --</option>
                            {/* <option value="_ilike">obsahuje</option> */}
                            <option value="_eq">je přesně</option>
                            <option value="_ge">větší</option>
                            <option value="_le">menší</option>
                            {/* <option value="_startsWith">začíná na</option>
                            <option value="_endsWith">končí na</option> */}
                        </Select>
                    </CQCol>
                    <CQCol xs={12} md={8}>
                        <Input
                            id={name}
                            type="number"
                            className="form-control"
                            name="exact"
                            defaultValue={operand}
                            onChange={onChangeOperand}
                            onBlur={onChangeOperand}
                        />
                    </CQCol>
                </CQRow>
            </Label>
        </>
    );
};

function extractMinMax(filterObj, field) {
    const root = (filterObj && filterObj[field]) || {};
    let min = root._ge ?? null;
    let max = root._le ?? null;

    if ((min == null || max == null) && Array.isArray(filterObj?._and)) {
        for (const term of filterObj._and) {
            if (term?.[field]?._ge != null) min = term[field]._ge;
            if (term?.[field]?._le != null) max = term[field]._le;
        }
    }
    return { min, max };
}

function extractFieldName(filter) {
    if (!filter || typeof filter !== "object") return "";
    // kořen (první ne-underscore klíč)
    for (const k of Object.keys(filter)) {
        if (!k.startsWith("_")) return k;
    }
    // _and varianta
    if (Array.isArray(filter._and)) {
        for (const term of filter._and) {
            if (term && typeof term === "object") {
                const k = Object.keys(term).find(x => !x.startsWith("_"));
                if (k) return k;
            }
        }
    }
    return "";
}

export const NumberIntervalFilter = ({
    filter,                 // { price: { _ge: x, _le: y } } nebo přes _and
    onChange,               // očekává { [name]: { _ge: <num|null>, _le: <num|null> } }
    minValue, maxValue,     // volitelné mantinely
    step = 1,
    title,                  // nepovinné; když není, použije se name
}) => {
    const name = useMemo(() => extractFieldName(filter || {}), [filter]);
    const { min: initMin, max: initMax } = useMemo(
        () => extractMinMax(filter || {}, name),
        [filter, name]
    );

    const [min, setMin] = useState(initMin ?? "");
    const [max, setMax] = useState(initMax ?? "");

    // drž sync se změnami zvenku – ale jen když se hodnoty opravdu liší
    useEffect(() => {
        const nextMin = initMin ?? "";
        const nextMax = initMax ?? "";
        if (String(min) !== String(nextMin)) setMin(nextMin);
        if (String(max) !== String(nextMax)) setMax(nextMax);
    }, [initMin, initMax]); // eslint-disable-line

    // pošli oba operátory najednou; prázdno => null (maže)
    const applyBoth = (nextMin, nextMax) => {
        if (!name) return;
        const ge = (nextMin === "" || nextMin == null) ? null : Number(nextMin);
        const le = (nextMax === "" || nextMax == null) ? null : Number(nextMax);
        onChange?.({ [name]: { _ge: ge, _le: le } });
    };

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    function onMinChange(e) {
        const raw = e?.target?.value ?? "";
        if (raw === "") {
            setMin("");
            applyBoth("", max);
            return;
        }
        let val = Number(raw);
        if (Number.isNaN(val)) return;
        const lo = (minValue ?? -Infinity);
        const hi = (max === "" ? (maxValue ?? Infinity) : Number(max));
        val = clamp(val, lo, hi);
        setMin(val);
        applyBoth(val, max);
    }

    function onMaxChange(e) {
        const raw = e?.target?.value ?? "";
        if (raw === "") {
            setMax("");
            applyBoth(min, "");
            return;
        }
        let val = Number(raw);
        if (Number.isNaN(val)) return;
        const lo = (min === "" ? (minValue ?? -Infinity) : Number(min));
        const hi = (maxValue ?? Infinity);
        val = clamp(val, lo, hi);
        setMax(val);
        applyBoth(min, val);
    }

    return (
        <Label title={title || name}>
            <CQRow>
                <CQCol xs={12} md={6}>
                    <Input
                        id={`${name}-from`}
                        type="number"
                        className="form-control"
                        name={`${name}-from`}
                        value={min === "" ? "" : min}       
                        min={minValue}
                        max={maxValue}
                        step={step}
                        placeholder="Od"
                        onChange={onMinChange}
                        onBlur={onMinChange}
                    />
                </CQCol>
                <CQCol xs={12} md={6}>
                    <Input
                        id={`${name}-to`}
                        type="number"
                        className="form-control"
                        name={`${name}-to`}
                        value={max === "" ? "" : max}       
                        min={minValue}
                        max={maxValue}
                        step={step}
                        placeholder="Do"
                        onChange={onMaxChange}
                        onBlur={onMaxChange}
                    />
                </CQCol>
            </CQRow>
        </Label>
    );
};

// export function ensureAndConjunct(base, field, opsObj) {
//     const next = { ...base };
//     const andArr = Array.isArray(next._and) ? [...next._and] : [];

//     for (const [op, val] of Object.entries(opsObj || {})) {
//         const idx = andArr.findIndex(
//             (f) => f && Object.prototype.hasOwnProperty.call(f, field) &&
//                 f[field] && Object.prototype.hasOwnProperty.call(f[field], op)
//         );
//         // ✨ Podpora mazání
//         if (val == null || val === "") {
//             if (idx >= 0) andArr.splice(idx, 1);
//             continue;
//         }

//         const entry = { [field]: { [op]: val } };
//         if (idx >= 0) andArr[idx] = entry;
//         else andArr.push(entry);
//     }

//     next._and = andArr;
//     return next;
// }

export function mapOpValue(op, value) {
    if (value == null || value === "") {
        return { [op]: value };          // umožní smazání v ensureAndConjunct
    }
    if (op === "_ilike") {
        return { [op]: `%${value}%` };   // jen pro neprázdnou hodnotu
    }
    return { [op]: value };              // čísla, datetime atd. beze změny
}

export function makeApplyFn(name, onChange) {
    return function apply(nextOp, value, prevOp = null) {
        const isEmpty = value == null || value === "";

        if (isEmpty) {
            // smaž aktuální výraz (preferuj prevOp, když měníš operátor)
            const delObj = mapOpValue(prevOp || nextOp, value);
            const delOp = Object.keys(delObj)[0];
            onChange({ [name]: { [delOp]: value } }); // value je "" nebo null
            return;
        }

        const mappedNew = mapOpValue(nextOp, value);
        const newOp = Object.keys(mappedNew)[0];
        const newVal = mappedNew[newOp];

        if (prevOp && prevOp !== nextOp) {
            // zároveň odstraň starý op
            const mappedOld = mapOpValue(prevOp, value);
            const oldOp = Object.keys(mappedOld)[0];
            onChange({ [name]: { [oldOp]: null, [newOp]: newVal } });
        } else {
            onChange({ [name]: { [newOp]: newVal } });
        }
    };
}

export function ensureAndConjunct(base, field, opsObj) {
    const next = { ...base };
    let andArr = Array.isArray(next._and) ? [...next._and] : [];
    const entries = Object.entries(opsObj || {});

    // 1) Nejdřív smaž všechno, co má null/"" (bez ohledu na pořadí)
    for (const [op, val] of entries) {
        if (val == null || val === "") {
            andArr = andArr.filter(f => {
                if (!f || !Object.prototype.hasOwnProperty.call(f, field)) return true;
                const obj = f[field];
                return !(obj && Object.prototype.hasOwnProperty.call(obj, op));
            });
        }
    }

    // 2) Pak přidej/nahraď položky s hodnotou
    for (const [op, val] of entries) {
        if (val == null || val === "") continue;

        const idx = andArr.findIndex(f =>
            f &&
            Object.prototype.hasOwnProperty.call(f, field) &&
            f[field] &&
            Object.prototype.hasOwnProperty.call(f[field], op)
        );

        const entry = { [field]: { [op]: val } };
        if (idx >= 0) andArr[idx] = entry;
        else andArr.push(entry);
    }

    // 3) Úklid: prázdné _and pryč
    if (andArr.length > 0) next._and = andArr;
    else delete next._and;

    return next;
}

export function makeFilterChangeHandler(setFilter, onChange = () => {}) {
    return function handleSubfilter(subfilter) {
        
        if (!subfilter || typeof subfilter !== "object") return;
        const [key] = Object.keys(subfilter || {});
        if (!key) return;

        if (!key.startsWith("_")) {
            const field = key;
            const opsObj = subfilter[field] || {};
            setFilter(prev => {
                const next = ensureAndConjunct(prev, field, opsObj);
                onChange(next);
                return next;
            });
            return;
        }

        setFilter(prev => {
            const next = { ...prev, ...subfilter };
            onChange(next);
            return next;
        });
    };
}

export const RequestTypeFilter = ({onChange=(newFilter)=> null}) => {
    const [filter, setFilter] = useState({})
    const onChange_ = makeFilterChangeHandler(setFilter, (newFilter) => {
        console.log("RequestTypeFilter.onChange", JSON.stringify(newFilter));
        onChange(newFilter); // předáme rodiči
    });
    return (<>
        <SimpleCardCapsule title="Typ požadavku" className="mb-3">
            <StrFilter onChange={onChange_} filter={{fullname: {}}} />
            <NumberFilter onChange={onChange_} filter={{id: {}}} />
            <NumberIntervalFilter onChange={onChange_} filter={{initial_form_id: {}}} />
        </SimpleCardCapsule>
    </>)
}