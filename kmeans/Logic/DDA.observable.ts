import { BehaviorSubject, combineLatest, Subject, startWith, map ,interval, merge } from 'rxjs';
import { DDA_updater, startNewGame, type ClusterInfo } from './kmeans.optimized.js';
import { calculateNextKey } from './DDA.action.js';
import { PPI_array } from '../Elbow_method/data_gen.js';
import { getActiveMap, STARTPOSITION, TILE } from '../../2D_Array/2dArray.js';
import { clearKeyPosition, currentKeyPosition } from '../../KeyGeneration/KeyGeneration.js';
import { playerState } from '../../PlayerState/PlayerState.js';
import type { Point } from '../../AStar/AStar.js';
import type { KeySpawnTarget } from './DDA.action.js';

const initialCluster: ClusterInfo = {
    index: 1,
    label: "FLOW",
    color: "blue",
    currentDist: 0,
}

// Simple databeholdere – de må IKKE trigge combineLatest for hvert skridt
export const playerPosition$ = new BehaviorSubject<Point | null>(null); 
export const optimalPath$ = new BehaviorSubject<Point[]>([]);
export const keyStateChanged$ = new Subject<void>();

//første kørsel uden kmeans -> startSession()
export const gameStarted$ = new Subject<void>();
export const initialKeySpawn$ = gameStarted$.pipe(
    map(() => {
        console.log("[DDA system] spawner første key (pre-kmeans)");
        return initialCluster
    })
);


// Strømmen lytter udelukkende på din K-means AI og dine diskrete spilhændelser
export const gameStatus$ = combineLatest({
    trigger: keyStateChanged$,
    currCluster: DDA_updater.pipe(startWith(initialCluster))
}).pipe(
    map(({currCluster}) => currCluster)
)

//merger subscriber 
merge(initialKeySpawn$, gameStatus$).subscribe((cluster) => {
    console.log(`[DDA system]: spawn trigger modtaget: ${cluster.label}`);
    executeSpawnLogic(cluster);
})


export function startSession () {
    console.log("startSession kaldt - spawner første key");
    gameStarted$.next();
}

let spawnTimeout: any = null;

function removeActiveKey(map: any) {
    const oldKeyCell = document.querySelector('.key');
    if (oldKeyCell) {
        oldKeyCell.classList.remove('key');
        oldKeyCell.innerHTML = '';
        (oldKeyCell as HTMLElement).style.removeProperty('display');
    }
    clearKeyPosition();
    if (map && map.activeKey) {
        map.grid[map.activeKey.y]![map.activeKey.x] = TILE.PATH;
        map.activeKey = null;
    }
}

export function cancelActiveSpawnTimer() {
    if (spawnTimeout) {
        clearTimeout(spawnTimeout);
        spawnTimeout = null;
    }
}

function executeSpawnLogic(cluster: any) {
    const map = getActiveMap();
    if (!map) return;

    // Dynamisk stop: Hvis alle nøgler til banen er samlet, stopper vi helt
    if (playerState.collectedKeys >= map.keys) {
        removeActiveKey(map);
        cancelActiveSpawnTimer();
        return;
    }

    removeActiveKey(map);

    // Hent dine data synkront ud af dine BehaviorSubjects i stedet for asynkront via streams
    const currentPos = playerPosition$.getValue() ?? { x: 0, y: 1 };
    const currentPath = optimalPath$.getValue();

    // Beregn næste logiske spawn-target ud fra K-means og A* stiens længde
    const keyTarget = calculateNextKey(currentPos, currentPath, cluster);
    if (keyTarget === null) return;

    // Dynamisk forsinkelse: Første nøgle spawner øjeblikkeligt (0ms), efterfølgende bruger cluster-intervallet
    const spawnDelay = map.hasSpawnedKey ? keyTarget.interval : 0;
    console.log(`[DDA System] Cluster: ${cluster.label} | Spawn interval sat til: ${spawnDelay}ms.`);

    // Placer nøglen fysisk i DOM og dit 2D-array
    const newKeyCell = document.querySelector(`[key-x="${keyTarget.position.x}"][key-y="${keyTarget.position.y}"]`);
    if (newKeyCell) {
        newKeyCell.classList.add('key');
        const htmlElement = newKeyCell as HTMLElement;
        htmlElement.style.display = "flex";
        htmlElement.style.alignItems = "center";
        htmlElement.style.justifyContent = "center";
        htmlElement.innerHTML = `🗝️`;

        map.activeKey = { x: keyTarget.position.x, y: keyTarget.position.y };
        map.hasSpawnedKey = true;
        map.grid[keyTarget.position.y]![keyTarget.position.x] = TILE.KEY;
        
        currentKeyPosition.x = keyTarget.position.x;
        currentKeyPosition.y = keyTarget.position.y;
    }

    if (spawnTimeout) clearTimeout(spawnTimeout);
    
    //TODO: første key bliver sat i et interval
    // Tidsbaseret rullering: Hvis intervallet udløber, kalder funktionen sig selv igen asynkront
    spawnTimeout = setTimeout(() => {
        console.log("[DDA System] Interval udløbet uden opsamling. Roterer nøglens position...");
        const freshCluster = DDA_updater.getValue() ?? cluster;
        executeSpawnLogic(freshCluster);
    }, spawnDelay);
}

startNewGame(PPI_array);
