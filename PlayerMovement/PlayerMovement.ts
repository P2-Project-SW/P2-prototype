import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js";
import { aStar } from "../AStar/AStar.js";
import type { Point } from "../AStar/AStar.js";
import { findGoal } from "../AStar/helpers.js";

export { movePlayerPosition, movePlayer };

const WALL = 0;
const END = 3;
const START = 2;

let y = 1; //player begins 1 tile down from the edge
let x = 0;
let nx = 0;
let ny = 0;

enum directions {
    UP,
    DOWN,
    RIGHT,
    LEFT
}

function computePath(grid: number[][], x: number, y: number): Point[] {
    const start: Point = { x, y };
    const goal = findGoal(grid);

    if (!goal) {
        console.error("Goal not found in grid");
        return [];
    }

    return aStar(grid, start, goal);
}

function movePlayer(direction: number) {
    //get the current map from function : getActiveMap
    const map = getActiveMap();
    if (map === null) return;

    if (direction === directions.UP) {
        nx = x;
        ny = y - 1;
    } else if (direction === directions.DOWN) {
        nx = x;
        ny = y + 1;
    } else if (direction === directions.RIGHT) {
        nx = x + 1;
        ny = y;
    } else if (direction === directions.LEFT) {
        nx = x - 1;
        ny = y;
    } else {
        nx = x;
        ny = y;
    }

    //check bounds
    const inBounds = ny >= 0 && ny < map.grid.length && nx >= 0 && nx < map.grid[0]!.length;
    
    if(!inBounds || map.grid[ny]![nx] === WALL || map.grid[ny]![nx] === START) {
        nx = x;
        ny = y;
    }
 
    movePlayerPosition(map, ny, nx)
    //update x and y
    x = nx;
    y = ny;

    // Run A* after each move
    const path = computePath(map.grid, x, y);
    console.log("Optimal path from current position:", path);

    if (map.grid[ny]![nx] === END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");
            x = 0;
            y = 1;

            const currentDiv = document.getElementById("playerId");
            currentDiv!.remove();
            movePlayerPosition(map, 1, 0);
        }, 200)

    }
}

function movePlayerPosition(map : (typeof maps)[keyof typeof maps], y : number, x : number) {
    const currentDiv = document.getElementById("playerId");
    currentDiv?.remove();
    
    //create new div
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = "playerId";

    const mapContainer = document.getElementById("map");
    if (mapContainer === null) return;

    div.innerHTML = ""; //make div empthy

    //find start position in map array (value = 2)
    if(x === 0 && y === 0) {
        for(let i = 0; i < map.grid.length; i++) {
            for(let j = 0; j < map.grid[0]!.length; j++) {
                if(map.grid[i]![j] === START) {
                    y = i;
                    x = j;
                }
            }
        }
    }

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
    
    //add the div to the mapContainer
    mapContainer.appendChild(div);
}


(window as any).movePlayer = movePlayer;

function resetPlayerState() {
    x = 0;
    y = 1;
    nx = 0;
    ny = 1;
}
