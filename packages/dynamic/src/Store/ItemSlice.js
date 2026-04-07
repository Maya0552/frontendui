import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

/**
 * Entity adapter pro items.
 * - očekává, že každá entita má `id` (UUID).
 */
const itemsAdapter = createEntityAdapter({
    selectId: (item) => item.id,
});

/**
 * Helper pro generování náhradního ID, když item žádné nemá.
 */
const generateId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

/**
 * Normalizované počáteční state:
 * {
 *   ids: [],
 *   entities: {}
 * }
 */
const initialState = itemsAdapter.getInitialState();

/**
 * Přidá / nahradí item v adapteru, doplní id a případná metadata.
 */
const upsertItem = (state, item) => {
    const id = item.id || generateId();
    const prev = state.entities[id] || {};
    const next = {
        ...prev,
        ...item,
        id,
        _updatedAt: Date.now(),
        _version: (prev._version ?? 0) + 1,
    };
    itemsAdapter.upsertOne(state, next);
    return next;
};

const asArray = (payload) => {
    if (!payload) return [];
    return Array.isArray(payload) ? payload : [payload];
};

/**
 * RTK Slice pro normalizované items.
 *
 * Tvar stavu:
 * {
 *   ids: string[],
 *   entities: {
 *     [id: string]: {
 *       id: string;
 *       __typename?: string;
 *       ...další pole...
 *       _updatedAt?: number;
 *       _version?: number;
 *     }
 *   }
 * }
 */
