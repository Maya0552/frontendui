import { AsyncComponent } from "@hrbolek/uoisfrontend-shared"
import { UserLargeCard } from "./UserLargeCard"
import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const UserReadFragment = createQueryStrLazy(
    `fragment on UserGQLModel {
        __typename
        id
        name

    }`
)

const UserReadQuery = createQueryStrLazy(
    `query UserReadQuery($id: UUID!) {
        result: userById(id: $id) {
            ...UserReadFragment
        }
    }`,
    UserReadFragment
)

const UserLargeReadAsyncAction = createAsyncGraphQLAction(UserReadQuery)

export const AsyncUserLargeCard = ({user}) => 
    <AsyncComponent
        asyncAction={UserLargeReadAsyncAction}
        propertyName="user"
        queryVariables={{id: user.id}}
    >
        <UserLargeCard />
    </AsyncComponent>
