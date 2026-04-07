import { Input } from "../../../../_template/src/Base/FormControls/Input";
import { 
    UpdateBody as BaseUpdateBody, 
    UpdateButton as BaseUpdateButton, 
    UpdateDialog as BaseUpdateDialog, 
    UpdateLink as BaseUpdateLink 
} from "../../../../_template/src/Base/Mutations/Update";

import { MediumEditableContent, UpdateItemURI } from "../Components";
import { UpdateAsyncAction } from "../Queries";

const DefaultContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null }) => {
    return (<>
    {/* {JSON.stringify(item)} */}
        <Input 
            id="id" 
            className="form-control"
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.id || ""} 
            hidden={true}
        />
        <Input 
            id="label" 
            className="form-control"
            label="label" 
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.label || ""} 
        />
        <Input
            id="name"
            className="form-control"
            label="Identifikátor"
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.name || ""} 
        />
        <Input
            id="description"
            className="form-control"
            label="Popis"
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.description || ""} 
        />
        <Input
            id="repeatableMin"
            className="form-control"
            type="number"
            label="Minimální počet opakování"
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.repeatableMin || ""} 
        />
        <Input
            id="repeatableMax"
            className="form-control"
            type="number"
            label="Maximální počet opakování"
            onChange={onChange} 
            onBlur={onBlur} 
            value={item?.repeatableMax || ""} 
        />    
    </>)
} 
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


export const DesignLink = ({
    uriPattern=UpdateItemURI, 
    ...props
}) => {
    return <BaseUpdateLink 
        {...props} 
        uriPattern={uriPattern} 
        {...permissions}
    />
}

export const DesignButton = ({
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

export const DesignDialog = ({
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

export const DesignBody = ({
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