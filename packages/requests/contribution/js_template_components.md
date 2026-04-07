## Set of Template Components for an Entity Named Request

### RequestLink
```js
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
    return <ProxyLink to={'/request/request/view/' + request.id}>{request.name}</ProxyLink>
}
```

### RequestMediumContent
```js
/**
 * A component that displays medium-level content for an request entity.
 *
 * This component renders a label "RequestMediumContent" followed by a serialized representation of the `request` object
 * and any additional child content. It is designed to handle and display information about an request entity object.
 *
 * @component
 * @param {Object} props - The properties for the RequestMediumContent component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `request` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestMediumContent request={requestEntity}>
 *   <p>Additional information about the entity.</p>
 * </RequestMediumContent>
 */
export const RequestMediumContent = ({request, children}) => {
    return (
        <>
            RequestMediumContent <br />
            {JSON.stringify(request)}
            {children}
        </>
    )
}

```

### RequestCardCapsule

```js
/**
 * A specialized card component that displays an `RequestLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `RequestLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `request` object.
 *
 * @component
 * @param {Object} props - The props for the RequestCardCapsule component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The display name for the request entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { RequestCardCapsule } from './RequestCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const requestEntity = { id: 123, name: "Example Entity" };
 *
 * <RequestCardCapsule request={requestEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </RequestCardCapsule>
 */
export const RequestCardCapsule = ({request, children}) => {
    return (
        <CardCapsule title={<><PersonFill /> <RequestLink request={request} /></>}>
            {children}
        </CardCapsule>
    )
}
```

### RequestMediumCard

This component must be always based on appropriate `CardCapsule` and `MediumContent` components

```js
/**
 * A card component that displays detailed content for an request entity.
 *
 * This component combines `RequestCardCapsule` and `RequestMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the request entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the RequestMediumCard component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestMediumCard request={requestEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </RequestMediumCard>
 */
export const RequestMediumCard = ({request, children}) => {
    return (
        <RequestCardCapsule title={<><PersonFill /> <RequestLink request={request} /></>}>
            <RequestMediumContent request={request}>
                {children}
            </RequestMediumContent>
        </RequestCardCapsule>
    )
}
```

### RequestLargeCard

This component must be always based on appropriate `RequestCardCapsule` and `RequestMediumCard` components, it is expected that `Row`, `LeftColumn` and `MiddleColumn` are used

```js
/**
 * A large card component for displaying detailed content and layout for an request entity.
 *
 * This component wraps an `RequestCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `RequestMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the RequestLargeCard component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {string|number} props.request.id - The unique identifier for the request entity.
 * @param {string} props.request.name - The name or label of the request entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const requestEntity = { id: 123, name: "Sample Entity" };
 * 
 * <RequestLargeCard request={requestEntity}>
 *   <p>Additional content for the middle column.</p>
 * </RequestLargeCard>
 */
export const RequestLargeCard = ({request}) => {
    return (
        <RequestCardCapsule request={request} >
            <Row>
                <LeftColumn>
                    <RequestMediumCard user={user}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </RequestCardCapsule>
    )
}

```

### For Each Scalar (Object type) Attribute

```js
/**
 * A component for displaying the `scalar` attribute of an request entity.
 *
 * This component checks if the `scalar` attribute exists on the `request` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestScalarAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {*} [props.request.scalar] - The scalar attribute of the request entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <RequestScalarAttribute request={requestEntity} />
 */
export const RequestScalarAttribute = ({request}) => {
    const {scalar} = request
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}
```

### For Each Vector Attribute


```js
/**
 * A component for displaying the `vector` attribute of an request entity.
 *
 * This component checks if the `vector` attribute exists on the `request` object. If `vector` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `vector` array and
 * displays a placeholder message and a JSON representation for each item in the `vector`.
 *
 * @component
 * @param {Object} props - The props for the RequestVectorAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {Array} [props.request.vector] - An array of vector items associated with the request entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `vector` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { 
 *   vector: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 *
 * <RequestVectorAttribute request={requestEntity} />
 */
export const RequestVectorAttribute = ({request}) => {
    const {vector} = request
    if (typeof vector === 'undefined') return null
    return (
        <>
            {vector.map(
                item => <div key={item.id}>
                    Probably {'<VectorMediumCard vector=\{item\} />'} <br />
                    {JSON.stringify(item)}
                </div>
            )}
        </>
    )
}

const VectorAttributeQuery = `
query RequestQueryRead($id: id, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: requestById(id: $id) {
        __typename
        id
        vector(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
        }
    }
}
`

const VectorAttributeAsyncAction = createAsyncGraphQLAction(
    VectorAttributeQuery,
    processVectorAttributeFromGraphQLResult("vector")
)

export const RequestVectorAttributeInifite = ({request}) => { 
    const {vector} = request

    return (
        <InfiniteScroll 
            Visualiser={'VectorMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={VectorAttributeAsyncAction}
        />
    )
}
```

### RequestPage

This is a component which can be linked into react router

```js
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { RequestLargeCard } from "../Components/Request/RequestLargeCard"

const RequestQueryRead = `
query RequestQueryRead($id: id) {
    result: requestById(id: $id) {
        __typename
        id
    }
}
`

/**
 * An async action for executing a GraphQL query to read request entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `RequestQueryRead` query.
 * It can be dispatched with query variables to fetch data related to request entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the request entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(RequestReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
const RequestReadAsyncAction = createAsyncGraphQLAction(RequestQueryRead)

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
    return (
        <RequestLargeCard request={request}>
            Request {JSON.stringify(request)}
        </RequestLargeCard>
    )
}

/**
 * A lazy-loading component for displaying content of an request entity.
 *
 * This component is created using `createLazyComponent` and wraps `RequestPageContent` to provide
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
const RequestPageContentLazy = createLazyComponent(RequestPageContent, "request", RequestReadAsyncAction)

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
```

### Expected Structure of the Source

- src
    - Components
        - Request
            - Scalars
                - RequestScalarAttribute.jsx
                - index.js
            - Vectors
                - RequestVectorAttribute.jsx
                - index.js
            RequestCardCapsule.jsx
            RequestLargeCard.jsx
            RequestLink.jsx
            RequestMediumContent.jsx
            index.js
        index.js
    - Pages
        - RequestPage.jsx
        - index.js
    - index.js
