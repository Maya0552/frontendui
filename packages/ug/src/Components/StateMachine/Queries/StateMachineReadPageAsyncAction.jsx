import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const StateMachineReadPageQuery =
`
query StateMachineReadPageQuery($skip: Int, $limit: Int, $where: StateMachineWhereFilter) {
  result: statemachinePage(skip: $skip, limit: $limit, where: $where) {
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

export const StateMachineReadPageAsyncAction = createAsyncGraphQLAction(StateMachineReadPageQuery)