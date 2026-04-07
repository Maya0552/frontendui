import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const RequestTypeDeleteMutation = `
mutation RequestTypeDelete($id: UUID!, $lastchange: DateTime!) {
  result: requestTypeDelete(type: {id: $id, lastchange: $lastchange}) {
    ...on RequestTypeGQLModelDeleteError {
      input
      failed
      msg
      Entity {
        ...RequestType
      }
    }
  
  }
}

fragment RequestType on RequestTypeGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`

export const RequestTypeDeleteAsyncAction = createAsyncGraphQLAction(RequestTypeDeleteMutation)