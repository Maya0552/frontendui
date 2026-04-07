/**
 * Serialize GQL query and variables into single object
 * @param {string} querystring 
 * @param {object} query_variables 
 * @returns 
 */
export const createPayload = (querystring, query_variables) => {
    return {query: querystring, variables: query_variables}
}