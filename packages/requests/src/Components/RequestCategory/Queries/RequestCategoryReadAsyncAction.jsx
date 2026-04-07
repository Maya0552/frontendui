import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const RequestCategoryQueryRead = `
query RequestCategoryQueryRead($id: UUID!) {
    result: requestCategoryById(id: $id) {
        __typename
        id
        ...RequestCategory
    }
}

fragment RequestCategory on RequestCategoryGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  requestTypes {
    ...RequestTypeLink
  }
}

fragment RequestTypeLink on RequestTypeGQLModel {
  __typename
  id
  name
}
`;

/**
 * An async action for executing a GraphQL query to read requestcategory entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `RequestCategoryQueryRead` query.
 * It can be dispatched with query variables to fetch data related to requestcategory entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the requestcategory entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(RequestCategoryReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const RequestCategoryReadAsyncAction = createAsyncGraphQLAction(RequestCategoryQueryRead);
