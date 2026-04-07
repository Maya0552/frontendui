import { Droppable, Draggable } from "@hello-pangea/dnd";
export { DragDropContext } from "@hello-pangea/dnd";

const grid = 8;

/**
 * Generates the styles for a draggable item based on its dragging state.
 *
 * @param {Object} provided - The object provided by the `Draggable` component, containing draggable props and styles.
 * @param {Object} provided.draggableProps - The draggable properties passed to the item.
 * @param {Object} snapshot - The snapshot object that contains the state of the draggable item.
 * @param {boolean} snapshot.isDragging - Indicates whether the item is currently being dragged.
 * 
 * @returns {Object} The computed style object for the draggable item, including visual feedback for dragging state.
 * 
 * @example
 * <Draggable draggableId="item-1" index={0}>
 *   {(provided, snapshot) => (
 *     <div
 *       ref={provided.innerRef}
 *       {...provided.draggableProps}
 *       {...provided.dragHandleProps}
 *       style={getItemStyleDefault(provided, snapshot)}
 *     >
 *       Draggable Item
 *     </div>
 *   )}
 * </Draggable>
 */
const getItemStyleDefault = (provided, snapshot) => ({
    userSelect: "none",
    // padding: grid,
    // margin: `0 0 ${grid}px 0`, // Add space below each item
    background: snapshot.isDragging ? "lightgreen" : "white", // Highlight dragging item
    // border: isDragging ? "1px solid lightgrey": "none", // Add a border for clarity
    border: "none", // Add a border for clarity
    borderRadius: "4px", // Rounded corners
    // boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Subtle shadow on drag
    ...provided.draggableProps.style, // Apply Draggable styles
});

/**
 * Generates the styles for a droppable list based on its dragging state.
 *
 * @param {Object} provided - The object provided by the `Droppable` component, containing droppable props and styles.
 * @param {Object} snapshot - The snapshot object that contains the state of the droppable list.
 * @param {boolean} snapshot.isDraggingOver - Indicates whether an item is currently being dragged over the list.
 * 
 * @returns {Object} The computed style object for the droppable list, including visual feedback for dragging state.
 * 
 * @example
 * <Droppable droppableId="list-1" direction="horizontal">
 *   {(provided, snapshot) => (
 *     <div
 *       ref={provided.innerRef}
 *       {...provided.droppableProps}
 *       style={getListStyleDefault(provided, snapshot)}
 *     >
 *       <!-- Draggable items will be dynamically rendered here -->
 *     </div>
 *   )}
 * </Droppable>
 */ 
const getListStyleDefault = (provided, snapshot) => ({
    display: "flex",
    // flexDirection: snapshot.isDraggingOver ?"column":"row", // Stack items horizontaly
    flexDirection: "row", // Stack items horizontaly
    gap: `${grid}px`, // Add consistent spacing
    background: snapshot.isDraggingOver ? "lightblue" : "transparent",
    // padding: `${grid}px`,
    borderRadius: "4px",
    // minHeight: "100px", // Ensure droppable area has a minimum height
    transition: "background-color 0.3s ease",
});

/**
 * A reusable component for rendering the content of a draggable item.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.provided - The object provided by the `Draggable` component.
 * @param {Object} props.provided.draggableProps - Props required for the draggable container.
 * @param {Object} props.provided.dragHandleProps - Props required for the draggable handle.
 * @param {Function} props.provided.innerRef - Reference to the draggable DOM element.
 * @param {Object} props.snapshot - The snapshot object representing the state of the draggable item.
 * @param {boolean} props.snapshot.isDragging - Indicates if the item is currently being dragged.
 * @param {React.ReactNode} props.children - The children elements to render inside the draggable container.
 * @param {Function} [props.getItemStyle=getItemStyleDefault] - A function to compute the styles for the draggable item.
 *
 * @returns {JSX.Element} A styled `div` containing the draggable item content.
 *
 * @example
 * <Draggable draggableId="item-1" index={0}>
 *   {(provided, snapshot) => (
 *     <DragableEnvelopContent
 *       provided={provided}
 *       snapshot={snapshot}
 *       getItemStyle={(provided, snapshot) => ({
 *         background: snapshot.isDragging ? "lightblue" : "white",
 *       })}
 *     >
 *       <div>Draggable Item</div>
 *     </DragableEnvelopContent>
 *   )}
 * </Draggable>
 */
export const DragableEnvelopContent = ({provided, snapshot, children, getItemStyle=getItemStyleDefault}) => {
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(provided, snapshot)}
        >
            {children}
        </div>                
    )
}

