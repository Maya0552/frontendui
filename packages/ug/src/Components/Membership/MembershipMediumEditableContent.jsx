import { Input } from "@hrbolek/uoisfrontend-shared"
import { InputUser } from "../User"
import { InputGroup } from "../Group"

export const MembershipMediumEditableContent = ({membership, children, onChange=(e)=>null, onBlur=(e)=>null}) => {
    const { user, group } = membership
    const { userId: user_id = user?.id, groupId: group_id = group?.id } = membership
    return (<>
        <Input id="startdate" label="Počátek" type="datetime-local" 
            defaultValue={membership.startdate} onChange={onChange} onBlur={onBlur} 
            className="form-control"
        />
        <Input id="enddate" label="Konec" type="datetime-local" 
            defaultValue={membership.startdate} onChange={onChange} onBlur={onBlur} 
            className="form-control"
        />
        {!user_id && <InputUser id={"user_id"} label="Uživatel" className="form-control" onChange={onChange} onBlur={onBlur} />}
        {!group_id && <InputGroup id={"group_id"} label="Skupina" className="form-control" onChange={onChange} onBlur={onBlur} />}
        
        <div>{JSON.stringify({user_id, group_id,  membership})}</div>
        {children}
    </>)
}