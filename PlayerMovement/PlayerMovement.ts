import { getTileSize, getActiveMap, generateDynamicMap , TILE, STARTPOSITION} from "../2D_Array/2dArray.js";
import { keyPosition, currentKeyPosition, clearKeyPosition } from "../KeyGeneration/KeyGeneration.js";
import { startTimer, startTime, resetTimer } from "../SystemController/timer.js";
import { aStar } from "../AStar/AStar.js";
import type { Point } from "../AStar/AStar.js";
import { findGoal } from "../AStar/helpers.js";
import { playerState, resetPlayerState } from "../PlayerState/PlayerState.js"; 

import { playerPosition$, optimalPath$, cancelActiveSpawnTimer } from "./../kmeans/Logic/DDA.observable.js"; 
import { AD } from "../kmeans/Logic/DDA.action.js";
import { DDA_updater } from "../kmeans/Logic/kmeans.optimized.js";
import { keyStateChanged$ } from "./../kmeans/Logic/DDA.observable.js";
import { playerState$ } from "../kmeans/Logic/DDA.observable.js";
import { movePlayerPosition, resetPlayerDiv } from "./PlayerView.js";

// Eksportér de korrekte navne til resten af dit projekt
export { movePlayerPosition, movePlayer, resetPlayerDiv as resetPlayerPosition };
export {resetInternalPlayerPosition};

let y = 0;
let x = 0;
let ny = 0;
let nx = 0;


enum directions {
    UP,
    DOWN,
    RIGHT,
    LEFT
}

function computePath(map: any, grid: number[][], x: number, y: number): Point[] {
    const start: Point = { x, y };
    let goal: Point;

    // SIKRING: Hvis der ikke er en aktiv nøgle på kortet endnu, søger A* mod udgangen (EXIT) for at undgå Array(0) crash
    if (playerState.collectedKeys < map.keys && map.activeKey) {
        goal = { x: currentKeyPosition.x, y: currentKeyPosition.y };
    } else {
        const exit = findGoal(grid);
        if(!exit){
            console.error("Exit not found in grid");
            return [{ x, y }]; // Sikkerhedsfallback
        }
        goal = exit;
    }

    return aStar(grid, start, goal);
}

export function computeOptimalPath( grid: number[][], x: number, y: number): Point[] {
    const start: Point = { x, y };
    let goal: Point;

    // SIKRING: Hvis der ikke er en aktiv nøgle på kortet endnu, søger A* mod udgangen (EXIT) for at undgå Array(0) crash
        const exit = findGoal(grid);
        if(!exit){
            console.error("Exit not found in grid");
            return [{ x, y }]; // Sikkerhedsfallback
        }
        goal = exit;

    return aStar(grid, start, goal);
}


