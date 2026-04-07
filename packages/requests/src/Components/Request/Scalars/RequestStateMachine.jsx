import { AsyncComponent, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { StateReadAsyncAction, VerticalArcGraph } from "@hrbolek/uoisfrontend-ug"

export const RequestStateMachine = ({request}) => {
    return (<>
    {request?.state?.id && (
        <SimpleCardCapsule title={"Stavy"}>
            <AsyncComponent 
                asyncAction={StateReadAsyncAction} 
                queryVariables={{id: request?.state?.id}}
                propertyName="state"
            > 
                <State2StateMachine activeState={request?.state}/>
            </AsyncComponent>
        </SimpleCardCapsule>
    )}</>)
}

const State2StateMachine = ({state, activeState}) => {
    return (<>
        {/* {JSON.stringify(state.statemachine?.states)}
        {JSON.stringify(state.statemachine?.transitions)} */}
        {state?.statemachine&&
            <VerticalArcGraph statemachine={state.statemachine} activeNodeId={activeState?.id} />
        }
        
    </>)
}
{/* <AsyncComponent asyncAction={}>
                                <VerticalArcGraph statemachine={request?.}/>
                            </AsyncComponent> */}