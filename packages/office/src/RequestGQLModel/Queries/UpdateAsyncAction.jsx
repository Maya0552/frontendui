import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation requestUpdate($id: UUID!, $lastchange: DateTime!) {
  requestUpdate(request: {id: $id, lastchange: $lastchange}) {
    ... on RequestGQLModelUpdateError { ...Error }
    ... on RequestGQLModel { ...Large }
  }
}

fragment Error on RequestGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
  input
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)