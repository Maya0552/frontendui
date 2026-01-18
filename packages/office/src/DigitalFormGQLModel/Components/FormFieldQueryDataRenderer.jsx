import { useEffect, useState } from "react";
import { Input } from "../../../../_template/src/Base/FormControls/Input";
import { TextArea } from "../../../../_template/src/Base/FormControls/TextArea";
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { useGQLClient } from "../../../../dynamic/src/Store";
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";
import { ReadAsyncAction as ReadFormAsyncAction } from "../../DigitalFormGQLModel/Queries";
import { validateJavaScriptExecutionEnvironment } from "happy-dom/lib/PropertySymbol";

/**
 * Get value from JSON-like data using dot selector, supports:
 *  - numeric index: "data.result.0.name"
 *  - wildcard index: "data.result.*.name"
 *
 * Returns:
 *  - { ok: true, value }
 *  - { ok: false, error, code, at, segment, pathSoFar, expected, actualType }
 */
function selectJson(selector, data, options = {}) {
  const {
    allowEmptySelector = false, // if true, "" returns the whole data
    flatten = false,            // if true, flattens nested arrays produced by "*"
  } = options;

  const isIndexSegment = (seg) => /^\d+$/.test(seg);
  const isWildcard = (seg) => seg === "*";

  const typeOf = (v) => {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    return typeof v;
  };

  const flatDeep1 = (arr) => arr.reduce((acc, x) => acc.concat(x), []);

  if (typeof selector !== "string") {
    return {
      ok: false,
      code: "INVALID_SELECTOR",
      error: "Selector must be a string.",
      at: 0,
      segment: String(selector),
      pathSoFar: "",
      expected: "string",
      actualType: typeof selector,
    };
  }

  const trimmed = selector.trim();

  if (trimmed === "") {
    if (allowEmptySelector) return { ok: true, value: data };
    return {
      ok: false,
      code: "EMPTY_SELECTOR",
      error: "Selector is empty.",
      at: 0,
      segment: "",
      pathSoFar: "",
    };
  }

  // split and validate segments
  const parts = trimmed.split(".");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "") {
      return {
        ok: false,
        code: "INVALID_SELECTOR",
        error: `Invalid selector: empty segment at position ${i}.`,
        at: i,
        segment: "",
        pathSoFar: parts.slice(0, i).join("."),
      };
    }
  }

  // evaluate from a given node and part index (needed for "*")
  function evalFrom(current, startIndex, pathPrefix = "") {
    let cur = current;
    let pathSoFar = pathPrefix;

    for (let i = startIndex; i < parts.length; i++) {
      const seg = parts[i];
      const last = i === parts.length - 1;

      pathSoFar = pathSoFar ? `${pathSoFar}.${seg}` : seg;

      // --- wildcard index ---
      if (isWildcard(seg)) {
        if (!Array.isArray(cur)) {
          return {
            ok: false,
            code: "EXPECTED_ARRAY",
            error: `Expected array at "${parts.slice(0, i).join(".") || "<root>"}" but got ${typeOf(cur)}.`,
            at: i,
            segment: seg,
            pathSoFar,
            expected: "array",
            actualType: typeOf(cur),
          };
        }

        // If "*" is the last segment -> return the array itself
        if (last) {
          return { ok: true, value: cur };
        }

        // Apply the rest of the selector to each element
        const results = [];
        for (let j = 0; j < cur.length; j++) {
          const sub = evalFrom(cur[j], i + 1, `${parts.slice(0, i).join(".")}.${j}`);
          if (!sub.ok) return sub; // fail-fast (or collect errors if you prefer)
          results.push(sub.value);
        }

        let out = results;

        // optional flatten for nested "*" => [[...],[...]] -> [...]
        if (flatten) {
          while (Array.isArray(out) && out.some(Array.isArray)) {
            out = flatDeep1(out);
          }
        }

        return { ok: true, value: out };
      }

      // --- numeric index ---
      if (isIndexSegment(seg)) {
        const idx = Number(seg);

        if (!Array.isArray(cur)) {
          return {
            ok: false,
            code: "EXPECTED_ARRAY",
            error: `Expected array at "${parts.slice(0, i).join(".") || "<root>"}" but got ${typeOf(cur)}.`,
            at: i,
            segment: seg,
            pathSoFar,
            expected: "array",
            actualType: typeOf(cur),
          };
        }

        if (idx < 0 || idx >= cur.length) {
          return {
            ok: false,
            code: "INDEX_OUT_OF_RANGE",
            error: `Index ${idx} out of range at "${parts.slice(0, i).join(".") || "<root>"}" (length ${cur.length}).`,
            at: i,
            segment: seg,
            pathSoFar,
            expected: `0..${Math.max(0, cur.length - 1)}`,
            actualType: "array",
          };
        }

        cur = cur[idx];
        continue;
      }

      // --- object key ---
      if (cur === null || typeof cur !== "object" || Array.isArray(cur)) {
        return {
          ok: false,
          code: "EXPECTED_OBJECT",
          error: `Expected object at "${parts.slice(0, i).join(".") || "<root>"}" to access key "${seg}", but got ${typeOf(cur)}.`,
          at: i,
          segment: seg,
          pathSoFar,
          expected: "object",
          actualType: typeOf(cur),
        };
      }

      if (!(seg in cur)) {
        const keys = Object.keys(cur);
        return {
          ok: false,
          code: "NOT_FOUND",
          error: `Property "${seg}" not found at "${parts.slice(0, i).join(".") || "<root>"}".`,
          at: i,
          segment: seg,
          pathSoFar,
          expected: `one of: ${keys.slice(0, 20).join(", ")}${keys.length > 20 ? ", ..." : ""}`,
          actualType: "object",
        };
      }

      cur = cur[seg];

      if (cur === undefined && !last) {
        return {
          ok: false,
          code: "UNDEFINED_VALUE",
          error: `Value became undefined at "${pathSoFar}".`,
          at: i,
          segment: seg,
          pathSoFar,
          actualType: "undefined",
        };
      }
    }

    return { ok: true, value: cur };
  }

  return evalFrom(data, 0, "");
}

