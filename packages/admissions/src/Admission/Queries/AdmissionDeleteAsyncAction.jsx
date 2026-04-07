import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { AdmissionLargeFragment } from "./AdmissionFragments";

const AdmissionDeleteMutation = createQueryStrLazy(
`
mutation AdmissionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: admissionDelete(
    admission: {id: $id, lastchange: $lastchange}
  ) {
    ... on AdmissionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...AdmissionLarge
      }
    }
  }
}
`,
    AdmissionLargeFragment)

export const AdmissionDeleteAsyncAction = createAsyncGraphQLAction(AdmissionDeleteMutation)