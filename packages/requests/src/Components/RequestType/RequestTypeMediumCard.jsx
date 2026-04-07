import { RequestTypeCardCapsule } from "./RequestTypeCardCapsule"
import { RequestTypeMediumContent } from "./RequestTypeMediumContent"

export const RequestTypeMediumCard = ({requesttype, children}) => {
    return (
        <RequestTypeCardCapsule requesttype={requesttype}>
            <RequestTypeMediumContent requesttype={requesttype}>
                {children}
            </RequestTypeMediumContent>
        </RequestTypeCardCapsule>
    )
}