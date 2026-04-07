import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateMachineLargeFragment, StateMachineLinkFragment, StateMediumFragment, StateTransitionMediumFragment } from "./StateMachineFragments";

const StateMachineReadQuery = createQueryStrLazy(
`
query StateMachineReadQuery($id: UUID!, $limit: Int) {
  result: statemachineById(id: $id) {
    ...StateMachineLink
    states(limit: $limit) { ...StateMedium }
    transitions(limit: $limit) { ...StateTransitionMedium }

  }
}
`,
    StateMachineLinkFragment, StateMediumFragment, StateTransitionMediumFragment)


export const StateMachineReadAsyncAction = createAsyncGraphQLAction(StateMachineReadQuery)