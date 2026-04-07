import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const RequestTypeInsertMutation = `
mutation RequestTypeInsert($id: UUID, $name: String!, $name_en: String!, $category_id: UUID!) {
  result: requestTypeInsert(requestType: {id: $id, name: $name, nameEn: $name_en, categoryId: $category_id}) {
    __typename
    ...on InsertError {
      input
      failed
      msg
      input
    }
    ...RequestType
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

export const RequestTypeInsertAsyncAction = createAsyncGraphQLAction(RequestTypeInsertMutation)