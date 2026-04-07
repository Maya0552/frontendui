import { useLocation, useNavigate } from "react-router"
import { InfiniteScroll, MyNavbar, ProxyLink } from "@hrbolek/uoisfrontend-shared"
import { RequestTypeReadPageAsyncAction } from "../Queries"
import { RequestTypeButton, RequestTypeLink, RequestTypeMediumCard, RequestTypeURI } from "../Components"
import { RequestButton, RequestURI } from "../../RequestGQLModel/Components"
import { RequestTypePageNavbar } from "./RequestTypePageNavbar"
import { Col, Row } from "react-bootstrap"
import { useState } from "react"
import { RequestTypeFilter } from "../Components/RequestTypeFilter"
import { CQRow, CQCol } from "../../CQ"
import { RequestsNavbar } from "./RequestsNavbar"
/**
 * Visualizes a list of requesttype entities using RequestTypeMediumCard.
 *
 * This component receives an array of requesttype objects via the `items` prop
 * and renders a `RequestTypeMediumCard` for each item. Each card is keyed by the requesttype's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of requesttype entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of RequestTypeMediumCard components.
 *
 * @example
 * const requesttypes = [
 *   { id: 1, name: "RequestType 1", ... },
 *   { id: 2, name: "RequestType 2", ... }
 * ];
 *
 * <RequestTypeVisualiser items={requesttypes} />
 */
const RequestTypeVisualiser = ({items}) => {
    return (
        <>
            {items.map(requesttype => (
                <Col key={requesttype.id} >
                    <RequestTypeMediumCard key={requesttype.id} requesttype={requesttype}>
                        <RequestButton 
                            operation="C"
                            request={{
                                id: crypto.randomUUID(),
                                requesttypeId: requesttype?.id,
                                rbacobjectId: crypto.randomUUID(),
                                name: `Nový ${requesttype?.name}`
                            }}
                            className="btn btn-outline-success form-control"
                        >
                            Nový požadavek
                        </RequestButton>
                    </RequestTypeMediumCard>
                </Col>
            ))}
        </>
    )
}

/**
 * mutation RequesttypeInsert($id: UUID, $rbacobjectId: UUID!) {
  result: requesttypeInsert(requestType: { id: $id, rbacobjectId: $rbacobjectId }) {
    __typename
    ... on InsertError {
      msg
      failed
      code
      location
      input
    }
    ... on RequestTypeGQLModel {
      ...RequestTypeLargeFragment
    }
  }
  
  rbac: rbacObjectInsert(rbacobject: {
    id: $rbacobjectId,
    grouptypeId: "de8654be-e776-4b6e-bb1e-2d5c949aa1eb"
    roles: []
  }) {
    __typename
    ...on InsertError {
      msg
      code
      location
      input
      
    }
    ...on GroupGQLModel {
      id
      name
      grouptypeId
    }
  }
}

fragment RequestTypeLargeFragment on RequestTypeGQLModel {
  initialForm {
      __typename
      id
      name
    }  
}
 */

const RequestTypesTableVisualiser = ({items}) => {
    const [ids, setIds] = useState({
        id: crypto.randomUUID(),                        
        rbacobjectId: crypto.randomUUID(),
    })

    const onRefreshIds = () => {
        setIds(() => ({
            id: crypto.randomUUID(),                        
            rbacobjectId: crypto.randomUUID(),
        }))
        console.log("ids refreshed")
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Tools</th>
                </tr>
            </thead>
            <tbody>
            {items.map(requesttype => (
                <tr key={requesttype.id} >
                    <td>
                        <RequestTypeLink requesttype={requesttype} />
                        {/* {requesttype?.name} */}
                    </td>
                    <td>
                        <RequestButton 
                            operation="C"
                            request={{
                                ...ids,
                                requesttypeId: requesttype?.id,
                                name: `Nový ${requesttype?.name}`,
                                onDone: onRefreshIds
                            }}
                            className="btn btn-outline-success form-control"
                        >
                            Nový požadavekX
                        </RequestButton>    
                    </td>
                
                </tr>
            ))}
            </tbody>
        </table>
    )
}



/**
 * Page component for displaying a (potentially filtered) list of requesttype entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting requesttypes using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=RequestTypeVisualiser] - 
 *   Optional component used to visualize the loaded requesttypes. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized requesttypes.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display requesttypes filtered by a `where` clause passed in the URL, e.g.:
 * //   /requesttype?where={"name":"Example"}
 * <RequestTypeVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <RequestTypeVectorPage Visualiser={CustomRequestTypeList}>
 *   <Footer />
 * </RequestTypeVectorPage>
 */
export const RequestTypeVectorPage = ({children, Visualiser=RequestTypesTableVisualiser}) => {
    const { search } = useLocation();
    const [reset, setReset] = useState(0)
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 10})
    try {
        const params = new URLSearchParams(search);
        const where = params.get('where');        
        queryParams.where = where ? JSON.parse(where) : undefined;
    } catch (e) {
        console.warn("Invalid 'where' query parameter!", e);
    }
    const onDone = (entity) => {
        console.log("RequestTypeVectorPage.onDone", entity, RequestTypeURI)
        setReset((old) => old + 1)
    }
    const onRefresh = () => setReset(value => value + 1)
    // const onRefresh = () => setQueryParams(value => ({...value}))
    return (<>
        {/* <RequestTypePageNavbar requesttype={requesttype} /> */}
        <RequestsNavbar />
        <CQRow>
            <CQCol md={12} lg={3}>
                <RequestTypeFilter />
            </CQCol>
            <CQCol md={12} lg={9}>
                <InfiniteScroll
                    preloadedItems={[]} // No preloaded items for requesttype
                    actionParams={queryParams} 
                    asyncAction={RequestTypeReadPageAsyncAction}
                    Visualiser={Visualiser}
                    reset={reset}
                />
                <RequestTypeCreateButton onDone={onDone} />
                <button className="btn btn-outline-success form-control" onClick={onRefresh}>Obnovit</button>
                {children}
            </CQCol>
        
            
        </CQRow>
        {/* <RequestTypeButton
            operation="C"
            className="btn btn-outline-success form-control"
            requesttype={newItemParams}
            onDone={onDone}
        >
            Vytvořit nový typ požadavků
        </RequestTypeButton> */}
        
        
    </>)
}

export const RequestTypeCreateButton = ({onDone = (item) => null}) => {
    const navigate = useNavigate();
    const getNewItemParams = () => ({
        name: "Nový typ požadavků",
        id: crypto.randomUUID(), 
        rbacobjectId: crypto.randomUUID(),
        
        statemachineId: crypto.randomUUID(),
        statemachinename: "Stavový automat pro proces ",
        stateId: crypto.randomUUID(),
        statename: "Žadatel"

    })
    const [newItemParams, setNewItemParams] = useState(() => getNewItemParams())
    const onDone_ = (entity) => {
        console.log("RequestTypeVectorPage.onDone", entity, RequestTypeURI)
        navigate(`${RequestTypeURI}${entity.id}`)
        setNewItemParams(() => getNewItemParams())
        onDone(entity)
    }
    
    return (
        <RequestTypeButton
            operation="C"
            className="btn btn-outline-success form-control"
            requesttype={newItemParams}
            onDone={onDone_}
        >
            Vytvořit nový typ požadavků
        </RequestTypeButton>
    )
}