import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js";
import { Graph, search, heuristics, GridNode } from "../A-star Algorithm/A-star Algorithm.js";

export { playerMovement, movePlayer };

let y = 0;
let x = 0;
let nx = 0;
let ny = 0;
let graph: Graph | null = null;
let goalX = 0;
let goalY = 0;

// Build graph and find goal from the active map
function initGraph() {
  const map = getActiveMap();
  if (!map) return;

  graph = new Graph(map.grid, { diagonal: false });

  // Find start tile (value = 2) and goal tile (value = 3)
  for (let i = 0; i < map.grid.length; i++) {
    for (let j = 0; j < map.grid[i]!.length; j++) {
      if (map.grid[i]![j] === 2) { y = i; x = j; }
      if (map.grid[i]![j] === 3) { goalY = i; goalX = j; }
    }
  }
}

// Call once when the page loads
initGraph();

enum directions {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

function movePlayer(direction: number) {
  if (direction === directions.UP)         { nx = x;     ny = y - 1; }
  else if (direction === directions.DOWN)  { nx = x;     ny = y + 1; }
  else if (direction === directions.RIGHT) { nx = x + 1; ny = y;     }
  else if (direction === directions.LEFT)  { nx = x - 1; ny = y;     }
  else                                     { nx = x;     ny = y;     }

  const map = getActiveMap();
  if (!map || !graph) return;

  // Move player visually
  playerMovement(map, ny, nx);

  // Run A* from new player position to goal
  const start = graph.grid[ny]?.[nx];
  const goal  = graph.grid[goalY]?.[goalX];

  if (start && goal) {
    const path = search(graph, start, goal, {
      heuristic: heuristics.manhattan,
    });

    if (path.length === 0) {
      console.log("No path to goal found!");
    } else {
      console.log(`Steps remaining: ${path.length}`);
      console.log("Route:", path.map((n: GridNode) => n.toString()));
    }

    // Check if player reached the goal
    if (ny === goalY && nx === goalX) {
      console.log("🎉 Player reached the goal!");
    }
  }

  // Update position
  y = ny;
  x = nx;
}

function playerMovement(map: (typeof maps)[keyof typeof maps], y: number, x: number) {
  const container = document.getElementById("map");
  if (container === null) return;

  // Remove old player div
  const existing = container.querySelector(".player");
  if (existing) existing.remove();

  const mapStyleGap = 2;
  const mapStylePadding = 10;
  const TILE_SIZE = getTileSize(map);

  const div = document.createElement("div");
  div.classList.add("player");
  div.style.width = `${TILE_SIZE}px`;
  div.style.height = `${TILE_SIZE}px`;
  div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`;
  div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`;
  div.style.backgroundColor = "aqua";
  div.style.borderRadius = "3px";
  div.style.position = "absolute";

  container.appendChild(div);
}

(window as any).movePlayer = movePlayer;