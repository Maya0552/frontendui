import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const SectionDeleteMutation =
`
mutation SectionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: formSectionDelete(
    section: {id: $id, lastchange: $lastchange}
  ) {
    ... on SectionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...SectionLarge
      }
    }
    
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

export const SectionDeleteAsyncAction = createAsyncGraphQLAction(SectionDeleteMutation)