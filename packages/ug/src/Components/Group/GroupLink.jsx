import { ProxyLink } from "@hrbolek/uoisfrontend-shared";
// import { Link as ProxyLink } from "react-router-dom";
export const GroupLink = ({group, children}) => {
    return (
        <ProxyLink to={"/ug/group/view/" + group?.id}>{children?children:group?.name}</ProxyLink>
    )
}