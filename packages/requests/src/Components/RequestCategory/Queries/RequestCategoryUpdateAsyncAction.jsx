import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const RequestCategoryUpdateMutation = `
mutation RequestCategoryUpdate($id: UUID!, $lastchange: DateTime!, $name: String!, $name_en: String!) {
  result: requestCategoryUpdate(category: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}) {
    ...on RequestCategoryGQLModelUpdateError {
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

export const RequestCategoryUpdateAsyncAction = createAsyncGraphQLAction(RequestCategoryUpdateMutation)