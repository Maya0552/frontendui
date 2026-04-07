import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { UserCardCapsule } from "../UserCardCapsule"
import { RoleMediumCard } from "../../Role"


const UserRolesReadQuery = `
query UserRolesReadQuery($id: UUID!) {
    result: userById(id: $id) {
        __typename
        id
    roles(limit: 100, where: {valid: {_eq: true}}) {
      __typename
      id
      group {
        ...Group
      }
      startdate
      enddate
      deputy
      roletypeId
      roletype { id name }
    }
  }
}

fragment Group on GroupGQLModel {
  __typename
  id
  name
  type {
    id
    name
    category {
      id
      name
    }
  }
}`

const UserRolesReadAsyncAction = createAsyncGraphQLAction(
    UserRolesReadQuery,
    processVectorAttributeFromGraphQLResult("roles")
)

// const Role = ({role}) => {
//     return (
//         <Row>
//             <Col>{role?.group?.name}</Col>
//             <Col>{role?.roletype?.name}</Col>
//         </Row>
//     )
// }

export const UserRolesContent = ({user, children, Visualiser=RoleMediumCard}) => {
    const [user_] = useFreshItem(user, UserRolesReadAsyncAction)
    const roles = user_?.roles
    return (
        <Row>
            {roles.map(
                role => <Col key={role?.id}>
                    <Visualiser role={role} />
                </Col>
            )}  
            {React.Children.map(
                children, (child) => 
                    <Col>
                        {child}
                    </Col>

            )}
        </Row>
    )
    
}

export const UserRolesCard = ({user, ...props}) => {
    return (
        <UserCardCapsule user={user}>
            <UserRolesContent user={user} {...props}/>
        </UserCardCapsule>
    )
}