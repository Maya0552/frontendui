import { useEffect } from 'react'
import { useParams, useNavigate } from "react-router"

import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { RequestReadAsyncAction } from "../Queries/RequestReadAsyncAction"
import { ErrorHandler, LoadingSpinner } from '@hrbolek/uoisfrontend-shared'
import { RequestCreationWizard } from '../RequestCreationWizard'


/**
 * A page content component for displaying detailed information about an request entity.
 *
 * This component utilizes `RequestLargeCard` to create a structured layout and displays 
 * the serialized representation of the `request` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the RequestCreatePageContent component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an request entity.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestCreatePageContent request={requestEntity} />
 */
const RequestCreatePageContent = ({request}) => {
    return (<>
        {/* hey */}
        <RequestCreationWizard request={request} />
    </>)
}

/**
 * A lazy-loading component for displaying content of an request entity.
 *
 * This component wraps `RequestCreatePageContent` to provide
 * automatic data fetching for the `request` entity. It uses the `RequestReadAsyncAction` to fetch
 * the entity data and dynamically injects it into the wrapped component as the `request` prop.
 *
 * @constant
 * @type {React.Component}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {string|number} props.request - The identifier of the request entity to fetch and display.
 *
 * @returns {JSX.Element} A component that fetches the `request` entity data and displays it
 * using `RequestCreatePageContent`, or shows loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const requestId = "12345";
 *
 * <RequestCreatePageContentLazy request={requestId} />
 */
const RequestCreatePageContentLazy = ({request}) => {
    const {
        loading,
        error,
        entity
    } = useAsyncAction(RequestReadAsyncAction, request)

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}

        {/* it is a wizard, do not stop its visualisation  */}
        {/* {!entity && !loading && <span>Nenalezeno</span>} */}

        {!entity && <RequestCreatePageContent request={request} />}
        {entity && <RequestCreatePageContent request={entity} />}
    </>)
}

/**
 * A page component for displaying lazy-loaded content of an request entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `request` object, and passes it to the `RequestCreatePageContentLazy` component.
 * The `RequestCreatePageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the request entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/request/:id" element={<RequestCreatePage />} />
 *
 * // Navigating to "/request/12345" will render the page for the request entity with ID 12345.
 */
export const RequestCreatePage = () => {
    const request = useParams()
    const navigate = useNavigate();
    useEffect(()=>{
        if (!request?.id) {
            const newid = crypto.randomUUID()
            // navigate(`./wizard/${newid}`)
            navigate(`/requests/request/wizard/${newid}`)
            return
        }
    }, [])
    if (!request?.id) return null
    return <RequestCreatePageContentLazy request={request} />
    // return <>{JSON.stringify(request)}</>
}