export const defaultAggregators = {
    sum(values, ctx) {
        const nums = coerceNumbers(values, ctx);
        return nums.reduce((a, b) => a + b, 0);
    },

    avg(values, ctx) {
        const nums = coerceNumbers(values, ctx);
        if (nums.length === 0) throw aggErr("EMPTY_INPUT", "avg() has no values.");
        const s = nums.reduce((a, b) => a + b, 0);
        return s / nums.length;
    },

    min(values, ctx) {
        const nums = coerceNumbers(values, ctx);
        if (nums.length === 0) throw aggErr("EMPTY_INPUT", "min() has no values.");
        return nums.reduce((m, v) => (v < m ? v : m), nums[0]);
    },

    max(values, ctx) {
        const nums = coerceNumbers(values, ctx);
        if (nums.length === 0) throw aggErr("EMPTY_INPUT", "max() has no values.");
        return nums.reduce((m, v) => (v > m ? v : m), nums[0]);
    },

    count(values, ctx) {
        const v = ctx.ignoreNulls
            ? values.filter((x) => x !== null && x !== undefined)
            : values;
        return v.length;
    },
};

// --- helpers for aggregators ---

function aggErr(code, message, extra = {}) {
    const e = new Error(message);
    e.code = code;
    Object.assign(e, extra);
    return e;
}

function coerceNumbers(values, ctx) {
    const filtered = ctx.ignoreNulls
        ? values.filter((v) => v !== null && v !== undefined)
        : values;

    if (ctx.numbersOnly) {
        return filtered.filter((v) => typeof v === "number" && !Number.isNaN(v));
    }

    const badIndex = filtered.findIndex((v) => typeof v !== "number" || Number.isNaN(v));
    if (badIndex !== -1) {
        throw aggErr(
            "EXPECTED_NUMBER",
            `Expected number but found ${typeOf(filtered[badIndex])} at index ${badIndex}.`,
            { badValue: filtered[badIndex], badIndex }
        );
    }
    return filtered;
}

function typeOf(v) {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    return typeof v;
}

/**
 * Evaluate expression:
 *  - "data.items.*.price"
 *  - "sum(data.items.*.price)"
 *
 * Requires: selectJson(selector, data, { allowEmptySelector, flatten })
 *
 * Returns:
 *  - { ok: true, value }
 *  - { ok: false, code, error, ...details }
 */
export function evaluate(expr, data, opts = {}) {
    const {
        registry = defaultAggregators,
        flatten = true,
        allowEmptySelector = true,
        allowEmptyExpression = true,
        ignoreNulls = true,
        numbersOnly = false,
    } = opts;

    const parsed = parseExpression(expr, { allowEmptyExpression });
    if (!parsed.ok) return parsed;

    const { func, selector } = parsed;

    const selRes = selectJson(selector, data, {
        allowEmptySelector: allowEmptySelector || selector === "",
        flatten,
    });
    if (!selRes.ok) return { ...selRes, details: { expr, func, selector } };

    if (!func) return { ok: true, value: selRes.value };

    const fn = func.toLowerCase();
    const agg = registry?.[fn];
    if (typeof agg !== "function") {
        return {
            ok: false,
            code: "UNKNOWN_FUNCTION",
            error: `Unknown aggregation function "${func}".`,
            expected: Object.keys(registry || {}).sort().join(", "),
            details: { expr, func, selector },
        };
    }

    const values = Array.isArray(selRes.value) ? selRes.value : [selRes.value];

    try {
        const ctx = { expr, func: fn, selector, ignoreNulls, numbersOnly };
        return { ok: true, value: agg(values, ctx) };
    } catch (e) {
        return {
            ok: false,
            code: e?.code || "AGGREGATION_ERROR",
            error: e?.message || String(e),
            details: { expr, func: fn, selector, badValue: e?.badValue, badIndex: e?.badIndex },
        };
    }
}

