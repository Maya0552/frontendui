import { Input, Select, Options, FormBody } from "@hrbolek/uoisfrontend-shared"
import { GroupTypeReadPageAsyncAction, GroupTypeReadPageAsyncActionCacheId } from "../GroupType/Queries/GroupTypeReadPageAsyncAction"
import { GroupTypeOptions } from "../GroupType"
import { UserUpdateAsyncAction } from "../User"
import { InputGroup } from "./InputGroup"


/**
 * A component that displays medium-level content for an group entity.
 *
 * This component renders a label "GroupMediumContent" followed by a serialized representation of the `group` object
 * and any additional child content. It is designed to handle and display information about an group entity object.
 *
 * @component
 * @param {Object} props - The properties for the GroupMediumContent component.
 * @param {Object} props.group - The object representing the group entity.
 * @param {string|number} props.group.id - The unique identifier for the group entity.
 * @param {string} props.group.name - The name or label of the group entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `group` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const groupEntity = { id: 123, name: "Sample Entity" };
 * 
 * <GroupMediumContent group={groupEntity}>
 *   <p>Additional information about the entity.</p>
 * </GroupMediumContent>
 */
export const GroupMediumEditableContent = ({group, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    // const handleChange = (e) => {
    //     console.log("GroupMediumEditableContent.handleChange", e.target)
    // }
    // const formdata = [
    //     {id: "34994cde-7337-4d59-ad9e-90af15de1a11", user: {id: "a0506cc4-5d53-4fdb-a989-c06a97e527fd", lastchange: "2025-01-04T21:40:51.551458", name: "Josef", surname: "Novák"}},
    //     {id: "a9f68dc4-df5b-476c-bc4a-cb31acd0078a", user: {id: "3ca2c2cf-28bc-4855-8936-3bafe8c94b7c", lastchange: "2024-08-19T20:34:24.539770", name: "Anna", surname: "Dostálová"}}
    // ]
    return (
        <>           
            <GroupTypeOptions id={"grouptype_id"} label={"Typ skupiny"} group={group} onChange={onChange} onBlur={onChange} />
            <InputGroup id={"mastergroup"} label="Nadřízená skupina" className="form-control" defaultValue={(group?.mastergroup || {})} onChange={onChange} onBlur={onChange} />
            <Input id={"name"} label={"Název"} className="form-control" defaultValue={group?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={group?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
            {/* <FormBody defaultValue={formdata} onChange={handleChange} onBlur={handleChange} >
                <FormBody id="user" label="Uživatel" asyncAction={UserUpdateAsyncAction} shouldFetch={0} >
                    <Input id="name" label="Jméno" className="form-control" />
                    <Input id="surname" label="Příjmení" className="form-control" />
                </FormBody>
            </FormBody> */}
        </>
    )
}


