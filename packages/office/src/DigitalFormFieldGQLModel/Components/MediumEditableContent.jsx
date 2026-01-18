import { SelectInput } from "@hrbolek/uoisfrontend-shared"
import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { Select } from "../../../../_template/src/Base/FormControls/Select"
import { formFieldRegister } from "../../DigitalFormGQLModel/Components/FormFieldRenderer"
import { useEffect, useState } from "react"
import { TextArea } from "../../../../_template/src/Base/FormControls/TextArea"

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
export const MediumEditableContent = ({ item, onChange = (e) => null, onBlur = (e) => null, children }) => {
    const typeOptions = Object.values(formFieldRegister).map(v => [v?.label, v?.value])

    const [backendFormula, setBackendFormula] = useState(() => { 
        if (item?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return ""
        return {...DEFAULT_BACKEND_FORMULA}
    })
    
    useEffect(() => {
        if (item?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return
        const parsed = parseBackendFormula(item?.backendFormula);
        // merge do defaultu (parsed může být null)
        setBackendFormula({ ...DEFAULT_BACKEND_FORMULA, ...(parsed || {}) });
    }, [item?.backendFormula]);

    const handleChangeFormula = (e) => {
        let value = e?.target?.value
        const id = e?.target?.id
        if (!id) {
            console.warn("event without id", e)
            return
        }
        if (id === "variables") {
            console.log("handleChangeFormula", id, value)
            try {
                value = JSON.parse(value)
            } catch (e) {

            }
            
            console.log("handleChangeFormula", id, value)
        }
            
        if (value)
            setBackendFormula(prev => ({ ...prev, [id]: value }))
        onChange?.({ target: { id: "backendFormula", value: JSON.stringify(backendFormula) } })
    }
    return (
        <>
            {/* defaultValue={item?.name|| "Název"}  */}

            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name || "name"} onChange={onChange} onBlur={onBlur} />
            <Input id={"label"} label={"Označení"} className="form-control" value={item?.label || "Položka"} onChange={onChange} onBlur={onBlur} />
            <Input id={"labelEn"} label={"Anglické označení / label"} className="form-control" value={item?.labelEn || "Field"} onChange={onChange} onBlur={onBlur} />
            <Input id={"description"} label={"Popis"} className="form-control" value={item?.description || "Popisný text"} onChange={onChange} onBlur={onBlur} />
            {/* required */}
            <Input type="number" id={"order"} label={"Pořadí"} className="form-control" value={item?.order || 1} onChange={onChange} onBlur={onBlur} />
            {/* formula */}
            {/* type_id */}
            <Select id="typeId" label={"typ"} className="form-control" value={item?.typeId || ""} onChange={onChange} onBlur={onBlur} >
                {typeOptions.map(o => <option value={o[1]}>{o[0]}</option>)}
            </Select>
            {/* {JSON.stringify(item)} */}
            {/* backend_formula */}
            {/* flatten_formula */}
            {(item?.typeId === "fa2baf40-babc-4593-890f-d49bb9731322") && (
                <MediumEditableContentQueryField item={item}  onChange={onChange} onBlur={onBlur} />
            )}

            {children}
        </>
    )
}

const MediumEditableContentQueryField = ({ item, onChange = (e) => null, onBlur = (e) => null, children}) => {
    const [backendFormula, setBackendFormula] = useState(() => { 
        if (item?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return ""
        return {...DEFAULT_BACKEND_FORMULA}
    })
    
    useEffect(() => {
        if (item?.typeId !== "fa2baf40-babc-4593-890f-d49bb9731322") return
        const parsed = parseBackendFormula(item?.backendFormula);
        // parsed.variables = JSON.parse(parsed.variables)
        // console.log("MediumEditableContentQueryField.useEffect", parsed)
        // merge do defaultu (parsed může být null)
        setBackendFormula({ ...DEFAULT_BACKEND_FORMULA, ...(parsed || {}) });
    }, [item?.backendFormula]);

    const handleChangeFormula = (e) => {
        let value = e?.target?.value
        const id = e?.target?.id
        if (!id) {
            console.warn("event without id", e)
            return
        }
        if (id === "variables") {
            console.log("handleChangeFormula.pre", id, value)
            try {
                value = JSON.parse(value)
            } catch (e) {

            }
            
            console.log("handleChangeFormula.post", id, value)
        }
            
        if (value) {
            const next = ({ ...backendFormula, [id]: value })
            console.log(next)
            setBackendFormula(prev => next)
            onChange?.({ target: { id: "backendFormula", value: JSON.stringify(next) } })
        }
            
        
    }

    return (<>
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
            value={JSON.stringify(backendFormula?.variables).replace('\"', '"')}
            onChange={handleChangeFormula} onBlur={handleChangeFormula}
        />
        <Input
            id="selector"
            label="Selector"
            className="form-control"
            value={backendFormula?.selector || ""}
            onChange={handleChangeFormula} onBlur={handleChangeFormula}
        />
    </>)
}

const DEFAULT_BACKEND_FORMULA = {
    query: `query groupPage(
    $skip: Int # how many entities will be ignored, 
    $limit: Int # how many entities will be taken, 
    $orderby: String # name of field which will determite the order, 
    $where: GroupInputWhereFilter # filter
) {
  groupPage(
    skip: $skip, 
    limit: $limit, 
    orderby: $orderby, 
    where: $where
  ) {
  id name
}
}`,
    variables: {},
    selector: "data",
};

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