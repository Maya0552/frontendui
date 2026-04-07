import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { EmptyLargeFragment } from "./EmptyFragments";

const EmptyUpdateMutation = createQueryStrLazy(
`
mutation EmptyUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: emptyUpdate(
    empty: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on EmptyGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...EmptyLarge
      }      
    }
    ...EmptyLarge
  }
}
`, EmptyLargeFragment)

export const EmptyUpdateAsyncAction = createAsyncGraphQLAction(EmptyUpdateMutation)