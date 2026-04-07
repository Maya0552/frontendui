import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an requestcategory entity.
 *
 * This component renders a label "RequestCategoryMediumContent" followed by a serialized representation of the `requestcategory` object
 * and any additional child content. It is designed to handle and display information about an requestcategory entity object.
 *
 * @component
 * @param {Object} props - The properties for the RequestCategoryMediumContent component.
 * @param {Object} props.requestcategory - The object representing the requestcategory entity.
 * @param {string|number} props.requestcategory.id - The unique identifier for the requestcategory entity.
 * @param {string} props.requestcategory.name - The name or label of the requestcategory entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `requestcategory` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const requestcategoryEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestCategoryMediumContent requestcategory={requestcategoryEntity}>
 *   <p>Additional information about the entity.</p>
 * </RequestCategoryMediumContent>
 */
export const RequestCategoryMediumEditableContent = ({requestcategory, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={requestcategory?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={requestcategory?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
