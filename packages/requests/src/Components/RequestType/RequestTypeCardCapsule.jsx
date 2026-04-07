import { CardCapsule, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { RequestTypeLink } from "./RequestTypeLink"

export const RequestTypeCardCapsule = ({requesttype, children}) => {
    return (
        <SimpleCardCapsule title={<RequestTypeLink requesttype={requesttype} />}>
            {children}
        </SimpleCardCapsule>
    )
}