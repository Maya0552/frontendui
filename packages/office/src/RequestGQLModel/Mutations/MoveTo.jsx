import { Input } from "../../../../_template/src/Base/FormControls/Input";
import { 
    UpdateBody as BaseUpdateBody, 
    UpdateButton as BaseUpdateButton, 
    UpdateDialog as BaseUpdateDialog, 
    UpdateLink as BaseUpdateLink 
} from "../../../../_template/src/Base/Mutations/Update";

import { UpdateItemURI } from "../Components";
import { MoveAsyncAction } from "../Queries/MoveAsyncAction";

const DefaultContent = (props) => (<>
    <Input 
        id="msg" 
        label="Poznámka k přesunu" 
        type="text" 
        {...props} 
        className="form-control" 
        placeholder="Zadejte poznámku k přesunu stavu"
    />
</>)
const mutationAsyncAction = MoveAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

// ALTERNATIVE, CHECK GQLENDPOINT
// const permissions = {
//     oneOfRoles: ["administrátor", "personalista"],
//     mode: "item",
// }


export const MoveToLink = ({
    uriPattern=UpdateItemURI, 
    ...props
}) => {
    return <BaseUpdateLink 
        {...props} 
        uriPattern={uriPattern} 
        {...permissions}
    />
}

export const MoveToDialog = ({
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

export const MoveToButton = ({
    DefaultContent:DefaultContent_=DefaultContent,
    Dialog=MoveToDialog,
    mutationAsyncAction:mutationAsyncAction_=mutationAsyncAction,
    ...props
}) => {
    return <BaseUpdateButton 
        {...props} 
        DefaultContent={DefaultContent_} 
        Dialog={Dialog}
        mutationAsyncAction={mutationAsyncAction_}
        {...permissions}
    />
}

export const MoveToBody = ({
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
}