## Set of Template Components for an Entity Named Empty

### EmptyLink
```js
/**
 * A component that renders a `ProxyLink` to an empty view page.
 * 
 * The target URL is dynamically constructed using the `empty` object's `id`, 
 * and the link displays the `empty` object's `name` as its content.
 * 
 * @component
 * @param {Object} props - The properties for the EmptyLink component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The display name for the empty entity.
 * 
 * @returns {JSX.Element} A `ProxyLink` component linking to the empty view page.
 * 
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Example Empty Entity" };
 * 
 * <EmptyLink empty={emptyEntity} />
 */
export const EmptyLink = ({empty}) => {
    return <ProxyLink to={'/empty/empty/view/' + empty.id}>{empty.name}</ProxyLink>
}
```

### EmptyMediumContent
```js
/**
 * A component that displays medium-level content for an empty entity.
 *
 * This component renders a label "EmptyMediumContent" followed by a serialized representation of the `empty` object
 * and any additional child content. It is designed to handle and display information about an empty entity object.
 *
 * @component
 * @param {Object} props - The properties for the EmptyMediumContent component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `empty` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyMediumContent empty={emptyEntity}>
 *   <p>Additional information about the entity.</p>
 * </EmptyMediumContent>
 */
export const EmptyMediumContent = ({empty, children}) => {
    return (
        <>
            EmptyMediumContent <br />
            {JSON.stringify(empty)}
            {children}
        </>
    )
}

```

### EmptyCardCapsule

```js
/**
 * A specialized card component that displays an `EmptyLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `EmptyLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `empty` object.
 *
 * @component
 * @param {Object} props - The props for the EmptyCardCapsule component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The display name for the empty entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { EmptyCardCapsule } from './EmptyCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const emptyEntity = { id: 123, name: "Example Entity" };
 *
 * <EmptyCardCapsule empty={emptyEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </EmptyCardCapsule>
 */
export const EmptyCardCapsule = ({empty, children}) => {
    return (
        <CardCapsule title={<><PersonFill /> <EmptyLink empty={empty} /></>}>
            {children}
        </CardCapsule>
    )
}
```

### EmptyMediumCard

This component must be always based on appropriate `CardCapsule` and `MediumContent` components

