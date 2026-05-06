import { insertTestData } from './DDA.js';
const minMax = {
    time: [0, 300],
    path: [0, 1],
    keys: [0, 10],
};
const weights = {
    Time: 0.8,
    Path: 1,
    Keys: 1
};
let playerState = {
    currentTime: 0,
    collectedKeys: 0,
    rightSteps: 0,
    wrongSteps: 0
};
const vector = [];
setInterval(() => {
    // Random test values
    playerState.currentTime = Math.random() * 120;
    playerState.collectedKeys = Math.random() * 3;
    // Simulate path behavior
    playerState.rightSteps = Math.floor(Math.random() * 20) + 5; // optimal steps
    playerState.wrongSteps = Math.floor(Math.random() * 20); // mistakes
    insertTestData(vector, playerState, minMax, weights);
}, 1000);
//# sourceMappingURL=test.js.map