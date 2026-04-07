import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { EmptyLargeFragment } from "./EmptyFragments";

const EmptyReadPageQuery = createQueryStrLazy(
`
query EmptyReadPageQuery($skip: Int, $limit: Int, $where: EmptyWhereInputFilter) {
  result: emptyPage(skip: $skip, limit: $limit, where: $where) {
    ...EmptyLarge
  }
}
`, 
    EmptyLargeFragment)

export const EmptyReadPageAsyncAction = createAsyncGraphQLAction(EmptyReadPageQuery)