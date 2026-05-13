// main.ts
import { AD } from './kmeans/Logic/DDA.action.js';
import { playerPosition$, optimalPath$ } from './kmeans/Logic/DDA.observable.js';
import { getActiveMap } from './2D_Array/2dArray.js';
import { movePlayer } from './PlayerMovement/PlayerMovement.js';
import { keyStateChanged$ } from './kmeans/Logic/DDA.observable.js';
import { cancelActiveSpawnTimer } from './kmeans/Logic/DDA.observable.js';

/**
 * Central initialisering af spillet
 */
function initGame() {
    console.log("initgame bliver kaldt");

    AD(null);
    const startingMap = getActiveMap();
    
    if (startingMap) {
        // Sæt de korrekte startværdier i dine adresser
        playerPosition$.next({ x: 0, y: 1 });
        optimalPath$.next([{ x: 0, y: 1 }]);
        
        // --- SPAR DET ALLERFØRSTE SPAWN I GANG VED OPSTART ---
        keyStateChanged$.next();
        
        console.log("DDA systemet er succesfuldt startet.");
    } else {
        console.error("Fejl: Kunne ikke generere det initiale kort under opstart.");
    }
}


function changeDifficulty(mode: string | null) {
    console.log(`🎛️ Manuelt sværhedsgradsskift triggeret: ${mode}`);
    
    // 1. Stop alle igangværende timere fra det gamle map, så de ikke spawner spøgelsesnøgler
    cancelActiveSpawnTimer();

    if (mode === null) {
        // Hvis der trykkes på "Initial Start"
        AD(null);
    } else {
        // Vi bygger et komplet ClusterInfo-objekt for at undgå runtime-fejl i switchen
        // Vi mapper EASY -> index 0, FLOW -> index 1, HARD -> index 2
        let targetIndex = 1;
        if (mode === 'EASY') targetIndex = 0;
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
        // 2. Nulstil spillerens position og rute i RxJS til det nye map
        playerPosition$.next({ x: 0, y: 1 });
        optimalPath$.next([{ x: 0, y: 1 }]);

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
