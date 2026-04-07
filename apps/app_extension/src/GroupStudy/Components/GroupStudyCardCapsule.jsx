import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { GroupStudyLink } from "./GroupStudyLink"

/**
 * A specialized card component that displays an `GroupStudyLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `GroupStudyLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `groupstudy` object.
 *
 * @component
 * @param {Object} props - The props for the GroupStudyCardCapsule component.
 * @param {Object} props.groupstudy - The object representing the groupstudy entity.
 * @param {string|number} props.groupstudy.id - The unique identifier for the groupstudy entity.
 * @param {string} props.groupstudy.name - The display name for the groupstudy entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { GroupStudyCardCapsule } from './GroupStudyCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const groupstudyEntity = { id: 123, name: "Example Entity" };
 *
 * <GroupStudyCardCapsule groupstudy={groupstudyEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </GroupStudyCardCapsule>
 */
export const GroupStudyCardCapsule = ({groupstudy, children, title=<><PersonFill /> <GroupStudyLink groupstudy={groupstudy} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
