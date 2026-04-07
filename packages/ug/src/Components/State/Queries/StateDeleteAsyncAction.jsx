import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateLargeFragment } from "./StateFragments";

const StateDeleteMutation = createQueryStrLazy(
`
mutation StateDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: stateDelete(
    state: {id: $id, lastchange: $lastchange}
  ) {
    __typename
    ... on StateGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...StateLarge
      }
    }
  }
}
`,
    StateLargeFragment)

export const StateDeleteAsyncAction = createAsyncGraphQLAction(StateDeleteMutation)