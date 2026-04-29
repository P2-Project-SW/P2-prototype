/*import { maps } from "../2dArray.js";
import { recursiveBacktracker } from "../MapGen/RecursiveBacktracking/RecursiveBacktracking.js";

let map = recursiveBacktracker(15);
//eksempel:
// maps.small - henter small map
*/
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pathTo(node) {
    let curr = node;
    const path = [];
    while (curr?.parent) {
        path.unshift(curr);
        curr = curr.parent;
    }
    return path;
}
function getHeap() {
    return new BinaryHeap((node) => node.f);
}
// ---------------------------------------------------------------------------
// Heuristics
// ---------------------------------------------------------------------------
export const heuristics = {
    manhattan(pos0, pos1) {
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    diagonal(pos0, pos1) {
        const D = 1;
        const D2 = Math.sqrt(2);
        const d1 = Math.abs(pos1.x - pos0.x);
        const d2 = Math.abs(pos1.y - pos0.y);
        return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
    },
};
// ---------------------------------------------------------------------------
// A* search
// ---------------------------------------------------------------------------
export function cleanNode(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
}
/**
 * Perform an A* search on a graph given a start and end node.
 *
 * @param graph   - The graph to search.
 * @param start   - The starting GridNode.
 * @param end     - The target GridNode.
 * @param options - Optional configuration.
 * @returns The path as an ordered array of GridNodes, or [] if none found.
 */
export function search(graph, start, end, options = {}) {
    graph.cleanDirty();
    const heuristic = options.heuristic ?? heuristics.manhattan;
    const closest = options.closest ?? false;
    const openHeap = getHeap();
    let closestNode = start;
    start.h = heuristic(start, end);
    graph.markDirty(start);
    openHeap.push(start);
    while (openHeap.size() > 0) {
        const currentNode = openHeap.pop();
        // Found the goal — trace back the path.
        if (currentNode === end) {
            return pathTo(currentNode);
        }
        currentNode.closed = true;
        const neighbors = graph.neighbors(currentNode);
        for (const neighbor of neighbors) {
            if (neighbor.closed || neighbor.isWall())
                continue;
            const gScore = currentNode.g + neighbor.getCost(currentNode);
            const beenVisited = neighbor.visited;
            if (!beenVisited || gScore < neighbor.g) {
                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || heuristic(neighbor, end);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                graph.markDirty(neighbor);
                if (closest) {
                    if (neighbor.h < closestNode.h ||
                        (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                        closestNode = neighbor;
                    }
                }
                if (!beenVisited) {
                    openHeap.push(neighbor);
                }
                else {
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
    }
    return closest ? pathTo(closestNode) : [];
}
// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------
/**
 * A graph memory structure backed by a 2-D grid of GridNodes.
 *
 * @param gridIn  - 2-D array of weights (0 = wall).
 * @param options - Optional configuration.
 */
export class Graph {
    nodes = [];
    diagonal;
    grid = [];
    dirtyNodes = [];
    constructor(gridIn, options = {}) {
        this.diagonal = !!options.diagonal;
        for (let x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];
            const row = gridIn[x];
            for (let y = 0; y < row.length; y++) {
                const node = new GridNode(x, y, row[y]);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }
        this.init();
    }
    init() {
        this.dirtyNodes = [];
        for (const node of this.nodes) {
            cleanNode(node);
        }
    }
    cleanDirty() {
        for (const node of this.dirtyNodes) {
            cleanNode(node);
        }
        this.dirtyNodes = [];
    }
    markDirty(node) {
        this.dirtyNodes.push(node);
    }
    neighbors(node) {
        const ret = [];
        const { x, y } = node;
        const g = this.grid;
        if (g[x - 1]?.[y])
            ret.push(g[x - 1][y]); // West
        if (g[x + 1]?.[y])
            ret.push(g[x + 1][y]); // East
        if (g[x]?.[y - 1])
            ret.push(g[x][y - 1]); // South
        if (g[x]?.[y + 1])
            ret.push(g[x][y + 1]); // North
        if (this.diagonal) {
            if (g[x - 1]?.[y - 1])
                ret.push(g[x - 1][y - 1]); // Southwest
            if (g[x + 1]?.[y - 1])
                ret.push(g[x + 1][y - 1]); // Southeast
            if (g[x - 1]?.[y + 1])
                ret.push(g[x - 1][y + 1]); // Northwest
            if (g[x + 1]?.[y + 1])
                ret.push(g[x + 1][y + 1]); // Northeast
        }
        return ret;
    }
    toString() {
        return this.grid
            .map((row) => row.map((n) => n.weight).join(" "))
            .join("\n");
    }
}
// ---------------------------------------------------------------------------
// GridNode
// ---------------------------------------------------------------------------
export class GridNode {
    x;
    y;
    weight;
    // A* bookkeeping (mutated during search, reset via cleanNode)
    f = 0;
    g = 0;
    h = 0;
    visited = false;
    closed = false;
    parent = null;
    constructor(x, y, weight) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
    toString() {
        return `[${this.x} ${this.y}]`;
    }
    /** Movement cost from a neighbouring node into this node. */
    getCost(fromNeighbor) {
        if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
            return this.weight * 1.41421; // diagonal penalty
        }
        return this.weight;
    }
    isWall() {
        return this.weight === 0;
    }
}
// ---------------------------------------------------------------------------
// BinaryHeap
// ---------------------------------------------------------------------------
class BinaryHeap {
    content = [];
    scoreFunction;
    constructor(scoreFunction) {
        this.scoreFunction = scoreFunction;
    }
    push(element) {
        this.content.push(element);
        this.sinkDown(this.content.length - 1);
    }
    pop() {
        const result = this.content[0];
        const end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }
    remove(node) {
        const i = this.content.indexOf(node);
        const end = this.content.pop();
        if (i !== this.content.length) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    }
    size() {
        return this.content.length;
    }
    rescoreElement(node) {
        this.sinkDown(this.content.indexOf(node));
    }
    sinkDown(n) {
        const element = this.content[n];
        while (n > 0) {
            const parentN = ((n + 1) >> 1) - 1;
            const parent = this.content[parentN];
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                n = parentN;
            }
            else {
                break;
            }
        }
    }
    bubbleUp(n) {
        const length = this.content.length;
        const element = this.content[n];
        const elemScore = this.scoreFunction(element);
        while (true) {
            const child2N = (n + 1) << 1;
            const child1N = child2N - 1;
            let swap = null;
            let child1Score = 0;
            if (child1N < length) {
                child1Score = this.scoreFunction(this.content[child1N]);
                if (child1Score < elemScore)
                    swap = child1N;
            }
            if (child2N < length) {
                const child2Score = this.scoreFunction(this.content[child2N]);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }
            if (swap !== null) {
                const swapIdx = swap;
                this.content[n] = this.content[swapIdx];
                this.content[swapIdx] = element;
                n = swapIdx;
            }
            else {
                break;
            }
        }
    }
}
//# sourceMappingURL=A-star%20Algorithm.js.map