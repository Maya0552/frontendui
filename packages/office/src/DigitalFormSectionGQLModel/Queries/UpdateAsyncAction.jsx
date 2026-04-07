import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment, MediumFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation digitalFormSectionUpdate($id: UUID!, $lastchange: DateTime!, $description: String, $name: String, $label: String, $labelEn: String, $repeatableMin: Int, $repeatableMax: Int, $repeatable: Boolean) {
  digitalFormSectionUpdate(digitalFormSection: {id: $id, lastchange: $lastchange, description: $description, name: $name, label: $label, labelEn: $labelEn, repeatableMin: $repeatableMin, repeatableMax: $repeatableMax, repeatable: $repeatable}) {
    ... on DigitalFormSectionGQLModel { ...Medium }
    ... on DigitalFormSectionGQLModelUpdateError { ...Error }
  }
}

fragment Error on DigitalFormSectionGQLModelUpdateError {
  __typename
  Entity {
    ...Medium
  }
  msg
  failed
  code
  location
  input
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, 
    // LargeFragment, 
    MediumFragment
)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)