import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const RequestCategoryDeleteMutation = `
mutation RequestCategoryDelete($id: UUID!, $lastchange: DateTime!) {
  result: requestCategoryDelete(category: {id: $id, lastchange: $lastchange}) {
    ...on RequestCategoryGQLModelDeleteError {
      input
      failed
      msg
      Entity {
        ...RequestCategory
      }
    }
  
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

export const RequestCategoryDeleteAsyncAction = createAsyncGraphQLAction(RequestCategoryDeleteMutation)