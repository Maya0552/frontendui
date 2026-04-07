import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an subject view page.
 * 
 * The target URL is dynamically constructed using the `subject` object's `id`, 
 * and the link displays the `subject` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the SubjectLink component.
 * @param {Object} props.subject - The object representing the subject entity.
 * @param {string|number} props.subject.id - The unique identifier for the subject entity.
 * @param {string} props.subject.name - The display name for the subject entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the subject view page.
 * 
 * @example
 * // Example usage:
 * const subjectEntity = { id: 123, name: "Example Subject Entity" };
 * 
 * <SubjectLink subject={subjectEntity} />
 */
export const SubjectLink = ({subject}) => {
    return <ProxyLink to={'/granting/subject/view/' + subject.id}>{subject.name}</ProxyLink>
}