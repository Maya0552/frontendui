import { useLocation, useNavigate } from "react-router"
import { InfiniteScroll, MyNavbar, ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { RequestReadPageAsyncAction } from "../Queries"
import { RequestLink, RequestMediumCard, RequestURI } from "../Components"
import { useEffect, useState } from "react"
import { RequestTypeLink } from "../../RequestTypeGQLModel/Components"
import { useRemoteState } from "@hrbolek/uoisfrontend-gql-shared"
import { Filter, FilterLeft } from "react-bootstrap-icons"
import { RequestsNavbar } from "../../RequestTypeGQLModel/Pages/RequestsNavbar"
import { CQCol, CQRow } from "../../CQ"
import { RequestFilter } from "../Components/RequestFilter"

/**
 * Visualizes a list of request entities using RequestMediumCard.
 *
 * This component receives an array of request objects via the `items` prop
 * and renders a `RequestMediumCard` for each item. Each card is keyed by the request's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of request entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of RequestMediumCard components.
 *
 * @example
 * const requests = [
 *   { id: 1, name: "Request 1", ... },
 *   { id: 2, name: "Request 2", ... }
 * ];
 *
 * <RequestVisualiser items={requests} />
 */
const RequestVisualiser = ({items}) => {
    return (
        <>
            {items.map(request => (
                <RequestMediumCard key={request.id} request={request} />
            ))}
        </>
    )
}


/**
 * Visualizes a list of request entities using table.
 *
 * This component receives an array of request objects via the `items` prop
 * and renders a `tr` for each item. Each row is keyed by the request's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of request entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of RequestMediumCard components.
 *
 * @example
 * const requests = [
 *   { id: 1, name: "Request 1", ... },
 *   { id: 2, name: "Request 2", ... }
 * ];
 *
 * <RequestTableVisualiser items={requests} />
 */
export const RequestTableVisualiser = ({items}) => {
    const navigate = useNavigate();
    const onClickNavigator = (whereFilter) => () => navigate(`?where=${JSON.stringify(whereFilter)}`);
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Typ</th>
                    <th>Stav</th>
                    <th>Name</th>
                    <th>Filtr</th>
                    <th>Tools</th>
                </tr>
            </thead>
            <tbody>
            {items.map(request => (
                <tr key={request?.id} >
                    <td>
                        <RequestLink request={request} />
                    </td>
                    <td>
                        <RequestTypeLink requesttype={{id: request?.requestTypeId, name: request?.requestTypeId}}>{request?.requestTypeId}</RequestTypeLink>
                        {/* <button className="btn btn-sm btn-outline-secondary" onClick={onClickNavigator(createTypeFilter(request?.requestTypeId))}><Filter /></button> */}
                        <ProxyLink to={`${RequestURI}?where=${JSON.stringify(createTypeFilter(request?.requestTypeId))}`}><Filter /></ProxyLink>
                    </td>
                    <td>
                        {request?.state?.name ?? request?.stateId}
                        {/* <button className="btn btn-sm btn-outline-secondary" onClick={onClickNavigator(createStateFilter(request?.stateId))}><Filter /></button> */}
                        <ProxyLink to={`${RequestURI}?where=${JSON.stringify(createStateFilter(request?.stateId))}`}><Filter /></ProxyLink>
                    </td>
                    <td>{request?.name}</td>
                    <td>
                        {/* {JSON.stringify(createTypeFilter(request?.requestTypeId))}<br/>
                        {JSON.stringify(createStateFilter(request?.stateId))}<br/> */}
                    </td>
                    <td></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of request entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting requests using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=RequestVisualiser] - 
 *   Optional component used to visualize the loaded requests. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized requests.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display requests filtered by a `where` clause passed in the URL, e.g.:
 * //   /request?where={"name":"Example"}
 * <RequestVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <RequestVectorPage Visualiser={CustomRequestList}>
 *   <Footer />
 * </RequestVectorPage>
 */
export const RequestVectorPage = ({children, Visualiser=RequestTableVisualiser}) => {
    const { search } = useLocation();
    // const [reset, setReset] = useState(0)
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 10})
    const navigate = useNavigate()
    let actionParams = { skip: 0, limit: 10};
    useEffect(() => {
        const params = new URLSearchParams(search);
        const where = params.get('where');
        // if (where) {
        //     const oldWhere = queryParams.where
        //     if (oldWhere !== where) {
        //         setQueryParams(old => ({...old, where}))
        //     }
        // }
        const oldWhere = queryParams.where
        if (oldWhere !== where) {
            setQueryParams(old => ({...old, where}))
        }
    })
    // try {
    //     const params = new URLSearchParams(search);
    //     const where = params.get('where');        
    //     actionParams.where = where ? JSON.parse(where) : undefined;
    // } catch (e) {
    //     console.warn("Invalid 'where' query parameter!", e);
    // }
    // const onRefresh = () => setReset(value => value + 1)
    const onRefresh = () => setQueryParams(value => ({...value}))
    const onFilterReset = () => {
        navigate("?")
        setQueryParams(() => ({}))
    }
    return (<>
        {/* <MyNavbar /> */}
        <RequestsNavbar />
        <CQRow>
            <CQCol md={12} lg={3}>
                {/* <RequestTypeFilter /> */}
                <RequestFilter />
            </CQCol>
            <CQCol md={12} lg={9}>
        
                <InfiniteScroll
                    preloadedItems={[]} // No preloaded items for request
                    actionParams={actionParams} 
                    asyncAction={RequestReadPageAsyncAction}
                    Visualiser={Visualiser}
                    reset={queryParams}
                />
                <button className="btn btn-outline-success form-control" onClick={onRefresh}>Obnovit</button>
                <button className="btn btn-outline-success form-control" onClick={() => navigate("?")}>Reset filtru</button>
                <button className="btn btn-outline-success form-control" onClick={onFilterReset}>Reset filtru</button>
                {children}
            </CQCol>
        </CQRow>
    </>)
}

const createTypeFilter = (requesttype_id) => (
    {
        request_type_id: {_eq: `${requesttype_id}`}
    }
)

const createStateFilter = (state_id) => (
    {
        state_id: {_eq: `${state_id}`}
    }
)