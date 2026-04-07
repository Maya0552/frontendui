import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";

const RequestQueryRead = `
query RequestQueryRead($id: UUID!) {
    result: requestById(id: $id) {
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
  form { ...FormLarge }
  histories {
    __typename
    id
    request { ...RequestLink }
    form { ...FormLarge }
    name
    state { id name }
    changedby { ...UserLink }
    createdby { ...UserLink }
    created
    lastchange

  }
  state { id name }
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
`;
/**
 * An async action for executing a GraphQL query to read request entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `RequestQueryRead` query.
 * It can be dispatched with query variables to fetch data related to request entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the request entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(RequestReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const RequestReadAsyncAction = createAsyncGraphQLAction(RequestQueryRead);
