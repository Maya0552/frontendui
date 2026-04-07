import { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { useParams } from 'react-router'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { ComponentSentinel, LeftColumn, MiddleColumn, LoadingSpinner, CreateDelayer } from "@hrbolek/uoisfrontend-shared"
import { GroupTypePageNavbar } from './GroupTypePageNavbar'
import { GroupTypeReadAsyncAction } from '../Queries'
import { GroupTypeEditableCard } from '../GroupTypeEditableCard'

/**
 * A React component for rendering the "Group Type" page content.
 * 
 * This component organizes the page layout into a navigation bar, a left column, 
 * and a middle column. It includes an editable card for managing `grouptype` 
 * data and displays the current `grouptype` as a JSON string for debugging or reference.
 *
 * @function GroupTypePageContent
 * @param {Object} props - The properties for the `GroupTypePageContent` component.
 * @param {Object} props.grouptype - The current data object for the group type to be displayed and edited.
 *   - Example: `{ name: "Type A", nameEn: "Type A (EN)" }`.
 * @param {Function} [props.onChange=(e) => null] - Callback function triggered when the `GroupTypeEditableCard` 
 *   fields' values change. Receives an event object containing the updated data as `event.target.value`.
 * @param {Function} [props.onBlur=(e) => null] - Callback function triggered when the `GroupTypeEditableCard` 
 *   fields lose focus. Receives an event object containing the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} The rendered layout for the "Group Type" page, including an editable card and JSON preview.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const [grouptype, setGroupType] = useState({
 *     name: "Type A",
 *     nameEn: "Type A (EN)"
 *   });
 *
 *   const handleChange = (e) => {
 *     setGroupType(e.target.value);
 *   };
 *
 *   const handleBlur = (e) => {
 *     console.log("Field blurred with value:", e.target.value);
 *   };
 *
 *   return (
 *     <GroupTypePageContent
 *       grouptype={grouptype}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component integrates `GroupTypeEditableCard` for dynamic form management.
 * - The `grouptype` JSON is displayed for debugging or additional context.
 *
 * @see GroupTypeEditableCard - The editable card used within this component.
 */
const GroupTypePageContent = ({
    grouptype,
    onChange = (e) => null,
    onBlur = (e) => null,
}) => {
    return (
        <>
            <GroupTypePageNavbar grouptype={grouptype} />
            <Row>
                <LeftColumn>
                    
                </LeftColumn>
                <MiddleColumn>
                    <GroupTypeEditableCard grouptype={grouptype} onChange={onChange} onBlur={onBlur} />
                    <br/>
                    {JSON.stringify(grouptype)}
                </MiddleColumn>
            </Row>
        </>
    )
}


// const GroupTypePageContentLazy = createLazyComponent(GroupTypePageContent, "grouptype", GroupTypeReadAsyncAction)
/**
 * A React component for lazy-loading and managing "Group Type" page content with server synchronization.
 *
 * `GroupTypePageContentLazy` utilizes the `useAsyncAction` hook to fetch, update, and manage the state
 * of a `grouptype` entity. It handles asynchronous server updates using debounced fetches and integrates
 * the `GroupTypePageContent` component for rendering.
 *
 * @function GroupTypePageContentLazy
 * @param {Object} props - The properties for the `GroupTypePageContentLazy` component.
 * @param {Object} props.grouptype - The initial data object for the group type to be fetched and displayed.
 *   - Example: `{ id: "12345", name: "Type A", nameEn: "Type A (EN)" }`.
 *
 * @returns {JSX.Element} A lazily loaded "Group Type" page content with error handling, loading states, 
 * and dynamic rendering of the `GroupTypePageContent` component.
 *
 * @example
 * // Example usage:
 * const ParentComponent = () => {
 *   const initialGroupType = { id: "12345", name: "Type A", nameEn: "Type A (EN)" };
 *
 *   return <GroupTypePageContentLazy grouptype={initialGroupType} />;
 * };
 *
 * @remarks
 * - This component fetches and synchronizes data with the server using the `GroupTypeReadAsyncAction`.
 * - The `handleChange` and `handleBlur` methods debounce updates to prevent excessive server requests.
 * - The `GroupTypePageContent` component is used for rendering once data is successfully fetched.
 * - Handles loading and error states with `LoadingSpinner` and `ErrorEvent` components respectively.
 *
 * @see GroupTypePageContent - The primary content component rendered once data is fetched.
 * @see useAsyncAction - The hook used for managing server communication and state.
 * @see GroupTypeReadAsyncAction - The asynchronous action used for fetching the group type data.
 */
const GroupTypePageContentLazy = ({grouptype}) => {
    const { error, loading, entity, fetch } = useAsyncAction(GroupTypeReadAsyncAction, grouptype)
    const [delayer] = useState(() => CreateDelayer())

    const handleChange = async(e) => {
        // console.log("GroupTypePageContentLazy.handleChange.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupTypePageContentLazy.serverResponse", serverResponse)
    }
    const handleBlur = async(e) => {
        // console.log("GroupTypePageContentLazy.handleBlur.e", e)
        const data = e.target.value
        const serverResponse = await delayer(() => fetch(data))
        // console.log("GroupTypePageContentLazy.serverResponse", serverResponse)
    }

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorEvent errors={error} />}
        {entity && <GroupTypePageContent grouptype={entity}  onChange={handleChange} onBlur={handleBlur} />}
    </>)
}

/**
 * A React component for editing a specific "Group Type" entity.
 *
 * The `GroupTypeEditPage` component wraps the `GroupTypePageContentLazy` component
 * within a `ComponentSentinel` to conditionally render based on user permissions. It uses
 * the `id` parameter from the React Router URL to fetch and display the specific group type.
 *
 * @function GroupTypeEditPage
 * @returns {JSX.Element} The edit page for the group type, conditionally rendered based on user permissions.
 *
 * @example
 * // Example usage in a React Router setup:
 * <Route path="/group/type/edit/:id" element={<GroupTypeEditPage />} />
 *
 * @remarks
 * - The `ComponentSentinel` ensures that only users meeting the `meCondition` (e.g., their email contains "world") 
 *   can view the page. Otherwise, it renders null.
 * - The `GroupTypePageContentLazy` component is used to handle lazy loading, error states, and server synchronization.
 * - This component leverages the `useParams` hook from React Router to extract the `id` of the group type 
 *   from the URL.
 *
 * @see ComponentSentinel - A utility component for conditional rendering based on user permissions.
 * @see GroupTypePageContentLazy - A lazy-loading component for displaying group type details.
 */
export const GroupTypeEditPage = () => {
    const { id } = useParams()
    const grouptype = {id}
    return ( 
        <ComponentSentinel meCondition={me => me?.email?.includes("world")}>
            <GroupTypePageContentLazy grouptype ={grouptype} />
        </ComponentSentinel>
    )
}