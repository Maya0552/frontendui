import Table from 'react-bootstrap/Table'
import { UserLink } from '../User'
import { GroupLink } from '../Group'
import { InfiniteScroll } from '@hrbolek/uoisfrontend-shared'

const MembershipsTableHeader = () => {
    return (
        <tr>
            <th>Uživatel</th>
            <th>Skupina</th>
            <th>Počátek</th>
            <th>Konec</th>
        </tr>
)
}

const MembershipsTableRow = ({membership}) => {
    return (
        <tr>
            <td><UserLink user={membership?.user} /></td>
            <td><GroupLink group={membership?.group} /></td>
            <td>{membership?.startdate}</td>
            <td>{membership?.enddate}</td>
        </tr>
    )
}

const MembershipsTableBody = ({items}) => {
    return (
        <>{items.map(
            membership => <MembershipsTableRow key={membership?.id} membership={membership} />
        )}</>
    )
}

/**
 * MembershipsTable Component
 * 
 * Renders a table with a striped and bordered style, using Bootstrap classes.
 * The table displays membership data in a paginated format with infinite scroll.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.memberships - The initial array of membership data to render.
 * @param {Object} props.actionParams - Parameters for the asynchronous action.
 * @param {Function} props.AsyncAction - An asynchronous function to load additional membership data.
 * 
 * @returns {JSX.Element} A styled table component with infinite scroll for memberships.
 * 
 * @example
 * // Example usage:
 * const memberships = [
 *     { id: 1, name: "Member 1", status: "Active" },
 *     { id: 2, name: "Member 2", status: "Inactive" },
 * ];
 * 
 * const loadMoreMemberships = async (params) => {
 *     // Fetch more data based on params
 * };
 * 
 * <MembershipsTable 
 *     memberships={memberships} 
 *     actionParams={{ page: 1 }} 
 *     AsyncAction={loadMoreMemberships} 
 * />
 */
export const MembershipsTable = ({ memberships, actionParams, AsyncAction }) => {
    return (
        <table className="table table-striped table-bordered">
            <thead>
                <MembershipsTableHeader />
            </thead>
            <tbody>
                <InfiniteScroll 
                    preloadedItems={memberships} 
                    asyncAction={AsyncAction}
                    Visualiser={MembershipsTableBody}
                    actionParams={actionParams}
                />
            </tbody>
        </table>
    );
};