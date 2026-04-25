declare var Plotly: any;
const {extendTraces} = Plotly;

declare var rxjs: any;
const { interval, from } = rxjs;
const { startWith, map, pairwise, tap, take } = rxjs.operators;


window.onload = () => {

    //plotly div
    const TESTER = document.getElementById('tester');

    //Data generation L:16-51
    const centroids_array: number[][] = [
        //[normal time, normal keys, normal step ratio]
        [0.75, 1, 0.75], // EASY (Index 0)
        [0.5, 0.5, 0.35], // FLOW (Index 1)
        [0.25, 0.25, 0.15] // HARD (Index 2)
    ]

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

    /*
    //! = not empty
    const easyCentroid = makeData(3, centroids_array[0]!, 0.1);
    const flowCentroid = makeData(3, centroids_array[1]!, 0.1);
    const HardCentroid = makeData(3, centroids_array[2]!, 0.1);
    */

    const PPI_array = makeData(10, centroids_array[1]!, 0.3);


//EUCLIDIAN DISTANCE
    //keep tracks of latest PPI data 
    function PPI_stream(array: number[][], period: number) {

        interval(period).pipe(
            take(array.length),
            map((index: number) => array[index]),
            startWith([array[0]]), //springer ikke første vector over

            pairwise(),
            tap((pair: number) => console.log(`O/P of pairwise: ${JSON.stringify(pair)}`)),

            map(([prev, curr]: [number[], number[]]) => {
            // Beregn forskel (Math.abs inverts to avoid negative numbers)
            const diffs = curr.map((value, i) => (Math.abs(value - prev[i]!)).toFixed(3));

             return { diffs, latestVector: curr};
            })
        ).subscribe(({diffs, latestVector}: {diffs: number[]; latestVector: number[]}) => {
            console.log(`differens (x, y, z): ${diffs}`);

            const kMeansResult = euclideanDistance(latestVector); //skal sendes til euclidian distance funktion
            const assignColor = centroidColors[kMeansResult.newDifficultyIndex]

            //tilføjer data til plotly løbende
            Plotly.extendTraces('tester', {
                x: [[latestVector[0]]],
                y: [[latestVector[1]]],
                z: [[latestVector[2]]],
                'marker.color': [[assignColor]]
            }, [3]);  // PPI_trace er trace 3

            //TODO: Last step i k-means: sæt funktionen ind der modtager den mindste distance og cluster til decision tree
            console.log(`Ny vektor tilhører ${kMeansResult.difficulty}`);
            console.log(`Afstan til centroid: ${kMeansResult.distance.toFixed(3)}`);

        })   
    }


    
    let currentDifficultyIndex = 1; //starter i FLOW

    //Afstand fra alle centroids til latestVector
    function euclideanDistance (newVector: number[]) {
        const distances = centroids_array.map((centroid) => {
            return Math.hypot(...centroid.map((value, i) => value - newVector[i]!));
        });

        const minDistance = Math.min(...distances); //Giver den mindste af distancerne
        const newDifficultyIndex = distances.indexOf(minDistance);

        const currentDist = distances[currentDifficultyIndex]!;
        const improvementThreshold = 0.05; 

        if (newDifficultyIndex!== currentDifficultyIndex && minDistance < currentDist * (1 - improvementThreshold)) {
            console.log(`SKIFTER CENTROID: Fra ${currentDifficultyIndex} til ${newDifficultyIndex}`);
            currentDifficultyIndex = newDifficultyIndex;
        }

        return {
            newDifficultyIndex,// 0      1       2
            difficulty: ["EASY", "FLOW", "HARD"][newDifficultyIndex],
            distance: minDistance
        }
    }


    let testEucArray: number[][] = [
        [0.70, 0.90, 0.70], // 1. Bliver EASY
        [0.52, 0.52, 0.37], // 2. Bliver FLOW
        [0.20, 0.20, 0.10], // 3. Bliver HARD
        [0.37, 0.37, 0.25], // 4. TEST: Ligger midt mellem HARD og FLOW (Bliver i HARD)
        [0.55, 0.55, 0.40]  // 5. TEST: Bevæger sig ind FLOW 
    ];

    

// TRACES
    function createTrace(data: number[][], name: string, color: string) {
        return {
            x: data.map(p => p[0]),
            y: data.map(p => p[1]),
            z: data.map(p => p[2]),
            mode: 'markers',
            type: 'scatter3d',
            name: name,
            marker: { size: 6, color: color, opacity: 0.5 }
        }

    }

    /*
    const easyTrace = createTrace(easyCentroid, 'Easy', 'red');
    const flowTrace = createTrace(flowCentroid, 'Flow', 'blue');
    const hardTrace = createTrace(HardCentroid, 'Hard', 'green');
    */

    //const PPI_trace = createTrace(PPI_array, 'random', 'gray')

    const centroidColors = ['red', 'blue', 'green']

    //3 manual centroids
    const centroids = {
        EASY: [0.75, 1, 0.75],
        FLOW: [0.5, 0.5, 0.35],
        HARD: [0.25, 0.25, 0.15]
    }

    const PPI_trace = {
        x: [], y: [], z: [],
        mode: 'markers',
        type: 'scatter3d',
        name: 'Player Data',
        marker: { size: 4, color: [], opacity: 0.7 }
    }

    var centroid1 = {
        x: [centroids.EASY[0]],
        y: [centroids.EASY[1]],
        z: [centroids.EASY[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 1',
        text: ['C1'],
        marker: { color: centroidColors[0], size: 8 }
    }

    var centroid2 = {
        x: [centroids.FLOW[0]],
        y: [centroids.FLOW[1]],
        z: [centroids.FLOW[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 2',
        text: ['C2'],
        marker: { color: centroidColors[1], size: 8 }
    }

    var centroid3 = {
        x: [centroids.HARD[0]],
        y: [centroids.HARD[1]],
        z: [centroids.HARD[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 3',
        text: ['C3'],
        marker: { color: centroidColors[2], size: 8 }
    }

//DATA OF PLOTLY
    var data = [centroid1, centroid2, centroid3, PPI_trace];

    //layout of plot
    const layout = {
        title: 'k-means centroids',
        scene: {
            xaxis: {
                text: 'AVG time',
                range: [0, 1.5],
                autorange: false // no zoom
            },
            yaxis: {
                text: 'Keys',
                range: [0, 1.5],
                autorange: false
            },
            zaxis: {
                text: 'Step ratio',
                range: [0, 1.5],
                autorange: false
            }
            //dragmode: 'turntable',
            //hovermode: false
        },
        margin: { l: 0, r: 0, b: 0, t: 40 }
    };

    //PLOTLY
    if (TESTER) {
        if (data && data.length > 0) {
            setTimeout(() => {
                Plotly.newPlot(TESTER, data, layout);
                PPI_stream(PPI_array, 3000);
            }, 100)
        }
    } else {
        console.error("Kunne ikke finde 'tester' elementet");
    }
};