function movePlayer(direction: number) {
    console.log("movePlayer() called, direction:", direction);

    const map = getActiveMap();
    if (map === null) return;



    

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

    // Tjek banens grænser og vægge
    const inBounds = ny >= 0 && ny < map.grid.length && nx >= 0 && nx < map.grid[0]!.length;
    
    if(!inBounds || map.grid[ny]![nx] === TILE.WALL) {
        nx = x;
        ny = y;
    }

    console.log("cell value:", map.grid[ny]![nx]);
    
    movePlayerPosition(map, ny, nx);

    // Hvis spilleren rent faktisk flyttede sig
    if(nx != x || ny != y) {
        if(startTime === null) {
            const score = document.getElementById("keyScore"); 
            if (score === null) return;
            
            startTimer(() => {        
                setTimeout(() => {
                    alert("You lost:(\nTry again.");
                    
                    // RETTET: Ryddet op i de kaotiske dublerede kald ved tab
                    resetPlayerDiv();
                    resetPlayerState(); 
                    
                    x = STARTPOSITION.x;
                    y = STARTPOSITION.y;

                    keyStateChanged$.next();

                    score.textContent = "0";
                    movePlayerPosition(map, y, x);
                    resetTimer();
                }, 200);
            });
        }
    }

     // Kør A* efter hvert skridt
    if(nx !== x || ny !== y) {
        const pathOld = computePath(map, map.grid, x, y);

        // FIX: Sikr mod crash hvis stien er tom under hurtige tastaturskift
     
        const expectedNextTile = pathOld && pathOld.length > 1 ? pathOld[1] : null;

        const isCorrectMove =
        expectedNextTile &&
        expectedNextTile.x === nx &&
        expectedNextTile.y === ny;

        if (isCorrectMove) {
        playerState.rightSteps++;
        } else {
        playerState.wrongSteps++;
        }
    }

    x = nx;
    y = ny;
    console.log("UPDATED POSITION:", x, y);

    const pathCurrent = computePath(map, map.grid, x, y);
    console.log("Optimal path from current position:", pathCurrent);


    const activeMap = getActiveMap();

    
    if(currentKeyPosition){
        keyCollisionDetection(activeMap, y, x, currentKeyPosition.y, currentKeyPosition.x);
    }

     // Stream opdateringerne synkront ud til RxJS
    playerPosition$.next({x: x, y: y });

    if (map.grid[ny]![nx] === TILE.KEY) {
        playerState.collectedKeys++;
    }   

    console.log("STATE:", {
        time: playerState.currentTime,
        right: playerState.rightSteps,
        wrong: playerState.wrongSteps,
        keys: playerState.collectedKeys
    });
    playerState$.next({ ...playerState });

    playerWin(map);
}

function playerWin(map: any) {
    const score = document.getElementById("keyScore"); 
    if (score === null) return;
    
    let currentScoreText = score.textContent;
    let currentScoreNumber = parseInt(currentScoreText || '0') || 0;

    if (currentScoreNumber != map.keys) return;  
    
    if (map.grid[ny]![nx] === TILE.END) {
        setTimeout(() => {
            alert("You have won!\nThat's amazing!");

            // RETTET: Renset for unødvendige gentagelser
            resetPlayerDiv();
            resetPlayerState();

            x = STARTPOSITION.x;
            y = STARTPOSITION.y;

            const clusterAverage = DDA_updater.getValue(); 
            score.textContent = "0";
            AD(clusterAverage);
        }, 200);
    }
}

function keyCollisionDetection(map: any, playerY : number, playerX: number, keyY: number, keyX: number) {
    if (!map) return;

    if (playerY === keyY && playerX === keyX) {
        const score = document.getElementById("keyScore"); 
        if (score === null) return;

        cancelActiveSpawnTimer();

        let currentScoreText = score.textContent;
        let currentScoreNumber = parseInt(currentScoreText || '0') || 0;
        const newScore = currentScoreNumber + 1;
        score.textContent = newScore.toString();
        playerState.collectedKeys = newScore;

        const keyCell = document.querySelector(`[key-x="${keyX}"][key-y="${keyY}"]`);
        if (keyCell) {
            keyCell.classList.remove('key');
            (keyCell as HTMLElement).innerHTML = '';
            (keyCell as HTMLElement).style.removeProperty('display');
            (keyCell as HTMLElement).style.removeProperty('alignItems');
            (keyCell as HTMLElement).style.removeProperty('justifyContent');
        }

        if (map.grid[keyY] && map.grid[keyY]![keyX] !== undefined) {
            map.grid[keyY]![keyX] = TILE.PATH;
        }

        if (map.activeKey) {
            map.activeKey = null;
        }

        clearKeyPosition();
        keyStateChanged$.next(); 
    }
}

(window as any).movePlayer = movePlayer;

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case "ArrowUp":
        case "w":
            movePlayer(directions.UP);
            break;
            
        case "ArrowDown":
        case "s":
            movePlayer(directions.DOWN);
            break;
            
        case "ArrowRight":
        case "d":
            movePlayer(directions.RIGHT);
            break;
            
        case "ArrowLeft":
        case "a":
            movePlayer(directions.LEFT);
            break;
    }
});

function resetInternalPlayerPosition() {
    x = STARTPOSITION.x;
    y = STARTPOSITION.y;
    nx = STARTPOSITION.x;
    ny = STARTPOSITION.y;
}

