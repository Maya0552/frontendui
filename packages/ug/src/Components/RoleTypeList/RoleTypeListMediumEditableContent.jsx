import { useState } from 'react'
import { Input, Options, Select } from "@hrbolek/uoisfrontend-shared"
import { RoleTypeReadPageAsyncAction } from "../RoleType/Queries/RoleTypeReadPageAsyncAction"
import { RoleCategoryReadPageAsyncAction } from '../RoleCategory/Queries/GroupTypeReadPageAsyncAction'

/**
 * A component that displays medium-level content for an roletypelist entity.
 *
 * This component renders a label "RoleTypeListMediumContent" followed by a serialized representation of the `roletypelist` object
 * and any additional child content. It is designed to handle and display information about an roletypelist entity object.
 *
 * @component
 * @param {Object} props - The properties for the RoleTypeListMediumContent component.
 * @param {Object} props.roletypelist - The object representing the roletypelist entity.
 * @param {string|number} props.roletypelist.id - The unique identifier for the roletypelist entity.
 * @param {string} props.roletypelist.name - The name or label of the roletypelist entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `roletypelist` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const roletypelistEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RoleTypeListMediumContent roletypelist={roletypelistEntity}>
 *   <p>Additional information about the entity.</p>
 * </RoleTypeListMediumContent>
 */
export const RoleTypeListMediumEditableContent = ({roletypelist, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    const [categoryId, setCategoryId] = useState(null)
    const where = categoryId?{"category": {"id": {"_eq": `${categoryId}`}}}:null
    const onChangeCategory = (e) => {
        const category_id = e.target.value
        setCategoryId(category_id)
    }
    console.log("RoleTypeListMediumEditableContent.where", where)
    return (
        <>           
            <Input id={"roletypelist_id"} label={"Název"} className="form-control" ariaHidden={true} defaultValue={roletypelist.id} onChange={onChange} onBlur={onBlur} />
            <Select id={"rolecategory_id"} label={"Role"} className="form-control" onChange={onChangeCategory} onBlur={onChangeCategory} >
                <Options asyncAction={RoleCategoryReadPageAsyncAction} params={{limit:200}}/>
            </Select>
            <Select id={"type_id"} label={"Role"} className="form-control" onChange={onChange} onBlur={onBlur} >
                <Options asyncAction={RoleTypeReadPageAsyncAction} params={{limit:200, where}} shouldFetch={categoryId}/>
            </Select>
            {children}
        </>
    )
}
