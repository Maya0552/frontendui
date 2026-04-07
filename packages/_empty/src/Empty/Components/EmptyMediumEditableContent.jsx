import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an empty entity.
 *
 * This component renders a label "EmptyMediumContent" followed by a serialized representation of the `empty` object
 * and any additional child content. It is designed to handle and display information about an empty entity object.
 *
 * @component
 * @param {Object} props - The properties for the EmptyMediumContent component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `empty` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyMediumContent empty={emptyEntity}>
 *   <p>Additional information about the entity.</p>
 * </EmptyMediumContent>
 */
export const EmptyMediumEditableContent = ({empty, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={empty?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={empty?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
