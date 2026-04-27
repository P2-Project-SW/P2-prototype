// javascript-astar 0.4.1 — TypeScript port
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the A* search algorithm using a Binary Heap.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pathTo(node: GridNode): GridNode[] {
  let curr: GridNode | null = node;
  const path: GridNode[] = [];
  while (curr?.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap(): BinaryHeap<GridNode> {
  return new BinaryHeap<GridNode>((node) => node.f);
}

// ---------------------------------------------------------------------------
// Heuristics
// ---------------------------------------------------------------------------

export const heuristics = {
  manhattan(pos0: GridNode, pos1: GridNode): number {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },

  diagonal(pos0: GridNode, pos1: GridNode): number {
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

export function cleanNode(node: GridNode): void {
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
export function search(
  graph: Graph,
  start: GridNode,
  end: GridNode,
  options: AStarOptions = {}
): GridNode[] {
  graph.cleanDirty();

  const heuristic = options.heuristic ?? heuristics.manhattan;
  const closest = options.closest ?? false;

  const openHeap = getHeap();
  let closestNode = start;

  start.h = heuristic(start, end);
  graph.markDirty(start);
  openHeap.push(start);

  while (openHeap.size() > 0) {
    const currentNode = openHeap.pop()!;

    // Found the goal — trace back the path.
    if (currentNode === end) {
      return pathTo(currentNode);
    }

    currentNode.closed = true;

    const neighbors = graph.neighbors(currentNode);

    for (const neighbor of neighbors) {
      if (neighbor.closed || neighbor.isWall()) continue;

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
          if (
            neighbor.h < closestNode.h ||
            (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
          ) {
            closestNode = neighbor;
          }
        }

        if (!beenVisited) {
          openHeap.push(neighbor);
        } else {
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
  nodes: GridNode[] = [];
  diagonal: boolean;
  grid: GridNode[][] = [];
  private dirtyNodes: GridNode[] = [];

  constructor(gridIn: number[][], options: GraphOptions = {}) {
    this.diagonal = !!options.diagonal;

    for (let x = 0; x < gridIn.length; x++) {
      this.grid[x] = [];
      const row = gridIn[x]!;
      for (let y = 0; y < row.length; y++) {
        const node = new GridNode(x, y, row[y]!);
        this.grid[x]![y] = node;
        this.nodes.push(node);
      }
    }

    this.init();
  }

  init(): void {
    this.dirtyNodes = [];
    for (const node of this.nodes) {
      cleanNode(node);
    }
  }

  cleanDirty(): void {
    for (const node of this.dirtyNodes) {
      cleanNode(node);
    }
    this.dirtyNodes = [];
  }

  markDirty(node: GridNode): void {
    this.dirtyNodes.push(node);
  }

  neighbors(node: GridNode): GridNode[] {
    const ret: GridNode[] = [];
    const { x, y } = node;
    const g = this.grid;

    if (g[x - 1]?.[y]) ret.push(g[x - 1]![y]!); // West
    if (g[x + 1]?.[y]) ret.push(g[x + 1]![y]!); // East
    if (g[x]?.[y - 1]) ret.push(g[x]![y - 1]!); // South
    if (g[x]?.[y + 1]) ret.push(g[x]![y + 1]!); // North

    if (this.diagonal) {
      if (g[x - 1]?.[y - 1]) ret.push(g[x - 1]![y - 1]!); // Southwest
      if (g[x + 1]?.[y - 1]) ret.push(g[x + 1]![y - 1]!); // Southeast
      if (g[x - 1]?.[y + 1]) ret.push(g[x - 1]![y + 1]!); // Northwest
      if (g[x + 1]?.[y + 1]) ret.push(g[x + 1]![y + 1]!); // Northeast
    }

    return ret;
  }

  toString(): string {
    return this.grid
      .map((row) => row.map((n) => n.weight).join(" "))
      .join("\n");
  }
}

// ---------------------------------------------------------------------------
// GridNode
// ---------------------------------------------------------------------------

export class GridNode {
  x: number;
  y: number;
  weight: number;

  // A* bookkeeping (mutated during search, reset via cleanNode)
  f = 0;
  g = 0;
  h = 0;
  visited = false;
  closed = false;
  parent: GridNode | null = null;

  constructor(x: number, y: number, weight: number) {
    this.x = x;
    this.y = y;
    this.weight = weight;
  }

  toString(): string {
    return `[${this.x} ${this.y}]`;
  }

  /** Movement cost from a neighbouring node into this node. */
  getCost(fromNeighbor?: GridNode): number {
    if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y) {
      return this.weight * 1.41421; // diagonal penalty
    }
    return this.weight;
  }

  isWall(): boolean {
    return this.weight === 0;
  }
}

// ---------------------------------------------------------------------------
// BinaryHeap
// ---------------------------------------------------------------------------

class BinaryHeap<T> {
  content: T[] = [];
  private scoreFunction: (node: T) => number;

  constructor(scoreFunction: (node: T) => number) {
    this.scoreFunction = scoreFunction;
  }

  push(element: T): void {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  }

  pop(): T | undefined {
    const result = this.content[0];
    const end = this.content.pop()!;
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }

  remove(node: T): void {
    const i = this.content.indexOf(node);
    const end = this.content.pop()!;
    if (i !== this.content.length) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }

  size(): number {
    return this.content.length;
  }

  rescoreElement(node: T): void {
    this.sinkDown(this.content.indexOf(node));
  }

  private sinkDown(n: number): void {
    const element = this.content[n] as T;
    while (n > 0) {
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN] as T;
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  private bubbleUp(n: number): void {
    const length = this.content.length;
    const element = this.content[n] as T;
    const elemScore = this.scoreFunction(element);

    while (true) {
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;
      let swap: number | null = null;
      let child1Score = 0;

      if (child1N < length) {
        child1Score = this.scoreFunction(this.content[child1N]!);
        if (child1Score < elemScore) swap = child1N;
      }

      if (child2N < length) {
        const child2Score = this.scoreFunction(this.content[child2N]!);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        const swapIdx: number = swap;
        this.content[n] = this.content[swapIdx]!;
        this.content[swapIdx] = element;
        n = swapIdx;
      } else {
        break;
      }
    }
  }
}