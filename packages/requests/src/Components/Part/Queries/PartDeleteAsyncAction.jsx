import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const PartDeleteMutation =
`
mutation PartDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: formPartDelete(
    part: {id: $id, lastchange: $lastchange}
  ) {
    __typename
    ... on PartGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...PartLarge
      }
    }
  }
}

fragment PartLarge on PartGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  section {
    id
    name
    form {
      id
      request {
        id
      }
    }
  }
}
`

export const PartDeleteAsyncAction = createAsyncGraphQLAction(PartDeleteMutation)