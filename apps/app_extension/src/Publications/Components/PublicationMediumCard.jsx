import { PersonFill } from "react-bootstrap-icons"
import { PublicationLink } from "./PublicationLink"
import { PublicationCardCapsule } from "./PublicationCardCapsule"
import { PublicationMediumContent } from "./PublicationMediumContent"

/**
 * A card component that displays detailed content for an publication entity.
 *
 * This component combines `PublicationCardCapsule` and `PublicationMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the publication entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the PublicationMediumCard component.
 * @param {Object} props.publication - The object representing the publication entity.
 * @param {string|number} props.publication.id - The unique identifier for the publication entity.
 * @param {string} props.publication.name - The name or label of the publication entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const publicationEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PublicationMediumCard publication={publicationEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </PublicationMediumCard>
 */
export const PublicationMediumCard = ({publication, children}) => {
    return (
        <PublicationCardCapsule title={<><PersonFill /> <PublicationLink publication={publication} /></>}>
            <PublicationMediumContent publication={publication}>
                {children}
            </PublicationMediumContent>
        </PublicationCardCapsule>
    )
}
