import { PersonFill } from "react-bootstrap-icons"
import { SectionLink } from "./SectionLink"
import { SectionCardCapsule } from "./SectionCardCapsule"
import { SectionMediumContent } from "./SectionMediumContent"

/**
 * A card component that displays detailed content for an section entity.
 *
 * This component combines `SectionCardCapsule` and `SectionMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the section entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the SectionMediumCard component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {string|number} props.section.id - The unique identifier for the section entity.
 * @param {string} props.section.name - The name or label of the section entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const sectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <SectionMediumCard section={sectionEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </SectionMediumCard>
 */
export const SectionMediumCard = ({section, children}) => {
    return (
        <SectionCardCapsule title={<><PersonFill /> <SectionLink section={section} /></>}>
            <SectionMediumContent section={section}>
                {children}
            </SectionMediumContent>
        </SectionCardCapsule>
    )
}
