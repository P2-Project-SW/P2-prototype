import type { PlayerState, MinMax, } from "../../../PlayerState/PlayerState.js";
export { normalize, invert, buildPerformanceVector, computeWeightedScore, computeStepRatio, weights, performanceHistory, sampleAndStore };
export type { Weights };


 type Weights = {
    Time: number;
    Path: number;
    Keys: number;
};

 const weights: Weights = {
    Time: 0.33,
    Path: 0.33,
    Keys: 0.33
};

 const performanceHistory: number[][] = [];

// Normalizing function to turn values into a number between 0 and 1
function normalize(value: number, minValue: number, maxValue: number): number {
    if(maxValue === minValue) return 0;
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
    if (rightSteps + wrongSteps === 0) return 0;
    return wrongSteps / (rightSteps + wrongSteps); // already 0–1
}

function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: Weights): number[] {

    // TIME 
    const timeNorm = normalize(state.currentTime, minMax.time[0], minMax.time[1]);
    const weightedTime = computeWeightedScore(timeNorm, weights.Time);

    // PATH 
    const rawPathEfficiency = computeStepRatio(state.rightSteps, state.wrongSteps);
    const pathNorm = normalize(rawPathEfficiency, minMax.path[0], minMax.path[1]);
    const weightedPath = computeWeightedScore(pathNorm, weights.Path);

    // KEYS 
    const keysNorm = normalize(state.collectedKeys, minMax.keys[0], minMax.keys[1]);
    const keysInverted = invert(keysNorm);
    const weightedCollect = computeWeightedScore(keysInverted, weights.Keys);

    // Final vector: [time, keys, path]
    return [weightedTime, weightedCollect, weightedPath];
}

function sampleAndStore(state: PlayerState, minMax: MinMax, weights: Weights) {
    const vector = buildPerformanceVector(state, minMax, weights);
    performanceHistory.push(vector);
    return vector;
}



/*
function insertTestData(vector: number[][], playerState: PlayerState, minMax: MinMax, weights: Weights) {
    const newData = buildPerformanceVector(playerState, minMax, weights);
    vector.push(...newData);

    console.log("Inserted:", newData);
    console.log("Vector now:", vector);
}
*/