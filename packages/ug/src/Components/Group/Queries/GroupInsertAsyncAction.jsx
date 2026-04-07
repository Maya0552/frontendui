import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { GroupLargeFragment } from "./GroupFragments";

const GroupInsertMutation = createQueryStrLazy(
`
mutation GroupInsertMutation($id: UUID, $name: String!, $name_en: String, $grouptype_id: UUID!) {
  result: groupInsert(
    group: {id: $id, name: $name, nameEn: $name_en, grouptypeId: $grouptype_id}
  ) {
      __typename
      ... on InsertError {
      failed
      msg
      input
    }
    ...GroupLarge
  }
}
`, GroupLargeFragment)

export const GroupInsertAsyncAction = createAsyncGraphQLAction(GroupInsertMutation)