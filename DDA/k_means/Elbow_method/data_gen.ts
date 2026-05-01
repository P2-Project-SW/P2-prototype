export {centroids_array, makeData};


//Manual centroids array
const centroids_array: number[][] = [
    //[x: normal time, y: normal keys, z: normal step ratio]
    [0.75, 1, 0.75], // EASY (Index 0)
    [0.5, 0.5, 0.35], // FLOW (Index 1)
    [0.25, 0.25, 0.15] // HARD (Index 2)
]

//Data generation (not needed in final iteration)
function makeData(samples: number, centroid: any[], stdDev: number) {
    let dataPoints: number[][] = [];

    if (!centroid) return dataPoints;

    for (let i = 0; i < samples; i++) {

        // Box-Muller for 3D (x, y, z)
        let u1 = Math.random(), u2 = Math.random();
        let u3 = Math.random(), u4 = Math.random();

        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        let z2 = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);

        let rawX = (centroid[0] + z0 * stdDev).toFixed(2)
        let rawY = (centroid[1] + z1 * stdDev).toFixed(2)
        let rawZ = (centroid[2] + z2 * stdDev).toFixed(2)

        const clamp = (value: number) => {
            let positive = Math.abs(value); //inverts (no negative)
            return Math.min(1, Math.max(0, positive)) // bettween 0 and 1
        }


        dataPoints.push([
            Number(clamp(rawX).toFixed(2)),
            Number(clamp(rawY).toFixed(2)),
            Number(clamp(rawZ).toFixed(2))
        ]);
    }
    return dataPoints;
}