import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an item entity.
 *
 * This component renders a label "ItemMediumContent" followed by a serialized representation of the `item` object
 * and any additional child content. It is designed to handle and display information about an item entity object.
 *
 * @component
 * @param {Object} props - The properties for the ItemMediumContent component.
 * @param {Object} props.item - The object representing the item entity.
 * @param {string|number} props.item.id - The unique identifier for the item entity.
 * @param {string} props.item.name - The name or label of the item entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `item` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const itemEntity = { id: 123, name: "Sample Entity" };
 * 
 * <ItemMediumContent item={itemEntity}>
 *   <p>Additional information about the entity.</p>
 * </ItemMediumContent>
 */
export const ItemMediumEditableContent = ({item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={item?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={item?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
