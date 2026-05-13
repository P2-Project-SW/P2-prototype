import { DDA_updater, startNewGame } from './kmeans.optimized.js';
import { PPI_array } from '../Elbow_method/data_gen.js';
import type { Point } from '../../AStar/AStar.js';
import type { ClusterInfo } from './kmeans.optimized.js';
import { getActiveMap, TILE, generateDynamicMap} from '../../2D_Array/2dArray.js';
import { playerState } from "../../PlayerState/PlayerState.js";

// Fjernet det globale kald af startNewGame(PPI_array) herfra for at forhindre utilsigtede genstarter ved imports.
// Den bør udelukkende kaldes i din main/init-fil.

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

const firstMapConfig: mapConfig = {
    size: 15,
    range: 8, 
    keys: 2,
    active: true
};

export function calculateNextKey (
    playerPosition: Point,
    currentPath: Point[], 
    cluster: ClusterInfo
): KeySpawnTarget | null {

    const map = getActiveMap();
    if (!map) return null;

    if (playerState.collectedKeys >= map.keys) {
        console.log(`[DDA] Max nøgler (${map.keys}) er nået. Stopper yderligere spawns.`);
        return null;
    }
    
    const pathLength = currentPath ? currentPath.length : 0;
    let spawnInterval = 5000;
    let spawnRange = 5; 

    switch (cluster.label.toUpperCase()) {
        case 'EASY':
            spawnInterval = 5000; 
            spawnRange = Math.max(4, Math.floor(pathLength * 0.5)); 
            break;

        case 'FLOW':
            spawnInterval = 2000; 
            spawnRange = Math.max(6, Math.floor(pathLength * 0.8)); 
            break;

        case 'HARD':
            spawnInterval = 1200; 
            spawnRange = 10; 
            break;
        default:
            spawnInterval = 2000;
            spawnRange = 6;
    }

    const nextPosition = generateCoordinates(
        playerPosition, 
        currentPath, 
        cluster.label.toUpperCase(), 
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
    // Hvis stien er tom eller for kort til at lave valide filtreringer (som set på dit screenshot)
    if (!path || path.length <= 1) {
        console.log("[DDA Protection] Stien er tom under init. Scanner banen efter det første valide PATH-felt...");
        // Vi scanner udefra og ind for at finde et sikkert PATH felt væk fra startpositionen
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

    // --- EASY MODUS ---
    if (diffMode === 'EASY' && path.length > 0) {
        // Tvinger en minimumsafstand på over 1 felt væk fra spilleren, men under max range
        const pointsWithinRange = path.filter(point => {
            const dist = getDistanceFromPlayer(point);
            return dist > 1 && dist <= range;
        });
        
        // FIX: Hvis filteret fejler, cutter vi stien fra index 2 (skipper spillerens nuværende position og det næste felt)
        const validPoints = pointsWithinRange.length > 0 ? pointsWithinRange : path.slice(2, range + 2);
        
        if (validPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPoints.length);
            return validPoints[randomIndex]!;
        }
    }

    // --- FLOW MODUS ---
    if (diffMode === 'FLOW' && path.length > 0) {
        // Sikrer at nøglen spawner i en sund "flow-zone" (ikke klos op ad spilleren, men på stien inden for range)
        const validPoints = path.filter(point => {
            const dist = getDistanceFromPlayer(point);
            return dist >= Math.max(2, Math.floor(range * 0.3)) && dist <= range;
        });

        if (validPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPoints.length);
            return validPoints[randomIndex]!;
        }
    }

    // --- HARD MODUS (Grid-baseret spredning) ---
    let validX = playerPos.x;
    let validY = playerPos.y;
    let attempts = 0;

    while (attempts < 100) {
        // FIX: Perfekt symmetrisk distribution fra -range til +range
        const offsetX = Math.floor(Math.random() * (range * 2 + 1)) - range;
        const offsetY = Math.floor(Math.random() * (range * 2 + 1)) - range;

        const randomX = playerPos.x + offsetX;
        const randomY = playerPos.y + offsetY;

        const inBounds = randomY >= 0 && randomY < rows && randomX >= 0 && randomX < cols;

        if (inBounds) {
            const tileType = grid[randomY] ? grid[randomY][randomX] : TILE.WALL;
            const distance = Math.abs(playerPos.x - randomX) + Math.abs(playerPos.y - randomY);
            
            // FIX: Nøglen skal ligge på en PATH og må under ingen omstændigheder ligge inden for en radius af 2 felter fra spilleren
            if (tileType === TILE.PATH && distance > 2) {
                validX = randomX;
                validY = randomY;
                break; 
            }
        }
        attempts++;
    }

   // Totalt krisecrash-sikring: Hvis kortet er så proppet med vægge at loopet fejler, 
   // returnerer vi et tvunget koordinat i stedet for spillerens egen position.
   if (validX === playerPos.x && validY === playerPos.y) {
       return { x: playerPos.x + 3 < cols ? playerPos.x + 3 : Math.max(0, playerPos.x - 3), y: playerPos.y };
   }

   return { x: validX, y: validY };
}

// AD (Architectural Difficulty / Map Generator)
export function AD (cluster: ClusterInfo | null): mapConfig {

    if(!cluster) {
        generateDynamicMap(firstMapConfig.size, firstMapConfig.range, firstMapConfig.keys);
        return firstMapConfig;
    }

    const diffMode = cluster.label.toUpperCase();
    
    let size = 25;
    let range = 10;
    let totalKeys = 3;

    switch (diffMode) {
        case 'EASY':
            size = 15;
            range = 8;
            totalKeys = 2; 
            break;

        case 'FLOW':
            size = 25;
            range = 10;
            totalKeys = 3; 
            break;

        case 'HARD':
            size = 35;
            range = 12;
            totalKeys = 5; 
            break;
            
        default:
            size = 25;
            range = 10;
            totalKeys = 3;
    }

    console.log(`🤖 AD System: Cluster [${diffMode}] -> Genererer dynamisk map-størrelse: ${size}x${size}, med ${totalKeys} nøgler.`);
    
    generateDynamicMap(size, range, totalKeys);

    return { 
        size: size, 
        range: range, 
        keys: totalKeys, 
        active: true 
    };
}
