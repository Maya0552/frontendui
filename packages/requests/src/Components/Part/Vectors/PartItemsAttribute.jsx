import { useState } from 'react'
import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"
import { DragDropContext, DragableEnvelop, DroppableContainer } from '../../DragAndDrop/dad';

import { Item } from "../../Item/Item"

/**
 * A component for displaying the `items` attribute of an part entity.
 *
 * This component checks if the `items` attribute exists on the `part` object. If `items` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `items` array and
 * displays a placeholder message and a JSON representation for each item in the `items`.
 *
 * @component
 * @param {Object} props - The props for the PartItemsAttribute component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {Array} [props.part.items] - An array of items items associated with the part entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `items` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const partEntity = { 
 *   items: [
 *     { id: 1, name: "Item Item 1" }, 
 *     { id: 2, name: "Item Item 2" }
 *   ] 
 * };
 *
 * <PartItemsAttribute part={partEntity} />
 */
export const PartItemsAttributeView = ({part}) => {
    const items = ([...part?.items || []]).sort((a,b) => a?.order - b?.order)

    if (typeof items === 'undefined') return null
    return (
        <>
            {items.map(
                item => <div key={item.id}>
                    <Item item={item} />
                </div>
            )}
        </>
    )
}


const grid = 8
const getListStyleDefault = (provided, snapshot) => ({
    display: "flex",
    // flexDirection: snapshot.isDraggingOver ?"column":"row", // Stack items horizontaly
    flexDirection: "column", // Stack items horizontaly
    gap: `${grid}px`, // Add consistent spacing
    background: snapshot.isDraggingOver ? "lightblue" : "transparent",
    // padding: `${grid}px`,
    borderRadius: "4px",
    // minHeight: "100px", // Ensure droppable area has a minimum height
    transition: "background-color 0.3s ease",
});



export const PartItemsAttribute = ({part}) => {
    const items = ([...part?.items || []]).sort((a,b) => a?.order - b?.order)

    if (typeof items === 'undefined') return null

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);
        console.log("PartItemsAttribute.onDragEnd", reorderedItems)
        // setItems(reorderedItems);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <DroppableContainer droppableId={`items-${part.id}`} getListStyle={getListStyleDefault}>
                {items.map((item, index) => (
                    <DragableEnvelop key={item.id} index={index} draggableId={item.id}>
                        {/* <div style={{ padding: "8px", background: "white", borderRadius: "4px" }}> */}
                            <Item item={item} />
                        {/* </div> */}
                    </DragableEnvelop>
                ))}
            </DroppableContainer>
        </DragDropContext>
    );
}

const ItemsAttributeQuery = `
query PartQueryRead($id: id, $where: ItemInputFilter, $skip: Int, $limit: Int) {
    result: partById(id: $id) {
        __typename
        id
        items(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
        }
    }
}
`

const ItemsAttributeAsyncAction = createAsyncGraphQLAction(
    ItemsAttributeQuery,
    processVectorAttributeFromGraphQLResult("items")
)

export const PartItemsAttributeInifite = ({part}) => { 
    const {items} = part

    return (
        <InfiniteScroll 
            Visualiser={'ItemMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={ItemsAttributeAsyncAction}
        />
    )
}