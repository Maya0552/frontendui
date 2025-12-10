import { createGraphQLClient } from "./gqlClient";

const client = createGraphQLClient({ endpoint: "/gql" });
// nebo injektovat endpoint zvenku

export const createFetchQuery = (graphQLQuery, defaultParams = {}) => {
    return async (variables) => {
        const mergedVars = { ...defaultParams, ...variables };
        return client.request({ query: graphQLQuery, variables: mergedVars });
    };
};


export const createAsyncGraphQLAction2 = (query, params, ...middlewares) => {
    const AsyncAction = (vars) => async (dispatch, getState) => {
        const data = await client.request({ query, variables: { ...params, ...vars } });
        // tady můžeš volat svoje middlewary / normalizaci
        // updateItemsFromGraphQLResult(data)(dispatch, getState, () => data)
        return data;
    };

    return AsyncAction;
};
