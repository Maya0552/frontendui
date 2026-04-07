import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { LazyRender } from "@hrbolek/uoisfrontend-shared"
import { GroupMediumCard } from "../../Group"

const QueryMembershipsRead =
`
query UserQueryRead($id: UUID!) {
  result: userById(id: $id) {
    __typename
    id
    memberships(limit: 100, where: {valid: {_eq: true}}) {
      group {
        __typename
        id
        name
        type {
          id
          name
        }
      }
    }
  }
}
`

const QueryMembershipsAsyncAction = createAsyncGraphQLAction(
    QueryMembershipsRead,
    processVectorAttributeFromGraphQLResult("memberships"),
    updateItemsFromGraphQLResult
    // hookGraphQLResult(jsonResult => {
    //     const memberships = jsonResult?.data?.result?.memberships || []
    //     const groups = memberships.map(
    //         m => m?.group
    //     )
    //     return groups
    // })
)

const UserMembershipsGroupsContent = ({user, Visualiser=GroupMediumCard}) => {
    const [updatedUser] = useFreshItem(user, QueryMembershipsAsyncAction)
    const memberships = updatedUser?.memberships || []
    const groups = memberships.map(
        m => m?.group
    )    
    return (
        <Row>
            {groups.map(
                group => <Col key={group?.id}>
                    <Visualiser group={group} />
                </Col>
            )}
        </Row>
    )
}

export const UserMembershipsGroups = ({user, Visualiser=GroupMediumCard}) => {
    return (
        <LazyRender>
            <UserMembershipsGroupsContent user={user} Visualiser={Visualiser} />
        </LazyRender>
    )
}