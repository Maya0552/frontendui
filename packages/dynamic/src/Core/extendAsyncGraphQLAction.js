/**
 * Rozšíří existující AsyncAction o další middlewares.
 *
 * Usage:
 *   const Base = createAsyncGraphQLAction2(query, addItemsFromGraphQLResult)
 *   const Extended = extendAsyncGraphQLAction(Base, myMw1, myMw2)
 *
 * @param {Function} baseAsyncAction - AsyncAction z createAsyncGraphQLAction2
 * @param  {...Function} extraMiddlewares - další middlewares stejného tvaru: (result) => (dispatch,getState,next)=>...
 * @returns {Function} new AsyncAction
 */
export const extendAsyncGraphQLAction = (baseAsyncAction, ...extraMiddlewares) => {
    if (typeof baseAsyncAction !== "function") {
        throw new Error("extendAsyncGraphQLAction: baseAsyncAction must be a function (AsyncAction).");
    }

    extraMiddlewares.forEach((mw, i) => {
        if (typeof mw !== "function") {
            throw new Error(`extendAsyncGraphQLAction: middleware at index ${i} is not a function.`);
        }
    });

    const ExtendedAsyncAction = (vars, gqlClient) => async (dispatch, getState, next = (x) => x) => {
        // baseThunk dostane jako "next" chain z extra middlewares
        const extraChain = extraMiddlewares.reduceRight(
            (nextMiddleware, middleware) => {
                return async (result) => middleware(result)(dispatch, getState, nextMiddleware);
            },
            next
        );

        // zavoláme původní thunk a předáme mu extraChain jako next
        const baseThunk = baseAsyncAction(vars, gqlClient);
        return baseThunk(dispatch, getState, extraChain);
    };

    // zachovej metadata (a případně přidej info o rozšíření)
    ExtendedAsyncAction.__metadata = {
        ...(baseAsyncAction.__metadata || {}),
        extended: true,
    };

    return ExtendedAsyncAction;
};
