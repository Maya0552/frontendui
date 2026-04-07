import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ButtonWithDialog, createLazyComponent, DeleteButton, ErrorHandler, LeftColumn, LoadingSpinner, MiddleColumn, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { RequestCategoryReadAsyncAction } from "../Queries/RequestCategoryReadAsyncAction"
import { RequestCategoryPageReadAsyncAction } from "../Queries/RequestCategoryPageReadAsyncAction"
import { RequestPageNavbar } from "../../../Pages/RequestPageNavbar"
import { RequestCategoriesTable } from ".."
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared'
import { RequestCategoryInsertAsyncAction } from '../../../Pages/Queries/RequestCategoryInsertMutation'
import { RequestTypeInsertAsyncAction } from '../../../Pages/Queries/RequestTypeInsertMutation'
import { RequestTypeMediumCard } from '../../RequestType/RequestTypeMediumCard'
import { RequestCategoryTypesAttribute } from '../Vectors/RequestCategoryTypesAttribute'
import { RequestCategoryMediumCard } from '../RequestCategoryMediumCard'
import { RequestCategoryCardCapsule } from '../RequestCategoryCardCapsule'
import { RequestTypeCardCapsule } from '../../RequestType/RequestTypeCardCapsule'
import { InsertRequestTypeButton } from '../../RequestType/InsertRequestTypeButton'
import { InsertRequestCategoryButton } from '../InsertRequestCategoryButton'
import { InsertRequestButton } from '../../Request/InsertRequestButton'
import { RequestCategoryLink } from '../RequestCategoryLink'
import { RequestTypeLink } from '../../RequestType/RequestTypeLink'


const RequestTypeMediumCardCol = ({requestcategory, ...props}) => {
    const {requesttype} = props
    return (
        <Col>
            <RequestTypeMediumCard {...props}/>
        </Col>
    )
}


