export const specialFetch = (url, params) => {
    const {
        method='POST',
        queryParams
    } = params
    return fetch(url, params)
}