import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { AdmissionLargeFragment } from "./AdmissionFragments";

const AdmissionReadPageQuery = createQueryStrLazy(
`
query AdmissionReadPageQuery($skip: Int, $limit: Int, $where: AdmissionWhereInputFilter) {
  result: admissionPage(skip: $skip, limit: $limit, where: $where) {
    ...AdmissionLarge
  }
}
`, 
    AdmissionLargeFragment)

export const AdmissionReadPageAsyncAction = createAsyncGraphQLAction(AdmissionReadPageQuery)