import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { PartLink } from "./PartLink"

/**
 * A specialized card component that displays an `PartLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `PartLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `part` object.
 *
 * @component
 * @param {Object} props - The props for the PartCardCapsule component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {string|number} props.part.id - The unique identifier for the part entity.
 * @param {string} props.part.name - The display name for the part entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { PartCardCapsule } from './PartCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const partEntity = { id: 123, name: "Example Entity" };
 *
 * <PartCardCapsule part={partEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </PartCardCapsule>
 */
export const PartCardCapsule = ({part, children, title=<><PersonFill /> <PartLink part={part} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
