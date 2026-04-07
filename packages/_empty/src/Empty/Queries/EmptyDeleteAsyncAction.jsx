import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { EmptyLargeFragment } from "./EmptyFragments";

const EmptyDeleteMutation = createQueryStrLazy(
`
mutation EmptyDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: emptyDelete(
    empty: {id: $id, lastchange: $lastchange}
  ) {
    ... on EmptyGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...EmptyLarge
      }
    }
  }
}
`,
    EmptyLargeFragment)

export const EmptyDeleteAsyncAction = createAsyncGraphQLAction(EmptyDeleteMutation)