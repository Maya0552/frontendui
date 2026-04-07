import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const StateMachineUpdateMutation =
`
mutation StateMachineUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: statemachineUpdate(
    statemachine: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on StateMachineGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...StateMachineLarge
      }      
    }
    ...StateMachineLarge
  }
}


fragment StateMachineLarge on StateMachineGQLModel {
  ...StateMachineLink
  states {
    ...StateLarge
  }
  transitions {
    ...StateTransition
  }
}

fragment StateMachineLink on StateMachineGQLModel {
  __typename
  id
  lastchange
  name
  nameEn  
}

fragment StateLarge  on StateGQLModel {
  ...StateLink
  targets {
    ...StateTransition
  }
  sources {
    ...StateTransition
  }
}

fragment StateLink on StateGQLModel {
    __typename
  id
  lastchange
  name
  nameEn
}

fragment StateTransition on StateTransitionGQLModel {
    __typename
  id
  lastchange
  name
  nameEn
	source { ...StateLink}
  target { ...StateLink}
}

`

export const StateMachineUpdateAsyncAction = createAsyncGraphQLAction(StateMachineUpdateMutation)