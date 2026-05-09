import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js";
import { keyPosition, currentKeyPosition } from "../KeyGeneration/KeyGeneration.js";
import { aStar } from "../AStar/AStar.js";
import type { Point } from "../AStar/AStar.js";
import { findGoal } from "../AStar/helpers.js";

export { movePlayerPosition, movePlayer };

const WALL = 0;
const END = 3;
const START = 2;

let keyAmountEasy = 2; //hardcoded easy level


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
    keyCollisionDetection(map, ny, nx, currentKeyPosition.y, currentKeyPosition.x);
    //update x and y
    x = nx;
    y = ny;

    // Run A* after each move
    const path = computePath(map.grid, x, y);
    console.log("Optimal path from current position:", path);

    playerWin(map);
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

    //style of div
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`;
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`;
    //div.style.backgroundColor = "aqua";
    //div.style.borderRadius = "3px";
    div.style.position = "absolute";

    //style of game piece
    div.style.fontSize = `${TILE_SIZE * 0.8}px`;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = `🧝`;
    
    //add the div to the mapContainer
    mapContainer.appendChild(div);
}

function playerWin(map: (typeof maps) [keyof typeof maps]) {
    const score = document.getElementById("keyScore"); 
    if (score === null) return;
    
    let currentScoreText = score.textContent;
    let currentScoreNumber = parseInt(currentScoreText || '0') || 0;

    //if all keys are not collected, the player can not win
    if (currentScoreNumber != keyAmountEasy) return;

    //if player wins, reset
    if (map.grid[ny]![nx] === END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");
            x = 0;
            y = 1;

            const currentDiv = document.getElementById("playerId");
            currentDiv!.remove();
            keyPosition(map, y, x);

            score.textContent = (0).toString(); //increment key score

            movePlayerPosition(map, y, x);
        }, 200)

    }
}

function resetPlayerState() {
    x = 0;
    y = 1;
    nx = 0;
    ny = 1;
}

function keyCollisionDetection(map: (typeof maps) [keyof typeof maps], playerY : number, playerX: number, keyY: number, keyX: number) {
    if(playerY === keyY && playerX === keyX) {
        const score = document.getElementById("keyScore"); 
        if (score === null) return;

        //convert inner HTML to number
        let currentScoreText = score.textContent;
        let currentScoreNumber = parseInt(currentScoreText || '0') || 0;

        if (currentScoreNumber < keyAmountEasy - 1) {
            keyPosition(map, playerY, playerX); //spawn new key
            score.textContent = (currentScoreNumber + 1).toString(); //increment key score
        } else {
            //remove key
            const currentDiv = document.getElementById("svgContainer");
            currentDiv!.remove();

            score.textContent = (currentScoreNumber + 1).toString(); //increment key score
        }
    }
}

(window as any).movePlayer = movePlayer;