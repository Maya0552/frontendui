import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { RoleCardCapsule } from "./RoleCardCapsule"
import { RoleMediumCard } from "./RoleMediumCard"

/**
 * A large card component for displaying detailed content and layout for an Role entity.
 *
 * This component wraps an `RoleCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `RoleMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the RoleLargeCard component.
 * @param {Object} props.role - The object representing the Role entity.
 * @param {string|number} props.Role.id - The unique identifier for the Role entity.
 * @param {string} props.role.name - The name or label of the Role entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const RoleEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RoleLargeCard role={RoleEntity}>
 *   <p>Additional content for the middle column.</p>
 * </RoleLargeCard>
 */
export const RoleLargeCard = ({role}) => {
    return (
        <RoleCardCapsule role={role} >
            <Row>
                <LeftColumn>
                    <RoleMediumCard role={role}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </RoleCardCapsule>
    )
}
