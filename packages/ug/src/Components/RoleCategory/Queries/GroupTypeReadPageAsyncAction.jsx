import { createAsyncGraphQLAction, transformAndCacheGraphQLVectorResult } from "@hrbolek/uoisfrontend-gql-shared"
import { RoleCategoryReadPageQuery } from "./RoleCategoryFragments";

export const RoleCategoryReadPageAsyncActionCacheId = "cc0cfa5f-5474-4307-904d-1099367974f9" //crypto.randomUUID()

/**
 * Asynchronous Redux action for fetching a paginated list of RoleCategory entities.
 * 
 * This action executes the `RoleCategoryReadPageQuery` GraphQL query and processes its result
 * using `transformAndCacheGraphQLVectorResult`, ensuring the vector of results is cached
 * and normalized into the Redux store.
 *
 * The query fetches RoleCategory entities with support for filtering, pagination, and sorting.
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
 * dispatch(RoleCategoryReadPageAsyncAction({
 *     skip: 0,
 *     limit: 20,
 *     where: { name: "ExampleGroup" },
 *     orderby: "name ASC",
 * }));
 *
 * @see {@link transformAndCacheGraphQLVectorResult} for processing details.
 */
export const RoleCategoryReadPageAsyncAction = createAsyncGraphQLAction(
    RoleCategoryReadPageQuery,
    transformAndCacheGraphQLVectorResult(RoleCategoryReadPageAsyncActionCacheId)
);
