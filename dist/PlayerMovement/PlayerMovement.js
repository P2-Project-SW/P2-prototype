import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js";
import { aStar } from "../AStar/AStar.js";
import { findGoal } from "../AStar/helpers.js";
export { movePlayerPosition, movePlayer, resetPlayerState };
const WALL = 0;
const END = 3;
const START = 2;
let y = 1;
let x = 0;
let nx = 0;
let ny = 0;
var directions;
(function (directions) {
    directions[directions["UP"] = 0] = "UP";
    directions[directions["DOWN"] = 1] = "DOWN";
    directions[directions["RIGHT"] = 2] = "RIGHT";
    directions[directions["LEFT"] = 3] = "LEFT";
})(directions || (directions = {}));
function computePath(grid, x, y) {
    const start = { x, y };
    const goal = findGoal(grid);
    if (!goal) {
        console.error("Goal not found in grid");
        return [];
    }
    return aStar(grid, start, goal);
}
function movePlayer(direction) {
    if (direction === directions.UP) {
        nx = x;
        ny = y - 1;
    }
    else if (direction === directions.DOWN) {
        nx = x;
        ny = y + 1;
    }
    else if (direction === directions.RIGHT) {
        nx = x + 1;
        ny = y;
    }
    else if (direction === directions.LEFT) {
        nx = x - 1;
        ny = y;
    }
    else {
        nx = x;
        ny = y;
    }
    const map = getActiveMap();
    if (map === null)
        return;
    if (map.grid[ny][nx] === WALL) {
        nx = x;
        ny = y;
    }
    else if (map.grid[ny][nx] === START) {
        nx = x;
        ny = y;
    }
    movePlayerPosition(map, ny, nx);
    x = nx;
    y = ny;
    // Run A* after each move
    const path = computePath(map.grid, x, y);
    console.log("Optimal path from current position:", path);
    if (map.grid[ny][nx] === END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");
            x = 0;
            y = 1;
            const currentDiv = document.getElementById("playerId");
            currentDiv.remove();
            movePlayerPosition(map, y, x);
        }, 200);
    }
}
function movePlayerPosition(map, y, x) {
    const currentDiv = document.getElementById("playerId");
    currentDiv?.remove();
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = "playerId";
    const mapContainer = document.getElementById("map");
    if (mapContainer === null)
        return;
    div.innerHTML = "";
    const mapStyleGap = 2;
    const mapStylePadding = 10;
    const TILE_SIZE = getTileSize(map);
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`;
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`;
    div.style.backgroundColor = "aqua";
    div.style.borderRadius = "3px";
    div.style.position = "absolute";
    mapContainer.appendChild(div);
}
window.movePlayer = movePlayer;
function resetPlayerState() {
    x = 0;
    y = 1;
    nx = 0;
    ny = 1;
}
//# sourceMappingURL=PlayerMovement.js.map