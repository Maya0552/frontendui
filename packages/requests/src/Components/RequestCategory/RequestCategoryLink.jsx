import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

export const RequestCategoryLink = ({requestcategory, children}) => {
    return (
        <ProxyLink to={"/requests/category/view/" + requestcategory?.id}>{children || requestcategory?.name}</ProxyLink>
    )
}