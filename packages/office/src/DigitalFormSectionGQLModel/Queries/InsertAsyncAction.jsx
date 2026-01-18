import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment, MediumFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation digitalFormSectionInsert($name: String, $label: String, $labelEn: String, $description: String, $sectionId: UUID, $formId: UUID, $id: UUID, $repeatableMin: Int, $repeatableMax: Int, $repeatable: Boolean, $fields: [DigitalFormFieldInsertGQLModel!], $sections: [DigitalFormSectionInsertGQLModel!]) {
  digitalFormSectionInsert(digitalFormSection: {name: $name, label: $label, labelEn: $labelEn, description: $description, sectionId: $sectionId, formId: $formId, id: $id, repeatableMin: $repeatableMin, repeatableMax: $repeatableMax, repeatable: $repeatable, fields: $fields, sections: $sections}) {
    ... on DigitalFormSectionGQLModel { ...Medium }
    ... on DigitalFormSectionGQLModelInsertError { ...InsertError }
  }
}


fragment InsertError on DigitalFormSectionGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input

}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, 
    // LargeFragment,
    MediumFragment
)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)