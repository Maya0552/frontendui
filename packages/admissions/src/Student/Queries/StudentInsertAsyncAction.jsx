import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StudentLargeFragment } from "./StudentFragments";

const StudentInsertMutation = createQueryStrLazy(
`
mutation StudentInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: studentInsert(
    student: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...StudentLarge
  }
}
`,
    StudentLargeFragment)


export const StudentInsertAsyncAction = createAsyncGraphQLAction(StudentInsertMutation)