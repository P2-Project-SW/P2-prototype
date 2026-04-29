import { Graph, search, heuristics, GridNode } from "./AStarAlgorithm.js";
import { maps } from "../2D Array/2dArray.js";

const graph = new Graph(maps.small.grid, { diagonal: false });

function onPlayerMove(playerX: number, playerY: number, goalX: number, goalY: number) {
  const start = graph.grid[playerX]![playerY]!;
  const end   = graph.grid[goalX]![goalY]!;

  const path = search(graph, start, end, {
    heuristic: heuristics.manhattan
  });

  if (path.length === 0) {
    console.log("No path found");
  } else {
    console.log(path.map((n: GridNode) => n.toString()));
  }

  return path;
}