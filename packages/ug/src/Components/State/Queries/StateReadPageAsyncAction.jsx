import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateLargeFragment } from "./StateFragments";

const StateReadPageQuery = createQueryStrLazy(
`
query StateReadPageQuery($skip: Int, $limit: Int, $where: StateWhereFilter) {
  result: statePage(skip: $skip, limit: $limit, where: $where) {
    ...StateLarge
  }
}
`,
    StateLargeFragment)

export const StateReadPageAsyncAction = createAsyncGraphQLAction(StateReadPageQuery)