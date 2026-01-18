import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation requestMoveToState($id: UUID!, $lastchange: DateTime!, $targetStateId: UUID!, $msg: String) {
  requestMoveToState(request: {id: $id, lastchange: $lastchange, targetStateId: $targetStateId, msg: $msg}) {
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
export const MoveAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)