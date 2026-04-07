import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { SemesterLargeCard } from "../Components/Semester/SemesterLargeCard"

const SemesterQueryRead = `
query SemesterQueryRead($id: id) {
    result: semesterById(id: $id) {
        __typename
        id
    }
}
`

/**
 * An async action for executing a GraphQL query to read semester entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `SemesterQueryRead` query.
 * It can be dispatched with query variables to fetch data related to semester entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the semester entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(SemesterReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
const SemesterReadAsyncAction = createAsyncGraphQLAction(SemesterQueryRead)

/**
 * A page content component for displaying detailed information about an semester entity.
 *
 * This component utilizes `SemesterLargeCard` to create a structured layout and displays 
 * the serialized representation of the `semester` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the SemesterPageContent component.
 * @param {Object} props.semester - The object representing the semester entity.
 * @param {string|number} props.semester.id - The unique identifier for the semester entity.
 * @param {string} props.semester.name - The name or label of the semester entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an semester entity.
 *
 * @example
 * // Example usage:
 * const semesterEntity = { id: 123, name: "Sample Entity" };
 * 
 * <SemesterPageContent semester={semesterEntity} />
 */
const SemesterPageContent = ({semester}) => {
    return (
        <SemesterLargeCard semester={semester}>
            Semester {JSON.stringify(semester)}
        </SemesterLargeCard>
    )
}

/**
 * A lazy-loading component for displaying content of an semester entity.
 *
 * This component is created using `createLazyComponent` and wraps `SemesterPageContent` to provide
 * automatic data fetching for the `semester` entity. It uses the `SemesterReadAsyncAction` to fetch
 * the entity data and dynamically injects it into the wrapped component as the `semester` prop.
 *
 * @constant
 * @type {React.Component}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {string|number} props.semester - The identifier of the semester entity to fetch and display.
 *
 * @returns {JSX.Element} A component that fetches the `semester` entity data and displays it
 * using `SemesterPageContent`, or shows loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const semesterId = "12345";
 *
 * <SemesterPageContentLazy semester={semesterId} />
 */
const SemesterPageContentLazy = createLazyComponent(SemesterPageContent, "semester", SemesterReadAsyncAction)

/**
 * A page component for displaying lazy-loaded content of an semester entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `semester` object, and passes it to the `SemesterPageContentLazy` component.
 * The `SemesterPageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the semester entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/semester/:id" element={<SemesterPage />} />
 *
 * // Navigating to "/semester/12345" will render the page for the semester entity with ID 12345.
 */
export const SemesterPage = () => {
    const {id} = useParams()
    const semester = {id}
    return <SemesterPageContentLazy semester={semester} />
}