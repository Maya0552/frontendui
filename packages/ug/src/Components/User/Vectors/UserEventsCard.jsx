import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { CardCapsule, createLazyComponent } from "@hrbolek/uoisfrontend-shared"

const QueryUserEvents = `
query UserEventsRead($id: UUID!, $skip: Int, $limit: Int, $where: UGEventInputFilter) {
    result: userById(id: $id) {
        __typename
        id
        events(where: $where, skip: $skip, limit: $limit) {    
            __typename
            name
            startdate
            enddate
          	duration(unit: HOURS)
          	description
            users {
                __typename
                id
                fullname
            }
            groups {
                __typename
                id
                name
            }
        }
    }
}
`

const UserEventsAsyncAction = createAsyncGraphQLAction(
    QueryUserEvents, 
    "user", 
    processVectorAttributeFromGraphQLResult("events"),
    updateItemsFromGraphQLResult
)

const UserEventsContent = ({user}) => {
    return (
        <>
        {JSON.stringify(user?.events, null, 4)}
        </>
    )
}

const UserEventsContentLazy = createLazyComponent(UserEventsContent, "user", UserEventsAsyncAction)

export const UserEventsCard = ({user, canlazy=true}) => {
    // const memberships = user?.memberships || []
    // const user_ids = memberships.map(m => m?.user?.id)
    const where = {"presences": {"user_id": {"_eq": user?.id}}}
    return (
        <CardCapsule title="Rozvrh">
            {/* <UserEventsCalendarLazy user={user} where={where} /> */}
            {JSON.stringify(user?.events, null, 4)}
        </CardCapsule>
    )
}