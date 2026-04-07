import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation requesttypeInsert($mastergroupId: UUID!, $id: UUID, $name: String, $initialForm: DigitalFormInsertGQLModel) {
  requesttypeInsert(requestType: {mastergroupId: $mastergroupId, id: $id, name: $name, initialForm: $initialForm}) {
    ... on RequestTypeGQLModelInsertError { ...RequestTypeGQLModelInsertError }
    ... on RequestTypeGQLModel { ...Large }
  }
}


fragment RequestTypeGQLModelInsertError on RequestTypeGQLModelInsertError {
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