import { FormBody } from '@hrbolek/uoisfrontend-shared';
import { RenderGroupTypeMediumEditableContent } from './GroupTypeMediumEditableContent';
import { GroupTypeUpdateAsyncAction } from './Queries/GroupTypeUpdateAsyncAction';


/**
 * A React component for editing "Group Type" details in a form card layout.
 * 
 * `GroupTypeEditableCard` wraps the `FormBody` component to provide a structured form interface
 * for managing `grouptype` data. It integrates asynchronous updates with a server using the `GroupTypeUpdateAsyncAction`.
 *
 * @function GroupTypeEditableCard
 * @param {Object} props - The properties for the `GroupTypeEditableCard` component.
 * @param {Object} props.grouptype - The initial data object for the group type.
 *   - Example: `{ name: "Type A", nameEn: "Type A (EN)" }`.
 * @param {Function} props.onChange - Callback function triggered when any form field's value changes.
 *   - Receives an event object with the updated data as `event.target.value`.
 * @param {Function} props.onBlur - Callback function triggered when any form field loses focus.
 *   - Receives an event object with the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} A `FormBody` component pre-configured for editing `grouptype` data.
 *
 * @example
 * // Example usage of GroupTypeEditableCard:
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
 *     <GroupTypeEditableCard
 *       grouptype={grouptype}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component leverages `FormBody` for dynamic form handling, allowing both synchronous and asynchronous updates.
 * - The `RenderGroupTypeMediumEditableContent()` function generates the input fields for `name` and `nameEn`.
 * - The `asyncAction` is set to `GroupTypeUpdateAsyncAction`, enabling server-side updates.
 *
 * @see FormBody - The reusable form wrapper component.
 * @see RenderGroupTypeMediumEditableContent - The function rendering input fields for group type details.
 * @see GroupTypeUpdateAsyncAction - The asynchronous action used for server updates.
 */
export const GroupTypeEditableCard = ({ grouptype, onChange, onBlur }) => {
    return <FormBody
        id="grouptype"
        label="Kategorie typů skupin"
        defaultValue={grouptype}
        onChange={onChange}
        onBlur={onBlur}
        asyncAction={GroupTypeUpdateAsyncAction}
        shouldFetch={0}
    >
        {RenderGroupTypeMediumEditableContent()}
    </FormBody>;
};
