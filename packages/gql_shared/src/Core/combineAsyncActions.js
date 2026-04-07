/**
 * Combines multiple async actions into a single dispatchable action.
 * Each action in the chain receives the result of the previous action as its input.
 *
 * @param {...Function} actions - A list of async actions created by `createAsyncGraphQLAction2`.
 * Each action should accept `jsonData` as input and return a middleware-compatible function.
 *
 * @returns {Function} A single async action that executes the input actions sequentially.
 *
 * @example
 * const getPostsAction = createAsyncGraphQLAction2(query2, logMiddleware, transformMiddleware);
 * const getUserAndPostsAction = createAsyncGraphQLAction2(query, updateItemsFromGraphQLResult2, getPostsAction);
 *
 * const combinedAction = combineAsyncActions(getUserAndPostsAction, getPostsAction);
 * dispatch(combinedAction({ id: "12345" }));
 */
const combineAsyncActions = (...actions) => {
    return (initialData) => {
        return async (dispatch, getState, next = (result) => result) => {
            try {
                let currentData = initialData;

                for (const action of actions) {
                    // Dispatch each action sequentially
                    const middleware = action(currentData);
                    currentData = await middleware(dispatch, getState, (result) => result);
                }

                // Pass the final result to the next middleware
                return next(currentData);
            } catch (error) {
                console.error("combineAsyncActions: Error during execution", error);
                throw error;
            }
        };
    };
};
