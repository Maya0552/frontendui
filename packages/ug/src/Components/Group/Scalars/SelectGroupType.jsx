import { Options } from "@hrbolek/uoisfrontend-shared/src/Components/Options"
import { Select } from "@hrbolek/uoisfrontend-shared/src/Components/Select"
import { GroupTypeReadPageAsyncAction } from "../../GroupType/Queries/GroupTypeReadPageAsyncAction"

export const SelectGroupType = ({onChange=()=>null, ...props}) => {
    return (
        <Select label="Typ skupiny" {...props} id="grouptype_id" onChange={onChange} >
            <Options asyncAction={GroupTypeReadPageAsyncAction}/>
        </Select>
    )
}