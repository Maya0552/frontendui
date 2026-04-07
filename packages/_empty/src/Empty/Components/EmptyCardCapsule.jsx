import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { EmptyLink } from "./EmptyLink"

/**
 * A specialized card component that displays an `EmptyLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `EmptyLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `empty` object.
 *
 * @component
 * @param {Object} props - The props for the EmptyCardCapsule component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The display name for the empty entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { EmptyCardCapsule } from './EmptyCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const emptyEntity = { id: 123, name: "Example Entity" };
 *
 * <EmptyCardCapsule empty={emptyEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </EmptyCardCapsule>
 */
export const EmptyCardCapsule = ({empty, children, title=<><PersonFill /> <EmptyLink empty={empty} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
