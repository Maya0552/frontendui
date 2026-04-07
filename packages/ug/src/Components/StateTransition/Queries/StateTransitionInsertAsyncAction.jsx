import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateTransitionLargeFragment } from "./StateTransitionFragments";

const StateTransitionInsertMutation = createQueryStrLazy(
`
mutation StateTransitionInsertMutation($id: UUID, $name: String!, $name_en: String, $source_id: UUID!, $target_id: UUID!, $statemachine_id: UUID!) {
  result: statetransitionInsert(
    statetransition: {id: $id, name: $name, nameEn: $name_en, sourceId: $source_id, targetId: $target_id, statemachineId: $statemachine_id}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...StateTransitionLarge
  }
}
`,
    StateTransitionLargeFragment)

export const StateTransitionInsertAsyncAction = createAsyncGraphQLAction(StateTransitionInsertMutation)