import { DDA_updater, startNewGame } from './kmeans.optimized.js';
import { PPI_array } from '../Elbow_method/data_gen.js';
import type { Point } from '../../AStar/AStar.js';
import type { ClusterInfo } from './kmeans.optimized.js';
import { getActiveMap, TILE } from '../../2D_Array/2dArray.js';


startNewGame(PPI_array);

//CONSTANTS

export type KeySpawnTarget = {
    position: Point;     // Det nøjagtige koordinat til den næste nøgle
    interval: number;    // Hvor hurtigt spillet skal spawne den (i ms)
};

export function calculateNextKey(
    playerPosition: Point,
    currentPath: Point[], // Ruten hen til den nuværende aktive nøgle
    cluster: ClusterInfo
): KeySpawnTarget {
    
    const pathLength = currentPath.length;
    let spawnInterval = 5000;
    let spawnRange = 5; // Standard radius for hvor langt væk næste nøgle må spawne

    // 1. Definer funktionaliteten (interval og range) ud fra cluster
    switch (cluster.label) {
        case 'EASY':
            spawnInterval = 5000; // Sæt farten ned (slow down)
            spawnRange = Math.max(3, Math.floor(pathLength * 0.5)); // Hold den tæt på nuværende sti
            break;

        case 'FLOW':
            spawnInterval = 2000; // Sæt farten op (increase)
            spawnRange = Math.floor(pathLength * 0.8); // Tillad moderat afstand
            break;

        case 'HARD':
            spawnInterval = 1200; // Konstant hurtig
            spawnRange = 10; // Helt uafhængig af den nuværende sti-længde
            break;
    }

    // 2. Beregn det nye {x, y} koordinat ud fra de genererede tal
    const nextPosition = generateCoordinatesByRules(
        playerPosition, 
        currentPath, 
        cluster.label, 
        spawnRange
    );

    return {
        position: nextPosition,
        interval: spawnInterval
    };
}

function generateCoordinatesByRules (
    playerPos: Point,
    path: Point[],
    label: string,
    range: number
): Point {
    const diffMode = label;
    const activeMap = getActiveMap();

    if (!activeMap) return {x: 1, y: 1};

    const grid = activeMap.grid
    const rows = grid.length;
    const cols = grid[0]!.length;

    // Hjælpefunktion til at måle afstanden fra spilleren
    const getDistanceFromPlayer = (target: Point) => {
        return Math.abs(playerPos.x - target.x) + Math.abs(playerPos.y - target.y);
    };

    //
    if (diffMode === 'EASY' && path.length > 0) {
        const pointsWithinRange = path.filter(point => getDistanceFromPlayer(point) <= range);
        const validPoints = pointsWithinRange.length > 0 ? pointsWithinRange : path.slice(0, range);
        
        const randomIndex = Math.floor(Math.random() * validPoints.length);
        return validPoints[randomIndex]!;
    }

    // FLOW 
    if (diffMode === 'FLOW' && path.length > 0) {
        const validPoints = path.filter(point => {
            const dist = getDistanceFromPlayer(point);
            return dist >= Math.floor(range * 0.4) && dist <= range;
        });

        if (validPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPoints.length);
            return validPoints[randomIndex]!;
        }
    }

    // HARD (Uafhængig af sti + Grid Validering) ---
    // Da Hard spawner tilfældigt omkring spilleren, skal vi sikre os, at det er et path-felt (PATH)
    let validX = playerPos.x;
    let validY = playerPos.y;
    let attempts = 0;

    // Kør en løkke indtil vi rammer et lovligt grid-felt, der IKKE er en væg
    while (attempts < 100) {
        // Generer tilfældigt offset ud fra spillers position inden for range
        const randomX = playerPos.x + (Math.floor(Math.random() * (range * 2)) - range);
        const randomY = playerPos.y + (Math.floor(Math.random() * (range * 2)) - range);

        // Tjek om koordinatet er inden for mappets grænser
        const inBounds = randomY >= 0 && randomY < rows && randomX >= 0 && randomX < cols;

        if (inBounds) {
            const tileType = grid[randomY]![randomX];
            
            // Vi accepterer kun feltet, hvis det er en PATH (eller START/END), men IKKE en WALL
            if (tileType !== TILE.WALL) {
                validX = randomX;
                validY = randomY;
                break; // Vi fandt et godt felt! Stop løkken.
            }
        }
        attempts++;
    }


   return { x: validX, y: validY };
}