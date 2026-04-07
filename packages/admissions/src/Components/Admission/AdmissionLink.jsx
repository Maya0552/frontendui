import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an admission view page.
 * 
 * The target URL is dynamically constructed using the `admission` object's `id`, 
 * and the link displays the `admission` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the AdmissionLink component.
 * @param {Object} props.admission - The object representing the admission entity.
 * @param {string|number} props.admission.id - The unique identifier for the admission entity.
 * @param {string} props.admission.name - The display name for the admission entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the admission view page.
 * 
 * @example
 * // Example usage:
 * const admissionEntity = { id: 123, name: "Example Admission Entity" };
 * 
 * <AdmissionLink admission={admissionEntity} />
 */
export const AdmissionLink = ({admission}) => {
    return <ProxyLink to={'/admission/admission/view/' + admission.id}>{admission.name}</ProxyLink>
}