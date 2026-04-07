import { PersonFill } from "react-bootstrap-icons"
import { GroupStudyLink } from "./GroupStudyLink"
import { GroupStudyCardCapsule } from "./GroupStudyCardCapsule"
import { GroupStudyMediumContent } from "./GroupStudyMediumContent"

/**
 * A card component that displays detailed content for an groupstudy entity.
 *
 * This component combines `GroupStudyCardCapsule` and `GroupStudyMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the groupstudy entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the GroupStudyMediumCard component.
 * @param {Object} props.groupstudy - The object representing the groupstudy entity.
 * @param {string|number} props.groupstudy.id - The unique identifier for the groupstudy entity.
 * @param {string} props.groupstudy.name - The name or label of the groupstudy entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const groupstudyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <GroupStudyMediumCard groupstudy={groupstudyEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </GroupStudyMediumCard>
 */
export const GroupStudyMediumCard = ({groupstudy, children}) => {
    return (
        <GroupStudyCardCapsule title={<><PersonFill /> <GroupStudyLink groupstudy={groupstudy} /></>}>
            <GroupStudyMediumContent groupstudy={groupstudy}>
                {children}
            </GroupStudyMediumContent>
        </GroupStudyCardCapsule>
    )
}
