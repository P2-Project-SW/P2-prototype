export interface AStarOptions {
    /** Return the path to the closest node if the target is unreachable. */
    closest?: boolean;
    /** Heuristic function to use (defaults to manhattan). */
    heuristic?: (pos0: GridNode, pos1: GridNode) => number;
}
export interface GraphOptions {
    /** Allow diagonal movement. */
    diagonal?: boolean;
}
export declare const heuristics: {
    manhattan(pos0: GridNode, pos1: GridNode): number;
    diagonal(pos0: GridNode, pos1: GridNode): number;
};
export declare function cleanNode(node: GridNode): void;
/**
 * Perform an A* search on a graph given a start and end node.
 *
 * @param graph   - The graph to search.
 * @param start   - The starting GridNode.
 * @param end     - The target GridNode.
 * @param options - Optional configuration.
 * @returns The path as an ordered array of GridNodes, or [] if none found.
 */
export declare function search(graph: Graph, start: GridNode, end: GridNode, options?: AStarOptions): GridNode[];
/**
 * A graph memory structure backed by a 2-D grid of GridNodes.
 *
 * @param gridIn  - 2-D array of weights (0 = wall).
 * @param options - Optional configuration.
 */
export declare class Graph {
    nodes: GridNode[];
    diagonal: boolean;
    grid: GridNode[][];
    private dirtyNodes;
    constructor(gridIn: number[][], options?: GraphOptions);
    init(): void;
    cleanDirty(): void;
    markDirty(node: GridNode): void;
    neighbors(node: GridNode): GridNode[];
    toString(): string;
}
export declare class GridNode {
    x: number;
    y: number;
    weight: number;
    f: number;
    g: number;
    h: number;
    visited: boolean;
    closed: boolean;
    parent: GridNode | null;
    constructor(x: number, y: number, weight: number);
    toString(): string;
    /** Movement cost from a neighbouring node into this node. */
    getCost(fromNeighbor?: GridNode): number;
    isWall(): boolean;
}
//# sourceMappingURL=A-star%20Algorithm.d.ts.map