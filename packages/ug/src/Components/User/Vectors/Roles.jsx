import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { RoleAddDeputyButton, RoleMediumCard } from "../../Role"
import { UserCardCapsule } from "../UserCardCapsule"
import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult } from '@hrbolek/uoisfrontend-gql-shared'
import { InfiniteScroll, LazyRender } from '@hrbolek/uoisfrontend-shared'


const UserRolesQuery = `
query UserRolesQuery($id: UUID!, $where: RoleInputWhereFilter, $skip: Int, $limit: Int ) {
    result: userById(id: $id) {
        __typename
        id
        # fullname
        roles(skip: $skip, limit: $limit, where: $where, orderby: "startdate")
        {
            ...Roles
        }
    }
}

fragment Roles on RoleGQLModel {
    __typename
    id
    startdate
    enddate
    deputy
    roletype {
        id
        name
        category {
            id
            name
        }
    }
    user {
        id
        fullname
        isThisMe
    }
    group {
        id
        name
    }
}
`

const UserRolesReadAsyncAction = createAsyncGraphQLAction(
    UserRolesQuery,
    processVectorAttributeFromGraphQLResult("roles"),
    hookGraphQLResult(jsonResult => {
        const data = jsonResult?.data?.result?.roles;
        // console.log('GroupQueryAsyncAction', data)
        return data
    })    
)

const RoleVisualiser = ({role}) => {
    return (
        <Col>
            <RoleMediumCard role={role}>           
                {role?.user?.isThisMe &&<hr />}
                <RoleAddDeputyButton role={role} />
            </RoleMediumCard>
            {/* {JSON.stringify(role)} */}
        </Col>
    )
}

const RolesVisualiser = ({items}) => {
    return (
        <Row>
            {items.map(
                // role => <>{(role?.id)&&<RoleVisualiser role={role}/>}</>
                role => <RoleVisualiser key={role?.id} role={role}/>
            )} 
        </Row>
    )
}

const UserRolesContent = ({user, children, ...props}) => {  
    return (
        <InfiniteScroll 
            preloadedItems={user.roles || []}
            Visualiser={RolesVisualiser}
            actionParams={{...props, ...user}}
            asyncAction={UserRolesReadAsyncAction}
        >
            {children}
        </InfiniteScroll>
    )
}

/**
 * A component that displays a user's roles inside a card capsule.
 *
 * This component takes a user object and renders their associated roles in a grid layout.
 * Each role is represented by a `RoleMediumCard` component.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.user - The user object containing roles.
 * @param {Array} [props.user.roles=[]] - An array of role objects associated with the user.
 * @param {string|number} props.user.roles[].id - The unique identifier for each role.
 * @param {string} props.user.roles[].name - The name of the role.
 *
 * @returns {JSX.Element} A card capsule with the user's roles rendered in a grid.
 *
 * @example
 * // Example usage:
 * const user = {
 *   id: 1,
 *   name: "John Doe",
 *   roles: [
 *     { id: 101, name: "Admin" },
 *     { id: 102, name: "Editor" }
 *   ]
 * };
 * 
 * <UserRoles user={user} />
 */
export const UserRolesCard = ({user, id="roles"}) => {
    // const roles = user?.roles || []
    return (
        <UserCardCapsule user={user} id={id}>
            <UserRolesContent user={user} />
        </UserCardCapsule>
    )
}
