import type { PlayerState, MinMax, Weights } from '../Types.js';
export { normalize, invert, buildPerformanceVector, computeWeightedScore, computeStepRatio, insertTestData };
declare function normalize(value: number, minValue: number, maxValue: number): number;
declare function invert(value: number): number;
declare function computeWeightedScore(v: number, weight: number): number;
declare function computeStepRatio(rightSteps: number, wrongSteps: number): number;
declare function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: Weights): number[][];
declare function insertTestData(vector: number[][], playerState: PlayerState, minMax: MinMax, weights: Weights): void;
//# sourceMappingURL=DDA.d.ts.map