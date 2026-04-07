import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const StateMachineDeleteMutation =
`
mutation StateMachineDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: statemachineDelete(
    statemachine: {id: $id, lastchange: $lastchange}
  ) {
    ... on StateMachineGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...StateMachineLarge
      }
    }
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

export const StateMachineDeleteAsyncAction = createAsyncGraphQLAction(StateMachineDeleteMutation)