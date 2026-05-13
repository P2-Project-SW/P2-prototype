// main.ts
import { AD } from './kmeans/Logic/DDA.action.js';
import { playerPosition$, optimalPath$ } from './kmeans/Logic/DDA.observable.js';
import { getActiveMap } from './2D_Array/2dArray.js';
import { movePlayer } from './PlayerMovement/PlayerMovement.js';


/**
 * Central initialisering af spillet
 */
function initGame() {
    console.log("initgame bliver kaldt");

    // 1. Kickstart det allerførste spil.
    // Vi sender 'null' ind i din AD-funktion, hvilket udløser 'firstMapConfig' 
    // og kalder generateDynamicMap(15, 8, 2) helt automatisk bag kulisserne.
    const initialConfig = AD(null);
    
    // 2. Hent det netop skabte kort for at opsætte start-tilstanden i dine Observables
    const startingMap = getActiveMap();
    
    if (startingMap) {
        // Vi sætter de første startværdier i dine BehaviorSubjects,
        // så combineLatest har sit fulde fundament til at starte DDA-timeren med det samme.
        playerPosition$.next({ x: 0, y: 1 }); // STARTPOSITION { y: 1, x: 0 }
        
        // Lav en tom start-rute (eller lad dit spil beregne den første A* rute)
        optimalPath$.next([]);
        
        console.log("");
    } else {
        console.error("Fejl: Kunne ikke generere det initiale kort under opstart.");
    }
}

// Vent på at DOM'en er helt klar, før vi eksekverer startskuddet
document.addEventListener("DOMContentLoaded", () => {
    initGame();
});

// Expose functions to window so HTML buttons can call them
(window as any).AD = AD;
(window as any).movePlayer = movePlayer;
