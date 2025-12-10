import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";

const ReadPageQueryStr = `
query ReadPageQuery($skip: Int, $limit: Int, $where: WhereInputFilter) {
  result: Page(skip: $skip, limit: $limit, where: $where) {
    ...Large
  }
}
`
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment)
export const ReadPageAsyncAction = createAsyncGraphQLAction(ReadPageQuery)