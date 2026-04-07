import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const RequestCategoryInsertMutation = `
mutation RequestCategoryInsert($id: UUID, $name: String!, $name_en: String!) {
  result: requestCategoryInsert(category: {id: $id, name: $name, nameEn: $name_en}) {
    ...on InsertError {
      input
      failed
      msg
      input
    }
    ...RequestCategory
  }
}

fragment RequestCategory on RequestCategoryGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`

export const RequestCategoryInsertAsyncAction = createAsyncGraphQLAction(RequestCategoryInsertMutation)