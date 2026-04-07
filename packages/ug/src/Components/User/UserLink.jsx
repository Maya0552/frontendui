import { ProxyLink } from "@hrbolek/uoisfrontend-shared";
// import { Link as ProxyLink } from "react-router-dom";
export const UserLink = ({user, children, ...others}) => {
    return (
        <ProxyLink {...others} to={"/ug/user/view/" + user?.id} >{children?children:user?.fullname}</ProxyLink>
    )
}