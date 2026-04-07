import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const GroupUpdateMutation =
`
mutation GroupUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: groupUpdate(
    group: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on GroupGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...GroupLarge
      }
    }
    ...GroupLarge
  }
}

fragment GroupLarge on GroupGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`

export const GroupUpdateAsyncAction = createAsyncGraphQLAction(GroupUpdateMutation)