import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js";
import { keyPosition } from "../KeyGeneration/KeyGeneration.js";
export { movePlayerPosition, movePlayer };
const WALL = 0;
const END = 3;
const START = 2;
let y = 1; //player begins 1 tile down from the edge
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
function movePlayer(direction) {
    //moves the coordinates of the game piece
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
    //get the current map from function : getActiveMap
    const map = getActiveMap();
    if (map === null)
        return;
    //if player hits a wall, then coordinates does not change
    if (map.grid[ny][nx] === WALL) {
        nx = x;
        ny = y;
    }
    else if (map.grid[ny][nx] === START) {
        nx = x;
        ny = y;
    }
    movePlayerPosition(map, ny, nx);
    //update x and y
    x = nx;
    y = ny;
    //if player reach end, the game alerts and the player piece moves to start
    if (map.grid[ny][nx] === END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");
            x = 0;
            y = 1;
            const currentDiv = document.getElementById("playerId");
            currentDiv.remove();
            movePlayerPosition(map, 7, 3);
        }, 200);
    }
}
function movePlayerPosition(map, y, x) {
    //if player is not at beginning, then remove earlier div
    if (x > 0 && y > 0) {
        const currentDiv = document.getElementById("playerId");
        currentDiv.remove();
    }
    //create new div
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = ("playerId");
    const mapContainer = document.getElementById("map"); //gets map from id
    //console.log("container:", container);
    if (mapContainer === null)
        return;
    div.innerHTML = ""; //make div empthy
    //find start position in map array (value = 2)
    if (x === 0 && y === 0) {
        for (let i = 0; i < map.grid.length; i++) {
            for (let j = 0; j < map.grid[0].length; j++) {
                if (map.grid[i][j] === 2) {
                    y = i;
                    x = j;
                }
            }
        }
    }
    const mapStyleGap = 2; //gap between cells
    const mapStylePadding = 10; //edge around the map
    const TILE_SIZE = getTileSize(map);
    //ad div style in HTML
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    div.style.backgroundColor = "aqua";
    div.style.borderRadius = "3px";
    div.style.position = "absolute";
    //add the div to the mapContainer
    mapContainer.appendChild(div);
}
window.movePlayer = movePlayer;
//# sourceMappingURL=PlayerMovement.js.map