import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";

const UpdateMutationStr = `
mutation UpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: Update(
    : {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on GQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...Large
      }      
    }
    ...Large
  }
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction(UpdateMutation)