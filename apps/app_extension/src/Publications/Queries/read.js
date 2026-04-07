/**
 * Vytvoří URL s query parametry zadanými jako JSON objekt.
 * Pokud je hodnota parametru pole, každý prvek se přidá zvlášť.
 *
 * @param {string} baseUrl - Základní URL (např. "/vvi/Vysledky/GetVysledkyListBody").
 * @param {object} params - Objekt s parametry, kde hodnoty mohou být scalární nebo pole.
 * @returns {string} - Upravená URL s query parametry.
 *
 * @example
 * const url = buildUrlWithQueryParams('/vvi/Vysledky/GetVysledkyListBody', {
 *   Uco: 633,
 *   Offset: 0,
 *   filter: ['active', 'new']
 * });
 * // Výsledek: "/vvi/Vysledky/GetVysledkyListBody?Uco=633&Offset=0&filter=active&filter=new"
 */
export const buildUrlWithQueryParams = (baseUrl, params = {}) => {
    // Vytvoříme URL objekt; pokud baseUrl není absolutní, použijeme window.location.origin
    const url = new URL(baseUrl, window.location.origin);
  
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Pokud je hodnota pole, přidáme každý prvek zvlášť
        value.forEach(item => {
          url.searchParams.append(key, item);
        });
      } else if (value !== undefined && value !== null) {
        // Pokud hodnota není pole a není null/undefined, nastavíme ji
        url.searchParams.set(key, value);
      }
    });
  
    return url.toString();
  };
  
export const doGet = (baseUrl, fetchParams={method: "GET"}) => async (params) => {
    const { queryParams } = params
    const extendedUrl = buildUrlWithQueryParams(baseUrl, queryParams)
    const _fetchParams = {fetchParams, ...params}
    const response = await fetch(extendedUrl, _fetchParams)

    return response
}

export const doPost = (baseUrl, fetchParams={method: "POST"}) => async (params) => {
    const _fetchParams = {fetchParams, ...params}
    const response = await fetch(baseUrl, _fetchParams)
    
    return response
}