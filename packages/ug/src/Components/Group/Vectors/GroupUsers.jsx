import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"
import { UserLink, UserMediumCard } from "../../User"
import { GroupCardCapsule } from "../GroupCardCapsule"



const GroupQuery =
`
query groupById($id: UUID!, $limit: Int, $skip: Int, $where: MembershipInputWhereFilter) {
  result: groupById(id: $id) {
    __typename
    id
    memberships(limit: $limit, skip: $skip, where: $where) {
      __typename
      id
      user {
        __typename
        id
        fullname
        email
      }
      valid
    }
  }
}
`

const GroupQueryAsyncAction = createAsyncGraphQLAction(
    GroupQuery,
    processVectorAttributeFromGraphQLResult("memberships"),
    hookGraphQLResult(jsonResult => {
        const data = jsonResult?.data?.result?.memberships;
        // console.log('GroupQueryAsyncAction', data)
        return data
    })
)

const MembershipRow = ({membership}) => {
    const user = membership?.user || {}
    return (
        <tr>
            <td>{membership?.startdate}</td>
            <td><UserLink user={user} /></td>
        </tr>
    )
}

const MembershipVisualiser = ({items}) => {
    if (!items) return null
    // return (
    //     <Row>
    //         {items.map(
    //             membership => <Col key={membership.id}>
    //                 <span key={membership.id}><UserLink user={membership.user} /></span>
    //             </Col>
    //         )}
    //     </Row>
    // )
    return (
        <div>
            {items.map(
                membership => 
                    <span key={membership.id}><UserLink user={membership.user} />; </span>
                
            )}
        </div>
    )    
}

export const GroupUsersInfinite = ({group}) => {
    return (
        <GroupCardCapsule group={group} >
            <Row>
                <InfiniteScroll 
                    preloadedItems={group?.memberships || []}
                    asyncAction={GroupQueryAsyncAction} 
                    Visualiser={MembershipVisualiser} 
                    actionParams={{...group, limit:20}}
                />
            </Row>
            {/* <div>
                {JSON.stringify(group, null, 4)}
            </div> */}
        </GroupCardCapsule>
    )
}

// export const GroupUsersInfinite = 