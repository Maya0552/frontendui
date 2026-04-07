import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation requesttypeDelete($id: UUID!, $lastchange: DateTime!) {
  requesttypeDelete(requestType: {id: $id, lastchange: $lastchange}) {
  ...RequestTypeGQLModelDeleteError
}
}

fragment RequestTypeGQLModelDeleteError on RequestTypeGQLModelDeleteError {
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