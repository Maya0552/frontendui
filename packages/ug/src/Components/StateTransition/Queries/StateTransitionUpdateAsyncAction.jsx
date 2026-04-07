import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateTransitionLargeFragment } from "./StateTransitionFragments";

const StateTransitionUpdateMutation = createQueryStrLazy(
`
mutation StateTransitionUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: statetransitionUpdate(
    statetransition: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on StateTransitionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...StateTransitionLarge
      }      
    }
    ...StateTransitionLarge
  }
}
`,
    StateTransitionLargeFragment)

export const StateTransitionUpdateAsyncAction = createAsyncGraphQLAction(StateTransitionUpdateMutation)