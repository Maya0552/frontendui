import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateTransitionLargeFragment } from "./StateTransitionFragments";

const StateTransitionDeleteMutation = createQueryStrLazy(
`
mutation StateTransitionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: statetransitionDelete(
    statetransition: {id: $id, lastchange: $lastchange}
  ) {
    ... on StateTransitionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...StateTransitionLarge
      }
    }
  }
}
`,
    StateTransitionLargeFragment)

export const StateTransitionDeleteAsyncAction = createAsyncGraphQLAction(StateTransitionDeleteMutation)