import { createAsyncGraphQLAction, createQueryStrLazy, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared";
import { StateMachineLargeFragment, StateMachineLinkFragment } from "@hrbolek/uoisfrontend-ug";
import { RequestTypeReadPage } from "./RequestTypeFragments";


/**
 * An asynchronous action to execute a GraphQL query for reading request type entities.
 *
 * This action is created using `createAsyncGraphQLAction` with the predefined `RequestTypePageRead` query.
 * It fetches paginated data for request type entities from the GraphQL API, using optional filter, skip, and limit parameters.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {number} [query_variables.skip] - The number of records to skip (used for pagination).
 * @param {number} [query_variables.limit] - The maximum number of records to fetch (used for pagination).
 * @param {Object} [query_variables.where] - Filters to apply to the query, matching the `RequestTypeInputFilter` type in the schema.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query and returns the fetched data.
 *
 * @throws {Error} If `query_variables` is not provided or is invalid.
 *
 * @example
 * // Fetch the first 10 request types with a name filter
 * const queryVariables = {
 *   skip: 0,
 *   limit: 10,
 *   where: { name: "TypeName" },
 * };
 *
 * dispatch(RequestTypePageReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched request types:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching request types:", error);
 *   });
 */

export const RequestTypeReadPageAsyncAction = createAsyncGraphQLAction(
    RequestTypeReadPage,
    updateItemsFromGraphQLResult,
    (jsonResult) => (dispatch, getState, next) => {
        const requests = jsonResult?.data?.result || [];
        return requests;
    }  
);
