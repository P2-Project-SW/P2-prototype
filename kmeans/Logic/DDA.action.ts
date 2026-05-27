import { getActiveMap, TILE, generateDynamicMap } from '../../2D_Array/2dArray.js';
import { playerState } from "../../PlayerState/PlayerState.js";
import type { Point } from '../../AStar/AStar.js';
import type { ClusterInfo } from './kmeans.optimized.js';

export type KeySpawnTarget = {
    position: Point;     
    interval: number;    
};


export type mapConfig = {
    size: number;
    range: number;
    keys: number;
    active: boolean;
};

// Start-fallback til spillets første state, hvis K-means ikke har data klar endnu
const initialMapConfig: mapConfig = {
    size: 15,
    range: 8, 
    keys: 2,
    active: true
};

//TODO: lave initial clusterinfo til første kald da A* og kmeans ikke er klar (første periode
export function calculateNextKey (
    playerPosition: Point,
    currentPath: Point[], 
    cluster: ClusterInfo | null
): KeySpawnTarget | null {

    const map = getActiveMap();
    if (!map) return null;

    if (playerState.collectedKeys >= map.keys) {
        console.log(`[DDA] Max nøgler (${map.keys}) er nået. Stopper yderligere spawns.`);
        return null;
    }
    
    const pathLength = currentPath ? currentPath.length: 0;
    let spawnInterval = 7000;
    let spawnRange = 10; 

    console.log("[DDA action]: pathLength is currently", pathLength);

    const clusterLabel = cluster?.label ?? "FLOW";

    switch (clusterLabel) {
        case  null:
            spawnInterval
            spawnRange
            break;
        case "EASY":
            spawnInterval = 9000; 
            // Sat et loft på max 8 felter væk
            spawnRange = Math.min(15, Math.max(5, Math.floor(pathLength * 0.5))); 
            break;

        case "FLOW":
            spawnInterval = 7000; 
            // Sat et fornuftigt FLOW-loft på max 11 felter væk, så den ikke spawner ved EXIT under opstart
            spawnRange = Math.min(20, Math.max(10, Math.floor(pathLength * 0.5))); 
            break;

        case "HARD":
            spawnInterval = 5000; 
            spawnRange = 20; 
            break;
        default:
            spawnInterval = 2000;
            spawnRange = 6;
    }

    const nextPosition = generateCoordinates(
        playerPosition, 
        currentPath, 
        clusterLabel, 
        spawnRange
    );

    return {
        position: nextPosition,
        interval: spawnInterval
    };
}


function generateCoordinates (
    playerPos: Point,
    path: Point[],
    label: string,
    range: number
): Point {
    const diffMode = label;
    const activeMap = getActiveMap();

    if (!activeMap) return { x: 1, y: 1 };

    const grid = activeMap.grid;
    const rows = grid.length;
    const cols = grid[0] ? grid[0].length : 0;

    const getDistanceFromPlayer = (target: Point) => {
        return Math.abs(playerPos.x - target.x) + Math.abs(playerPos.y - target.y);
    };

    // --- STRIDT SIKRINGS-TJEK FOR INIT/OPSTART ---
    if (!path || path.length <= 1) {
        for (let y = 3; y < rows - 3; y++) {
            for (let x = 3; x < cols - 3; x++) {
                if (grid[y] && grid[y][x] === TILE.PATH) {
                    const tempPoint = { x, y };
                    if (getDistanceFromPlayer(tempPoint) > 2) {
                        return tempPoint;
                    }
                }
            }
        }
    }

    // Vi søger på tværs af hele banens grid for at finde valide felter, hvilket fjerner A* feedback-loopen
    if (diffMode === 'EASY' || diffMode === 'FLOW') {
        const validPoints: Point[] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r] && grid[r][c] === TILE.PATH) {
                    const dist = getDistanceFromPlayer({ x: c, y: r });

                    if (diffMode === 'EASY' && dist > 2 && dist <= range) {
                        validPoints.push({ x: c, y: r });
                    } 
                    else if (diffMode === 'FLOW' && dist >= Math.max(3, Math.floor(range * 0.4)) && dist <= range) {
                        validPoints.push({ x: c, y: r });
                    }
                }
            }
        }

        if (validPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPoints.length);
            return validPoints[randomIndex]!;
        }
    }

    // --- HARD MODUS (Symmetrisk distribution uden fastlåste koordinater) ---
    let validX = playerPos.x;
    let validY = playerPos.y;
    let attempts = 0;

    while (attempts < 100) {
        const offsetX = Math.floor(Math.random() * (range * 2 + 1)) - range;
        const offsetY = Math.floor(Math.random() * (range * 2 + 1)) - range;

        const randomX = playerPos.x + offsetX;
        const randomY = playerPos.y + offsetY;

        if (randomY >= 0 && randomY < rows && randomX >= 0 && randomX < cols) {
            const tileType = grid[randomY] ? grid[randomY][randomX] : TILE.WALL;
            const distance = getDistanceFromPlayer({ x: randomX, y: randomY });
            
            if (tileType === TILE.PATH && distance > 2) {
                validX = randomX;
                validY = randomY;
                break; 
            }
        }
        attempts++;
    }

   if (validX === playerPos.x && validY === playerPos.y) {
       return { x: playerPos.x + 3 < cols ? playerPos.x + 3 : Math.max(0, playerPos.x - 3), y: playerPos.y };
   }

   return { x: validX, y: validY };
}

//TODO: skal affect første periode i næste spil
// AD (Architectural Difficulty / Map Generator)
export function AD (cluster: ClusterInfo | null): mapConfig {
    if (!cluster) {
        generateDynamicMap(initialMapConfig.size, initialMapConfig.range, initialMapConfig.keys);
        return initialMapConfig;
    }

    // SKALERING AF BANEN
    // banens størrelse og antallet af nøgler vokse dynamisk baseret på K-means indekset
    const clusterIndex = cluster.index; // 0, 1, 2...

    
    const size = 15 + (clusterIndex * 10);     // Indeks 0 = 15x15, Indeks 1 = 25x25, Indeks 2 = 35x35
    const range = 8 + (clusterIndex * 2);      // Indeks 0 = 8, Indeks 1 = 10, Indeks 2 = 12
    const totalKeys = 2 + clusterIndex;        // Indeks 0 = 2 nøgler, Indeks 1 = 3 nøgler, Indeks 2 = 4 nøgler

    console.log(`Genererer dynamisk map ud fra cluster [${cluster.label}]: ${size}x${size}, Nøgler: ${totalKeys}`);
    
    generateDynamicMap(size, range, totalKeys);

    return { 
        size: size, 
        range: range, 
        keys: totalKeys, 
        active: true 
    };
}
