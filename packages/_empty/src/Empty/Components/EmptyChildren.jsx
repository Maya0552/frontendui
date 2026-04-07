import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * EmptyChildren Component
 *
 * A utility React component that wraps its children with the `ChildWrapper` component, 
 * passing down an `empty` entity along with other props to all child elements.
 * This component is useful for injecting a common `empty` entity into multiple children 
 * while preserving their existing functionality.
 *
 * @component
 * @param {Object} props - The props for the EmptyChildren component.
 * @param {any} props.empty - An entity (e.g., object, string, or other data) to be passed to the children.
 * @param {React.ReactNode} props.children - The children elements to be wrapped and enhanced.
 * @param {...any} props - Additional props to be passed to each child element.
 *
 * @returns {JSX.Element} A `ChildWrapper` component containing the children with the injected `empty` entity.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 1, message: "No data available" };
 *
 * <EmptyChildren empty={emptyEntity}>
 *     <CustomMessage />
 *     <CustomIcon />
 * </EmptyChildren>
 *
 * // Result: Both <CustomMessage /> and <CustomIcon /> receive the 'empty' prop with the specified entity.
 */
export const EmptyChildren = ({empty, children, ...props}) => <ChildWrapper empty={empty} children={children} {...props} />