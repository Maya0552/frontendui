import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const ItemDeleteMutation = `
mutation FormItemDelete($id: UUID!, $lastchange: DateTime!) {
  result: formItemDelete(
    item: {id: $id, lastchange: $lastchange}
  ) {
    __typename
    ...on FormItemGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...ItemWithRequest
      }
    }
    
  }
}

fragment ItemWithRequest on FormItemGQLModel {
  __typename
  id
  lastchange
  name
  value
  part {
    id
    section {
      id
      form {
        id
        request {
          id
        }
      }
    }
  }
}
`

export const ItemDeleteAsyncAction = createAsyncGraphQLAction(ItemDeleteMutation)