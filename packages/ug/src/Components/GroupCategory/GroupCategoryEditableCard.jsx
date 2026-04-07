import { FormBody } from '@hrbolek/uoisfrontend-shared';
import { RenderGroupCategoryMediumEditableContent } from './GroupCategoryMediumEditableContent';
import { GroupCategoryUpdateAsyncAction } from './Queries/GroupCategoryUpdateAsyncAction';


/**
 * A React component for editing "Group Category" details in a form card layout.
 * 
 * `GroupCategoryEditableCard` wraps the `FormBody` component to provide a structured form interface
 * for managing `groupcategory` data. It integrates asynchronous updates with a server using the `GroupCategoryUpdateAsyncAction`.
 *
 * @function GroupCategoryEditableCard
 * @param {Object} props - The properties for the `GroupCategoryEditableCard` component.
 * @param {Object} props.groupcategory - The initial data object for the group category.
 *   - Example: `{ name: "Category A", nameEn: "Category A (EN)" }`.
 * @param {Function} props.onChange - Callback function triggered when any form field's value changes.
 *   - Receives an event object with the updated data as `event.target.value`.
 * @param {Function} props.onBlur - Callback function triggered when any form field loses focus.
 *   - Receives an event object with the updated data as `event.target.value`.
 *
 * @returns {JSX.Element} A `FormBody` component pre-configured for editing `groupcategory` data.
 *
 * @example
 * // Example usage of GroupCategoryEditableCard:
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
 *     <GroupCategoryEditableCard
 *       groupcategory={groupcategory}
 *       onChange={handleChange}
 *       onBlur={handleBlur}
 *     />
 *   );
 * };
 *
 * @remarks
 * - This component leverages `FormBody` for dynamic form handling, allowing both synchronous and asynchronous updates.
 * - The `RenderGroupCategoryMediumEditableContent()` function generates the input fields for `name` and `nameEn`.
 * - The `asyncAction` is set to `GroupCategoryUpdateAsyncAction`, enabling server-side updates.
 *
 * @see FormBody - The reusable form wrapper component.
 * @see RenderGroupCategoryMediumEditableContent - The function rendering input fields for group category details.
 * @see GroupCategoryUpdateAsyncAction - The asynchronous action used for server updates.
 */
export const GroupCategoryEditableCard = ({ groupcategory, onChange, onBlur }) => {
    return <FormBody
        id="groupcategory"
        label="Kategorie typů skupin"
        defaultValue={groupcategory}
        onChange={onChange}
        onBlur={onBlur}
        asyncAction={GroupCategoryUpdateAsyncAction}
        shouldFetch={0}
    >
        {/* <Input id="name" label="Název" className="form-control" />
        <Input id="nameEn" label="Anglický název" className="form-control" /> */}
        {/* <GroupCategoryMediumEditableContent /> */}
        {RenderGroupCategoryMediumEditableContent()}
    </FormBody>;
};
