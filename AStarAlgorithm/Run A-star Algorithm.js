import { Graph, search, heuristics, GridNode } from "./AStarAlgorithm.js";
import { maps } from "../2D Array/2dArray.js";
const graph = new Graph(maps.small.grid, { diagonal: false });
function onPlayerMove(playerX, playerY, goalX, goalY) {
    const start = graph.grid[playerX][playerY];
    const end = graph.grid[goalX][goalY];
    const path = search(graph, start, end, {
        heuristic: heuristics.manhattan
    });
    if (path.length === 0) {
        console.log("No path found");
    }
    else {
        console.log(path.map((n) => n.toString()));
    }
    return path;
}
//# sourceMappingURL=Run%20A-star%20Algorithm.js.map