import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const FormInsertMutation = 
`
mutation FormInsert($id: UUID, $name: String, $sections: [SectionInsertGQLModel!]) {
  result: formInsert(form: {id: $id, name: $name, sections: $sections}) {
    ...FormLarge
    ...on InsertError {
      __typename
      msg
      failed
      input
    }    
  }
}

fragment FormLarge on FormGQLModel {
  __typename
  id
  name
  state {
    __typename
    id
    name
    readerslistId
  }
  sections {
    __typename
    id
    lastchange
    name
    order
    parts {
      __typename
      id
      lastchange
      name
      order
      items {
        __typename
        lastchange
        id
        name
        value
        order
        type {
          id
          name
        }
      }
    }
  }
}`

export const FormInsertAsyncAction = createAsyncGraphQLAction(
    FormInsertMutation)