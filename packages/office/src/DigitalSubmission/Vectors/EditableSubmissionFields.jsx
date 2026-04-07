import { useState } from "react"
import { SimpleCardCapsule, SimpleCardCapsuleRightCorner } from "../../../../_template/src/Base/Components"
import { Attribute, formatDateTime } from "../../../../_template/src/Base/Components/Attribute"
import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { Link } from "../Components"
import { useCallback } from "react"


export const H3 = ({ field }) => {
    const [state, setState] = useState({ mode: "view", first: true })
    const showEdit = useCallback(()=>setState(prev=>({...prev, mode: "edit"})), [setState])
    const hideEdit = useCallback(()=>setState(prev=>({...prev, mode: "view"})), [setState])
    if (state?.mode === "edit")
        return (<>
            <Input id={"id"} defaultValue={field?.field?.name} onBlur={hideEdit}/>
        </>)
    else return (
        <h3 onClick={showEdit}>{field?.field?.name}</h3>
        // <h3>{field?.field?.name}</h3>
    )
}

export const EditableSubmissionFields = ({ item }) => {
    const { fields=[] } = item || {}

    return (
        <>
            {fields.map(field => {
                return (
                    <div key={field?.id}>
                        {/* <H3 field={field} /> */}
                        {/* <h3>{field?.field?.name}</h3> */}
                        {/* {field?.name}
                        {field?.field?.name}
                        {field?.label}
                        {field?.value} */}
                        {/* {JSON.stringify(field)} */}
                        <SimpleCardCapsule title={<>{field?.field?.name}|{field?.field?.typeId}</>}>
                            <SimpleCardCapsuleRightCorner>
                                <Link item={field?.changedby} />@{formatDateTime(item?.lastchange)}
                            </SimpleCardCapsuleRightCorner>
                            <Input id="value" className="form-control" defaultValue={field?.value} />
                        </SimpleCardCapsule>             
                    </div>
                )
            })}
        </>
    )

}