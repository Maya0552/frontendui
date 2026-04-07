import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A utility function that renders input fields for editing "Group Type" details.
 *
 * This function returns an array of `<Input>` components for editing the `name` and `nameEn` fields
 * of a group type. It is specifically designed to be used within components like `GroupTypeEditableCard`,
 * providing a consistent and reusable form structure for group type details.
 *
 * @function RenderGroupTypeMediumEditableContent
 * @returns {JSX.Element[]} An array of `<Input>` components for editing "Group Type" fields.
 *
 * @example
 * // Usage within GroupTypeEditableCard:
 * const GroupTypeEditableCard = ({ grouptype, onChange, onBlur }) => (
 *   <FormBody
 *     id="grouptype"
 *     label="Kategorie typů skupin"
 *     defaultValue={grouptype}
 *     onChange={onChange}
 *     onBlur={onBlur}
 *     asyncAction={GroupTypeUpdateAsyncAction}
 *     shouldFetch={0}
 *   >
 *     {RenderGroupTypeMediumEditableContent()}
 *   </FormBody>
 * );
 *
 * @remarks
 * - The input fields are pre-configured with `id`, `label`, and `className` attributes.
 * - The `label` attributes are hardcoded but can be localized by integrating a localization mechanism.
 * - Designed to work seamlessly with `FormBody` to handle dynamic form operations and state management.
 * - It is not a React component; it is a utility function that must be invoked directly within JSX.
 *
 * @see GroupTypeEditableCard - A component that uses this function to edit "Group Type" details.
 * @see FormBody - The reusable form wrapper component.
 * @see Input - The reusable input component used for rendering each field.
 */
export const RenderGroupTypeMediumEditableContent = () => [
    <Input id="name" label="Název" className="form-control" />,
    <Input id="nameEn" label="Anglický název" className="form-control" />
]