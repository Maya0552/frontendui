import { Options, Select } from "@hrbolek/uoisfrontend-shared"
import { GroupTypeReadPageAsyncAction } from "./Queries"

/**
 * A React component that renders a dropdown of group types with dynamic options fetched from a GraphQL query.
 *
 * This component uses a `Select` component for the dropdown UI and an `Options` component to fetch and display
 * the group types. The options are retrieved from the `GroupTypeReadPageQuery` GraphQL query and updated dynamically
 * based on the `shouldFetch` prop. It allows handling of `onChange` and `onBlur` events for form integration.
 *
 * @function GroupTypeOptions
 * @param {Object} props - The props for the GroupTypeOptions component.
 * @param {Object} [props.group] - The initial group object to set the default selected value.
 * @param {string|number} [props.group.grouptypeId] - The ID of the currently selected group type.
 * @param {Object} [props.params={}] - Parameters for customizing the fetch action, such as filters and pagination.
 * @param {Object} [props.params.where] - A filter object for the GraphQL query, used to apply conditions.
 * @param {Array<Object>} [props.params.where._or] - A list of conditions combined with OR logic.
 * @param {Object} [props.params.where._or[].name] - A condition object for filtering by name.
 * @param {string} [props.params.where._or[].name._ilike] - A case-insensitive pattern for name matching.
 * @param {number} [props.params.limit] - The maximum number of results to fetch (pagination).
 * @param {number} [props.params.skip] - The number of results to skip (pagination).
 * @param {string} [props.params.orderby] - The sorting order of results.
 * @param {Function} [props.onChange] - Callback function triggered when the dropdown value changes. Receives an event object.
 * @param {Function} [props.onBlur] - Callback function triggered when the dropdown loses focus. Receives an event object.
 * @param {number} [props.shouldFetch=0] - A numeric flag to trigger refetching options; options are refetched when this value increments.
 *
 * @returns {JSX.Element} A styled dropdown populated with dynamically fetched group types.
 *
 * @example
 * // Example usage:
 * const MyComponent = () => {
 *   const [selectedGroupType, setSelectedGroupType] = useState("");
 *   const [refreshCount, setRefreshCount] = useState(0);
 *   const searchStr = "example";
 *
 *   const where = {
 *     "_or": [
 *       { "name": { "_ilike": `%${searchStr}%` } },
 *       // { "abbreviation": { "_ilike": `%${searchStr}%` } }
 *     ]
 *   };
 *
 *   const handleGroupTypeChange = (e) => {
 *     setSelectedGroupType(e.target.value);
 *   };
 *
 *   const refreshOptions = () => setRefreshCount((prev) => prev + 1);
 *
 *   return (
 *     <div>
 *       <button onClick={refreshOptions}>Refresh Group Types</button>
 *       <GroupTypeOptions
 *         group={{ grouptypeId: selectedGroupType }}
 *         params={{ where, limit: 10 }}
 *         onChange={handleGroupTypeChange}
 *         shouldFetch={refreshCount}
 *       />
 *     </div>
 *   );
 * };
 */
export const GroupTypeOptions = ({id="grouptype_id", label="Typ skupiny", group, params = {}, onChange, onBlur, shouldFetch}) => {
    return <Select id={id} label={label} className="form-control" defaultValue={group?.grouptypeId} onChange={onChange} onBlur={onBlur}>
        <Options asyncAction={GroupTypeReadPageAsyncAction} shouldFetch={shouldFetch} params={params}/>
    </Select>
}

