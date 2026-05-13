// AStarObservable.ts
import { BehaviorSubject, combineLatest } from 'rxjs';
import {  map } from 'rxjs/operators';
import { DDA_updater } from './kmeans.optimized.js';
import type {Point, aStar } from '../../AStar/AStar.js'
import { calculateNextKey } from './DDA.action.js';
import { startNewGame } from './kmeans.optimized.js';
import { PPI_array } from '../Elbow_method/data_gen.js';

startNewGame(PPI_array);

//Observable source
const playerPosition$ = new BehaviorSubject<Point | null>(null);
const optimalPath$ = new BehaviorSubject<Point[]>([]);

//samler Observable i et object 
export const gameStatus$ = combineLatest ({
    currPosition: playerPosition$,
    currPath: optimalPath$,
    currCluster: DDA_updater
})

let spawnTimeout: any = null;

gameStatus$.subscribe(({currPosition, currPath, currCluster}) => {

    //if(!currPosition && !currPath && !currCluster) return //venter til alt data kommet    
    //Tester
    console.log("position:", currPosition);
    console.log("Optimal path", currPath);
    console.log("position:", currCluster);

    const keyTarget = calculateNextKey(currPosition!, currPath, currCluster)

    //clears timer if player moved before new key spawned.
    if(spawnTimeout) {
        clearTimeout(spawnTimeout)
    }

    console.log(`Nøgle spawner om ${keyTarget.interval}ms på felt X: ${keyTarget.position.x}, Y: ${keyTarget.position.y}`);

    spawnTimeout = setTimeout(() => {
        // Fjern den gamle nøgle-klasse fra HTML'en, hvis den findes
        const oldKey = document.querySelector('.key');
        if (oldKey) oldKey.classList.remove('key');

        // Find det nye key i DOM'en ved hjælp af [key-x][key-y]
        const newKeyCell = document.querySelector(`[data-x="${keyTarget.position.x}"][data-y="${keyTarget.position.y}"]`);
        
        if (newKeyCell) {
            newKeyCell.classList.add('key'); // Tilføj CSS-klassen så den tegnes på kortet
        }

    }, keyTarget.interval);

})


