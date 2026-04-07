// depGraph.js

export function cloneDepGraph(depGraph) {
    const out = {};
    for (const [k, edges] of Object.entries(depGraph || {})) {
        out[k] = edges.map((e) => ({ ...e }));
    }
    return out;
}

export function addEdge(depGraph, fromFrag, toFrag, viaField) {
    const g = cloneDepGraph(depGraph);
    if (!g[fromFrag]) g[fromFrag] = [];
    // de-dupe
    const exists = g[fromFrag].some(
        (e) => e.to === toFrag && e.viaField === viaField
    );
    if (!exists) g[fromFrag].push({ to: toFrag, viaField });
    return g;
}

export function wouldCreateCycle(depGraph, fromFrag, toFrag) {
    // cycle if there is a path toFrag ~> fromFrag
    if (fromFrag === toFrag) {
        return {
            cycle: true,
            path: [{ from: fromFrag, viaField: "(self)", to: toFrag }],
        };
    }

    const g = depGraph || {};
    const stack = [toFrag];
    const visited = new Set([toFrag]);

    // parent pointers: node -> { prevNode, edge }
    const parent = new Map();

    while (stack.length) {
        const cur = stack.pop();
        const edges = g[cur] || [];

        for (const edge of edges) {
            const nxt = edge.to;
            if (visited.has(nxt)) continue;

            visited.add(nxt);
            parent.set(nxt, { prev: cur, edge: { from: cur, to: nxt, viaField: edge.viaField } });

            if (nxt === fromFrag) {
                // reconstruct path: toFrag -> ... -> fromFrag
                const pathEdges = [];
                let node = fromFrag;
                while (node !== toFrag) {
                    const p = parent.get(node);
                    if (!p) break;
                    pathEdges.push(p.edge);
                    node = p.prev;
                }
                pathEdges.reverse();
                // plus the prospective new edge would close the loop:
                pathEdges.push({ from: fromFrag, viaField: "(new)", to: toFrag });
                return { cycle: true, path: pathEdges };
            }

            stack.push(nxt);
        }
    }

    return { cycle: false, path: null };
}

export function formatCyclePath(pathEdges) {
    if (!pathEdges || !pathEdges.length) return "";
    // format like: A --x--> B --y--> C --(new)--> A
    const parts = [];
    for (const e of pathEdges) {
        parts.push(`${e.from} --${e.viaField}--> ${e.to}`);
    }
    return parts.join("  ");
}
