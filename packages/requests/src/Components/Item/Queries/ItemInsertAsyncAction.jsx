import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const ItemInsertMutation = `
mutation FormItemInsert($id: UUID, $part_id: UUID!, $type_id: UUID!, $state_id: UUID!, $name: String, $name_en: String) {
  result: formItemInsert(
    item: {id: $id, partId: $part_id, typeId: $type_id, stateId: $state_id, name: $name, nameEn: $name_en}
  ) {
    __typename
    ...on InsertError {
      failed
      msg
      input
    }
    ...ItemWithRequest
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

export const ItemInsertAsyncAction = createAsyncGraphQLAction(ItemInsertMutation)