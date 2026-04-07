/**
 * Builds a full URL by appending query parameters to a base URL.
 * If a query parameter's value is an array, each element is appended as a separate query parameter.
 *
 * @param {string} baseUrl - The base URL to which query parameters will be appended.
 * @param {Object} [queryParams={}] - An object representing query parameters.
 * @param {(string|number|Array<string|number>)} [queryParams.<key>] - The value for a query parameter. If it's an array, each element is added separately.
 * @returns {string} The full URL with query parameters appended.
 *
 * @example
 * const baseUrl = '/vvi/Vysledky/GetVysledkyListBody';
 * const params = { Uco: 633, categories: ['science', 'math'], Offset: 0 };
 * const fullUrl = buildUrlWithQueryParams(baseUrl, params);
 * // Example output: "http://yourdomain.com/vvi/Vysledky/GetVysledkyListBody?Uco=633&categories=science&categories=math&Offset=0"
 */
export const buildUrlWithQueryParams = (baseUrl, queryParams = {}) => {
    // Create a new URL instance. If baseUrl is not absolute, window.location.origin is used as the base.
    const url = new URL(baseUrl, window.location.origin);
  
    // Iterate over all keys in queryParams
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
  
      // If the value is an array, append each element separately
      if (Array.isArray(value)) {
        value.forEach(v => {
          url.searchParams.append(key, v);
        });
      } else {
        // Otherwise, set the parameter with the given value
        url.searchParams.set(key, value);
      }
    });
  
    return url.toString();
  };
  