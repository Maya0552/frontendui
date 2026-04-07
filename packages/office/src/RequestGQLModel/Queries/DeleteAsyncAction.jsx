import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation requestDelete($id: UUID!, $lastchange: DateTime!) {
  requestDelete(request: {id: $id, lastchange: $lastchange}) {
  ...RequestGQLModelDeleteError
}
}

fragment RequestGQLModelDeleteError on RequestGQLModelDeleteError {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  failed
  location
  input
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)