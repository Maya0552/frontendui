import { PersonFill } from "react-bootstrap-icons"
import { EmptyLink } from "./EmptyLink"
import { EmptyCardCapsule } from "./EmptyCardCapsule"
import { EmptyMediumContent } from "./EmptyMediumContent"

/**
 * A card component that displays detailed content for an empty entity.
 *
 * This component combines `EmptyCardCapsule` and `EmptyMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the empty entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the EmptyMediumCard component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyMediumCard empty={emptyEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </EmptyMediumCard>
 */
export const EmptyMediumCard = ({empty, children}) => {
    return (
        <EmptyCardCapsule title={<><PersonFill /> <EmptyLink empty={empty} /></>}>
            <EmptyMediumContent empty={empty}>
                {children}
            </EmptyMediumContent>
        </EmptyCardCapsule>
    )
}
