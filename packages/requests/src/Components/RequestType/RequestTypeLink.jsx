import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

export const RequestTypeLink = ({requesttype, children}) => {
    return (
        <ProxyLink to={"/requests/type/view/" + requesttype?.id}>{children || requesttype?.name}</ProxyLink>
    )
}