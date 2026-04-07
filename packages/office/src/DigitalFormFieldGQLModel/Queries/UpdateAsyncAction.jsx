import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation digitalFormFieldUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $label: String, $labelEn: String, $description: String, $required: Boolean, $order: Int, $computed: Int, $typeId: UUID, $formula: String, $backendFormula: String, $flattenFormula: String) {
  digitalFormFieldUpdate(formField: {id: $id, lastchange: $lastchange, name: $name, label: $label, labelEn: $labelEn, description: $description, required: $required, order: $order, computed: $computed, typeId: $typeId, formula: $formula, backendFormula: $backendFormula, flattenFormula: $flattenFormula}) {
    ... on DigitalFormFieldGQLModel { ...Large }
    ... on DigitalFormFieldGQLModelUpdateError { ...Error }
  }
}

fragment Error on DigitalFormFieldGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
  input
}

`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)