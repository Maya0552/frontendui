import { ProxyLink } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that renders a `ProxyLink` to an request view page.
 * 
 * The target URL is dynamically constructed using the `request` object's `id`, 
 * and the link displays the `request` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the RequestLink component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The display name for the request entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the request view page.
 * 
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Example Request Entity" };
 * 
 * <RequestLink request={requestEntity} />
 */
export const RequestLink = ({request}) => {
    return <ProxyLink to={'/requests/request/view/' + request.id}>{request.name}</ProxyLink>
}