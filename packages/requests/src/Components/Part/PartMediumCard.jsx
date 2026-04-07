import { PersonFill } from "react-bootstrap-icons"
import { PartLink } from "./PartLink"
import { PartCardCapsule } from "./PartCardCapsule"
import { PartMediumContent } from "./PartMediumContent"

/**
 * A card component that displays detailed content for an part entity.
 *
 * This component combines `PartCardCapsule` and `PartMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the part entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the PartMediumCard component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {string|number} props.part.id - The unique identifier for the part entity.
 * @param {string} props.part.name - The name or label of the part entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const partEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PartMediumCard part={partEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </PartMediumCard>
 */
export const PartMediumCard = ({part, children}) => {
    return (
        <PartCardCapsule title={<><PersonFill /> <PartLink part={part} /></>}>
            <PartMediumContent part={part}>
                {children}
            </PartMediumContent>
        </PartCardCapsule>
    )
}