/**
 * A wrapper component for a draggable item, integrating with `react-beautiful-dnd` or `@hello-pangea/dnd`.
 * It renders a draggable item and passes its state and props to `DragableEnvelopContent`.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.draggableId - A unique identifier for the draggable item.
 * @param {number} props.index - The index of the draggable item within the list.
 * @param {React.ReactNode} props.children - The children elements to render inside the draggable item.
 *
 * @returns {JSX.Element} A `Draggable` component wrapped with `DragableEnvelopContent`.
 *
 * @example
 * <DragDropContext onDragEnd={handleDragEnd}>
 *   <Droppable droppableId="droppable-1">
 *     {(provided) => (
 *       <div ref={provided.innerRef} {...provided.droppableProps}>
 *         {items.map((item, index) => (
 *           <DragableEnvelop key={item.id} draggableId={item.id} index={index}>
 *             <div>{item.content}</div>
 *           </DragableEnvelop>
 *         ))}
 *         {provided.placeholder}
 *       </div>
 *     )}
 *   </Droppable>
 * </DragDropContext>
 */
export const DragableEnvelop = ({draggableId, index, children, getItemStyle=getItemStyleDefault}) => {
    return (
        <Draggable draggableId={draggableId} index={index}>
            {(provided, snapshot) => 
                <DragableEnvelopContent provided={provided} snapshot={snapshot} getItemStyle={getItemStyle} >
                    {children}
                </DragableEnvelopContent>
            }
        </Draggable>
    )
}

/**
 * A component that renders the content of a droppable area, integrating with `react-beautiful-dnd` or `@hello-pangea/dnd`.
 * It applies styles dynamically based on the state of the droppable area.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.provided - The object provided by the `Droppable` component.
 * @param {Object} props.provided.droppableProps - Props required for the droppable container.
 * @param {Function} props.provided.innerRef - Reference to the droppable DOM element.
 * @param {React.ReactNode} props.provided.placeholder - Placeholder element for the droppable area.
 * @param {Object} props.snapshot - The snapshot object representing the state of the droppable area.
 * @param {boolean} props.snapshot.isDraggingOver - Indicates if an item is being dragged over the droppable area.
 * @param {boolean} props.snapshot.isUsingPlaceholder - Indicates if the placeholder is visible in the droppable area.
 * @param {React.ReactNode} props.children - The children elements to render inside the droppable area.
 * @param {Function} [props.getListStyle=getListStyleDefault] - A function to compute the styles for the droppable container.
 *
 * @returns {JSX.Element} A `div` styled as a droppable area, containing children and the placeholder.
 *
 * @example
 * <Droppable droppableId="droppable-1" direction="horizontal">
 *   {(provided, snapshot) => (
 *     <DroppableContainerContent
 *       provided={provided}
 *       snapshot={snapshot}
 *       getListStyle={(provided, snapshot) => ({
 *         display: "flex",
 *         flexDirection: "row",
 *         background: snapshot.isDraggingOver ? "lightblue" : "white",
 *       })}
 *     >
 *       <div>Item 1</div>
 *       <div>Item 2</div>
 *     </DroppableContainerContent>
 *   )}
 * </Droppable>
 */
export const DroppableContainerContent = ({provided, snapshot, children, getListStyle=getListStyleDefault}) => {
    // console.log("DroppableContainer.Content", snapshot)

    return (
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(provided, snapshot)}
        >
            {children}
            {snapshot.isUsingPlaceholder? provided.placeholder: ""}
        </div>
    )
}

/**
 * A wrapper component for a droppable area, integrating with `react-beautiful-dnd` or `@hello-pangea/dnd`.
 * It uses `DroppableContainerContent` to render the droppable area with styles and state handling.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.droppableId - A unique identifier for the droppable area.
 * @param {React.ReactNode} props.children - The children elements to render inside the droppable area.
 * @param {string} [props.direction="horizontal"] - The direction of the droppable area layout. Can be "horizontal" or "vertical".
 *
 * @returns {JSX.Element} A `Droppable` component wrapped with `DroppableContainerContent`.
 *
 * @example
 * <DroppableContainer droppableId="droppable-1" direction="horizontal">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </DroppableContainer>
 *
 * @example
 * <DragDropContext onDragEnd={handleDragEnd}>
 *   <DroppableContainer droppableId="list-1" direction="vertical">
 *     {items.map((item, index) => (
 *       <DragableEnvelop key={item.id} draggableId={item.id} index={index}>
 *         <div>{item.content}</div>
 *       </DragableEnvelop>
 *     ))}
 *   </DroppableContainer>
 * </DragDropContext>
 */
export const DroppableContainer = ({droppableId, children, direction="horizontal", getListStyle=getListStyleDefault}) => { 
    return (
        <Droppable key={droppableId} droppableId={droppableId} direction={direction}>
            {(provided, snapshot) => <DroppableContainerContent provided={provided} snapshot={snapshot} getListStyle={getListStyle}>
                    {children}
                </DroppableContainerContent>
            }
        </Droppable>
    )
}