export const ItemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        /**
         * Vloží nový item. Pokud nemá `id`, vygeneruje se.
         * payload: { ...item }
         */
        item_add: (state, action) => {
            const items = asArray(action.payload);
            for (const item of items) {
                upsertItem(state, item);
            }
        },

        /**
         * “Replace” – nastaví item tak, jak je (přepíše existující).
         * payload: { ...item, id }
         */
        item_replace: (state, action) => {
            // console.log("item_replace", action)
            const item = action.payload;
            const id = item.id || generateId();
            const next = {
                ...item,
                id,
                _updatedAt: Date.now(),
                _version: (state.entities[id]?._version ?? 0) + 1,
            };
            itemsAdapter.setOne(state, next);
        },

        /**
         * Update – merge existujícího itemu s partial daty.
         * payload: { ...partialItem, id }
         */
        item_update: (state, action) => {
            const items = asArray(action.payload);
            if (items.length === 0) return;

            const now = Date.now();

            const stripUndefined = (obj) => {
                if (!obj || typeof obj !== "object") return obj;
                const out = {};
                for (const [k, v] of Object.entries(obj)) {
                    if (v !== undefined) out[k] = v;
                }
                return out;
            };

            // batch větev
            if (items.length > 1) {
                const updates = [];

                for (const raw of items) {
                    const id = raw?.id;
                    if (!id) continue;

                    const prev = state.entities[id] || {};
                    const cleaned = stripUndefined(raw); // <-- klíčové

                    updates.push({
                        id,
                        changes: {
                            ...cleaned,
                            _updatedAt: now,
                            _version: (prev._version ?? 0) + 1,
                        },
                    });
                }

                if (updates.length) itemsAdapter.updateMany(state, updates);
                // if (updates.length) itemsAdapter.upsertMany(state, updates);
                return;
            }

            // single větev
            const raw = items[0];
            const id = raw?.id;
            if (!id) return;

            const prev = state.entities[id] || {};
            const cleaned = stripUndefined(raw); // <-- klíčové

            itemsAdapter.updateOne(state, {
                id,
                changes: {
                    ...cleaned,
                    _updatedAt: now,
                    _version: (prev._version ?? 0) + 1,
                },
            });
        },

        /**
         * Smaže item podle id.
         * payload: { id } nebo přímo id
         */
        item_delete: (state, action) => {
            const payload = action.payload;
            const id = typeof payload === "string" ? payload : payload?.id;
            if (!id) return;
            itemsAdapter.removeOne(state, id);
        },

        /**
         * Update scalar atributu u itemu a případné normalizace vnořeného objektu.
         * payload: { item, scalarname }
         *  - item: objekt obsahující id a nové hodnoty scalaru
         *  - scalarname: název field (např. "owner", "template", ...)
         */
        item_updateAttributeScalar: (state, action) => {
            const { item, scalarname } = action.payload || {};
            if (!item || !item.id || !scalarname) return;

            const base = state.entities[item.id] || {};
            const oldScalar = base[scalarname] || {};
            const newScalar = item[scalarname];

            // update parent
            itemsAdapter.updateOne(state, {
                id: item.id,
                changes: {
                    [scalarname]:
                        newScalar && typeof newScalar === "object"
                            ? { ...oldScalar, ...newScalar }
                            : newScalar,
                    _updatedAt: Date.now(),
                    _version: (base._version ?? 0) + 1,
                },
            });

            // pokud je scalar zároveň entita s __typename, normalizujeme ji
            if (newScalar && typeof newScalar === "object" && newScalar.__typename) {
                upsertItem(state, newScalar);
            }
        },

        /**
         * Update vektorového atributu (pole sub-entit) u parent itemu.
         * payload: { item, vectorname }
         *  - item: objekt obsahující id parenta a nový vektor (item[vectorname] = [...])
         *  - vectorname: název pole (např. "roles", "children", ...)
         *
         * Implementace:
         *  - všechny sub-itemy, které mají __typename, normalizuje do entities
         *  - v parentovi uloží celé objekty (jako dřív), ale klidně si to můžeš upravit na IDs
         */
        item_updateAttributeVector: (state, action) => {
            const { item, vectorname } = action.payload || {};
            if (!item || !item.id || !vectorname) return;

            const parent = state.entities[item.id] || {};
            const oldVector = Array.isArray(parent[vectorname])
                ? parent[vectorname]
                : [];
            const newVector = Array.isArray(item[vectorname])
                ? item[vectorname]
                : [];

            // Index původních sub-itemů podle id
            const indexed = {};
            for (const sub of oldVector) {
                if (sub && sub.id) {
                    indexed[sub.id] = sub;
                }
            }

            // merge/update + normalizace
            for (const sub of newVector) {
                if (!sub) continue;
                const id = sub.id || generateId();

                // pokud je sub entita s __typename, normalizujeme ji do adapteru
                if (sub.__typename) {
                    upsertItem(state, { ...sub, id });
                }

                const prev = indexed[id] || {};
                indexed[id] = { ...prev, ...sub, id };
            }

            const mergedVector = Object.values(indexed);

            itemsAdapter.updateOne(state, {
                id: item.id,
                changes: {
                    [vectorname]: mergedVector,
                    _updatedAt: Date.now(),
                    _version: (parent._version ?? 0) + 1,
                },
            });
        },


        /**
         * Update childItem uvnitř uloženého mainItem.
         * payload: { mainItem, childItem }
         *
         * mainItem: objekt s { id } (minimálně) – určuje parenta v `state.entities`
         * childItem: objekt s { id, __typename } – hledaný a updatovaný child
         *
         * Shoda child objektů je dána: child.id === childItem.id && child.__typename === childItem.__typename
         *
         * Chování:
         * - projde rekurzivně celý uložený mainItem (včetně vnořených objektů a polí)
         * - kdekoliv narazí na matching child objekt, provede merge: { ...oldChild, ...childItem }
         * - aktualizuje mainItem ve store (_updatedAt, _version)
         * - volitelně také normalizuje child entitu do `entities` přes upsertItem (pokud má __typename)
         */
        item_updateChildInMain: (state, action) => {
            const { mainItem, childItem } = action.payload || {};
            const mainId = mainItem?.id;
            const childId = childItem?.id;
            const childTypename = childItem?.__typename;

            if (!mainId || !childId || !childTypename) return;

            const prevMain = state.entities[mainId];
            if (!prevMain) return;

            const isMatch = (obj) =>
                obj &&
                typeof obj === "object" &&
                obj.id === childId &&
                obj.__typename === childTypename;

            // Rekurzivní "deep update" s copy-on-write: vytváří kopie jen když dojde ke změně
            const deepUpdate = (node) => {
                if (!node) return node;

                // Array
                if (Array.isArray(node)) {
                    let changed = false;
                    const nextArr = node.map((x) => {
                        const nx = deepUpdate(x);
                        if (nx !== x) changed = true;
                        return nx;
                    });
                    return changed ? nextArr : node;
                }

                // Object (pozor na Date apod. – tady předpokládáme plain objekty)
                if (typeof node === "object") {
                    // pokud je to přímo child objekt, proveď merge
                    if (isMatch(node)) {
                        return { ...node, ...childItem };
                    }

                    let changed = false;
                    const nextObj = { ...node };
                    for (const [k, v] of Object.entries(node)) {
                        const nv = deepUpdate(v);
                        if (nv !== v) {
                            nextObj[k] = nv;
                            changed = true;
                        }
                    }
                    return changed ? nextObj : node;
                }

                // Primitive
                return node;
            };

            const updatedMain = deepUpdate(prevMain);

            // Pokud se nic nezměnilo, nic neukládej
            if (updatedMain === prevMain) return;

            const now = Date.now();

            itemsAdapter.updateOne(state, {
                id: mainId,
                changes: {
                    ...updatedMain,
                    _updatedAt: now,
                    _version: (prevMain._version ?? 0) + 1,
                },
            });

            // Volitelná normalizace child entity do store (pokud ji chceš mít i v entities)
            // (je bezpečné i když run/mutace nevrací entitu; tady rovnou upsertujeme to, co máme)
            //   if (childItem && typeof childItem === "object" && childItem.__typename) {
            //     upsertItem(state, childItem);
            //   }
        },
    },
});

export const ItemReducer = ItemSlice.reducer;
export const ItemActions = ItemSlice.actions;

// Selektory z adapteru
// Použití: const allItems = selectAll(state);
const adapterSelectors = itemsAdapter.getSelectors((state) => state.items);

export const selectItemById = adapterSelectors.selectById;
export const selectAllItems = adapterSelectors.selectAll;
export const selectItemsEntities = adapterSelectors.selectEntities;
export const selectItemsIds = adapterSelectors.selectIds;
export const selectItemsTotal = adapterSelectors.selectTotal;
