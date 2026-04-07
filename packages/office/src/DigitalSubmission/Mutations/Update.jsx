import { 
    UpdateBody as BaseUpdateBody, 
    UpdateButton as BaseUpdateButton, 
    UpdateDialog as BaseUpdateDialog, 
    UpdateLink as BaseUpdateLink 
} from "../../../../_template/src/Base/Mutations/Update";

import { MediumEditableContent, UpdateItemURI } from "../Components";
import { UpdateAsyncAction } from "../Queries";
import { EditableSubmissionSections } from "../Vectors/EditableSubmissionSections";

const DefaultContent = ({ item }) => {
    return (
        <MediumEditableContent item={item}>
            <EditableSubmissionSections item={item}>

            </EditableSubmissionSections>
        </MediumEditableContent>
    )
}
// const DefaultContent = (props) => {
//     return (<>
//         DefaultContent
//     </>)
// }
const mutationAsyncAction = UpdateAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

// ALTERNATIVE, CHECK GQLENDPOINT
// const permissions = {
//     oneOfRoles: ["administrátor", "personalista"],
//     mode: "item",
// }


export const UpdateLink = ({
    uriPattern=UpdateItemURI, 
    ...props
}) => {
    return <BaseUpdateLink 
        {...props} 
        uriPattern={uriPattern} 
        {...permissions}
    />
}

export const UpdateButton = ({
    DefaultContent:DefaultContent_=DefaultContent,
    mutationAsyncAction:mutationAsyncAction_=mutationAsyncAction,
    ...props
}) => {
    return <BaseUpdateButton 
        {...props} 
        DefaultContent={DefaultContent_} 
        mutationAsyncAction={mutationAsyncAction_}
        {...permissions}
    />
}

export const UpdateDialog = ({
    DefaultContent:DefaultContent_=DefaultContent,
    mutationAsyncAction:mutationAsyncAction_=mutationAsyncAction,
    ...props
}) => {
    return <BaseUpdateDialog 
        {...props} 
        DefaultContent={DefaultContent_} 
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const UpdateBody = ({
    DefaultContent:DefaultContent_=DefaultContent,
    mutationAsyncAction:mutationAsyncAction_=mutationAsyncAction,
    ...props
}) => {
    return <BaseUpdateBody 
        {...props} 
        DefaultContent={DefaultContent_} 
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
    // return (<>KIL</>)
}