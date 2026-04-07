import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `states` attribute of an statemachine entity.
 *
 * This component checks if the `states` attribute exists on the `statemachine` object. If `states` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `states` array and
 * displays a placeholder message and a JSON representation for each item in the `states`.
 *
 * @component
 * @param {Object} props - The props for the StateMachineStatesAttribute component.
 * @param {Object} props.statemachine - The object representing the statemachine entity.
 * @param {Array} [props.statemachine.states] - An array of states items associated with the statemachine entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `states` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const statemachineEntity = { 
 *   states: [
 *     { id: 1, name: "State Item 1" }, 
 *     { id: 2, name: "State Item 2" }
 *   ] 
 * };
 *
 * <StateMachineStatesAttribute statemachine={statemachineEntity} />
 */
export const StateMachineStatesAttribute = ({statemachine}) => {
    const { states } = statemachine
    if (typeof states === 'undefined') return null
    return (
        <>
            {states.map(
                vector => <div vector={item.id}>
                    Probably {'<VectorMediumCard vector=\{vector\} />'} <br />
                    {JSON.stringify(vector)}
                </div>
            )}
        </>
    )
}

const StatesAttributeQuery = `
query StateMachineQueryRead($id: id, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: statemachineById(id: $id) {
        __typename
        id
        states(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
        }
    }
}
`

const StatesAttributeAsyncAction = createAsyncGraphQLAction(
    StatesAttributeQuery,
    processVectorAttributeFromGraphQLResult("states")
)

export const StateMachineStatesAttributeInifite = ({statemachine}) => { 
    const {states} = statemachine

    return (
        <InfiniteScroll 
            Visualiser={'VectorMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={StatesAttributeAsyncAction}
        />
    )
}