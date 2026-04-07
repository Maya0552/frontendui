import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { MembershipsTable } from "../../Membership"
import { LazyRender } from "@hrbolek/uoisfrontend-shared"
import { GroupCardCapsule } from "../GroupCardCapsule"

const GroupMembershipsReadQuery = 
`
query GroupMembershipsReadQuery($id: UUID!, $skip: Int, $limit: Int, $where: MembershipInputWhereFilter) {
  result: groupById(id: $id) {
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

const GroupMembershipsReadAsyncAction = createAsyncGraphQLAction(
    GroupMembershipsReadQuery,
    processVectorAttributeFromGraphQLResult("memberships"),
    updateItemsFromGraphQLResult,
    hookGraphQLResult(jsonResult => {
        const memberships = jsonResult?.data?.result?.memberships || []
        return memberships
    })    
)

const GroupMembershipsContent = ({group}) => {
    if (!group?.id) return <>Chybí id skupiny {JSON.stringify(group)}</>
    const memberships=group?.memberships || []
    return (
        <MembershipsTable 
            memberships={memberships} 
            actionParams={{...group, skip: 0, limit: 20}} 
            AsyncAction={GroupMembershipsReadAsyncAction}/>
    )
}

export const GroupMemberships = ({group}) => {
    return (
        <LazyRender>
            <GroupMembershipsContent group={group} />
        </LazyRender>
    )
}

export const GroupMembershipsCard = ({group, children}) => {
    return (
        <GroupCardCapsule group={group}>
            <GroupMemberships group={group}>
                {children}
            </GroupMemberships>
        </GroupCardCapsule>

    )
}