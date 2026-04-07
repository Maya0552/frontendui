import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { SectionLink } from "./SectionLink"

/**
 * A specialized card component that displays an `SectionLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `SectionLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `section` object.
 *
 * @component
 * @param {Object} props - The props for the SectionCardCapsule component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {string|number} props.section.id - The unique identifier for the section entity.
 * @param {string} props.section.name - The display name for the section entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { SectionCardCapsule } from './SectionCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const sectionEntity = { id: 123, name: "Example Entity" };
 *
 * <SectionCardCapsule section={sectionEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </SectionCardCapsule>
 */
export const SectionCardCapsule = ({section, children, title=<><PersonFill /> <SectionLink section={section} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
