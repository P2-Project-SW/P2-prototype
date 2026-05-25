// main.ts
import { AD } from './kmeans/Logic/DDA.action.js';
import { playerPosition$, optimalPath$ } from './kmeans/Logic/DDA.observable.js';
import { getActiveMap, STARTPOSITION } from './2D_Array/2dArray.js';
import { movePlayer, resetPlayerPosition, computeOptimalPath, resetPlayerCoords } from './PlayerMovement/PlayerMovement.js';
import { keyStateChanged$ } from './kmeans/Logic/DDA.observable.js';
import { cancelActiveSpawnTimer } from './kmeans/Logic/DDA.observable.js';
import { startSession } from './kmeans/Logic/DDA.observable.js';
import { resetPlayerDiv } from './PlayerMovement/PlayerView.js';
import { buildPerformanceVector } from './kmeans/Logic/DDA.js';
import { playerState, minMax, weights } from './PlayerState/PlayerState.js';
import { startNewGame } from './kmeans/Logic/kmeans.optimized.js';

/**
 * Central initialisering af spillet
 */
function initGame() {

    AD(null);
    startSession();

    

   /* setInterval(() => {
        const vector = buildPerformanceVector(playerState, minMax, weights);
        startNewGame(vector);
    }, 10000);*/

    const startingMap = getActiveMap();
    
    if (startingMap) {
        const observePath = computeOptimalPath( startingMap.grid,  STARTPOSITION.x, STARTPOSITION.y);
        optimalPath$.next([...observePath]);
        // Sæt de korrekte startværdier i dine adresser
        playerPosition$.next({ x: STARTPOSITION.x, y: STARTPOSITION.y });
        
        
        console.log("DDA systemet er succesfuldt startet.");
    } else {
        console.error("Fejl: Kunne ikke generere det initiale kort under opstart.");
    }
}


function changeDifficulty(mode: string | null) {
    resetPlayerPosition();
    resetPlayerDiv();
    console.log(` Manuelt sværhedsgradsskift triggeret: ${mode}`);
    
    // 1. Stop alle igangværende timere fra det gamle map, så de ikke spawner spøgelsesnøgler
    cancelActiveSpawnTimer();
    resetPlayerCoords();

    if (mode === null) {
        // Hvis der trykkes på "Initial Start"
        AD(null);
    } else {
        // Vi mapper EASY -> index 0, FLOW -> index 1, HARD -> index 2
        let targetIndex = 1; //starter ved FLOW
        if (mode === 'EASY') targetIndex = 0;
        if (mode === 'FLOW') targetIndex = 1;
        if (mode === 'HARD') targetIndex = 2;

        const mockCluster = {
            index: targetIndex,
            label: mode,
            color: 'gray',
            currentDist: 0
        };

        // Generer det nye map med den valgte størrelse
        AD(mockCluster);
    }

    const newMap = getActiveMap();
    if (newMap) {
        const observePath = computeOptimalPath( newMap.grid,  STARTPOSITION.x, STARTPOSITION.y);
        optimalPath$.next([...observePath]);

        // 2. Nulstil spillerens position og rute i RxJS til det nye map
        playerPosition$.next({ x: STARTPOSITION.x, y: STARTPOSITION.y });
        
        // 3. Tving en ny nøgle til at spawne på det nye kort med det samme!
        keyStateChanged$.next();
    }
}

// Vent på at DOM'en er helt klar, før vi eksekverer startskuddet
document.addEventListener("DOMContentLoaded", () => {
    initGame();
});

// Expose functions to window so HTML buttons can call them
(window as any).AD = AD;
(window as any).changeDifficulty = changeDifficulty;
(window as any).movePlayer = movePlayer;
