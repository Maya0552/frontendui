import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, transformAndCacheGraphQLVectorResult } from "@hrbolek/uoisfrontend-gql-shared"

const GroupTypeReadPageQuery = 
`
query GroupTypeReadPageQuery($skip: Int, $limit: Int, $where: GroupTypeInputWhereFilter, $orderby: String) {
  result: groupTypePage(skip: $skip, limit: $limit, where: $where, orderby: $orderby) {
    ...GroupTypeMedium
  }
}

fragment GroupTypeMedium on GroupTypeGQLModel {
  __typename
  id
  name
  nameEn
}
`
export const GroupTypeReadPageAsyncActionCacheId = "d44693b5-5a24-4f6e-9a34-f9154f7c53bc" //crypto.randomUUID()

/**
 * Asynchronous Redux action for fetching a paginated list of GroupType entities.
 * 
 * This action executes the `GroupTypeReadPageQuery` GraphQL query and processes its result
 * using `transformAndCacheGraphQLVectorResult`, ensuring the vector of results is cached
 * and normalized into the Redux store.
 *
 * The query fetches GroupType entities with support for filtering, pagination, and sorting.
 *
 * @type {AsyncGraphQLAction}
 * @param {Object} variables - The variables for the GraphQL query.
 * @param {number} [variables.skip=0] - The number of items to skip (for pagination).
 * @param {number} [variables.limit=10] - The maximum number of items to fetch.
 * @param {Object} [variables.where] - Filters to apply to the query.
 * @param {string} [variables.orderby] - The field and direction for sorting.
 *
 * @returns {Promise} A promise that resolves when the query is completed.
 * 
 * @example
 * // Dispatching the action to fetch group types
 * dispatch(GroupTypeReadPageAsyncAction({
 *     skip: 0,
 *     limit: 20,
 *     where: { name: "ExampleGroup" },
 *     orderby: "name ASC",
 * }));
 *
 * @see {@link transformAndCacheGraphQLVectorResult} for processing details.
 */
export const GroupTypeReadPageAsyncAction = createAsyncGraphQLAction(
    GroupTypeReadPageQuery,
    transformAndCacheGraphQLVectorResult(GroupTypeReadPageAsyncActionCacheId)
);
