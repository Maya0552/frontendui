import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const PartInsertMutation =
`
mutation PartInsertMutation($id: UUID, $name: String, $name_en: String, $order: Int, $section_id: UUID) {
  result: formPartInsert(
    part: {id: $id, name: $name, nameEn: $name_en, order: $order, sectionId: $section_id}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...PartLarge
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

export const PartInsertAsyncAction = createAsyncGraphQLAction(PartInsertMutation)