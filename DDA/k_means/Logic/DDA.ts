// -------------------------------
//  Player State
// -------------------------------
export interface PlayerState {
    currentTime: number;       // raw time spent in the maze
    pathEfficiency: number;    // raw path efficiency (0–1)
    collectedKeys: number;     // raw number of keys collected
}



// -------------------------------
//  1. normalizeInverted()
// -------------------------------
export function normalizeInverted(
    value: number,
    minValue: number,
    maxValue: number
): number {

    // Normalize to 0–1
    let n = (value - minValue) / (maxValue - minValue);

    // Invert so 1 = bad, 0 = good
    let inverted = 1 - n;

    // Clamp to [0, 1]
    if (inverted < 0) inverted = 0;
    if (inverted > 1) inverted = 1;

    return inverted;
}



// -------------------------------
//  2. buildPerformanceVector()
// -------------------------------
export function buildPerformanceVector(
    timeScore: number,
    pathScore: number,
    collectibleScore: number
): number[] {

    // Return the 3D performance vector
    return [timeScore, pathScore, collectibleScore];
}



// -------------------------------
//  3. computeWeightedScore()
// -------------------------------
export function computeWeightedScore(
    v: number[],
    weights: number[]
): number {

    let score = 0;

    // Weighted sum (dot product)
    for (let i = 0; i < v.length; i++) {
        score += v[i] * weights[i];
    }

    return score;
}
