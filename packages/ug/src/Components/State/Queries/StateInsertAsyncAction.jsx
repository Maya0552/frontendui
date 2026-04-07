import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateLargeFragment } from "./StateFragments";

const StateInsertMutation = createQueryStrLazy(
`
mutation StateInsertMutation($id: UUID, $name: String!, $name_en: String, $statemachine_id: UUID!) {
  result: stateInsert(
    state: {id: $id, name: $name, nameEn: $name_en, statemachineId: $statemachine_id}
  ) {
    __typename
    ... on InsertError {
      failed
      msg
      input
    }
    ...StateLarge
  }
}
`,
    StateLargeFragment)

export const StateInsertAsyncAction = createAsyncGraphQLAction(StateInsertMutation)