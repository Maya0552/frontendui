import { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { useParams } from 'react-router'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ComponentSentinel, LeftColumn, MiddleColumn, LoadingSpinner, CreateDelayer } from "@hrbolek/uoisfrontend-shared"
import { GroupPageNavbar } from './GroupPageNavbar'
import { GroupReadAsyncAction } from '../Queries'
import { GroupEditableCard } from '../GroupEditableCard'

/**
 * A React component for rendering the "Group " page content.
 * 
 * This component organizes the page layout into a navigation bar, a left column, 
 * and a middle column. It includes an editable card for managing `group` 
 * data and displays the current `group` as a JSON string for debugging or reference.
 *
 * @function GroupPageContent
 * @param {Object} props - The properties for the `GroupPageContent` component.
 * @param {Object} props.group - The current data object for the group  to be displayed and edited.
 *   - Example: `{ name: " A", nameEn: " A (EN)" }`.
 * @param {Function} [props.onChange=(e) => null] - Callback function triggered when the `GroupEditableCard` 
 *   fields' values change. Receives an event object containing the updated data as `event.target.value`.
 * @param {Function} [props.onBlur=(e) => null] - Callback function triggered when the `GroupEditableCard` 
 *   fields lose focus. Receives an event object containing the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} The rendered layout for the "Group " page, including an editable card and JSON preview.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const [group, setGroup] = useState({
 *     name: " A",
 *     nameEn: " A (EN)"
 *   });
 *
 *   const handleChange = (e) => {
 *     setGroup(e.target.value);
 *   };
 *
 *   const handleBlur = (e) => {
 *     console.log("Field blurred with value:", e.target.value);
 *   };
 *
 *   return (
 *     <GroupPageContent
 *       group={group}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component integrates `GroupEditableCard` for dynamic form management.
 * - The `group` JSON is displayed for debugging or additional context.
 *
 * @see GroupEditableCard - The editable card used within this component.
 */
const GroupPageContent = ({
    group,
    onChange = (e) => null,
    onBlur = (e) => null,
}) => {
    return (
        <>
            <GroupPageNavbar group={group} />
            <Row>
                <LeftColumn>
                    
                </LeftColumn>
                <MiddleColumn>
                    <GroupEditableCard group={group} onChange={onChange} onBlur={onBlur} />
                    <br/>
                    {JSON.stringify(group)}
                </MiddleColumn>
            </Row>
        </>
    )
}


// const GroupPageContentLazy = createLazyComponent(GroupPageContent, "group", GroupReadAsyncAction)
/**
 * A React component for lazy-loading and managing "Group " page content with server synchronization.
 *
 * `GroupPageContentLazy` utilizes the `useAsyncAction` hook to fetch, update, and manage the state
 * of a `group` entity. It handles asynchronous server updates using debounced fetches and integrates
 * the `GroupPageContent` component for rendering.
 *
 * @function GroupPageContentLazy
 * @param {Object} props - The properties for the `GroupPageContentLazy` component.
 * @param {Object} props.group - The initial data object for the group  to be fetched and displayed.
 *   - Example: `{ id: "12345", name: " A", nameEn: " A (EN)" }`.
 *
 * @returns {JSX.Element} A lazily loaded "Group " page content with error handling, loading states, 
 * and dynamic rendering of the `GroupPageContent` component.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const initialGroup = { id: "12345", name: " A", nameEn: " A (EN)" };
 *
 *   return <GroupPageContentLazy group={initialGroup} />;
 * };
 *
 * @remarks
 * - This component fetches and synchronizes data with the server using the `GroupReadAsyncAction`.
 * - The `handleChange` and `handleBlur` methods debounce updates to prevent excessive server requests.
 * - The `GroupPageContent` component is used for rendering once data is successfully fetched.
 * - Handles loading and error states with `LoadingSpinner` and `ErrorEvent` components respectively.
 *
 * @see GroupPageContent - The primary content component rendered once data is fetched.
 * @see useAsyncAction - The hook used for managing server communication and state.
 * @see GroupReadAsyncAction - The asynchronous action used for fetching the group  data.
 */
const GroupPageContentLazy = ({group}) => {
    const { error, loading, entity, fetch } = useAsyncAction(GroupReadAsyncAction, group)
    const [delayer] = useState(() => CreateDelayer())

    const handleChange = async(e) => {
        // console.log("GroupPageContentLazy.handleChange.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupPageContentLazy.serverResponse", serverResponse)
    }
    const handleBlur = async(e) => {
        // console.log("GroupPageContentLazy.handleBlur.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupPageContentLazy.serverResponse", serverResponse)
    }

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorEvent errors={error} />}
        {entity && <GroupPageContent group={entity}  onChange={handleChange} onBlur={handleBlur} />}
    </>)
}

/**
 * A React component for editing a specific "Group " entity.
 *
 * The `GroupEditPage` component wraps the `GroupPageContentLazy` component
 * within a `ComponentSentinel` to conditionally render based on user permissions. It uses
 * the `id` parameter from the React Router URL to fetch and display the specific group .
 *
 * @function GroupEditPage
 * @returns {JSX.Element} The edit page for the group , conditionally rendered based on user permissions.
 *
 * @example
 * // Example usage in a React Router setup:
 * <Route path="/group//edit/:id" element={<GroupEditPage />} />
 *
 * @remarks
 * - The `ComponentSentinel` ensures that only users meeting the `meCondition` (e.g., their email contains "world") 
 *   can view the page. Otherwise, it renders null.
 * - The `GroupPageContentLazy` component is used to handle lazy loading, error states, and server synchronization.
 * - This component leverages the `useParams` hook from React Router to extract the `id` of the group  
 *   from the URL.
 *
 * @see ComponentSentinel - A utility component for conditional rendering based on user permissions.
 * @see GroupPageContentLazy - A lazy-loading component for displaying group  details.
 */
export const GroupEditPage = () => {
    const { id } = useParams()
    const group = {id}
    return ( 
        <ComponentSentinel meCondition={me => me?.email?.includes("world")}>
            <GroupPageContentLazy group ={group} />
        </ComponentSentinel>
    )
}


