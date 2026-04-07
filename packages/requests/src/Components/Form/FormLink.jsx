import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an form view page.
 * 
 * The target URL is dynamically constructed using the `form` object's `id`, 
 * and the link displays the `form` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the FormLink component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {string|number} props.form.id - The unique identifier for the form entity.
 * @param {string} props.form.name - The display name for the form entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the form view page.
 * 
 * @example
 * // Example usage:
 * const formEntity = { id: 123, name: "Example Form Entity" };
 * 
 * <FormLink form={formEntity} />
 */
export const FormLink = ({form}) => {
    return <ProxyLink to={'/requests/form/view/' + form.id}>{form.name}</ProxyLink>
}