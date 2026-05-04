export { centroids_array, makeData };
//Manual centroids array
const centroids_array = [
    //[x: normal time, y: normal keys, z: normal step ratio]
    [0.75, 0.75, 0.75], // EASY (Index 0)
    [0.5, 0.5, 0.5], // FLOW (Index 1)
    [0.25, 0.25, 0.25] // HARD (Index 2)
];
function makeData(samples, centroid, stdDev) {
    let dataPoints = [];
    if (!centroid)
        return dataPoints;
    function genGaussVariable(variable) {
        let truncatedVariable = Math.trunc(variable * 100) / 100;
        return truncatedVariable;
    }
    for (let i = 0; i < samples; i++) {
        let u1 = Math.random(), u2 = Math.random() || 0.0001; // må ikke ramme nul pga lg(0)=0
        let u3 = Math.random(), u4 = Math.random() || 0.0001;
        console.log("u1 and u2", u1, u2);
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        let z2 = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);
        console.log("z0", z0);
        let x = centroid[0] + z0 * stdDev;
        let y = centroid[1] + z1 * stdDev;
        let z = centroid[2] + z2 * stdDev;
        //console.log("x", x);
        let finalx = genGaussVariable(x);
        let finaly = genGaussVariable(y);
        let finalz = genGaussVariable(z);
        console.log("x,y,z", x, y, z);
        console.log("final x,y,z", finalx, finaly, finalz);
        dataPoints.push([
            finalx,
            finaly,
            finalz
        ]);
    }
    return dataPoints;
}
//# sourceMappingURL=data_gen.js.map