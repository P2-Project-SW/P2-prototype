import type { PlayerState, MinMax, Weights } from '../Types.js';
import { insertTestData } from './DDA.js';

const minMax: MinMax = {
    time: [0, 300],
    path: [0, 1],
    keys: [0, 10],
};

const weights: Weights = {
    Time: 0.8,
    Path: 1,
    Keys: 1
};

let playerState: PlayerState = {
    currentTime: 0,
    collectedKeys: 0,
    rightSteps: 0,
    wrongSteps: 0
};

const vector: number[][] = [];

setInterval(() => {
    // Random test values
    playerState.currentTime = Math.random() * 120;
    playerState.collectedKeys = Math.random() * 3;

    // Simulate path behavior
    playerState.rightSteps = Math.floor(Math.random() * 20) + 5;  // optimal steps
    playerState.wrongSteps = Math.floor(Math.random() * 20);      // mistakes

    insertTestData(vector, playerState, minMax, weights);

}, 1000);



    
    

    

    

