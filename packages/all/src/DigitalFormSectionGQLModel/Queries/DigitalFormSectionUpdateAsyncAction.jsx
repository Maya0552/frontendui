import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormSectionLargeFragment } from "./DigitalFormSectionFragments";
import { DigitalFormLargeFragment } from "../../DigitalFormGQLModel/Queries";

const DigitalFormSectionUpdateMutationStr = `
mutation DigitalFormSectionUpdateMutation(
  $id: UUID!, 
  $lastchange: DateTime!, 
  $name: String, 
  $label: String, 
  $labelEn: String,
  $repeatableMin: Int,
  $repeatableMax: Int,
  $repeatable: Boolean
) {
  result: digitalFormSectionUpdate(
    digitalFormSection: {
      id: $id, 
      lastchange: $lastchange, 
      name: $name, 
      label: $label, 
      labelEn: $labelEn,
      repeatableMin: $repeatableMin,
      repeatableMax: $repeatableMax,
      repeatable: $repeatable
    }
  ) {
    ... on DigitalFormSectionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalFormSectionLargeFragment
      }      
    }
    ...DigitalFormSectionLargeFragment
    ...on DigitalFormSectionGQLModel {
      form {
          __typename
          ...DigitalFormLargeFragment  
      }
  	}

  }
}
`

const DigitalFormSectionUpdateMutation = createQueryStrLazy(
    `${DigitalFormSectionUpdateMutationStr}`, 
    DigitalFormSectionLargeFragment,
    DigitalFormLargeFragment
)
export const DigitalFormSectionUpdateAsyncAction = createAsyncGraphQLAction(DigitalFormSectionUpdateMutation)