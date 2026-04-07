import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an state view page.
 * 
 * The target URL is dynamically constructed using the `state` object's `id`, 
 * and the link displays the `state` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the StateLink component.
 * @param {Object} props.state - The object representing the state entity.
 * @param {string|number} props.state.id - The unique identifier for the state entity.
 * @param {string} props.state.name - The display name for the state entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the state view page.
 * 
 * @example
 * // Example usage:
 * const stateEntity = { id: 123, name: "Example State Entity" };
 * 
 * <StateLink state={stateEntity} />
 */
export const StateLink = ({state}) => {
    return <ProxyLink to={'/state/state/view/' + state.id}>{state.name}</ProxyLink>
}