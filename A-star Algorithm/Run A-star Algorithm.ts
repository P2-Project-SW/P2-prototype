import { maps } from "../2dArray.js";
import { Graph, search, heuristics } from "./A-star Algorithm.js";

const grid = maps;

const graph = new Graph(grid.small.grid, { diagonal: false });
const start = graph.grid[1]![1]!;
const end   = graph.grid[10]![10]!;

const path = search(graph, start, end, { heuristic: heuristics.manhattan });
console.log(path.map(n => n.toString()));