import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A utility function that renders input fields for editing "Group Category" details.
 *
 * This function returns an array of `<Input>` components for editing the `name` and `nameEn` fields
 * of a group category. It is specifically designed to be used within components like `GroupCategoryEditableCard`,
 * providing a consistent and reusable form structure for group category details.
 *
 * @function RenderGroupCategoryMediumEditableContent
 * @returns {JSX.Element[]} An array of `<Input>` components for editing "Group Category" fields.
 *
 * @example
 * // Usage within GroupCategoryEditableCard:
 * const GroupCategoryEditableCard = ({ groupcategory, onChange, onBlur }) => (
 *   <FormBody
 *     id="groupcategory"
 *     label="Kategorie typů skupin"
 *     defaultValue={groupcategory}
 *     onChange={onChange}
 *     onBlur={onBlur}
 *     asyncAction={GroupCategoryUpdateAsyncAction}
 *     shouldFetch={0}
 *   >
 *     {RenderGroupCategoryMediumEditableContent()}
 *   </FormBody>
 * );
 *
 * @remarks
 * - The input fields are pre-configured with `id`, `label`, and `className` attributes.
 * - The `label` attributes are hardcoded but can be localized by integrating a localization mechanism.
 * - Designed to work seamlessly with `FormBody` to handle dynamic form operations and state management.
 * - It is not a React component; it is a utility function that must be invoked directly within JSX.
 *
 * @see GroupCategoryEditableCard - A component that uses this function to edit "Group Category" details.
 * @see FormBody - The reusable form wrapper component.
 * @see Input - The reusable input component used for rendering each field.
 */
export const RenderGroupCategoryMediumEditableContent = () => [
    <Input id="name" label="Název" className="form-control" />,
    <Input id="nameEn" label="Anglický název" className="form-control" />
]