export const TypeRow = ({ requesttype, onAddType }) => {
    const onAdd = (request) => {
        console.log("vztvo5en po6adavek", request)
        window.open(`/requests/request/view/${request.id}`, '_blank'); // Opens in a new tab
    }
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>{requesttype.name}</span>
            <InsertRequestButton 
                onAdd={onAdd} 
                request={{
                    request_type_id: requesttype.id,
                    name: "Žádost " + requesttype.name,
                    name_en: "Request " + (requesttype.nameEn || requesttype.name)
                }}
            >
                Vytvořit požadavek
            </InsertRequestButton>
        </li>
    );
};
export const CategoryCard = ({ requestcategory, onNewRequestType, onAddCategory, onAddType }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="card mb-3">
            {/* Category Header */}
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <strong>{requestcategory.name}</strong>
                    <button
                        className="btn btn-link btn-sm ms-3"
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? "Show Types" : "Hide Types"}
                    </button>
                </div>
                <InsertRequestTypeButton 
                    // params={requestcategory} 
                    className='btn btn-outline-primary form-control'
                    params={{category_id: requestcategory.id}}
                    onDone={onNewRequestType}
                >
                    Vložit nový typ
                </InsertRequestTypeButton>
            </div>

            {/* Collapsible Type Rows */}
            {!isCollapsed && (
                <div className="card-body">
                    <ul className="list-group">
                        {requestcategory.requestTypes.map((requesttype) => (
                            <TypeRow
                                key={requesttype.id}
                                requesttype={requesttype}
                                onAddType={(typeId) => onAddType(requestcategory.id, typeId)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const GroupedCategories = ({ requestcategories, onAddCategory, onAddType, addRow }) => {
    return (
        <div className="container">
            {requestcategories.map((requestcategory) => (
                <CategoryCard
                    key={requestcategory.id}
                    requestcategory={requestcategory}
                    onAddCategory={onAddCategory}
                    onAddType={onAddType}
                />
            ))}
            <InsertRequestCategoryButton className='btn btn-outline-primary form-control' onDone={addRow}>
                Vložit novou kategorii
            </InsertRequestCategoryButton>
        </div>
    );
};



/**
 * A page content component for displaying detailed information about an requestcategory entity.
 *
 * This component utilizes `RequestCategoryLargeCard` to create a structured layout and displays 
 * the serialized representation of the `requestcategory` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the RequestCategoryPageContent component.
 * @param {Array} props.requestcategories - The object representing the requestcategory entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an requestcategory entity.
 *
 * @example
 * // Example usage:
 * const requestcategoryEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestCategoryPageContent requestcategory={requestcategoryEntity} />
 */
const RequestCategoriesPageContent = ({requestcategories = [], onContentChange = ()=>null}) => {
    const items = useSelector(state => state.items)
    requestcategories = Object.values(items).filter(
        item => item?.__typename === "RequestCategoryGQLModel"
    )
    // const [data, setData] = useState(requestcategories || [])
    // const addRow = (newRow) => {
    //     setData(prev => [...prev, newRow])
    // }

    const addRow = () => null
    const onNewRequestType = async (requestType) => {
        console.log("onNewRequestType", requestType)
        onContentChange(requestType)
    }
    // useEffect(() => {
    //     if (requestcategories.length !== requestcategories.length) {
    //         setData(requestcategories)
    //     }
    // }, [requestcategories])
    return (
        <>
            <RequestPageNavbar />
            <Row>
                <LeftColumn></LeftColumn>
                <MiddleColumn>
                    <div class="accordion" id="accordionExample">
                        {requestcategories.map(requestcategory => 
                            <div class="accordion-item">
                                <h2 class="accordion-header"><button 
                                    class="accordion-button" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target={`#${requestcategory.id}`} 
                                    aria-expanded="true" ari
                                    a-controls="collapseOne"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: '0 0 auto', marginRight: '20px'}}>
                                            <RequestCategoryLink requestcategory={requestcategory} />
                                            {/* {requestcategory.name} */}
                                        </div>
                                        <div style={{ flex: '0 0 auto', marginRight: '20px'}}>
                                            
                                            
                                        </div>
                                    </div>
                                </button></h2>
                                <div id={`${requestcategory.id}`}  class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        {requestcategory.requestTypes.map((requesttype) => {
                                            return (
                                                <Row className="align-items-center border-bottom pb-2 mb-2" key={requesttype.id}>
                                                    <Col xs={1}></Col>
                                                    <Col xs={3}>
                                                        <RequestTypeLink requesttype={requesttype} />
                                                    </Col>
                                                    <Col xs={8}>
                                                        <InsertRequestButton
                                                                className='btn btn-outline-primary'
                                                        >
                                                                Založit nový požadavek
                                                        </InsertRequestButton>
                                                    </Col>
                                                </Row>
                                            )
                                        })} 
                                        <br />
                                        <Row className="align-items-center border-bottom pb-2 mb-2" >
                                            <Col xs={1}></Col>
                                            <Col xs={3}>
                                                <InsertRequestTypeButton 
                                                    // params={requestcategory} 
                                                    className='btn btn-outline-primary'
                                                    params={{category_id: requestcategory.id}}
                                                    onDone={onNewRequestType}
                                                >
                                                    Vytvořit nový typ
                                                </InsertRequestTypeButton>                                       
                                            </Col>
                                            <Col xs={8}>
                                                
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                    <InsertRequestCategoryButton 
                        className='btn btn-outline-primary form-control' 
                        // onDone={addRow}
                    >
                        Vložit novou kategorii
                    </InsertRequestCategoryButton>
                </MiddleColumn>
            </Row>
        </>
    )
}

/**
 * A lazy-loading component for displaying the content of multiple `requestcategories` entities.
 *
 * This component is created using `createLazyComponent` and wraps `RequestCategoriesPageContent` to provide
 * automatic data fetching for the `requestcategories` entities. It uses the `RequestCategoryPageReadAsyncAction` to fetch
 * paginated data and dynamically injects it into the wrapped component as the `requestcategories` prop.
 *
 * @constant
 * @type {React.ComponentType}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {Object} props.requestcategories - An object containing pagination and filtering options.
 * @param {number} [props.requestcategories.skip] - The number of records to skip (used for pagination).
 * @param {number} [props.requestcategories.limit] - The maximum number of records to fetch (used for pagination).
 * @param {Object} [props.requestcategories.where] - Filtering options to apply to the query, matching the `RequestCategoryInputFilter` type in the GraphQL schema.
 *
 * @returns {JSX.Element} A lazy-loading component that fetches the `requestcategories` entities data and displays it
 * using `RequestCategoriesPageContent`. The component manages loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const queryOptions = {
 *   skip: 0,
 *   limit: 10,
 *   where: { name: "Example Category" },
 * };
 *
 * <RequestCategoriesPageContentLazy requestcategories={queryOptions} />
 */
const RequestCategoriesPageContentLazy_ = createLazyComponent(RequestCategoriesPageContent, "requestcategories", RequestCategoryPageReadAsyncAction)
const RequestCategoriesPageContentLazy = ({where}) => {
    const {fetch, error, loading, dispatchResult} = useAsyncAction(RequestCategoryPageReadAsyncAction, {where})
    const onContentChange = async ()=> {
        console.log("buble to RequestCategoriesPageContentLazy")
        const refresh = await fetch()
        console.log("refresh ", refresh)
    }
    if (error) return <ErrorHandler errors={error} />
    if (loading) return <LoadingSpinner text={"Nahrávám kategorie požadavků"}/>
    const requestcategories = dispatchResult?.data?.result
    if (!requestcategories) <ErrorHandler errors="Neočekáváně selhal dotaz na server" />
    return (
        <RequestCategoriesPageContent requestcategories= {requestcategories} onContentChange={onContentChange}/>
    )
}
/**
 * A page component for displaying lazy-loaded content of an requestcategory entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `requestcategory` object, and passes it to the `RequestCategoryPageContentLazy` component.
 * The `RequestCategoryPageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the requestcategory entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/requestcategory/:id" element={<RequestCategoryPage />} />
 *
 * // Navigating to "/requestcategory/12345" will render the page for the requestcategory entity with ID 12345.
 */
export const RequestCategoriesPage = () => {
    const {id, where} = useParams()
    return <RequestCategoriesPageContentLazy requestcategories={{where: where, skip: 0, limit: 10}} />
}
