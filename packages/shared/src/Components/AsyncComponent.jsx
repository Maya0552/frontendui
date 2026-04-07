import { useEffect, useRef } from 'react'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler } from "./ErrorHandler"
import { LoadingSpinner } from "./LoadingSpinner"
import { ChildWrapper } from "../ComponentManagement"

/**
 * AsyncComponent
 *
 * A higher-order React component that handles asynchronous operations and provides the fetched data,
 * loading states, and error handling to its children. It simplifies integrating asynchronous logic
 * into UI components by managing the entire fetch lifecycle.
 *
 * @component
 * @param {Object} props - The properties for the AsyncComponent.
 * @param {React.ReactNode} props.children - The child components that will receive the fetched data as a prop.
 * @param {Function} props.asyncAction - The asynchronous function to be executed. Should return a promise that resolves to the fetched data.
 * @param {Object} props.queryVariables - The variables passed to the asynchronous function for fetching data.
 * @param {string} props.propertyName - The name of the prop under which the fetched data (`entity`) is passed to the children.
 * @param {number} [props.shouldFetch=0] - A numeric property that triggers re-fetching of data when incremented. 
 *                                         Each change in `shouldFetch` counts as a unique request and re-executes the fetch action.
 * @param {...Object} props - Additional props that are passed down to the `ChildWrapper` component.
 *
 * @example
 * // Usage Example
 * const MyComponent = () => {
 *     const asyncAction = async (variables) => {
 *         const response = await fetch('/api/data', { method: 'POST', body: JSON.stringify(variables) });
 *         return response.json();
 *     };
 *
 *     const [shouldFetch, setShouldFetch] = useState(0);
 *
 *     return (
 *         <>
 *             <button onClick={() => setShouldFetch(shouldFetch + 1)}>Reload Data</button>
 *             <AsyncComponent
 *                 asyncAction={asyncAction}
 *                 queryVariables={{ id: 1 }}
 *                 propertyName="data"
 *                 shouldFetch={shouldFetch}
 *             >
 *                 {(props) => <div>Data: {props.data}</div>}
 *             </AsyncComponent>
 *         </>
 *     );
 * };
 *
 * @returns {JSX.Element} A component that renders child components with the fetched data, while handling loading, error, and re-fetch states.
 */
export const AsyncComponent = ({
    children, asyncAction, queryVariables, propertyName, shouldFetch=0, 
    ...props
}) => {
    const { 
        loading,
        error,
        entity,
        fetch
    } = useAsyncAction(asyncAction, queryVariables, {deferred: true})
    
    useEffect(()=>{
        fetch(queryVariables)
    }, [shouldFetch])
    
    const childrenProps = {[propertyName]: entity}
    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner />}
        {!entity && <span className='alert-warning' role="alert">Nemám data</span>}
        {entity && <ChildWrapper {...childrenProps} {...props}>
            {children}
        </ChildWrapper>}
    </>)
}