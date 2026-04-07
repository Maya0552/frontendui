import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { AdmissionLargeFragment } from "./AdmissionFragments";

const AdmissionInsertMutation = createQueryStrLazy(
`
mutation AdmissionInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: admissionInsert(
    admission: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...AdmissionLarge
  }
}
`,
    AdmissionLargeFragment)


export const AdmissionInsertAsyncAction = createAsyncGraphQLAction(AdmissionInsertMutation)