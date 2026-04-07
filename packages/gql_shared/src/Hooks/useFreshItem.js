/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"


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

export const useFreshItem = ({ id, ...queryVariables }, AsyncAction) => {
    const dispatch = useDispatch();
    const items = useSelector(state => state["items"]);

    if (!items) {
        throw Error(
            "Invalid store state: 'items' attribute is missing. Ensure the store state contains 'items' before using useFreshItem."
        );
    }

    const result = items[id];

    const [_state, _setState] = useState({
        resultPromise: null,
        errors: null,
        data: null,
        json: null,
        loading: false,
        done: false
    });

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted
        const fetchItem = async () => {
            _setState(prevState => ({
                ...prevState,
                loading: true,
                errors: null,
                done: false
            }));

            try {
                const dispatchResult = await dispatch(AsyncAction({ id, ...queryVariables }));
                const { data, errors } = dispatchResult;

                if (isMounted) {
                    _setState({
                        resultPromise: Promise.resolve(dispatchResult),
                        errors,
                        data,
                        json: dispatchResult,
                        loading: false,
                        done: true
                    });
                }
                return dispatchResult;
            } catch (error) {
                if (isMounted) {
                    _setState({
                        resultPromise: Promise.reject(error),
                        errors: error,
                        data: null,
                        json: null,
                        loading: false,
                        done: false
                    });
                }
                console.error("useFreshItem: Error fetching item", error);
            }
        };

        const resultPromise = fetchItem();
        _setState(prevState => ({
            ...prevState,
            resultPromise
        }));

        return () => {
            isMounted = false; // Cleanup on component unmount
        };
    }, [id, AsyncAction, dispatch]);

    return [result, _state.resultPromise, _state];
};
