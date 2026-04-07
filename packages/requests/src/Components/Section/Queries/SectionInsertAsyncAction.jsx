import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const SectionInsertMutation =
`
mutation SectionInsertMutation($id: UUID, $name: String, $name_en: String, $order: Int, $stateId: UUID, $form_id: UUID) {
  result: formSectionInsert(
    section: {id: $id, name: $name, nameEn: $name_en, order: $order, stateId: $stateId, formId: $form_id}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...SectionLarge
  }
}

fragment SectionLarge on SectionGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  form {
    id
    request {
      id
    }
  }
}
`

export const SectionInsertAsyncAction = createAsyncGraphQLAction(SectionInsertMutation)