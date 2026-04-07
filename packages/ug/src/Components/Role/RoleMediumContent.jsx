import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { GroupLink } from "../Group"
import { UserLink } from "../User"

/**
 * A component that displays medium-level content for an Role entity.
 *
 * This component renders a label "RoleMediumContent" followed by a serialized representation of the `Role` object
 * and any additional child content. It is designed to handle and display information about an Role entity object.
 *
 * @component
 * @param {Object} props - The properties for the RoleMediumContent component.
 * @param {Object} props.role - The object representing the role entity.
 * @param {string|number} props.role.id - The unique identifier for the role entity.
 * @param {string} props.role.name - The name or label of the role entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `role` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const RoleEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RoleMediumContent role={RoleEntity}>
 *   <p>Additional information about the entity.</p>
 * </RoleMediumContent>
 */
export const RoleMediumContent = ({role, children}) => {
    return (
        <>
            <Row>
                <Col>
                    <UserLink user={role?.user} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <GroupLink group={role?.group} />
                </Col>
            </Row>
            <Row>
                <Col>
                    Zástup
                </Col>
                <Col>
                    {role?.deputy?"Ano":"Ne"}
                </Col>
            </Row>
            <Row>
                <Col>
                    Počátek
                </Col>
                <Col>
                    {new Date(role?.startdate).toLocaleDateString()}
                </Col>
            </Row>
            <Row>
                <Col>
                    Konec
                </Col>
                <Col>
                    {role?.enddate && new Date(role?.enddate).toLocaleDateString()}
                    <br />{role?.enddate}
                </Col>
            </Row>
            <Row>
                <Col>
                    Typ
                </Col>
                <Col>
                    {role?.roletype?.name}
                </Col>
            </Row>
            {children}
        </>
    )
}
