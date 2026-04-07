import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateLargeFragment, StateReadPermissionsQuery } from "./StateFragments";

const StateReadQuery = createQueryStrLazy(
`
query StateReadQuery($id: UUID!) {
  result: stateById(id: $id) {
    __typename
    ...StateLarge
  }
}
  `,
    StateLargeFragment)

export const StateReadAsyncAction = createAsyncGraphQLAction(StateReadQuery)

export const StateReadPermissionsAsyncAction = createAsyncGraphQLAction(
    StateReadPermissionsQuery
)