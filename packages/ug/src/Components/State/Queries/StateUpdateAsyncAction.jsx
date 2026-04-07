import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateLargeFragment } from "./StateFragments";

const StateUpdateMutation = createQueryStrLazy(
`
mutation StateUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: stateUpdate(
    state: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    __typename
    ... on StateGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...StateLarge
      }      
    }
    ...StateLarge
  }
}
  `,
    StateLargeFragment)

export const StateUpdateAsyncAction = createAsyncGraphQLAction(StateUpdateMutation)