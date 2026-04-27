import type { PlayerState, MinMax } from '../Types.js';
import { buildPerformanceVector, computeWeightedScore } from './DDA.js'

const minMax: MinMax = {
    time: [0, 300],   // min 0 seconds, max 300 seconds
    path: [0, 1],     // min 0, max 1 (already a ratio)
    keys: [0, 10],    // min 0 keys, max 10 keys
};

const weights = [0.4, 0.35, 0.25]; // time, path, keys

// this would be your live player data, updated as the game runs
const playerState: PlayerState = {
    currentTime: 142,
    pathEfficiency: 0.76,
    collectedKeys: 5,
};

// called every 30 seconds
const vector = buildPerformanceVector(playerState, minMax, weights);
const score = computeWeightedScore(vector, weights);

console.log(score); // a number between 0-1, higher = better performance