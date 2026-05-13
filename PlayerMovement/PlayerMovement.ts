import { getTileSize, maps, getActiveMap } from "../2D_Array/2dArray.js";
import { keyPosition, currentKeyPosition, clearKeyPosition } from "../KeyGeneration/KeyGeneration.js";
import { STARTPOSITION, TILE } from "../2D_Array/2dArray.js";
import { startTimer, startTime, resetTimer } from "../SystemController/timer.js";
//import { buildPerformanceVector } from "../DDA/k_means/Logic/DDA.js";
import { aStar } from "../AStar/AStar.js";
import type { Point } from "../AStar/AStar.js";
import { findGoal } from "../AStar/helpers.js";
import { playerState} from "../PlayerState/PlayerState.js";

export { movePlayerPosition, movePlayer, resetPlayerPosition };


let y = STARTPOSITION.y; //player begins 1 tile down from the edge
let x = STARTPOSITION.x;
let ny = STARTPOSITION.y; 
let nx = STARTPOSITION.x;

/*
let steps = 0; //amount of steps the player takes
let keySpawnTime = Date.now(); //how long time the player takes to collect a key and/or reach end
let optimalPathLength = 0; //ready to save A* path
*/

enum directions {
    UP,
    DOWN,
    RIGHT,
    LEFT
}

//TODO: opdater med finalkey fra DDA.action.ts
function computePath(map: any, grid: number[][], x: number, y: number): Point[] {
    const start: Point = { x, y };
    let goal: Point;

    if (playerState.collectedKeys < map.keys) {
        goal = { x: currentKeyPosition.x, y: currentKeyPosition.y };
    } else {
        const exit = findGoal(grid);
        if(!exit){
            console.error("Exit not found in grid");
            return [];
        }
        goal = exit;
    }

    return aStar(grid, start, goal);
}

function movePlayer(direction: number) {

    console.log("movePlayer CALLED");

    const map = getActiveMap();
    if (map === null) return;

      // Run A* after each move
    const path = computePath(map, map.grid, x, y);
    console.log("Optimal path from current position:", path);

    const optimalNext = path[1];

    if (direction === directions.UP) {
        nx = x;
        ny = y - 1;
    } else if(direction === directions.DOWN) {
        nx = x;
        ny = y + 1;
    } else if(direction === directions.RIGHT) {
        nx = x + 1;
        ny = y;
    } else if(direction === directions.LEFT) {
        nx = x - 1;
        ny = y;
    } else {
        nx = x;
        ny = y;
    }

    //check bounds
    const inBounds = ny >= 0 && ny < map.grid.length && nx >= 0 && nx < map.grid[0]!.length;
    
    if(!inBounds || map.grid[ny]![nx] === TILE.WALL) {
        nx = x;
        ny = y;
    }

    console.log("cell value:", map.grid[ny]![nx]);
    
    movePlayerPosition(map, ny, nx);

    //heini jeg kommer til at indsætte noget her mvh Luna
    //count if player took a step
    if(nx != x || ny != y) {
        //steps++;
        if(startTime === null) {
            const score = document.getElementById("keyScore"); 
            if (score === null) return;
            startTimer(()=>{        
            setTimeout(() => {
            alert("You lost:(\nTry again.");

            resetPlayerPosition();

            const currentDiv = document.getElementById("playerId");
            currentDiv?.remove();

            keyPosition(map, y, x);

            score.textContent = "0";

            movePlayerPosition(map, y, x);

            resetTimer();
        }, 200)});
        }
    }

    //update x and y
    x = nx;
    y = ny;
    console.log("UPDATED POSITION:", x, y);
    keyCollisionDetection(map, y, x, currentKeyPosition.y, currentKeyPosition.x);


    if (optimalNext && optimalNext.x === x && optimalNext.y === y) {
        playerState.rightSteps++;
    } else {
        playerState.wrongSteps++;
    }

    if (map.grid[ny]![nx] === 4) {
        playerState.collectedKeys++;
    }   

   console.log("STATE:", {
        time: playerState.currentTime,
        right: playerState.rightSteps,
        wrong: playerState.wrongSteps,
        keys: playerState.collectedKeys
    });

    playerWin(map);
}

function movePlayerPosition(map : (typeof maps)[keyof typeof maps], y : number, x : number) {
    const currentDiv = document.getElementById("playerId");
    currentDiv?.remove();
    
    //create new div
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = ("playerId");

    const mapContainer = document.getElementById("map"); //gets map from id
    //console.log("container:", container);
    if(mapContainer === null) return;

    div.innerHTML = ""; //make div empthy

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
    if (currentScoreNumber != map.keys) return;

    //if player wins, reset
    if (map.grid[ny]![nx] === TILE.END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");

            resetPlayerPosition();

            const currentDiv = document.getElementById("playerId");
            currentDiv?.remove();

            keyPosition(map, y, x);

            score.textContent = "0";

            movePlayerPosition(map, y, x);

            resetTimer();
        }, 200)

    }
}

function resetPlayerPosition() {
    x = STARTPOSITION.x;
    y = STARTPOSITION.y;
    nx = STARTPOSITION.x;
    ny = STARTPOSITION.y;
}

function keyCollisionDetection(map: (typeof maps) [keyof typeof maps], playerY : number, playerX: number, keyY: number, keyX: number) {
    if(playerY === keyY && playerX === keyX) {
        const score = document.getElementById("keyScore"); 
        if (score === null) return;

        //convert inner HTML to number
        let currentScoreText = score.textContent;
        let currentScoreNumber = parseInt(currentScoreText || '0') || 0;

        /*
        let time = Date.now() - keySpawnTime;
        const normalizedTime = Math.min(time / 60000, 1); //normalizes time between 0 and 1
        */
        
        //call A* and get the optimal path length (length of array, which A* returns)
        //optimalPathLength = aStar(map.grid, {x: playerX, y: playerY}, {x: currentKeyPosition.x, y: currentKeyPosition.y}).length;
        
        if (currentScoreNumber < map.keys - 1) {
            keyPosition(map, playerY, playerX); //spawn new key
            //keySpawnTime = Date.now();
            score.textContent = (currentScoreNumber + 1).toString(); //increment key score
        } else {
            //remove key
            const currentDiv = document.getElementById("svgContainer");

            if(currentDiv) {
                currentDiv.remove();
            };

            clearKeyPosition();

            score.textContent = (currentScoreNumber + 1).toString(); //increment key score
        }
 
        /*
        const vector = [normalizedTime, currentScoreNumber / map.keys, steps / optimalPathLength];
        const result = euclideanDistance(vector, PPI_array);

        const difficulty = !Array.isArray(result) ? result.difficulty : undefined;
        if(difficulty === "EASY") map.range = 5;
        if(difficulty === "FLOW") map.range = 10;
        if(difficulty === "HARD") map.range = 15;

        steps = 0;
        */
    }
}


(window as any).movePlayer = movePlayer;