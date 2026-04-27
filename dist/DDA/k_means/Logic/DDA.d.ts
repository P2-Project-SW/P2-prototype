import type { PlayerState, MinMax } from '../Types.js';
export { normalizeInverted, buildPerformanceVector, computeWeightedScore };
declare function normalizeInverted(value: number, minValue: number, maxValue: number): number;
declare function computeWeightedScore(v: number[], weights: number[]): number[];
<<<<<<< Updated upstream
declare function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: number[]): number[];
=======
declare function buildPerformanceVector(state: PlayerState, minMax: MinMax, weights: number[]): number[][];
>>>>>>> Stashed changes
//# sourceMappingURL=DDA.d.ts.map