export function parseExpression(expr, options = {}) {
    const { allowEmptyExpression = true } = options;

    if (typeof expr !== "string") {
        return { ok: false, code: "INVALID_EXPRESSION", error: "Expression must be a string." };
    }

    const s = expr.trim();

    // ✅ prázdný výraz => identity (vrátí vstupní data)
    if (!s) {
        if (allowEmptyExpression) {
            return { ok: true, func: null, selector: "" }; // "" znamená "root"
        }
        return { ok: false, code: "EMPTY_EXPRESSION", error: "Expression is empty." };
    }

    const m = s.match(/^([a-zA-Z_]\w*)\s*\(\s*(.*?)\s*\)\s*$/);
    if (m) {
        const func = m[1];
        const selector = m[2];

        // tady můžeš taky povolit prázdný selector uvnitř func(...)
        if (!selector) {
            return { ok: true, func, selector: "" }; // func("") => agregace nad rootem
            // nebo když to nechceš: return { ok:false, code:"EMPTY_SELECTOR", ... }
        }

        return { ok: true, func, selector };
    }

    return { ok: true, func: null, selector: s };
}

export const FormFieldQueryDataRenderer = ({ mode, digital_submission_field, fieldDef, onChange, ...props }) => {
    const { formId } = fieldDef
    const {
        entity: formDef,
        run: readFormDef,
        loading,
        error
    } = useAsyncThunkAction(
        ReadFormAsyncAction, 
        { id: formId }, 
        { deferred: true }
    )

    const [backendFormula, setBackendFormula] = useState(() => { 
        if (fieldDef?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return ""
        return {}
    })
    
    useEffect(() => {
        if (fieldDef?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return

        const parseBackendFormula = (raw) => {
            if (!raw) return null;
            if (typeof raw === "object") return raw; // už je objekt
            if (typeof raw !== "string") return null;

            try {
                return JSON.parse(raw);
            } catch (e) {
                console.warn("Invalid backendFormula JSON:", raw, e);
                return null;
            }
        };

        const parsed = parseBackendFormula(fieldDef?.backendFormula);
        // parsed.variables = JSON.parse(parsed.variables)
        // console.log("FormFieldQueryDataRenderer.useEffect", parsed)
        // merge do defaultu (parsed může být null)
        setBackendFormula({ ...(parsed || {}) });
    }, [fieldDef?.backendFormula]);

    const [response, setResponse] = useState({ data: {}, error: {} })
    // const handleChangeFormula = (e) => {
    //     const value = e?.target?.value
    //     const id = e?.target?.id
    //     if (!id) {
    //         console.warn("event without id", e)
    //         return
    //     }
    //     if (value)
    //         setBackendFormula(prev => ({ ...prev, [id]: value }))
    // }
    const gqlClient = useGQLClient();
    const handleRunTest = async () => {
        const getState = () => ({})
        const extra = (json) => json
        const customDispatch = (actionOrThunk) => {
            // thunk: funkce (dispatch, getState, extra) => Promise/any
            if (typeof actionOrThunk === "function") {
                return Promise.resolve(actionOrThunk(customDispatch, getState, extra));
            }

            // plain action (object, string, cokoliv) – tady s ním nic neděláme,
            // jen ho vrátíme zabalený v Promise, aby signatura seděla.
            return Promise.resolve(actionOrThunk);
        }
        console.log("test run", backendFormula?.query)
        console.log("test run", backendFormula)
        try {
            const asyncAction = createAsyncGraphQLAction2(backendFormula?.query)
            const response = await customDispatch(asyncAction(backendFormula?.variables, gqlClient))
            const selected = evaluate(backendFormula?.selector || "", response, { allowEmptySelector: true })
            console.log(selected)
            if (selected?.ok) {
                setResponse(prev => selected?.value ?? prev)
                onChange?.({target: {id: fieldDef?.name, value: JSON.stringify(selected?.value)}})
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    return (<div>
        <AsyncStateIndicator error={error} loading={loading} text={"Nahrávám definici formuláře"} />
        {/* {JSON.stringify(fieldDef)} */}
        {/* <hr />
        
        <hr />
        {JSON.stringify(formDef)}
        <hr />
        {JSON.stringify(backendFormula)}
        <hr />
        <TextArea
            id="query"
            label="Query"
            className="form-control"
            value={backendFormula?.query}
            onChange={handleChangeFormula} onBlur={handleChangeFormula}
        />
        <TextArea
            id="variables"
            label="Variables"
            className="form-control"
            value={JSON.stringify(backendFormula?.variables)}
            onChange={handleChangeFormula} onBlur={handleChangeFormula}
        />
        <Input
            id="selector"
            label="Selector"
            className="form-control"
            value={backendFormula?.selector || ""}
            onChange={handleChangeFormula} onBlur={handleChangeFormula}
        />
        <button className="form-control btn btn-outline-primary" onClick={handleRunTest}>Otestovat</button> */}
        <Input id="value" label={fieldDef?.label} className="form-control" value={JSON.stringify(response)} disabled />
        <button className="form-control btn btn-outline-primary" onClick={handleRunTest}>{fieldDef?.label}</button>
        {/* <SimpleCardCapsule>
            {JSON.stringify(response)}
        </SimpleCardCapsule> */}
        <hr />
    </div>)
}