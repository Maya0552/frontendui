import { useState } from "react"
import { useSelector } from "react-redux";

import { createAsyncGraphQLAction, useAsyncAction, useAsyncClick } from "@hrbolek/uoisfrontend-gql-shared"
import { AsyncClickHandler, ButtonWithDialog, Input, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { ErrorHandler } from "@hrbolek/uoisfrontend-shared"
import { useEffect } from "react";

const StateReadQuery = 
`
query StateReadQuery($id: UUID!) {
  result: stateById(id: $id)  {
  	__typename
    id  
    name
    order
    targets {
      __typename
      id
      name
      target {
        id
        name
        order
      }
    }
  } 
}
`

const StateReadAsyncAction = createAsyncGraphQLAction(StateReadQuery)


const RequestUseTransitionMutation =
`
mutation RequestUseTransition($id: UUID!, $lastchange: DateTime!, $history_message: String!, $transition_id: UUID!) { 
	formRequestUseTransition(request: {id: $id, lastchange: $lastchange, historyMessage: $history_message transitionId: $transition_id}){
    __typename
    ...on RequestGQLModelUpdateError {
      Entity {
        ...RequestLarge
      }
      msg
      failed
      input
    }
    ...RequestLarge
  }
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

fragment RequestLarge on RequestGQLModel {
  __typename
  id
  name
  lastchange
  histories {
    __typename
    id
    request { ...RequestLink }
    form { ...FormLarge }
    name
    changedby { ...UserLink }
    createdby { ...UserLink }
    state { id name }
    created
    lastchange

  }
  state { id name targets {id name target { id name }}}
  createdby { ...UserLink }
  changedby { ...UserLink }  
}

fragment UserLink on UserGQLModel {
  __typename
  id
  fullname
}

fragment RequestLink on RequestGQLModel {
  __typename
  id
  name
}
`

const RequestUseTransitionAsyncAction = createAsyncGraphQLAction(
    RequestUseTransitionMutation
)

/**
 * A component for displaying the `state` attribute of an request entity.
 *
 * This component checks if the `state` attribute exists on the `request` object. If `state` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `state` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestStateAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {*} [props.request.state] - The state attribute of the request entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `state` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { state: { id: 1, name: "Sample State" } };
 *
 * <RequestStateAttribute request={requestEntity} />
 */
export const RequestStateAttribute = ({request}) => {
    const {state = {id: "bdf5169a-c2f1-4bc2-923b-1eefd941e261"}} = request
    const state_id = state.id
    if (typeof state === 'undefined') return null
    
    // const [_state] = useFreshItem(state, StateReadAsyncAction)
    const { entity: _state, error, loading, fetch } = useAsyncAction(StateReadAsyncAction, state, {deferred: true})
    useEffect(() => {
        fetch(state)
    }, [state_id])

    if (error) return <ErrorHandler errors={error} />
    if (loading) return <LoadingSpinner text="Nahrávám stavy"/>
    if (_state?.targets?.length === 0) {
        return (
            <>
                <span className="btn btn-outline-danger form-control">Toto je konečný stav</span>
            </>
        )
    }
    return (
        <>
            {/* <AsyncComponent>

            </AsyncComponent> */}
            {(_state?.targets || []).map(
                transition => {
                    const className = ((transition?.target?.order || 0) > (_state?.order || -1))?"btn btn-lg btn-outline-success" :"btn btn-lg btn-outline-danger" 
                    return (
                        <RequestTransitionButton 
                            key={transition.id} 
                            className={className}
                            params={{
                                id: request.id,
                                lastchange: request.lastchange,
                                history_message: "",
                                transition_id: transition.id
                            }}
                        >
                            {transition?.name} ({transition?.target?.name})
                        </RequestTransitionButton>
                        // <span key={transition.id} className="btn btn-lg btn-outline-success">{transition?.name} ({transition?.target?.name})</span>
                    )
                }
            )}
            {/* <br/>Probably {'<StateMediumCard state=\{state\} />'} <br />
            {JSON.stringify(_state)} */}
        </>
    )
}


export const RequestTransitionButton_ = ({request, transition, ...props}) => {
    const [mutationParams, setMutationParams] = useState({
        id: request.id,
        lastchange: request.lastchange,
        history_message: "",
        transition_id: transition.id
    })

    useEffect(() => {
        setMutationParams(oldState => ({
            ...oldState, 
            lastchange: request.lastchange,
            transition_id: transition.id
        }))
    }, [request, transition])

    const onChange = (e) => {
        const newValue = e.target.value
        const attributeName = e.target.id
        setMutationParams(oldState => ({...oldState, [attributeName]: newValue}))
    }

    const onClick = () => {
        fetch(mutationParams)
    }    

    const {loading, error, fetch} = useAsyncAction(
        RequestUseTransitionAsyncAction, 
        mutationParams, 
        {deferred: true}
    )
    
    return (
        <>
            {loading && <LoadingSpinner text="Ukládám" />}
            {error && <ErrorHandler errors={error} />}
            <ButtonWithDialog 
                onClick={onClick} 
                buttonLabel={`${transition?.name} (${transition?.target?.name})`} 
                dialogTitle={"Potvrďte akci a napište zprávu"} {...props} 
            >
                <input id="history_message" className="form-control" defaultValue={""} onChange={onChange} onBlur={onChange}/>
            </ButtonWithDialog>
        </>
    )
}

export const RequestTransitionButton = ({children, params, onDone=()=>null, ...props}) => {
    const { error, loading, fetch, entity } = useAsyncAction(RequestUseTransitionAsyncAction, params, { deferred: true });
    const handleClick = async (_params = {}) => {
        const fetchParams = { ...params, ..._params };
        const freshEmpty = await fetch(fetchParams);
        onDone(freshEmpty); // Pass the result to the external callback
    };

    //AsyncClickHandler
    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={"Ukládám"} />}

        <ButtonWithDialog 
            buttonLabel={children} 
            dialogTitle="Vložit zprávu" 
            onClick={handleClick}
            {...props} 
            params={params}
        >
            <Input id="history_message" label="Veřejná zpráva" className="form-control" defaultValue={""} />
            {/* <input id="history_message" className="form-control" defaultValue={""} /> */}

        </ButtonWithDialog>
    </>);
}

export const RequestCurrentState = ({request}) => {
    // const {state = {id: "bdf5169a-c2f1-4bc2-923b-1eefd941e261"}} = request
    const {state } = request
    if (typeof state === 'undefined') return null
    const items = useSelector((state) => state["items"]);
    const _state = items[state.id]
    if (_state) {
        return (
            // <span className="btn btn-lg btn-outline-secondary form-control">Stav {_state?.name}</span>
            <span>Stav {_state?.name}</span>
        )
    }
}