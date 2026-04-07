import { PersonFill, ShieldFill } from "react-bootstrap-icons"
import { RoleLink } from "./RoleLink"
import { RoleCardCapsule } from "./RoleCardCapsule"
import { RoleMediumContent } from "./RoleMediumContent"

/**
 * A card component that displays detailed content for an Role entity.
 *
 * This component combines `RoleCardCapsule` and `RoleMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the Role entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the RoleMediumCard component.
 * @param {Object} props.role - The object representing the Role entity.
 * @param {string|number} props.role.id - The unique identifier for the Role entity.
 * @param {string} props.role.name - The name or label of the Role entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const RoleEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RoleMediumCard Role={RoleEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </RoleMediumCard>
 */
export const RoleMediumCard = ({role, children}) => {
    return (
        <RoleCardCapsule role={role} >
            <RoleMediumContent role={role}>
                {children}
            </RoleMediumContent>
        </RoleCardCapsule>
    )
}
