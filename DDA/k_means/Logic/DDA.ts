import type { PlayerState, MinMax } from '../Types.js';

export { normalizeInverted, buildPerformanceVector, computeWeightedScore };

function normalizeInverted(value: number, minValue: number, maxValue: number): number {
    let n = (value - minValue) / (maxValue - minValue);
    let inverted = 1 - n;
    if (inverted < 0) inverted = 0;
    if (inverted > 1) inverted = 1;
    return inverted;
}

function computeWeightedScore(v: number[], weights: number[]): number[] {
    let result: number[] = [];
    for (let i = 0; i < v.length; i++) {
        result.push((v[i] ?? 0) * (weights[i] ?? 0));
    }
    return result;
}

function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: number[]): number[] {
    const timeScore = normalizeInverted(state.currentTime, minMax.time[0], minMax.time[1]);
    const pathScore = normalizeInverted(state.pathEfficiency, minMax.path[0], minMax.path[1]);
    const collectScore = normalizeInverted(state.collectedKeys, minMax.keys[0], minMax.keys[1]);
    return computeWeightedScore([timeScore, pathScore, collectScore], weights);
}