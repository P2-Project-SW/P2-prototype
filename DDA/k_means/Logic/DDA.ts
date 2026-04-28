import type { PlayerState, MinMax, Weights } from '../Types.js';

export { normalizeInverted, buildPerformanceVector, computeWeightedScore, computeStepRatio, insertTestData };

function normalizeInverted(value: number, minValue: number, maxValue: number): number {
    let n = (value - minValue) / (maxValue - minValue);
    let inverted = 1 - n;
    return Math.min(1, Math.max(0, inverted));
}

function computeWeightedScore(v: number, weight: number) {
    return (v ?? 0) * (weight ?? 0);
}

// Path efficiency = wrongSteps / (wrongSteps + rightSteps)
function computeStepRatio(rightSteps: number, wrongSteps: number) {
    if (rightSteps + wrongSteps === 0) return 0; // avoid NaN
    let ratio = wrongSteps / (rightSteps + wrongSteps);
    return Math.min(1, Math.max(0, ratio));
}

function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: Weights) {
    const timeScore = normalizeInverted(state.currentTime, minMax.time[0], minMax.time[1]);

    // NEW: compute path efficiency using step ratio
    const rawPathEfficiency = computeStepRatio(state.rightSteps, state.wrongSteps);
    const pathScore = normalizeInverted(rawPathEfficiency, minMax.path[0], minMax.path[1]);

    const collectScore = normalizeInverted(state.collectedKeys, minMax.keys[0], minMax.keys[1]);

    const weightedTime = computeWeightedScore(timeScore, weights.Time);
    const weightedPath = computeWeightedScore(pathScore, weights.Path);
    const weightedCollect = computeWeightedScore(collectScore, weights.Keys);

    return [[weightedTime, weightedCollect, weightedPath]];
}

function insertTestData(vector: number[][], playerState: PlayerState, minMax: MinMax, weights: Weights) {
    const newData = buildPerformanceVector(playerState, minMax, weights);
    vector.push(...newData);

    console.log("Inserted:", newData);
    console.log("Vector now:", vector);
}

