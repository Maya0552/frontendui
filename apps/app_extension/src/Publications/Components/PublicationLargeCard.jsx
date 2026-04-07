import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { PublicationCardCapsule } from "./PublicationCardCapsule"
import { PublicationMediumCard } from "./PublicationMediumCard"

/**
 * A large card component for displaying detailed content and layout for an publication entity.
 *
 * This component wraps an `PublicationCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `PublicationMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the PublicationLargeCard component.
 * @param {Object} props.publication - The object representing the publication entity.
 * @param {string|number} props.publication.id - The unique identifier for the publication entity.
 * @param {string} props.publication.name - The name or label of the publication entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const publicationEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PublicationLargeCard publication={publicationEntity}>
 *   <p>Additional content for the middle column.</p>
 * </PublicationLargeCard>
 */
export const PublicationLargeCard = ({publication, children}) => {
    return (
        <PublicationCardCapsule publication={publication} >
            <Row>
                <LeftColumn>
                    <PublicationMediumCard publication={publication}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </PublicationCardCapsule>
    )
}
