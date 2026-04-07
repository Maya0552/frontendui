import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an section view page.
 * 
 * The target URL is dynamically constructed using the `section` object's `id`, 
 * and the link displays the `section` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the SectionLink component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {string|number} props.section.id - The unique identifier for the section entity.
 * @param {string} props.section.name - The display name for the section entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the section view page.
 * 
 * @example
 * // Example usage:
 * const sectionEntity = { id: 123, name: "Example Section Entity" };
 * 
 * <SectionLink section={sectionEntity} />
 */
export const SectionLink = ({section}) => {
    return <ProxyLink to={'/section/section/view/' + section.id}>{section.name}</ProxyLink>
}