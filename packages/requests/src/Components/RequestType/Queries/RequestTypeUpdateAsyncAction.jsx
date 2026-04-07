import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { StateMachineLargeFragment } from "@hrbolek/uoisfrontend-ug"

const RequestTypeUpdateMutation = createQueryStrLazy(`
mutation RequestTypeUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String, 
  	$group_id: UUID, $template_form_id: UUID, $statemachine_id: UUID, $state_id: UUID) {
  result: requestTypeUpdate(
    requestType: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en, 
      groupId: $group_id, templateFormId: $template_form_id, statemachineId: $statemachine_id, stateId: $state_id}
  ) {
      __typename
    ... on RequestTypeGQLModelUpdateError {
      input
      failed
      msg
      input
    }
    ...RequestType
  }
}

fragment RequestType on RequestTypeGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  groupId
  group { ...GroupLink }
  templateFormId
  templateForm { ...FormLarge }
  statemachine { ...StateMachineLarge }
}

fragment GroupLink on GroupGQLModel {
  __typename
  id
  name
}

fragment FormLarge on FormGQLModel {
  __typename
  id
  name
  state {
    __typename
    id
    name
    readerslistId
  }
  sections {
    __typename
    id
    lastchange
    name
    order
    parts {
      __typename
      id
      lastchange
      name
      order
      items {
        __typename
        lastchange
        id
        name
        value
        order
        type {
          id
          name
        }
      }
    }
  }
}
`,
    StateMachineLargeFragment
)

export const RequestTypeUpdateAsyncAction = createAsyncGraphQLAction(RequestTypeUpdateMutation)