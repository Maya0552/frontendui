import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const PartUpdateMutation =
`
mutation PartUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String, $order: Int, $section_id: UUID) {
  result: formPartUpdate(
    part: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en, order: $order, sectionId: $section_id}
  ) {
    ... on PartGQLModelUpdateError {
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

export const PartUpdateAsyncAction = createAsyncGraphQLAction(PartUpdateMutation)