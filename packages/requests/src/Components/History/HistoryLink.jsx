import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an history view page.
 * 
 * The target URL is dynamically constructed using the `history` object's `id`, 
 * and the link displays the `history` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the HistoryLink component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {string|number} props.history.id - The unique identifier for the history entity.
 * @param {string} props.history.name - The display name for the history entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the history view page.
 * 
 * @example
 * // Example usage:
 * const historyEntity = { id: 123, name: "Example History Entity" };
 * 
 * <HistoryLink history={historyEntity} />
 */
export const HistoryLink = ({history}) => {
    return <ProxyLink to={'/history/history/view/' + history.id}>{history.name}</ProxyLink>
}