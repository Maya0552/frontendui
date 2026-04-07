import { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { useParams } from 'react-router'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ComponentSentinel, LeftColumn, MiddleColumn, LoadingSpinner, CreateDelayer } from "@hrbolek/uoisfrontend-shared"
import { GroupCategoryPageNavbar } from './GroupCategoryPageNavbar'
import { GroupCategoryReadAsyncAction } from '../Queries'
import { GroupCategoryEditableCard } from '../GroupCategoryEditableCard'

/**
 * A React component for rendering the "Group Category" page content.
 * 
 * This component organizes the page layout into a navigation bar, a left column, 
 * and a middle column. It includes an editable card for managing `groupcategory` 
 * data and displays the current `groupcategory` as a JSON string for debugging or reference.
 *
 * @function GroupCategoryPageContent
 * @param {Object} props - The properties for the `GroupCategoryPageContent` component.
 * @param {Object} props.groupcategory - The current data object for the group category to be displayed and edited.
 *   - Example: `{ name: "Category A", nameEn: "Category A (EN)" }`.
 * @param {Function} [props.onChange=(e) => null] - Callback function triggered when the `GroupCategoryEditableCard` 
 *   fields' values change. Receives an event object containing the updated data as `event.target.value`.
 * @param {Function} [props.onBlur=(e) => null] - Callback function triggered when the `GroupCategoryEditableCard` 
 *   fields lose focus. Receives an event object containing the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} The rendered layout for the "Group Category" page, including an editable card and JSON preview.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const [groupcategory, setGroupCategory] = useState({
 *     name: "Category A",
 *     nameEn: "Category A (EN)"
 *   });
 *
 *   const handleChange = (e) => {
 *     setGroupCategory(e.target.value);
 *   };
 *
 *   const handleBlur = (e) => {
 *     console.log("Field blurred with value:", e.target.value);
 *   };
 *
 *   return (
 *     <GroupCategoryPageContent
 *       groupcategory={groupcategory}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component integrates `GroupCategoryEditableCard` for dynamic form management.
 * - The `groupcategory` JSON is displayed for debugging or additional context.
 *
 * @see GroupCategoryEditableCard - The editable card used within this component.
 */
const GroupCategoryPageContent = ({
    groupcategory,
    onChange = (e) => null,
    onBlur = (e) => null,
}) => {
    return (
        <>
            <GroupCategoryPageNavbar groupcategory={groupcategory} />
            <Row>
                <LeftColumn>
                    
                </LeftColumn>
                <MiddleColumn>
                    <GroupCategoryEditableCard groupcategory={groupcategory} onChange={onChange} onBlur={onBlur} />
                    <br/>
                    {JSON.stringify(groupcategory)}
                </MiddleColumn>
            </Row>
        </>
    )
}


// const GroupCategoryPageContentLazy = createLazyComponent(GroupCategoryPageContent, "groupcategory", GroupCategoryReadAsyncAction)
/**
 * A React component for lazy-loading and managing "Group Category" page content with server synchronization.
 *
 * `GroupCategoryPageContentLazy` utilizes the `useAsyncAction` hook to fetch, update, and manage the state
 * of a `groupcategory` entity. It handles asynchronous server updates using debounced fetches and integrates
 * the `GroupCategoryPageContent` component for rendering.
 *
 * @function GroupCategoryPageContentLazy
 * @param {Object} props - The properties for the `GroupCategoryPageContentLazy` component.
 * @param {Object} props.groupcategory - The initial data object for the group category to be fetched and displayed.
 *   - Example: `{ id: "12345", name: "Category A", nameEn: "Category A (EN)" }`.
 *
 * @returns {JSX.Element} A lazily loaded "Group Category" page content with error handling, loading states, 
 * and dynamic rendering of the `GroupCategoryPageContent` component.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const initialGroupCategory = { id: "12345", name: "Category A", nameEn: "Category A (EN)" };
 *
 *   return <GroupCategoryPageContentLazy groupcategory={initialGroupCategory} />;
 * };
 *
 * @remarks
 * - This component fetches and synchronizes data with the server using the `GroupCategoryReadAsyncAction`.
 * - The `handleChange` and `handleBlur` methods debounce updates to prevent excessive server requests.
 * - The `GroupCategoryPageContent` component is used for rendering once data is successfully fetched.
 * - Handles loading and error states with `LoadingSpinner` and `ErrorEvent` components respectively.
 *
 * @see GroupCategoryPageContent - The primary content component rendered once data is fetched.
 * @see useAsyncAction - The hook used for managing server communication and state.
 * @see GroupCategoryReadAsyncAction - The asynchronous action used for fetching the group category data.
 */
const GroupCategoryPageContentLazy = ({groupcategory}) => {
    const { error, loading, entity, fetch } = useAsyncAction(GroupCategoryReadAsyncAction, groupcategory)
    const [delayer] = useState(() => CreateDelayer())

    const handleChange = async(e) => {
        // console.log("GroupCategoryPageContentLazy.handleChange.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupCategoryPageContentLazy.serverResponse", serverResponse)
    }
    const handleBlur = async(e) => {
        // console.log("GroupCategoryPageContentLazy.handleBlur.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupCategoryPageContentLazy.serverResponse", serverResponse)
    }

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorEvent errors={error} />}
        {entity && <GroupCategoryPageContent groupcategory={entity}  onChange={handleChange} onBlur={handleBlur} />}
    </>)
}

/**
 * A React component for editing a specific "Group Category" entity.
 *
 * The `GroupCategoryEditPage` component wraps the `GroupCategoryPageContentLazy` component
 * within a `ComponentSentinel` to conditionally render based on user permissions. It uses
 * the `id` parameter from the React Router URL to fetch and display the specific group category.
 *
 * @function GroupCategoryEditPage
 * @returns {JSX.Element} The edit page for the group category, conditionally rendered based on user permissions.
 *
 * @example
 * // Example usage in a React Router setup:
 * <Route path="/group/category/edit/:id" element={<GroupCategoryEditPage />} />
 *
 * @remarks
 * - The `ComponentSentinel` ensures that only users meeting the `meCondition` (e.g., their email contains "world") 
 *   can view the page. Otherwise, it renders null.
 * - The `GroupCategoryPageContentLazy` component is used to handle lazy loading, error states, and server synchronization.
 * - This component leverages the `useParams` hook from React Router to extract the `id` of the group category 
 *   from the URL.
 *
 * @see ComponentSentinel - A utility component for conditional rendering based on user permissions.
 * @see GroupCategoryPageContentLazy - A lazy-loading component for displaying group category details.
 */
export const GroupCategoryEditPage = () => {
    const { id } = useParams()
    const groupcategory = {id}
    return ( 
        <ComponentSentinel meCondition={me => me?.email?.includes("world")}>
            <GroupCategoryPageContentLazy groupcategory ={groupcategory} />
        </ComponentSentinel>
    )
}


