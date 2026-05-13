import { BehaviorSubject, combineLatest } from 'rxjs';
import { DDA_updater } from './kmeans.optimized.js';
import type { Point } from '../../AStar/AStar.js'
import { calculateNextKey } from './DDA.action.js';
import { startNewGame } from './kmeans.optimized.js';
import { PPI_array } from '../Elbow_method/data_gen.js';
import { getActiveMap, TILE } from '../../2D_Array/2dArray.js';
import { clearKeyPosition, currentKeyPosition } from '../../KeyGeneration/KeyGeneration.js';
import { playerState } from '../../PlayerState/PlayerState.js';

const DEFAULT_CLUSTER = { index: 1, label: 'FLOW', color: 'blue', currentDist: 0 };

function removeActiveKey(map: any) {
    const oldKeyCell = document.querySelector('.key');
    if (oldKeyCell) {
        oldKeyCell.classList.remove('key');
        oldKeyCell.innerHTML = '';
        (oldKeyCell as HTMLElement).style.removeProperty('display');
        (oldKeyCell as HTMLElement).style.removeProperty('alignItems');
        (oldKeyCell as HTMLElement).style.removeProperty('justifyContent');
    }

    clearKeyPosition();

    if (map && map.activeKey) {
        map.grid[map.activeKey.y]![map.activeKey.x] = TILE.PATH;
        map.activeKey = null;
    }
}

startNewGame(PPI_array);

export const playerPosition$ = new BehaviorSubject<Point | null>(null); 
export const optimalPath$ = new BehaviorSubject<Point[]>([]);

export const gameStatus$ = combineLatest({
    currPosition: playerPosition$,
    currPath: optimalPath$,
    currCluster: DDA_updater
});

let spawnTimeout: any = null;
let currentTargetPosition: Point | null = null; // Holder styr på, hvor den næste nøgle ER på vej hen

gameStatus$.subscribe(({ currPosition, currPath, currCluster }) => {
    const map = getActiveMap();
    if (!currPosition || !map) return;

    const cluster = currCluster ?? DEFAULT_CLUSTER;

    // Hvis alle nøgler til banen er samlet, skal vi ikke spawne flere
    if (playerState.collectedKeys >= map.keys) {
        if (map.activeKey) removeActiveKey(map);
        if (spawnTimeout) {
            clearTimeout(spawnTimeout);
            spawnTimeout = null;
        }
        currentTargetPosition = null;
        return;
    }

    // Hvis der REELT ligger en opsamlelig nøgle på kortet lige nu, skal vi afvente, at spilleren tager den
    if (map.activeKey) {
        return;
    }

    // Beregn næste logiske spawn-target baseret på DDA/Cluster adfærd
    const keyTarget = calculateNextKey(currPosition, currPath, cluster);
    if (keyTarget === null) {
        removeActiveKey(map);
        return;
    }

    // BEHAVIOUR FIX: Hvis vi allerede har startet en timer mod DET SAMME koordinat, 
    // skal vi IKKE genstarte eller afbryde timeren. Lad den tælle færdig.
    if (currentTargetPosition && 
        currentTargetPosition.x === keyTarget.position.x && 
        currentTargetPosition.y === keyTarget.position.y) {
        return; 
    }

    // Hvis målet har ændret sig (f.eks. pga. nyt adfærdsmønster/cluster), nulstiller vi den gamle timer
    if (spawnTimeout) {
        clearTimeout(spawnTimeout);
    }

    // Lås det nye mål, så næste skridt ikke afbryder nedtællingen
    currentTargetPosition = keyTarget.position;

    const spawnDelay = map.hasSpawnedKey ? keyTarget.interval : 0;
    console.log(`[DDA] Mode: ${cluster.label} | Nøgle spawner om ${spawnDelay}ms på X: ${keyTarget.position.x}, Y: ${keyTarget.position.y}`);

    spawnTimeout = setTimeout(() => {
        // Ryd op før placering
        removeActiveKey(map);

        const newKeyCell = document.querySelector(`[key-x="${keyTarget.position.x}"][key-y="${keyTarget.position.y}"]`);
        if (newKeyCell) {
            newKeyCell.classList.add('key');
            const htmlElement = newKeyCell as HTMLElement;
            htmlElement.style.display = "flex";
            htmlElement.style.alignItems = "center";
            htmlElement.style.justifyContent = "center";
            htmlElement.innerHTML = `🗝️`;

            // Opdater kort-datastrukturen
            map.activeKey = { x: keyTarget.position.x, y: keyTarget.position.y };
            map.hasSpawnedKey = true;
            map.grid[keyTarget.position.y]![keyTarget.position.x] = TILE.KEY;
            
            // Opdater globale adresser, så kollisionsdetekteringen i PlayerMovement.ts virker
            currentKeyPosition.x = keyTarget.position.x;
            currentKeyPosition.y = keyTarget.position.y;
        } else {
            console.warn(`[DDA Error] Kunne ikke placere nøglen fysisk på HTML-felt X: ${keyTarget.position.x}, Y: ${keyTarget.position.y}`);
        }

        // Nulstil timeren i hukommelsen, da den nu er eksekveret
        spawnTimeout = null;
        currentTargetPosition = null; 
    }, keyTarget.interval); // Bruger dynamisk ms her (1200ms, 2000ms eller 5000ms)
});
