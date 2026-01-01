import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation digitalFormFieldDelete($id: UUID!, $lastchange: DateTime!) {
  digitalFormFieldDelete(formField: {id: $id, lastchange: $lastchange}) {
  ...DigitalFormFieldGQLModelDeleteError
}
}

fragment DigitalFormFieldGQLModelDeleteError on DigitalFormFieldGQLModelDeleteError  {
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