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


export function calculateNextKey(
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

    const pathLength = currentPath ? currentPath.length : 0;
    let spawnInterval = 7000;

    console.log("[DDA action]: pathLength is currently", pathLength);

    const clusterLabel = cluster?.label ?? "FLOW";

    switch (clusterLabel) {
        case "EASY":
            spawnInterval = 9000;
            break;
        case "FLOW":
            spawnInterval = 7000;
            break;
        case "HARD":
            spawnInterval = 5000;
            break;
        default:
            spawnInterval = 7000;
    }

    const nextPosition = generateCoordinates(
        playerPosition,
        currentPath,
        clusterLabel,
    );

    return {
        position: nextPosition,
        interval: spawnInterval
    };
}

function generateCoordinates(
    playerPos: Point,
    path: Point[],
    label: string,
): Point {
    const diffMode = label;
    const activeMap = getActiveMap();

    if (!activeMap) return { x: 1, y: 1 };

    if (path && path.length > 3) {
        let targetDistanceFraction: number;
        let spreadFraction: number;

        if (diffMode === 'EASY') {
            targetDistanceFraction = 0.25;
            spreadFraction = 0.10;
        } else if (diffMode === 'FLOW') {
            targetDistanceFraction = 0.45;
            spreadFraction = 0.08;
        } else { // HARD
            targetDistanceFraction = 0.65;
            spreadFraction = 0.06;
        }

        const getDistanceFromPlayer = (target: Point) =>
            Math.abs(playerPos.x - target.x) + Math.abs(playerPos.y - target.y);

        // Første path-punkt inden for 1 tile af spilleren — ikke nærmeste Manhattan
        const exactIndex = path.findIndex(p => getDistanceFromPlayer(p) <= 1);
        const playerPathIndex = exactIndex !== -1
            ? exactIndex
            : path.reduce((bestIdx, p, idx) => {
                return getDistanceFromPlayer(p) < getDistanceFromPlayer(path[bestIdx]!)
                    ? idx : bestIdx;
            }, 0);

        const remainingPath = path.slice(playerPathIndex + 1);
        const remainingLength = remainingPath.length;

        const searchPath = remainingLength <= 4
            ? path.slice(Math.max(0, playerPathIndex - 10))
            : remainingPath;

        const searchLength = searchPath.length;
        if (searchLength <= 1) return { x: 1, y: 1 };

        const endTile = path[path.length - 1]!;
        const isEndTile = (p: Point) => p.x === endTile.x && p.y === endTile.y;

        const targetIndex = Math.floor(searchLength * targetDistanceFraction);
        const tolerance = Math.max(2, Math.floor(searchLength * spreadFraction));

        const candidates = searchPath.filter((p, i) => {
            if (isEndTile(p)) return false;
            return i >= targetIndex - tolerance && i <= targetIndex + tolerance;
        });

        if (candidates.length > 0) {
            return candidates[Math.floor(Math.random() * candidates.length)]!;
        }

        const sorted = searchPath
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => !isEndTile(p))
            .sort((a, b) => Math.abs(a.i - targetIndex) - Math.abs(b.i - targetIndex));

        if (sorted[0]) return sorted[0].p;
    }

    return { x: 1, y: 1 };
}

//TODO: skal affect første periode i næste spil
// AD (Architectural Difficulty / Map Generator)
export function AD(cluster: ClusterInfo | null): mapConfig {
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
