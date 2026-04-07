import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

export const StateMachineLinkFragment = createQueryStrLazy(
`
fragment StateMachineLink on StateMachineGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`)


export const StateLinkFragment = createQueryStrLazy(
`
fragment StateLink on StateGQLModel {
    __typename
    id
    lastchange
    name
    nameEn
    order
}
`
)
  
export const StateTransitionLinkFragment = createQueryStrLazy(
`
fragment StateTransitionLink on StateTransitionGQLModel {
    __typename
    id
    lastchange
    name
    nameEn
    
}
`
)

export const StateTransitionMediumFragment = createQueryStrLazy(
`
fragment StateTransitionMedium on StateTransitionGQLModel {
    ...StateTransitionLink
    source { ...StateLink }
    target { ...StateLink }
    statemachine { ...StateMachineLink }
}
`, 
    StateTransitionLinkFragment, StateLinkFragment, StateMachineLinkFragment
)
        
export const StateMediumFragment = createQueryStrLazy(
`
fragment StateMedium on StateGQLModel {
    ...StateLink
    readerslistId
  	writerslistId
    statemachine { ...StateMachineLink }
    targets { ...StateTransitionLink }
    sources { ...StateTransitionLink }
}
`, StateMachineLinkFragment, StateLinkFragment, StateTransitionLinkFragment
)
  
    
export const StateMachineMediumFragment = createQueryStrLazy(
`
fragment StateMachineMedium on StateMachineGQLModel {
    ...StateMachineLink
    states { ...StateLink }
    transitions { ...StateTransitionLink }
}
`,
    StateMachineLinkFragment, StateLinkFragment, StateTransitionLinkFragment
)

export const StateMachineLargeFragment = createQueryStrLazy(
`
fragment StateMachineLarge on StateMachineGQLModel {
    ...StateMachineLink
    states { ...StateMedium }
    transitions { ...StateTransitionMedium }
}
`,
    StateMachineLinkFragment, StateMediumFragment, StateTransitionMediumFragment
)


export const StateLargeFragment = createQueryStrLazy(
    `
    fragment StateLarge on StateGQLModel {
        ...StateLink
        statemachine { ...StateMachineLarge }
        targets { ...StateTransitionMedium }
        sources { ...StateTransitionMedium }
    }
    `, 
        StateMachineLargeFragment, StateLinkFragment, StateTransitionMediumFragment
    )
    
        
    export const StateTransitionLargeFragment = createQueryStrLazy(
    `
    fragment StateTransitionLarge on StateTransitionGQLModel {
        ...StateTransitionLink
        source { ...StateMedium }
        target { ...StateMedium }
        statemachine { ...StateMachineLarge }
    }
    `, 
        StateMachineLargeFragment, StateMachineMediumFragment, StateTransitionLinkFragment
    )
        
    