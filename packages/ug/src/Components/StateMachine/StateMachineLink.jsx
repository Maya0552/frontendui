import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an statemachine view page.
 * 
 * The target URL is dynamically constructed using the `statemachine` object's `id`, 
 * and the link displays the `statemachine` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the StateMachineLink component.
 * @param {Object} props.statemachine - The object representing the statemachine entity.
 * @param {string|number} props.statemachine.id - The unique identifier for the statemachine entity.
 * @param {string} props.statemachine.name - The display name for the statemachine entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the statemachine view page.
 * 
 * @example
 * // Example usage:
 * const statemachineEntity = { id: 123, name: "Example StateMachine Entity" };
 * 
 * <StateMachineLink statemachine={statemachineEntity} />
 */
export const StateMachineLink = ({statemachine}) => {
    return <ProxyLink to={'/statemachine/statemachine/view/' + statemachine.id}>{statemachine.name}</ProxyLink>
}