## Basic Functions for Sending GraphQL Querires to Endpoint

#### authorizedFetch2

```js
/**
 * Wrapper function for `fetch` that provides an intermediary layer for server communication.
 * Includes options for custom headers, body modifications, and response handling.
 *
 * @param {string} path - The API endpoint path to fetch from. Ignored if `overridenPath` is provided.
 * @param {Object} [params={}] - Fetch parameters, including headers and body. These are merged with global fetch parameters.
 * @param {Object} [options={}] - Additional configuration options for the fetch request.
 * @param {boolean} [options.replaceUUID=false] - If true, replaces all instances of "UUID" in the request body with "ID".
 * @param {boolean} [options.replaceID=false] - If true, replaces all instances of ": ID" in the request body with ": UUID".
 * @param {Object} [options.globalFetchParams={}] - Default fetch parameters applied globally.
 * @param {string} [options.globalFetchParams.method='POST'] - HTTP method for the fetch request (e.g., 'GET', 'POST').
 * @param {Object} [options.globalFetchParams.headers={'Content-Type': 'application/json'}] - Default headers for the fetch request.
 * @param {string} [options.globalFetchParams.cache='no-cache'] - Cache behavior (e.g., 'no-cache', 'reload').
 * @param {string} [options.globalFetchParams.redirect='follow'] - Redirect behavior (e.g., 'manual', 'follow', 'error').
 * @param {string} [options.overridenPath='/api/gql'] - Path to use for the request instead of the provided `path`.
 *
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON response, or rejects with an error.
 *
 * @throws {Error} If the fetch response status is not in the 2xx range.
 * @throws {Error} If the response contains a redirect (302) and the `location` header is missing.
 *
 * @example
 * authorizedFetch2('/api/users', {
 *   headers: { Authorization: 'Bearer token' },
 *   body: JSON.stringify({ query: '{ users { id, name } }' })
 * }, {
 *   replaceUUID: true,
 *   overridenPath: '/api/custom'
 * }).then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
```

### createFetchQuery

```js
/**
 * Creates a fetch function for a given GraphQL query string. The resulting function
 * accepts query variables, constructs the request payload, and initiates the fetch request.
 *
 * @param {string} query - The GraphQL query string. Must be a valid, non-empty string.
 * @param {Object} [params={}] - Additional parameters to customize the fetch request.
 * @param {Object} [params.headers] - Custom headers to include in the fetch request. Can be used for authentication tokens.
 * @param {string} [params.method='POST'] - HTTP method for the request (defaults to POST).
 * @param {*} [params.body] - Custom body content (overwritten by the query payload).
 *
 * @returns {Function} A function that takes an object of query variables and returns a Promise from the fetch request.
 *
 * @throws {Error} If the `query` is not a valid non-empty string.
 *
 * @example
 * // Define a GraphQL query
 * const query = `
 *   query GetUser($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *       email
 *     }
 *   }
 * `;
 *
 * // Create a fetch function
 * const fetchUser = CreateFetchQuery(query, {
 *   headers: {
 *     Authorization: 'Bearer some-token'
 *   }
 * });
 *
 * // Use the fetch function with query variables
 * fetchUser({ id: '12345' })
 *   .then(response => console.log(response))
 *   .catch(err => console.error(err));
 */
```

### createAsyncGraphQLAction

```js
/**
 * Creates a dispatchable async action from a GraphQL query.
 * Supports chaining multiple middleware-like functions for post-fetch processing.
 * @function
 * @param {string} query - The GraphQL query string. Must be a valid, non-empty string.
 * @param {object|Function} [params=updateItemsFromGraphQLResult] - Additional parameters for the query (e.g., headers), 
 * or a middleware function. If it is a middleware function, it is added to the middleware chain.
 * @param {...Function} middlewares - Additional middleware functions to process the result.
 * Each middleware must be a function that returns a higher-order function `(result) => (dispatch, getState) => next(result)`.
 *
 * @see processVectorAttributeFromGraphQLResult
 * @see updateItemsFromGraphQLResult
 * 
 * @returns {Function} A dispatchable async action that processes the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query` is not a string.
 * @throws {Error} If any of the middlewares are not functions.
 * @throws {Error} If the `query_variables` provided to the resulting action are not a valid JSON object.
 *
 * @example
 * const exampleQuery = `
 *   query ExampleQuery($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *       groups {
 *          __typename
 *          id
 *          name
 *       }
 *     }
 *   }
 * `;
 *
  * // Create an async action
 * const fetchAction = createAsyncGraphQLAction(
 *   exampleQuery,
 *   processVectorAttributeFromGraphQLResult("groups"),
 *   updateItemsFromGraphQLResult
 * );
 *
 * // Dispatch the action with query variables
 * dispatch(fetchAction({ id: "12345" }));
 */
