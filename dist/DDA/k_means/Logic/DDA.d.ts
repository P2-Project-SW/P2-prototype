export interface PlayerState {
    currentTime: number;
    pathEfficiency: number;
    collectedKeys: number;
}
export declare function normalizeInverted(value: number, minValue: number, maxValue: number): number;
export declare function buildPerformanceVector(timeScore: number, pathScore: number, collectibleScore: number): number[];
export declare function computeWeightedScore(v: number[], weights: number[]): number;
//# sourceMappingURL=DDA.d.ts.map