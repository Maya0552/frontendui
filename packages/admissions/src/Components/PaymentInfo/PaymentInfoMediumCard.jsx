import { PersonFill } from "react-bootstrap-icons"
import { PaymentInfoLink } from "./PaymentInfoLink"
import { PaymentInfoCardCapsule } from "./PaymentInfoCardCapsule"
import { PaymentInfoMediumContent } from "./PaymentInfoMediumContent"

/**
 * A card component that displays detailed content for an paymentinfo entity.
 *
 * This component combines `PaymentInfoCardCapsule` and `PaymentInfoMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the paymentinfo entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the PaymentInfoMediumCard component.
 * @param {Object} props.paymentinfo - The object representing the paymentinfo entity.
 * @param {string|number} props.paymentinfo.id - The unique identifier for the paymentinfo entity.
 * @param {string} props.paymentinfo.name - The name or label of the paymentinfo entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const paymentinfoEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PaymentInfoMediumCard paymentinfo={paymentinfoEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </PaymentInfoMediumCard>
 */
export const PaymentInfoMediumCard = ({paymentinfo, children}) => {
    return (
        <PaymentInfoCardCapsule title={<><PersonFill /> <PaymentInfoLink paymentinfo={paymentinfo} /></>}>
            <PaymentInfoMediumContent paymentinfo={paymentinfo}>
                {children}
            </PaymentInfoMediumContent>
        </PaymentInfoCardCapsule>
    )
}
