import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { EmptyLargeFragment } from "./EmptyFragments";

const EmptyInsertMutation = createQueryStrLazy(
`
mutation EmptyInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: emptyInsert(
    empty: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...EmptyLarge
  }
}
`,
    EmptyLargeFragment)


export const EmptyInsertAsyncAction = createAsyncGraphQLAction(EmptyInsertMutation)