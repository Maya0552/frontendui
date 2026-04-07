import React from "react";

import { useAsyncAction, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared";
import { LoadingSpinner } from "../Components";
import { ErrorHandler } from "../Components/ErrorHandler";





/**
 * Higher-order function to create a lazy-loading component that fetches an entity using a custom hook.
 *
 * This function wraps a given component (`WrappedComponent`) and dynamically fetches the specified
 * entity (`entityName`) using an asynchronous Redux action (`asyncAction`). It manages loading, error,
 * and success states, and injects the fetched entity into the wrapped component as a prop.
 *
 * @function
 * @param {React.ComponentType} WrappedComponent - The component that will display the fetched entity.
 * @param {string} entityName - The name of the prop representing the entity to be fetched.
 * @param {Function} asyncAction - The asynchronous Redux action used to fetch the entity data.
 *
 * @returns {React.ComponentType} A lazy-loading component that handles the fetching of the entity
 * and passes it to the wrapped component.
 *
 * @example
 * // Example usage:
 * const MyComponent = ({ user }) => <div>User Name: {user.name}</div>;
 * 
 * const exampleQuery = `
 *   query ExampleQuery($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *       groups {
 *          __typename
 *          id
 *          name
 *       }
 *     }
 *   }
 * `;
 *
  * // Create an async action
 * const asyncFetchUser = createAsyncGraphQLAction(
 *   exampleQuery,
 *   processVectorAttributeFromGraphQLResult("groups"),
 *   updateItemsFromGraphQLResult
 * );
 * 
 * const LazyUserComponent = createLazyComponent(MyComponent, "user", asyncFetchUser);
 * 
 * <LazyUserComponent user="123" />
 */
export const createLazyComponent = (WrappedComponent, entityName, asyncAction) => {
    function LazyComponent(props) {
        const entityValue = props[entityName];
        // const [result, promise, state] = useFreshItem(entityValue, asyncAction);
        const state = useAsyncAction(asyncAction, entityValue)
        const { entity: result, loading, error } = state
        // console.log("LazyComponent.useAction got state", state)

        if (result) {
            const wrappedProps = {
                ...props,
                [entityName]: result,
            };

            return (
                <>  
                    {/* {JSON.stringify(result)} */}
                    <WrappedComponent {...wrappedProps} />
                    {error && <ErrorHandler errors={error} />}
                    {loading && <LoadingSpinner text="Aktualizuji..." />}
                </>
            );
        }

        if (error) {
            return <ErrorHandler errors={error} />;
        }

        if (loading) {
            return <LoadingSpinner text="Nahrávám..." />;
        }

        return (
            <div>
                <h2>Nenalezeno</h2>
                <p>Data not found or unknown issue occurred.</p>
            </div>
        );
    }

    LazyComponent.displayName = `Lazy${entityName}Component`;
    return LazyComponent;
};
