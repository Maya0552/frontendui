import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { PublicationLink } from "./PublicationLink"

/**
 * A specialized card component that displays an `PublicationLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `PublicationLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `publication` object.
 *
 * @component
 * @param {Object} props - The props for the PublicationCardCapsule component.
 * @param {Object} props.publication - The object representing the publication entity.
 * @param {string|number} props.publication.id - The unique identifier for the publication entity.
 * @param {string} props.publication.name - The display name for the publication entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { PublicationCardCapsule } from './PublicationCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const publicationEntity = { id: 123, name: "Example Entity" };
 *
 * <PublicationCardCapsule publication={publicationEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </PublicationCardCapsule>
 */
export const PublicationCardCapsule = ({publication, children, title=<><PersonFill /> <PublicationLink publication={publication} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
