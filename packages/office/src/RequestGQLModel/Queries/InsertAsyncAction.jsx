import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation requestInsert($requestTypeId: UUID!, $id: UUID, $name: String) {
  requestInsert(request: {requestTypeId: $requestTypeId, id: $id, name: $name}) {
    ... on RequestGQLModelInsertError { ...RequestGQLModelInsertError }
    ... on RequestGQLModel { ...Large }
  }
}


fragment RequestGQLModelInsertError on RequestGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input

}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)