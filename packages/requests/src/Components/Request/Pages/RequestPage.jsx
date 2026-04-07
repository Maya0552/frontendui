import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { AsyncComponent, createLazyComponent, ErrorHandler, HashContainer, LeftColumn, LoadingSpinner, MiddleColumn, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { RequestCurrentState, RequestStateAttribute } from "../Scalars/RequestStateAttribute"
import { VerticalArcGraph } from "@hrbolek/uoisfrontend-ug"
import { RequestMediumContent } from "../RequestMediumContent"
import { HorizontalLine } from "../../Part"
import { RequestPageNavbar } from "./RequestPageNavbar"
import { RequestStateMachine } from "../Scalars/RequestStateMachine"
import { RequestLink } from "../RequestLink"
import { FormSectionAttributeView } from "../../Form/Vectors/FormSectionsAttribute"
import { RequestReadAsyncAction } from "../Queries/RequestReadAsyncAction"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"


/**
 * A page content component for displaying detailed information about an request entity.
 *
 * This component utilizes `RequestLargeCard` to create a structured layout and displays 
 * the serialized representation of the `request` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the RequestPageContent component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an request entity.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestPageContent request={requestEntity} />
 */
const RequestPageContent = ({request}) => {
  const histories = request?.histories || []
  const firstform = request?.form || {}
    return (
        // <>
        // Request {JSON.stringify(request)}
        // </>
        <>
            <RequestPageNavbar request={request} />
            <Row>
                
                <LeftColumn>
                    <HashContainer>
                        <div id="history">
                            <div className="print-only">
                                <HorizontalLine>{request?.id}</HorizontalLine>
                            </div>
                            <SimpleCardCapsule title={<><RequestLink request={request} /> (Historie) </>}>
                                <RequestMediumContent request={request}>

                                </RequestMediumContent>
                            </SimpleCardCapsule>
                            {/* <RequestMediumCard request={request}>
                            
                            </RequestMediumCard> */}
                        </div>
                        <div id="roles">
                            Role
                        </div>
                        <div id="graph">
                            <RequestStateMachine request={request} />
                        </div>
                    </HashContainer>
                </LeftColumn>
                
                <div className="print-only page-break-after"></div>
                <MiddleColumn>
                    <div className="print-only">
                        <HorizontalLine>{request?.id}</HorizontalLine>
                    </div>
                    <SimpleCardCapsule title={<><RequestLink request={request} /> (Formulář) <RequestCurrentState request={request} /></>}>
                        
                        {/* <hr /> */}
                        {/* <Divider type="text" text="Formulář žádosti" /> */}
                        <FormSectionAttributeView form={firstform} />
                        {/* <hr /> */}
                        <div className='screen-only'>
                        <Divider type="text" text="Odeslání k dalšímu zpracování" />
                        <RequestStateAttribute request={request} />
                        </div>
                    </SimpleCardCapsule>
                    
                    {JSON.stringify(request?.state)}
                    {JSON.stringify(request?.createdby)}
                    {/* {JSON.stringify(request?.state)} */}
                    <HashContainer>
                        <Row id="">
                            <Col>
                            </Col>
                        </Row>
                    </HashContainer>
                </MiddleColumn>
            </Row>  
            
        </>
    )
}


const styles = {
  divider: {
      border: "none",
      height: "2px",
      backgroundColor: "#6c757d",
      margin: "1rem 0",
      opacity: 0.7,
  },
  dottedDivider: {
      border: "0",
      borderTop: "2px dotted #6c757d",
      margin: "1.5rem 0",
      opacity: 0.8,
  },
  textDividerContainer: {
    display: "flex",
    alignItems: "center",
    color: "#6c757d",
    textTransform: "uppercase",
    fontSize: "0.85rem",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
  },
  textDividerLine: {
      flex: 1,
      borderTop: "2px solid #6c757d",
      // margin: "0 0.5rem",
      opacity: 0.7,
  },
};

const Divider = ({ type, text }) => {
  if (type === "dotted") {
      return <hr style={styles.dottedDivider} />;
  }

  if (type === "text") {
      return (
          <div style={styles.textDividerContainer}>
              <div style={styles.textDividerLine}></div>
              <span style={{"margin": "0 0.5rem"}}>{text}</span>
              <div style={styles.textDividerLine}></div>
          </div>
      );
  }

  return <hr style={styles.divider} />;
};


/**
 * A lazy-loading component for displaying content of an request entity.
 *
 * This component wraps `RequestPageContent` to provide
 * automatic data fetching for the `request` entity. It uses the `RequestReadAsyncAction` to fetch
 * the entity data and dynamically injects it into the wrapped component as the `request` prop.
 *
 * @constant
 * @type {React.Component}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {string|number} props.request - The identifier of the request entity to fetch and display.
 *
 * @returns {JSX.Element} A component that fetches the `request` entity data and displays it
 * using `RequestPageContent`, or shows loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const requestId = "12345";
 *
 * <RequestPageContentLazy request={requestId} />
 */
const RequestPageContentLazy = ({request}) => {
    const {
        loading,
        error,
        entity
    } = useAsyncAction(RequestReadAsyncAction, request)

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {!entity && !loading && <span>Nenalezeno</span>}
        {/* <RequestPageContent request={entity} /> */}
        {/* {JSON.stringify(entity)} */}
        {entity && <RequestPageContent request={entity} />}
    </>)
}

/**
 * A page component for displaying lazy-loaded content of an request entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `request` object, and passes it to the `RequestPageContentLazy` component.
 * The `RequestPageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the request entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/request/:id" element={<RequestPage />} />
 *
 * // Navigating to "/request/12345" will render the page for the request entity with ID 12345.
 */
export const RequestPage = () => {
    const {id} = useParams()
    const request = {id}
    return <RequestPageContentLazy request={request} />
}