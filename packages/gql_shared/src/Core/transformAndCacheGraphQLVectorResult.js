import { processVectorAttributeFromGraphQLResult } from "./processVectorAttributeFromGraphQLResult";

/**
 * Transforms a vector result from a GraphQL query, caches it using a specified cache ID, 
 * and processes it as a Redux vector attribute update.
 * 
 * This function works as a middleware-like processor to ensure that GraphQL responses 
 * are normalized and handled consistently, particularly for responses that include 
 * a single vector of results (e.g., a list of items).
 *
 * @param {string} cacheId - A UUID or unique identifier used to locate and cache the vector result.
 * @returns {Function} A function that processes the `jsonResult` from a GraphQL query.
 *
 * @throws {Error} If `cacheId` is not a string or is missing.
 *
 * @example
 * // Define the transformation and caching middleware
 * const transformAndCacheMiddleware = transformAndCacheGraphQLVectorResult("cache-id-1234");
 *
 * // Create an async action using this middleware
 * export const ExampleReadAsyncAction = createAsyncGraphQLAction(
 *   ExampleQuery,
 *   transformAndCacheMiddleware
 * );
 *
 * // Dispatch the async action
 * dispatch(ExampleReadAsyncAction);
 */
export const transformAndCacheGraphQLVectorResult = (cacheId) => (jsonResult) => (dispatch, getState, next) => {
    const data = jsonResult?.data;

    if (!data) {
        console.warn("transformAndCacheGraphQLVectorResult: No data found in jsonResult");
        return next(jsonResult);
    }

    let result = data?.result;

    if (!result && Object.keys(data).length === 1) {
        const singleKey = Object.keys(data)[0];
        result = data[singleKey];
    }

    if (!Array.isArray(result)) {
        console.warn("transformAndCacheGraphQLVectorResult: Result is not an array as expected");
        return next(jsonResult);
    }

    const proxyEntity = {
        data: {
            result: {
                id: cacheId,
                options: result,
            },
        },
    };

    return processVectorAttributeFromGraphQLResult("options")(proxyEntity)(dispatch, getState, next);
};