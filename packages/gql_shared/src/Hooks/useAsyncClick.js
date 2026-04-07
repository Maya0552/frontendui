import { useAsyncAction } from "./useAsyncAction";

/**
 * useAsyncClick
 *
 * A custom hook to handle click-based asynchronous actions with state management.
 *
 * @param {Function} asyncAction - A Redux thunk or async action to be executed on click.
 * @param {Object} defaultParams - Default parameters for the async action.
 * @param {Function} [onClick] - Optional callback triggered after the async action resolves.
 *
 * @returns {Object} - An object containing:
 *   - `error`: The error state from the last fetch.
 *   - `loading`: Whether a fetch operation is in progress.
 *   - `handleClick`: A function to trigger the async action with optional parameters.
 *   - `fetch`: The fetch function from `useAsyncAction`.
 */
export const useAsyncClick = (asyncAction, defaultParams, onClick) => {
    const { error, loading, fetch, entity } = useAsyncAction(asyncAction, defaultParams, { deferred: true });

    const handleClick = async (params = {}) => {
        try {
            const fetchParams = { ...defaultParams, ...params };
            const entity = await fetch(fetchParams);
            console.log("useAsyncClick.handleClick.result", entity)
            if (onClick) {
                onClick(entity); // Pass the result to the external callback
            }
        } catch (err) {
            console.error('useAsyncClick: Error during fetch', err);
            // Optionally handle errors here or let the consuming component handle them
        }
    };

    return {
        error,
        loading,
        handleClick,
        fetch,
    };
};
