import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an part view page.
 * 
 * The target URL is dynamically constructed using the `part` object's `id`, 
 * and the link displays the `part` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the PartLink component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {string|number} props.part.id - The unique identifier for the part entity.
 * @param {string} props.part.name - The display name for the part entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the part view page.
 * 
 * @example
 * // Example usage:
 * const partEntity = { id: 123, name: "Example Part Entity" };
 * 
 * <PartLink part={partEntity} />
 */
export const PartLink = ({part}) => {
    return <ProxyLink to={'/part/part/view/' + part.id}>{part.name}</ProxyLink>
}