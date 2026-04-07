import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an program view page.
 * 
 * The target URL is dynamically constructed using the `program` object's `id`, 
 * and the link displays the `program` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the ProgramLink component.
 * @param {Object} props.program - The object representing the program entity.
 * @param {string|number} props.program.id - The unique identifier for the program entity.
 * @param {string} props.program.name - The display name for the program entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the program view page.
 * 
 * @example
 * // Example usage:
 * const programEntity = { id: 123, name: "Example Program Entity" };
 * 
 * <ProgramLink program={programEntity} />
 */
export const ProgramLink = ({program}) => {
    return <ProxyLink to={'/granting/program/view/' + program.id}>{program.name}</ProxyLink>
}