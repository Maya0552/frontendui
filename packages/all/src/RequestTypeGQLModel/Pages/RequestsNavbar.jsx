import { MyNavbar, ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { RequestURI } from "../../RequestGQLModel/Components"
import { RequestTypeURI } from "../Components"

export const RequestsNavbar = () => {
    return (
        <MyNavbar>
            <ProxyLink to={RequestURI} >
                Požadavky
            </ProxyLink>
            {'\u00A0'}
            <ProxyLink to={RequestTypeURI} >
                Typy požadavků  
            </ProxyLink>
        </MyNavbar>
    )
}