import { createSlice } from '@reduxjs/toolkit';

/**
 * Shared module for item management.
 * Provides utility functions and a Redux slice for managing items in a normalized state.
 * @module shared
 */

/**
 * Adds an item to the state. If the item doesn't have an `id`, it generates one.
 *
 * @param {Object} state - The current state, typically a normalized object with items indexed by their IDs.
 * @param {Object} action - The action containing the item to add.
 * @param {Object} action.payload - The item to be added.
 * @returns {Object} The updated state with the new item added.
 */
export const CreateItem = (state, action) => {
    const item = action.payload;
    const id = item.id || crypto.randomUUID();
    if (!item.id) {
        item.id = id;
    }

    state[id] = item
    return state
}

/**
 * Deletes an item from the state by its `id`.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action containing the item to delete.
 * @param {Object} action.payload - The item to be deleted.
 * @returns {Object} The updated state with the item removed.
 */
export const DeleteItem = (state, action) => {
    const item = action.payload;
    delete state[item.id];

    return state;
};

/**
 * Replaces an item in the state with the given item.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action containing the new item.
 * @param {Object} action.payload - The new item to replace the existing one.
 * @returns {Object} The updated state with the item replaced.
 */
export const ReplaceItem = (state, action) => {
    const newItem = action.payload;
    state[newItem.id] = newItem;

    return state;
};

/**
 * Updates an existing item in the state by merging its properties with new properties.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action containing the item to update.
 * @param {Object} action.payload - The updated item.
 * @returns {Object} The updated state with the modified item.
 */
export const UpdateItem = (state, action) => {
    const newItem = action.payload;
    const oldItem = state[newItem.id];
    state[newItem.id] = { ...oldItem, ...newItem };

    return state;
};

/**
 * Updates a sub-array attribute (vector) of an item in the state.
 * Sub-items with a `__typename` are also merged into the state for normalization.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action containing the item and vector to update.
 * @param {Object} action.payload - The payload of the action.
 * @param {Object} action.payload.item - The item containing the sub-array to update.
 * @param {string} action.payload.vectorname - The name of the sub-array attribute to update.
 * @returns {Object} The updated state.
 */
export const UpdateSubVector = (state, action) => {
    const { item, vectorname } = action.payload;
    // console.log("UpdateSubVector.new", item[vectorname])
    const testItem = state[item.id]
    if (!testItem) {
        console.log("UpdateSubVector, item not found, setting directly", item)
        state[item.id] = {...item}
    } else {
        const oldItem = state[item.id]
        // if (oldItem[vectorname]) {
        //     console.log("UpdateSubVector.old", [...oldItem[vectorname]])
        //     console.log("UpdateSubVector.old", oldItem[vectorname].length)
        // }
            
        const subItems = vectorname in oldItem ? oldItem[vectorname] : [];
        const indexedSubItems = {};

        // Index existing sub-items by their IDs
        for (let i of subItems) {
            indexedSubItems[i.id] = i;
        }

        // Update or add sub-items
        for (let i of item[vectorname]) {
            if (i?.__typename) {
                state[i.id] = { ...state[i.id], ...i };
            }
            const existing = indexedSubItems[i.id] || {};
            indexedSubItems[i.id] = { ...existing, ...i };
        }

        oldItem[vectorname] = Object.values(indexedSubItems);
    }
    return state;
};

/**
 * Updates a scalar attribute of an item in the state.
 * If the scalar is a nested item with a `__typename`, it is also normalized into the state.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action containing the item and scalar to update.
 * @param {Object} action.payload - The payload of the action.
 * @param {Object} action.payload.item - The item containing the scalar to update.
 * @param {string} action.payload.scalarname - The name of the scalar attribute to update.
 * @returns {Object} The updated state.
 */
export const UpdateSubScalar = (state, action) => {
    const { item, scalarname } = action.payload;
    const oldItem = state[item.id];
    const newSubitem = item[scalarname];
    oldItem[scalarname] = { ...oldItem[scalarname], ...newSubitem };
    if (newSubitem?.__typename) {
        state[newSubitem.id] = { ...state[newSubitem.id], ...newSubitem };
    }
    return state;
};

// Exported action names for Redux slice
const item_add = CreateItem;
const item_update = UpdateItem;
const item_replace = ReplaceItem;
const item_delete = DeleteItem;
const item_updateAttributeScalar = UpdateSubScalar;
const item_updateAttributeVector = UpdateSubVector;

/**
 * Redux slice for managing items in a normalized state.
 */
export const ItemSlice = createSlice({
    name: 'items',
    initialState: {},
    reducers: {
        item_add,
        item_update,
        item_replace,
        item_delete,
        item_updateAttributeScalar,
        item_updateAttributeVector,
    },
});

export const ItemReducer = ItemSlice.reducer;
export const ItemActions = ItemSlice.actions;
