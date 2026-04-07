import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation digitalFormFieldInsert($formId: UUID, $typeId: UUID, $formSectionId: UUID, $id: UUID, $name: String, $label: String, $labelEn: String, $description: String, $required: Boolean, $order: Int, $computed: Int) {
  digitalFormFieldInsert(formField: {formId: $formId, typeId: $typeId, formSectionId: $formSectionId, id: $id, name: $name, label: $label, labelEn: $labelEn, description: $description, required: $required, order: $order, computed: $computed}) {
    ... on DigitalFormFieldGQLModel { ...Large }
    ... on DigitalFormFieldGQLModelInsertError { ...InsertError }
  }
}


fragment InsertError on DigitalFormFieldGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input

}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)