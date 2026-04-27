import type { PlayerState, MinMax } from '../Types.js';
import { buildPerformanceVector, computeWeightedScore } from './DDA.js'

const minMax: MinMax = {
    time: [0, 300],   
    path: [0, 1],     
    keys: [0, 10],    
};

const weights = [0.4, 0.35, 0.25]; // time, path, keys

//.
const playerState: PlayerState = {
    currentTime: 142,
    pathEfficiency: 0.76,
    collectedKeys: 5,
};


const vector = buildPerformanceVector(playerState, minMax, weights);
const score = computeWeightedScore(vector, weights);

console.log(score); 