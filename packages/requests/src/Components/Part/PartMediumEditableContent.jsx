import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an part entity.
 *
 * This component renders a label "PartMediumContent" followed by a serialized representation of the `part` object
 * and any additional child content. It is designed to handle and display information about an part entity object.
 *
 * @component
 * @param {Object} props - The properties for the PartMediumContent component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {string|number} props.part.id - The unique identifier for the part entity.
 * @param {string} props.part.name - The name or label of the part entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `part` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const partEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PartMediumContent part={partEntity}>
 *   <p>Additional information about the entity.</p>
 * </PartMediumContent>
 */
export const PartMediumEditableContent = ({part, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={part?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={part?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
