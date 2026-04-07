import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const SectionUpdateMutation =
`
mutation SectionUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String, $order: Int, $stateId: UUID, $form_id: UUID) {
  result: formSectionUpdate(
    section: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en, order: $order, stateId: $stateId, formId: $form_id}
  ) {
    ... on SectionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...SectionLarge
      }
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

export const SectionUpdateAsyncAction = createAsyncGraphQLAction(SectionUpdateMutation)