import { Input, Label, Select, TextArea } from "@hrbolek/uoisfrontend-shared"
import { useState } from "react"

/**
 * A component that displays medium-level content for an digitalformsection entity.
 *
 * This component renders a label "DigitalFormSectionMediumContent" followed by a serialized representation of the `digitalformsection` object
 * and any additional child content. It is designed to handle and display information about an digitalformsection entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormSectionMediumContent component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The name or label of the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalformsection` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormSectionMediumContent digitalformsection={digitalformsectionEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalFormSectionMediumContent>
 */
export const DigitalFormSectionMediumEditableContent = ({digitalformsection, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    const [showRepeatLimits, setShowRepeatLimits] = useState(digitalformsection?.repeatable ?? false)
    const onChangeRepeatable = (next) => (e) => {
        // console.log("DigitalFormSectionMediumEditableContent.onChangeRepeatable", e.target.value)
        const value = e.target.value === "true" ? true : false
        setShowRepeatLimits(value)
        next({...e, target: {...e.target, value}})
    }
    
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={digitalformsection?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"label"} label={"Titulek"} className="form-control" defaultValue={digitalformsection?.label|| "Titulek"} onChange={onChange} onBlur={onBlur} />
            <Input id={"labelEn"} label={"Anglický titulek"} className="form-control" defaultValue={digitalformsection?.label_en|| "Title"} onChange={onChange} onBlur={onBlur} />
            <Input id={"description"} label={"Popis"} className="form-control" defaultValue={digitalformsection?.description|| "Popis"} onChange={onChange} onBlur={onBlur} />
            <Input id={"order"} type="number" label={"Pořadí"} className="form-control" defaultValue={digitalformsection?.order|| 1} onChange={onChange} onBlur={onBlur} />
            <Select 
                id={"repeatable"} 
                label={"Povolit opakování"} 
                className="form-control" 
                defaultValue={digitalformsection?.repeatable ?? false} 
                onChange={onChangeRepeatable(onChange)} 
                onBlur={onChangeRepeatable(onBlur)} 
            >
                <option value={false}>Ne</option>
                <option value={true}>Ano</option>
            </Select>
            {/* {JSON.stringify(showRepeatLimits)} <br /> */}
            {showRepeatLimits && (<>
                <Input 
                    id={"repeatableMin"} 
                    type="number" 
                    label={"Minimální počet opakování"} 
                    className="form-control" 
                    defaultValue={digitalformsection?.repeatableMin|| 1} 
                    onChange={onChange} 
                    onBlur={onBlur} 
                />
                <Input 
                    id={"repeatableMax"} 
                    type="number" 
                    label={"Maximální počet opakování"} 
                    className="form-control" 
                    defaultValue={digitalformsection?.repeatableMax|| 1} 
                    onChange={onChange} 
                    onBlur={onBlur} 
                />
            </>)}
            
            {children}
        </>
    )
}

const ok = "bg-opacity-10 bg-success"
const error = "bg-opacity-10 bg-danger"
export const DigitalFormSectionJSONContent = ({digitalformsection, children, onChange=()=>null, className, ...props}) => {
    const [className_, setClassName] = useState(className || "form-control")
    const onChange_ = (e) => {
        const value = e.target.value
        try {
            const json = JSON.parse(value)
            onChange({target: {id: "json", value: json}})
            setClassName(old => {
                if (old.includes(ok)) return old
                if (old.includes(error)) return old.replace(error, ok)
                return `${old} ${ok}`
            })
        } catch (err) {
            setClassName(old => {
                if (old.includes(error)) return old
                if (old.includes(ok)) return old.replace(ok, error)
                return `${old} ${error}`
            })
            console.error("Invalid JSON format:", err)
            // Optionally handle the error, e.g., show a message to the user
        }
        console.log("DigitalFormSectionJSONContent.onChange", e.target.value)
    }
    return (<>
        <TextArea {...props} className={className_} id={"json"} label={"JSON data"} onChange={onChange_} defaultValue={JSON.stringify(digitalformsection?.json || {}, null, 2)}/>
        {children}
    </>)
}