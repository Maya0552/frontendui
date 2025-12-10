import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";


const InsertMutationStr = `
mutation InsertMutation($id: UUID, $name: String, $name_en: String) {
  result: Insert(
    template: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...Large
  }
}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction(InsertMutation)