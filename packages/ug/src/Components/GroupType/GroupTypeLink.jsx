import { ProxyLink } from "@hrbolek/uoisfrontend-shared";

/**
 * A `GroupTypeLink` component for creating navigation links to a specific group type view.
 *
 * This component uses the `ProxyLink` component to generate a link to the detailed view of a group type.
 * If `children` are provided, they are rendered inside the link; otherwise, the group type's name is used as the link text.
 *
 * @function GroupTypeLink
 * @param {Object} props - The properties for the `GroupTypeLink` component.
 * @param {Object} props.grouptype - The group type object containing the details for the link.
 *   @param {string} [props.grouptype.id] - The unique identifier of the group type. Used to construct the target URL.
 *   @param {string} [props.grouptype.name] - The name of the group type. Used as the default link text.
 * @param {React.ReactNode} [props.children] - The custom content to display inside the link. If not provided, `grouptype.name` is used.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified group type view.
 *
 * @example
 * // Example usage with a custom child:
 * <GroupTypeLink grouptype={{ id: "123", name: "Example Group" }}>
 *   <span>Custom Link Text</span>
 * </GroupTypeLink>
 *
 * @example
 * // Example usage without custom children:
 * <GroupTypeLink grouptype={{ id: "123", name: "Example Group" }} />
 * // Renders: <ProxyLink to="/ug/grouptype/view/123">Example Group</ProxyLink>
 *
 * @see ProxyLink - The underlying component used for link rendering.
 */
export const GroupTypeLink = ({grouptype, children}) => {
    return (
        <ProxyLink to={"/ug/grouptype/view/" + grouptype?.id}>{children?children:grouptype?.name}</ProxyLink>
    )
}