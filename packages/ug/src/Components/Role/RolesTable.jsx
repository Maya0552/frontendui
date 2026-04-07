import { useState } from 'react'
import { UserLink } from '../User'
import { GroupLink } from '../Group'
import { InfiniteScroll, ChildWrapper } from '@hrbolek/uoisfrontend-shared'

/**
 * RolesTableHeader Component
 *
 * Renders a table header row (`<tr>`) with column names for a roles table.
 * The column names can be customized by passing an array of strings as a prop.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<string>} [props.columnNames] - An optional array of column names to render.
 *                                             Defaults to ["Uživatel", "Skupina", "Role", "Počátek", "Konec"].
 *
 * @returns {JSX.Element} A table row (`<tr>`) containing table headers (`<th>`) for each column name.
 *
 * @example
 * // Default usage
 * <RolesTableHeader />
 *
 * @example
 * // Custom column names
 * <RolesTableHeader columnNames={["User", "Group", "Role Type", "Start Date", "End Date"]} />
 */
const RolesTableHeader = ({
    columnNames=[
        "Uživatel",
        "Skupina",
        "Role",
        "Počátek",
        "Konec"
        ]}) => {
    return (
        <tr>{columnNames.map(
            cname => <th key={cname}>{cname}</th>
        )}
        </tr>
    )
}

/**
 * RolesTableRow Component
 *
 * Renders a table row (`<tr>`) representing a single role, displaying user, group, role type, start date, 
 * and end date. It also allows additional child components to be rendered within the last cell, 
 * with the `role` prop passed down to them through the `ChildWrapper`.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.role - The role object containing details for rendering the table row.
 * @param {Object} [props.role.user] - The user associated with the role.
 * @param {Object} [props.role.group] - The group associated with the role.
 * @param {Object} [props.role.roletype] - The role type information.
 * @param {string} [props.role.roletype.name] - The name of the role type.
 * @param {string} [props.role.startdate] - The start date of the role.
 * @param {string} [props.role.enddate] - The end date of the role.
 * @param {React.ReactNode} props.children - Additional React components to render within the last cell.
 * @param {...any} props - Additional props spread onto the `<tr>` element.
 *
 * @returns {JSX.Element} A table row element displaying role details and additional children.
 *
 * @example
 * // Example role object
 * const role = {
 *   user: { name: "John Doe" },
 *   group: { name: "Admin Group" },
 *   roletype: { name: "Manager" },
 *   startdate: "2024-01-01",
 *   enddate: "2024-12-31"
 * };
 *
 * // Example usage of RolesTableRow
 * <RolesTableRow role={role}>
 *     <button>Edit</button>
 *     <span>Status: Active</span>
 * </RolesTableRow>
 */
const RolesTableRow = ({role, children, ...props}) => {
    return (
        <tr {...props}>
            <td><UserLink user={role?.user} /></td>
            <td><GroupLink group={role?.group} /></td>
            <td>{role?.roletype?.name}</td>
            <td>{role?.startdate}</td>
            <td>{role?.enddate}</td>
            <td>{role?.deputy?"Ano":"Ne"}</td>
            <td>
                <ChildWrapper role={role}>
                    {children}
                </ChildWrapper>
            </td>
        </tr>
    )
}

/**
 * RolesTableBody Component
 *
 * Renders a collection of `RolesTableRow` components by mapping over a list of role items.
 * Additional props and child components are passed down to each `RolesTableRow` for customization.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.items - An array of role objects to render as rows.
 * @param {React.ReactNode} props.children - Additional React components to pass as children 
 *                                          to each `RolesTableRow`.
 * @param {...any} props - Additional props spread onto each `RolesTableRow` component.
 *
 * @returns {JSX.Element} A fragment containing a list of `RolesTableRow` components.
 *
 * @example
 * // Example items array
 * const roles = [
 *   { id: 1, user: { name: "John Doe" }, group: { name: "Admins" }, roletype: { name: "Manager" }, startdate: "2024-01-01", enddate: "2024-12-31" },
 *   { id: 2, user: { name: "Jane Smith" }, group: { name: "Editors" }, roletype: { name: "Editor" }, startdate: "2024-02-01", enddate: "2024-11-30" }
 * ];
 *
 * // Example usage
 * <RolesTableBody items={roles}>
 *     <button>Action</button>
 * </RolesTableBody>
 */
const RolesTableBody = ({items, children, ...props}) => {
    return (
        <>{items.map(
            role => <RolesTableRow {...props} key={role?.id} role={role} >
                {children}
            </RolesTableRow>
        )}</>
    )
}

/**
 * RolesTable Component
 *
 * Renders a table with a striped and bordered style using Bootstrap classes. 
 * The table displays role data and supports infinite scrolling for pagination.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.roles - The initial array of role data to render in the table.
 * @param {Object} props.actionParams - Parameters for the asynchronous action used for pagination.
 * @param {number} props.actionParams.skip - Initial skip value for pagination.
 * @param {number} props.actionParams.limit - Number of roles to fetch per page.
 * @param {Object} [props.actionParams.otherParams] - Additional parameters passed to the async action.
 * @param {Function} props.AsyncAction - An asynchronous function to load additional role data.
 *   It must return a promise that resolves to an array of fetched roles.
 * @param {Array<string>} [props.columnNames=["Uživatel", "Skupina", "Role", "Počátek", "Konec"]] - 
 *   The names of the columns to display in the table header.
 * @param {React.ReactNode} [props.children] - Optional React components to render inside each role row 
 *   in addition to role data. These will be passed to `RolesTableBody`.
 *
 * @returns {JSX.Element} A styled table component with infinite scroll functionality for role data.
 *
 * @example
 * // Example role data
 * const roles = [
 *     { id: 1, user: { name: "John Doe" }, group: { name: "Admins" }, roletype: { name: "Manager" }, startdate: "2024-01-01", enddate: "2024-12-31" },
 *     { id: 2, user: { name: "Jane Smith" }, group: { name: "Editors" }, roletype: { name: "Editor" }, startdate: "2024-02-01", enddate: "2024-11-30" }
 * ];
 *
 * // Asynchronous action to load more roles
 * const fetchMoreRoles = async ({ skip, limit }) => {
 *     const response = await fetch(`/api/roles?skip=${skip}&limit=${limit}`);
 *     const result = await response.json();
 *     return result.roles;
 * };
 *
 * // Custom content in the role rows
 * const CustomActions = () => <button>Edit</button>;
 *
 * // Usage of RolesTable
 * <RolesTable
 *     roles={roles}
 *     actionParams={{ skip: 0, limit: 10 }}
 *     AsyncAction={fetchMoreRoles}
 *     columnNames={["User", "Group", "Role", "Start Date", "End Date"]}
 * >
 *     <CustomActions />
 * </RolesTable>
 */
export const RolesTable = ({ 
    roles, 
    actionParams, 
    AsyncAction, 
    columnNames=["Uživatel", "Skupina", "Role", "Počátek", "Konec", "Zástup" ],
    children
}) => {
    const [done, setDone] = useState(false)
    return (
        <>
        <table className="table table-striped table-bordered">
            <thead>
                <RolesTableHeader columnNames={columnNames}/>
            </thead>
            <tbody>
                <InfiniteScroll 
                    preloadedItems={roles} 
                    asyncAction={AsyncAction}
                    Visualiser={RolesTableBody}
                    actionParams={actionParams}
                    onAll={()=>setDone(true)}
                >
                    {children}
                </InfiniteScroll>
            </tbody>
        </table>
        {done && "Více toho není"}
        </>
    );
};