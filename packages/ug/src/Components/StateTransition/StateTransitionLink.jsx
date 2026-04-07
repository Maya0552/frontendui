import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an statetransition view page.
 * 
 * The target URL is dynamically constructed using the `statetransition` object's `id`, 
 * and the link displays the `statetransition` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the StateTransitionLink component.
 * @param {Object} props.statetransition - The object representing the statetransition entity.
 * @param {string|number} props.statetransition.id - The unique identifier for the statetransition entity.
 * @param {string} props.statetransition.name - The display name for the statetransition entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the statetransition view page.
 * 
 * @example
 * // Example usage:
 * const statetransitionEntity = { id: 123, name: "Example StateTransition Entity" };
 * 
 * <StateTransitionLink statetransition={statetransitionEntity} />
 */
export const StateTransitionLink = ({statetransition}) => {
    return <ProxyLink to={'/statetransition/statetransition/view/' + statetransition.id}>{statetransition.name}</ProxyLink>
}