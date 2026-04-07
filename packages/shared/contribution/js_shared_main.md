## Basis Functions for Component Creation

### CardCapsule
```js

/**
 * A reusable card component that encapsulates content with a title and children.
 *
 * This component is a wrapper around a `Card` element. It renders a title in the card header
 * and any additional content in the card body. The `title` is displayed prominently, while
 * the `children` prop allows for flexible content to be passed inside the card.
 *
 * @param {Object} props - The props for the CardCapsule component.
 * @param {string} [props.title=""] - The title displayed in the card's header.
 * @param {React.ReactNode} [props.children=null] - The content to display inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a header and body.
 *
 * @example
 * // Usage example:
 * <CardCapsule title="My Card Title">
 *   <p>This is some content inside the card.</p>
 * </CardCapsule>
 */
```

### InfiniteScroll

```js
/**
 * A reusable component that provides infinite scrolling functionality.
 * 
 * It dynamically fetches and displays items in pages, loading more items as the user scrolls to the end of the list.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.actionParams - Initial parameters for the async action, including pagination info.
 * @param {number} props.actionParams.skip - Initial skip value for pagination.
 * @param {number} props.actionParams.limit - Number of items to fetch per page.
 * @param {Object} [props.actionParams.otherParams] - Additional parameters to pass to the async action.
 * @param {Function} props.asyncAction - The async Redux action used to fetch data. 
 *   This function must return a promise resolving to an array of fetched items.
 * @param {React.ComponentType} props.Visualiser - A component to visualize the fetched data.
 *   It receives the fetched results as a prop `events`.
 * 
 * @example
 * // Redux action to fetch items
 * const fetchItems = ({ skip, limit }) => async (dispatch) => {
 *   const response = await fetch(`/api/items?skip=${skip}&limit=${limit}`);
 *   const result = await response.json();
 *   return result.items;
 * };
 * 
 * // Visualizer Component
 * const ItemsVisualizer = ({ events }) => (
 *   <ul>
 *     {events.map((item) => (
 *       <li key={item.id}>{item.name}</li>
 *     ))}
 *   </ul>
 * );
 * 
 * // Usage
 * <InfiniteScroll
 *   actionParams={{ skip: 0, limit: 10 }}
 *   asyncAction={fetchItems}
 *   Visualiser={ItemsVisualizer}
 * />
 * 
 * @returns {JSX.Element} The rendered infinite scroll component.
 */
```

### createLazyComponent
```js
/**
 * Higher-order function to create a lazy-loading component that fetches an entity using a custom hook.
 *
 * This function wraps a given component (`WrappedComponent`) and dynamically fetches the specified
 * entity (`entityName`) using an asynchronous Redux action (`asyncAction`). It manages loading, error,
 * and success states, and injects the fetched entity into the wrapped component as a prop.
 *
 * @function
 * @param {React.ComponentType} WrappedComponent - The component that will display the fetched entity.
 * @param {string} entityName - The name of the prop representing the entity to be fetched.
 * @param {Function} asyncAction - The asynchronous Redux action used to fetch the entity data.
 *
 * @returns {React.ComponentType} A lazy-loading component that handles the fetching of the entity
 * and passes it to the wrapped component.
 *
 * @example
 * // Example usage:
 * const MyComponent = ({ user }) => <div>User Name: {user.name}</div>;
 * 
 * const exampleQuery = `
 *   query ExampleQuery($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *       groups {
 *          __typename
 *          id
 *          name
 *       }
 *     }
 *   }
 * `;
 *
  * // Create an async action
 * const asyncFetchUser = createAsyncGraphQLAction(
 *   exampleQuery,
 *   processVectorAttributeFromGraphQLResult("groups"),
 *   updateItemsFromGraphQLResult
 * );
 * 
 * const LazyUserComponent = createLazyComponent(MyComponent, "user", asyncFetchUser);
 * 
 * <LazyUserComponent user="123" />
 */
```

### Dialog

```js
/**
 * A customizable dialog component with a title, content, and action buttons.
 *
 * @param {Object} props - The properties for the Dialog component.
 * @param {React.ReactNode} props.children - The content to display inside the dialog.
 * @param {string} [props.title="Dialog"] - The title of the dialog.
 * @param {string} [props.oklabel="Ok"] - The label for the confirmation button.
 * @param {string} [props.cancellabel="Zrušit"] - The label for the cancel button.
 * @param {function} props.onOk - Callback for when the confirmation button is clicked.
 * @param {function} props.onCancel - Callback for when the cancel button or close button is clicked.
 *
 * @example
 * <Dialog
 *   title="Confirm Delete"
 *   oklabel="Delete"
 *   cancellabel="Cancel"
 *   onOk={handleConfirm}
 *   onCancel={handleCancel}
 * >
 *   Are you sure you want to delete this item?
 * </Dialog>
 *
 * @returns {JSX.Element} A styled modal dialog.
 */
```

### ProxyLink
```js
/**
 * A `ProxyLink` component that conditionally determines whether to reload the document based on the link's target.
 * It also preserves existing hash and query parameters from the current URL and appends them to the target path.
 *
 * @param {Object} props - The properties for the ProxyLink component.
 * @param {string} props.to - The target path for the link.
 * @param {React.ReactNode} props.children - The content to render inside the link.
 * @param {Object} props.others - Additional props to pass to the `Link` component.
 *
 * @returns {JSX.Element} A React Router `Link` component with conditional behavior and parameter preservation.
 *
 * @example
 * // Example usage:
 * <ProxyLink to="/local-path">Local Link</ProxyLink>
 * <ProxyLink to="https://external-site.com">External Link</ProxyLink>
 */
```

