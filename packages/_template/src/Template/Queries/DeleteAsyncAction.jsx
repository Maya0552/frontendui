import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";

const DeleteMutationStr = `
mutation DeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: Delete(
    item : {id: $id, lastchange: $lastchange}
  ) {
    ... on GQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...Large
      }
    }
  }
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction(DeleteMutation)