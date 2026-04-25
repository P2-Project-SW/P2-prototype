"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInverted = normalizeInverted;
exports.buildPerformanceVector = buildPerformanceVector;
exports.computeWeightedScore = computeWeightedScore;
// -------------------------------
//  1. normalizeInverted()
// -------------------------------
function normalizeInverted(value, minValue, maxValue) {
    // Normalize to 0–1
    let n = (value - minValue) / (maxValue - minValue);
    // Invert so 1 = bad, 0 = good
    let inverted = 1 - n;
    // Clamp to [0, 1]
    if (inverted < 0)
        inverted = 0;
    if (inverted > 1)
        inverted = 1;
    return inverted;
}
// -------------------------------
//  2. buildPerformanceVector()
// -------------------------------
function buildPerformanceVector(timeScore, pathScore, collectibleScore) {
    // Return the 3D performance vector
    return [timeScore, pathScore, collectibleScore];
}
// -------------------------------
//  3. computeWeightedScore()
// -------------------------------
function computeWeightedScore(v, weights) {
    let score = 0;
    // Weighted sum (dot product)
    for (let i = 0; i < v.length; i++) {
        score += v[i] * weights[i];
    }
    return score;
}
//# sourceMappingURL=DDA.js.map