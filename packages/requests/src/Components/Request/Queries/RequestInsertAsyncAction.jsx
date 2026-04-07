import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const RequestInsertMutation = 
`
mutation RequestInsertMutation($id: UUID, $request_type_id: UUID!) {
  result: formRequestInsert(request: {id: $id, requestTypeId: $request_type_id}) {
    __typename
    ...on InsertError {
      failed
      msg
      input
    }
    ...Request
  }
}


fragment Request on RequestGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  formId
  form {
    ...FormLarge
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
}
`

export const RequestInsertAsyncAction = createAsyncGraphQLAction(RequestInsertMutation)