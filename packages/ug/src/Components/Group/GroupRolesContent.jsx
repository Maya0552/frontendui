import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { UserLink } from "../User"
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"

const QueryGroupRoles = `
query QueryGroupRoles($id: UUID!) {
    result: groupById(id: $id) {
        __typename
        id
    		roles(limit: 100, where: {valid: {_eq: true}}) {
          	...GroupRole
        }
    }
}

fragment GroupRole on RoleGQLModel 
{
    __typename
    id
  	valid
    roletype {
      name
    }
  	user {
      	id
      	fullname
    }
}
`
export const QueryGroupRolesAsyncAction = createAsyncGraphQLAction(QueryGroupRoles)

export const GroupRolesContent = ({group}) => {
    const roles = group?.roles || []
    return (
        <>
        {roles.map(
            role => <Row key={role.id}>
                <Col>{role?.roletype?.name}</Col>
                <Col><UserLink user={role?.user} /></Col>
            </Row>
        )}
    </>
    )
}

// export const GroupRolesContentLazy = createLazyComponent(GroupRolesContent, "group", QueryGroupRolesAsyncAction)

export const GroupRolesContentLazy = (props) => null