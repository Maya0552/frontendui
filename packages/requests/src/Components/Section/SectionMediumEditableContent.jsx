import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an section entity.
 *
 * This component renders a label "SectionMediumContent" followed by a serialized representation of the `section` object
 * and any additional child content. It is designed to handle and display information about an section entity object.
 *
 * @component
 * @param {Object} props - The properties for the SectionMediumContent component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {string|number} props.section.id - The unique identifier for the section entity.
 * @param {string} props.section.name - The name or label of the section entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `section` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const sectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <SectionMediumContent section={sectionEntity}>
 *   <p>Additional information about the entity.</p>
 * </SectionMediumContent>
 */
export const SectionMediumEditableContent = ({section, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={section?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={section?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
