import type { PlayerState, MinMax, Weights } from './types.js';

export { normalize, invert, buildPerformanceVector, computeWeightedScore, computeStepRatio };

// Normalizing function to turn values into a number between 0 and 1
function normalize(value: number, minValue: number, maxValue: number): number {
    return Math.min(1, Math.max(0, (value - minValue) / (maxValue - minValue)));
}

// Invert Function for keys
function invert(value: number): number {
    return 1 - value;
}

function computeWeightedScore(v: number, weight: number) {
    return (v ?? 0) * (weight ?? 0);
}

// Path efficiency = wrongSteps / (rightSteps + wrongSteps)
function computeStepRatio(rightSteps: number, wrongSteps: number) {
    if (rightSteps + wrongSteps === 0) return 0; // avoid NaN
    return wrongSteps / (rightSteps + wrongSteps); // already 0–1
}

function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: Weights) {

    //Collect values
    const timeRaw = state.currentTime;
    const pathRaw = computeStepRatio(state.rightSteps, state.wrongSteps); // already 0–1
    const keysRaw = state.collectedKeys;

    //Normalize
    const timeNorm = normalize(timeRaw, minMax.time[0], minMax.time[1]);
    const pathNorm = normalize(pathRaw, minMax.path[0], minMax.path[1]);
    const keysNorm = normalize(keysRaw, minMax.keys[0], minMax.keys[1]);

    // multiply by weights
    const wTime = timeNorm * weights.Time;
    const wPath = pathNorm * weights.Path;
    //invert keys aswell
    const wKeys = (1 - keysNorm) * weights.Keys;

    //normalize again. This helps prevent one metric from dominating the others
    const vector: [number, number, number] = [wTime, wKeys, wPath];

    const mag = Math.sqrt(vector[0]**2 + vector[1]**2 + vector[2]**2) || 1;

    const finalVector = vector.map(v => v / mag);
    
    return [finalVector];
}


/*function insertTestData(vector: number[][], playerState: PlayerState, minMax: MinMax, weights: Weights) {
    const newData = buildPerformanceVector(playerState, minMax, weights);
    vector.push(...newData);

    console.log("Inserted:", newData);
    console.log("Vector now:", vector);
}*/