```

### processVectorAttributeFromGraphQLResult

```js
/**
 * Middleware-like function to process a specific vector attribute from a GraphQL query result.
 * Extracts the relevant data, identifies the vector attribute, and dispatches an action to update the attribute.
 *
 * @param {string} vectorname - The name of the vector attribute to extract and process.
 * @returns {Function} A function that takes the `jsonResult` and returns a middleware function.
 *
 * @throws {Error} If `vectorname` is not a string.
 * @throws {Error} If `jsonResult` is not a valid object.
 *
 * @example
 * // Define the vector processing middleware
 * const processVectorMiddleware = processVectorAttributeFromGraphQLResult("events");
 *
 * const query EmptyQueryRead($id: id) {
 *   result: emptyById(id: $id) {
 *      __typename
 *      id
 * }
 *
 * const EmptyReadAsyncAction = createAsyncGraphQLAction(EmptyQueryRead, processVectorMiddleware)
 * dispatch(EmptyReadAsyncAction)
 */
```

### hookGraphQLResult

```js
/**
 * Middleware function for processing GraphQL query results with a custom hook.
 *
 * This middleware allows you to pass a hook function that will be executed with
 * the GraphQL query result (`jsonResult`). The hook function can perform additional
 * processing or side effects based on the query result. After invoking the hook,
 * the middleware passes the result to the next middleware in the chain.
 *
 * @param {Function} hook - A custom hook function to process the GraphQL result.
 *                          The function must accept a single argument: `jsonResult`.
 * @throws {Error} Throws an error if the provided hook is not a function.
 * @returns {Function} A middleware function that processes the GraphQL result.
 *
 * @example
 * const exampleQuery = `
 *   query ExampleQuery($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
  * // Create an async action
 * const fetchAction = createAsyncGraphQLAction(
 *   exampleQuery,
 *   processVectorAttributeFromGraphQLResult("users"),
 *   updateItemsFromGraphQLResult,
 *   hookGraphQLResult(jsonResult => console.log(jsonResult))
 * );
 *
 * // Dispatch the action with query variables
 * dispatch(fetchAction({ id: "12345" }));
 */
```

### useFreshItem
```js
/**
 * A custom React hook to retrieve a fresh item from the Redux store and optionally fetch updated data using an asynchronous action.
 * 
 * @param {Object} queryVariables - An object containing the `id` of the item to fetch and other query variables.
 * @param {string} queryVariables.id - The unique identifier of the item to retrieve.
 * @param {Function} AsyncAction - An asynchronous Redux action that fetches updated data. It should return a Promise resolving to the data in JSON format.
 * 
 * @returns {[Object, Promise, Object]} A tuple containing:
 * - The current item from the Redux store (or `undefined` if it doesn't exist).
 * - A Promise representing the asynchronous fetch operation.
 * - The current state of the fetch operation, including:
 *   - `resultPromise`: The current Promise being processed.
 *   - `errors`: Any errors returned by the asynchronous action.
 *   - `data`: The fetched data from the action.
 *   - `json`: The full response object from the asynchronous action.
 *   - `loading`: A boolean indicating if the fetch operation is in progress.
 *   - `done`: A boolean indicating if the fetch operation has completed.
 * 
 * @throws {Error} If the Redux store's state does not contain an `items` attribute.
 * 
 * @example
 * // Usage with a Redux asynchronous action
 * const AsyncAction = (variables) => async (dispatch) => {
 *     const response = await fetch('/api/items', { method: 'POST', body: JSON.stringify(variables) });
 *     const json = await response.json();
 *     return json;
 * };
 * 
 * const MyComponent = () => {
 *     const [item, resultPromise, state] = useFreshItem({ id: '123', filter: 'active' }, AsyncAction);
 * 
 *     useEffect(() => {
 *         resultPromise.then(() => {
 *             console.log("Fetch complete:", state);
 *         });
 *     }, [resultPromise]);
 * 
 *     return (
 *         <div>
 *             {state.loading && <p>Loading...</p>}
 *             {state.errors && <p>Error: {state.errors}</p>}
 *             {item && <p>Item: {item.name}</p>}
 *         </div>
 *     );
 * };
 */
```