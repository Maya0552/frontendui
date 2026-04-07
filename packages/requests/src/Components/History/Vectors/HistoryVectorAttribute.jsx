import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `vector` attribute of an history entity.
 *
 * This component checks if the `vector` attribute exists on the `history` object. If `vector` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `vector` array and
 * displays a placeholder message and a JSON representation for each item in the `vector`.
 *
 * @component
 * @param {Object} props - The props for the HistoryVectorAttribute component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {Array} [props.history.vector] - An array of vector items associated with the history entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `vector` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const historyEntity = { 
 *   vector: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 *
 * <HistoryVectorAttribute history={historyEntity} />
 */
export const HistoryVectorAttribute = ({history}) => {
    const {vector} = history
    if (typeof vector === 'undefined') return null
    return (
        <>
            {vector.map(
                item => <div key={item.id}>
                    Probably {'<VectorMediumCard vector=\{item\} />'} <br />
                    {JSON.stringify(item)}
                </div>
            )}
        </>
    )
}

const VectorAttributeQuery = `
query HistoryQueryRead($id: id, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: historyById(id: $id) {
        __typename
        id
        vector(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
        }
    }
}
`

const VectorAttributeAsyncAction = createAsyncGraphQLAction(
    VectorAttributeQuery,
    processVectorAttributeFromGraphQLResult("vector")
)

export const HistoryVectorAttributeInifite = ({history}) => { 
    const {vector} = history

    return (
        <InfiniteScroll 
            Visualiser={'VectorMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={VectorAttributeAsyncAction}
        />
    )
}