```js
/**
 * A card component that displays detailed content for an empty entity.
 *
 * This component combines `EmptyCardCapsule` and `EmptyMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the empty entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the EmptyMediumCard component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyMediumCard empty={emptyEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </EmptyMediumCard>
 */
export const EmptyMediumCard = ({empty, children}) => {
    return (
        <EmptyCardCapsule title={<><PersonFill /> <EmptyLink empty={empty} /></>}>
            <EmptyMediumContent empty={empty}>
                {children}
            </EmptyMediumContent>
        </EmptyCardCapsule>
    )
}
```

### EmptyLargeCard

This component must be always based on appropriate `EmptyCardCapsule` and `EmptyMediumCard` components, it is expected that `Row`, `LeftColumn` and `MiddleColumn` are used

```js
/**
 * A large card component for displaying detailed content and layout for an empty entity.
 *
 * This component wraps an `EmptyCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `EmptyMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the EmptyLargeCard component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyLargeCard empty={emptyEntity}>
 *   <p>Additional content for the middle column.</p>
 * </EmptyLargeCard>
 */
export const EmptyLargeCard = ({empty}) => {
    return (
        <EmptyCardCapsule empty={empty} >
            <Row>
                <LeftColumn>
                    <EmptyMediumCard user={user}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </EmptyCardCapsule>
    )
}

```

### For Each Scalar (Object type) Attribute

```js
/**
 * A component for displaying the `scalar` attribute of an empty entity.
 *
 * This component checks if the `scalar` attribute exists on the `empty` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the EmptyScalarAttribute component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {*} [props.empty.scalar] - The scalar attribute of the empty entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <EmptyScalarAttribute empty={emptyEntity} />
 */
export const EmptyScalarAttribute = ({empty}) => {
    const {scalar} = empty
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
 * A component for displaying the `vector` attribute of an empty entity.
 *
 * This component checks if the `vector` attribute exists on the `empty` object. If `vector` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `vector` array and
 * displays a placeholder message and a JSON representation for each item in the `vector`.
 *
 * @component
 * @param {Object} props - The props for the EmptyVectorAttribute component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {Array} [props.empty.vector] - An array of vector items associated with the empty entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `vector` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { 
 *   vector: [
 *     { id: 1, name: "Vector Item 1" }, 
 *     { id: 2, name: "Vector Item 2" }
 *   ] 
 * };
 *
 * <EmptyVectorAttribute empty={emptyEntity} />
 */
export const EmptyVectorAttribute = ({empty}) => {
    const {vector} = empty
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
query EmptyQueryRead($id: id, $where: VectorInputFilter, $skip: Int, $limit: Int) {
    result: emptyById(id: $id) {
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

export const EmptyVectorAttributeInifite = ({empty}) => { 
    const {vector} = empty

    return (
        <InfiniteScroll 
            Visualiser={'VectorMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={VectorAttributeAsyncAction}
        />
    )
}
```

### EmptyPage

This is a component which can be linked into react router

```js
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"
import { EmptyLargeCard } from "../Components/Empty/EmptyLargeCard"

const EmptyQueryRead = `
query EmptyQueryRead($id: id) {
    result: emptyById(id: $id) {
        __typename
        id
    }
}
`

/**
 * An async action for executing a GraphQL query to read empty entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `EmptyQueryRead` query.
 * It can be dispatched with query variables to fetch data related to empty entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the empty entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(EmptyReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
const EmptyReadAsyncAction = createAsyncGraphQLAction(EmptyQueryRead)

/**
 * A page content component for displaying detailed information about an empty entity.
 *
 * This component utilizes `EmptyLargeCard` to create a structured layout and displays 
 * the serialized representation of the `empty` object within the card's content.
 *
 * @component
 * @param {Object} props - The properties for the EmptyPageContent component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 *
 * @returns {JSX.Element} A JSX element rendering the page content for an empty entity.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyPageContent empty={emptyEntity} />
 */
const EmptyPageContent = ({empty}) => {
    return (
        <EmptyLargeCard empty={empty}>
            Empty {JSON.stringify(empty)}
        </EmptyLargeCard>
    )
}

/**
 * A lazy-loading component for displaying content of an empty entity.
 *
 * This component is created using `createLazyComponent` and wraps `EmptyPageContent` to provide
 * automatic data fetching for the `empty` entity. It uses the `EmptyReadAsyncAction` to fetch
 * the entity data and dynamically injects it into the wrapped component as the `empty` prop.
 *
 * @constant
 * @type {React.Component}
 *
 * @param {Object} props - The props for the lazy-loading component.
 * @param {string|number} props.empty - The identifier of the empty entity to fetch and display.
 *
 * @returns {JSX.Element} A component that fetches the `empty` entity data and displays it
 * using `EmptyPageContent`, or shows loading and error states as appropriate.
 *
 * @example
 * // Example usage:
 * const emptyId = "12345";
 *
 * <EmptyPageContentLazy empty={emptyId} />
 */
const EmptyPageContentLazy = createLazyComponent(EmptyPageContent, "empty", EmptyReadAsyncAction)

/**
 * A page component for displaying lazy-loaded content of an empty entity.
 *
 * This component extracts the `id` parameter from the route using `useParams`,
 * constructs an `empty` object, and passes it to the `EmptyPageContentLazy` component.
 * The `EmptyPageContentLazy` component handles the lazy-loading and rendering of the entity's content.
 *
 * @component
 * @returns {JSX.Element} The rendered page component displaying the lazy-loaded content for the empty entity.
 *
 * @example
 * // Example route setup:
 * <Route path="/empty/:id" element={<EmptyPage />} />
 *
 * // Navigating to "/empty/12345" will render the page for the empty entity with ID 12345.
 */
export const EmptyPage = () => {
    const {id} = useParams()
    const empty = {id}
    return <EmptyPageContentLazy empty={empty} />
}
```

### Expected Structure of the Source

- src
    - Components
        - Empty
            - Scalars
                - EmptyScalarAttribute.jsx
                - index.js
            - Vectors
                - EmptyVectorAttribute.jsx
                - index.js
            EmptyCardCapsule.jsx
            EmptyLargeCard.jsx
            EmptyLink.jsx
            EmptyMediumContent.jsx
            index.js
        index.js
    - Pages
        - EmptyPage.jsx
        - index.js
    - index.js
