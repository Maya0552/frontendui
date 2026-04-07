import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const StateTransitionReadQuery =
`
mutation StateTransitionReadQuery($id: UUID!) {
  result: statetransitionById(id: $id) {
    ...StateTransitionLarge
  }
}


fragment StateTransitionLarge on StateTransitionGQLModel {
  ...StateTransition
  statemachine {
    ...StateMachineLink
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
  statemachine {
    ...StateMachineLink
  }
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

export const StateTransitionReadAsyncAction = createAsyncGraphQLAction(StateTransitionReadQuery)