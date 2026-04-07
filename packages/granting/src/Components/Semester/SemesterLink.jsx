import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an semester view page.
 * 
 * The target URL is dynamically constructed using the `semester` object's `id`, 
 * and the link displays the `semester` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the SemesterLink component.
 * @param {Object} props.semester - The object representing the semester entity.
 * @param {string|number} props.semester.id - The unique identifier for the semester entity.
 * @param {string} props.semester.name - The display name for the semester entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the semester view page.
 * 
 * @example
 * // Example usage:
 * const semesterEntity = { id: 123, name: "Example Semester Entity" };
 * 
 * <SemesterLink semester={semesterEntity} />
 */
export const SemesterLink = ({semester}) => {
    return <ProxyLink to={'/semester/semester/view/' + semester.id}>{semester.name}</ProxyLink>
}