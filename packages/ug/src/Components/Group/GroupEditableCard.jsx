import { FormBody } from '@hrbolek/uoisfrontend-shared';
import { GroupMediumEditableContent } from './GroupMediumEditableContent';
import { GroupUpdateAsyncAction } from './Queries/GroupUpdateAsyncAction';


/**
 * A React component for editing "Group " details in a form card layout.
 * 
 * `GroupEditableCard` wraps the `FormBody` component to provide a structured form interface
 * for managing `group` data. It integrates asynchronous updates with a server using the `GroupUpdateAsyncAction`.
 *
 * @function GroupEditableCard
 * @param {Object} props - The properties for the `GroupEditableCard` component.
 * @param {Object} props.group - The initial data object for the group .
 *   - Example: `{ name: " A", nameEn: " A (EN)" }`.
 * @param {Function} props.onChange - Callback function triggered when any form field's value changes.
 *   - Receives an event object with the updated data as `event.target.value`.
 * @param {Function} props.onBlur - Callback function triggered when any form field loses focus.
 *   - Receives an event object with the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} A `FormBody` component pre-configured for editing `group` data.
 *
 * @example
 * // Example usage of GroupEditableCard:
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
 *     <GroupEditableCard
 *       group={group}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component leverages `FormBody` for dynamic form handling, allowing both synchronous and asynchronous updates.
 * - The `RenderGroupMediumEditableContent()` function generates the input fields for `name` and `nameEn`.
 * - The `asyncAction` is set to `GroupUpdateAsyncAction`, enabling server-side updates.
 *
 * @see FormBody - The reusable form wrapper component.
 * @see RenderGroupMediumEditableContent - The function rendering input fields for group  details.
 * @see GroupUpdateAsyncAction - The asynchronous action used for server updates.
 */
export const GroupEditableCard = ({ group, onChange, onBlur, children }) => {
    return <FormBody
        id="group"
        label="Skupina"
        defaultValue={group}
        onChange={onChange}
        onBlur={onBlur}
        asyncAction={GroupUpdateAsyncAction}
        shouldFetch={0}
    >
        <GroupMediumEditableContent group={group} onChange={onChange} onBlur={onBlur} />
        {children}
    </FormBody>;
};
