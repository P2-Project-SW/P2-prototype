export { normalize, invert, buildPerformanceVector, computeWeightedScore, computeStepRatio, insertTestData };
// Normalizing function to turn values into a number between 0 and 1
function normalize(value, minValue, maxValue) {
    return Math.min(1, Math.max(0, (value - minValue) / (maxValue - minValue)));
}
// Invert Function for keys
function invert(value) {
    return 1 - value;
}
function computeWeightedScore(v, weight) {
    return (v ?? 0) * (weight ?? 0);
}
// Path efficiency = wrongSteps / (rightSteps + wrongSteps)
function computeStepRatio(rightSteps, wrongSteps) {
    if (rightSteps + wrongSteps === 0)
        return 0; // avoid NaN
    return wrongSteps / (rightSteps + wrongSteps); // already 0–1
}
function buildPerformanceVector(state, minMax, weights) {
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
    return [[weightedTime, weightedCollect, weightedPath]];
}
function insertTestData(vector, playerState, minMax, weights) {
    const newData = buildPerformanceVector(playerState, minMax, weights);
    vector.push(...newData);
    console.log("Inserted:", newData);
    console.log("Vector now:", vector);
}
//# sourceMappingURL=DDA.js.map