import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { AdmissionLargeCard } from "../Components/Admission/AdmissionLargeCard"
import { AdmissionPageNavbar } from "./AdmissionPageNavbar"

const AdmissionQueryRead = `
query AdmissionQueryRead($id: id) {
    result: admissionById(id: $id) {
        __typename
        id
    }
}
`

/**
 * An async action for executing a GraphQL query to read admission entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `AdmissionQueryRead` query.
 * It can be dispatched with query variables to fetch data related to admission entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the admission entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(AdmissionReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
const AdmissionReadAsyncAction = createAsyncGraphQLAction(AdmissionQueryRead)

/**
 * A page content component for displaying detailed information about an admission entity.
 *
 * This component utilizes `AdmissionLargeCard` to create a structured layout and displays 
 * the serialized representation of the `admission` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the AdmissionPageContent component.
 * @param {Object} props.admission - The object representing the admission entity.
 * @param {string|number} props.admission.id - The unique identifier for the admission entity.
 * @param {string} props.admission.name - The name or label of the admission entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an admission entity.
 *
 * @example
 * // Example usage:
 * const admissionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <AdmissionPageContent admission={admissionEntity} />
 */
const AdmissionPageContent = ({admission}) => {
    return (
        <>
            <AdmissionPageNavbar admission={admission} />
            <AdmissionLargeCard admission={admission}>
                Admission {JSON.stringify(admission)}
            </AdmissionLargeCard>
        </>
    )
}

/**
 * A lazy-loading component for displaying content of an admission entity.
 *
 * This component is created using `createLazyComponent` and wraps `AdmissionPageContent` to provide
 * automatic data fetching for the `admission` entity. It uses the `AdmissionReadAsyncAction` to fetch
 * the entity data and dynamically injects it into the wrapped component as the `admission` prop.
 *
 * @constant
 * @type {React.Component}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {string|number} props.admission - The identifier of the admission entity to fetch and display.
 *
 * @returns {JSX.Element} A component that fetches the `admission` entity data and displays it
 * using `AdmissionPageContent`, or shows loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const admissionId = "12345";
 *
 * <AdmissionPageContentLazy admission={admissionId} />
 */
const AdmissionPageContentLazy = createLazyComponent(AdmissionPageContent, "admission", AdmissionReadAsyncAction)

/**
 * A page component for displaying lazy-loaded content of an admission entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `admission` object, and passes it to the `AdmissionPageContentLazy` component.
 * The `AdmissionPageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the admission entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/admission/:id" element={<AdmissionPage />} />
 *
 * // Navigating to "/admission/12345" will render the page for the admission entity with ID 12345.
 */
export const AdmissionPage = () => {
    const {id} = useParams()
    const admission = {id}
    return <AdmissionPageContentLazy admission={admission} />
}