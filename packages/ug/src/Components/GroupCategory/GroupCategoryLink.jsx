import { ProxyLink } from "@hrbolek/uoisfrontend-shared";

/**
 * A `GroupCategoryLink` component for creating navigation links to a specific group category view.
 *
 * This component uses the `ProxyLink` component to generate a link to the detailed view of a group category.
 * If `children` are provided, they are rendered inside the link; otherwise, the group category's name is used as the link text.
 *
 * @function GroupCategoryLink
 * @param {Object} props - The properties for the `GroupCategoryLink` component.
 * @param {Object} props.groupcategory - The group category object containing the details for the link.
 *   @param {string} [props.groupcategory.id] - The unique identifier of the group category. Used to construct the target URL.
 *   @param {string} [props.groupcategory.name] - The name of the group category. Used as the default link text.
 * @param {React.ReactNode} [props.children] - The custom content to display inside the link. If not provided, `groupcategory.name` is used.
 *
 * @returns {JSX.Element} A `ProxyLink` component linking to the specified group category view.
 *
 * @example
 * // Example usage with a custom child:
 * <GroupCategoryLink groupcategory={{ id: "123", name: "Example Group" }}>
 *   <span>Custom Link Text</span>
 * </GroupCategoryLink>
 *
 * @example
 * // Example usage without custom children:
 * <GroupCategoryLink groupcategory={{ id: "123", name: "Example Group" }} />
 * // Renders: <ProxyLink to="/ug/groupcategory/view/123">Example Group</ProxyLink>
 *
 * @see ProxyLink - The underlying component used for link rendering.
 */
export const GroupCategoryLink = ({groupcategory, children}) => {
    return (
        <ProxyLink to={"/ug/groupcategory/view/" + groupcategory?.id}>{children?children:groupcategory?.name}</ProxyLink>
    )
}