import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const GroupDeleteMutation =
`
mutation GroupDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: formGroupDelete(
    group: {id: $id, lastchange: $lastchange}
  ) {
    ... on GroupGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...GroupLarge
      }
    }
  }
}

fragment GroupLarge on GroupGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`

export const GroupDeleteAsyncAction = createAsyncGraphQLAction(GroupDeleteMutation)