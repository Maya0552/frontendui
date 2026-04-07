import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { MembershipsTable } from "../../Membership"
import { LazyRender } from "@hrbolek/uoisfrontend-shared"
import { UserCardCapsule } from "../UserCardCapsule"

const UserMembershipsReadQuery = 
`
query UserMembershipsReadQuery($id: UUID!, $skip: Int, $limit: Int, $where: MembershipInputWhereFilter) {
  result: userById(id: $id) {
    __typename
    id
    memberships(skip: $skip, limit: $limit, where: $where) {
      id
      startdate
      enddate
      user {
        __typename
        id
        fullname
        email
      }
      group {
        __typename
        id
        name
      }
    }
  }
}`

const UserMembershipsReadAsyncAction = createAsyncGraphQLAction(
    UserMembershipsReadQuery,
    processVectorAttributeFromGraphQLResult("memberships"),
    updateItemsFromGraphQLResult,
    hookGraphQLResult(jsonResult => {
        const memberships = jsonResult?.data?.result?.memberships || []
        return memberships
    })
)

const UserMembershipsContent = ({user}) => {
    const memberships=user?.memberships || []
    return (
        <MembershipsTable 
            memberships={memberships} 
            actionParams={{...user, skip: 0, limit: 20}} 
            AsyncAction={UserMembershipsReadAsyncAction}/>
    )
}

export const UserMemberships = ({user}) => {
    return (
        <LazyRender>
            <UserMembershipsContent user={user} />
        </LazyRender>
    )
}

export const UserMembershipsCard = ({user, children}) => {
    return (
        <UserCardCapsule user={user}>
            <UserMemberships user={user}>
                {children}
            </UserMemberships>
        </UserCardCapsule>
    )
}