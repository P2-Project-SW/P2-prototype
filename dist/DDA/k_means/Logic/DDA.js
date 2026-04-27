export { normalizeInverted, buildPerformanceVector, computeWeightedScore };
function normalizeInverted(value, minValue, maxValue) {
    let n = (value - minValue) / (maxValue - minValue);
    let inverted = 1 - n;
    if (inverted < 0)
        inverted = 0;
    if (inverted > 1)
        inverted = 1;
    return inverted;
}
function computeWeightedScore(v, weights) {
    let result = [];
    for (let i = 0; i < v.length; i++) {
        result.push((v[i] ?? 0) * (weights[i] ?? 0));
    }
    return result;
}
<<<<<<< Updated upstream
function buildPerformanceVector(state, minMax, weights) {
    const timeScore = normalizeInverted(state.currentTime, minMax.time[0], minMax.time[1]);
    const pathScore = normalizeInverted(state.pathEfficiency, minMax.path[0], minMax.path[1]);
    const collectScore = normalizeInverted(state.collectedKeys, minMax.keys[0], minMax.keys[1]);
    return computeWeightedScore([timeScore, pathScore, collectScore], weights);
=======
//TODO: lav systemcontroller fil
function computeStepRatio(rightSteps, wrongSteps) {
    let stepRatio;
    stepRatio = wrongSteps / (wrongSteps + rightSteps);
    const clamp = (value) => {
        let positive = Math.abs(value); //inverts (no negative)
        return Math.min(1, Math.max(0, positive)); // bettween 0 and 1
    };
    clamp(stepRatio);
    return stepRatio;
    //vurderingslogik af A* optimalsteps
}
function buildPerformanceVector(state, minMax, weights) {
    let score = [];
    const timeScore = normalizeInverted(state.currentTime, minMax.time[0], minMax.time[1]);
    //const pathScore = normalizeInverted(state.pathEfficiency, minMax.path[0], minMax.path[1]);
    const pathScore = computeStepRatio(5, 10);
    const collectScore = normalizeInverted(state.collectedKeys, minMax.keys[0], minMax.keys[1]);
    computeWeightedScore([timeScore, pathScore, collectScore], weights);
    score.push([
        timeScore,
        pathScore,
        collectScore
    ]);
    return score;
>>>>>>> Stashed changes
}
//# sourceMappingURL=DDA.js.map