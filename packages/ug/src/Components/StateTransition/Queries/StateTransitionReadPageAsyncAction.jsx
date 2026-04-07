import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const StateTransitionReadPageQuery =
`
query StateTransitionReadPageQuery($skip: Int, $limit: Int, $where: StateTransitionWhereFilter) {
  result: statetransitionPage(skip: $skip, limit: $limit, where: $where) {
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

export const StateTransitionReadPageAsyncAction = createAsyncGraphQLAction(StateTransitionReadPageQuery)