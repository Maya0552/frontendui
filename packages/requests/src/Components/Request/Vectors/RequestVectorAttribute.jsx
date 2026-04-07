import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"

/**
 * A component for displaying the `vector` attribute of an request entity.
 *
 * This component checks if the `vector` attribute exists on the `request` object. If `vector` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `vector` array and
 * displays a placeholder message and a JSON representation for each item in the `vector`.
 *
 * @component
 * @param {Object} props - The props for the RequestVectorAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {Array} [props.request.vector] - An array of vector items associated with the request entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `vector` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { 
 *   vector: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 *
 * <RequestVectorAttribute request={requestEntity} />
 */
export const RequestVectorAttribute = ({request}) => {
    const {vector} = request
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
query RequestQueryRead($id: id, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: requestById(id: $id) {
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

export const RequestVectorAttributeInifite = ({request}) => { 
    const {vector} = request

    return (
        <InfiniteScroll 
            Visualiser={'VectorMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={VectorAttributeAsyncAction}
        />
    )
}