// @ts-nocheck 
import Plotly from 'plotly.js-dist-min';
import { interval, lastValueFrom, Observable } from 'rxjs';
import { startWith, map, pairwise, tap, take, } from 'rxjs/operators';

import { centroids_array, makeData } from './Elbow_method/data_gen.js'
import { optimalK } from './Elbow_method/elbow_method.js'; //giver bundle problemer

export { PPI_array }

 //TODO: lave updater funktion og assign k = elbow method

 // CONSTANTS
const centroidColors = ['red', 'blue', 'green']

 //FUNCTIONS

 //DATA STREAM 

 //PLOTLY

//window.onload = () => {

//plotly div
const TESTER = document.getElementById('tester');


const PPI_array= [
    makeData(12, centroids_array[0]!, 0.10),
    makeData(12, centroids_array[1]!, 0.10),
    makeData(12, centroids_array[2]!, 0.10),
].flat();

//EUCLIDIAN DISTANCE

    function PPI_stream (array: number[][], period: number) {

        const Stream = interval(period).pipe(
            take(array.length),
            map((index: number) => array[index]),
            startWith([array[0]]), //springer ikke første vector over

            pairwise(),
            tap((pair: number) => console.log(`O/P of pairwise: ${JSON.stringify(pair)}`)),

            map(([prev, curr]: [number[], number[]]) => {
            // Beregn forskel (Math.abs inverts to avoid negative numbers)
                const diffs: number[] = curr.map((value, i) => (Math.abs(value - prev[i]!)).toFixed(3));

                const kMeansResult = euclideanDistance(curr, PPI_array); //skal sendes til euclidian distance funktion
                const assignColor = centroidColors[kMeansResult.newDifficultyIndex]

                return {
                    diffs,
                    latestVector: curr,
                    previousVector: prev,
                    assignColor,
                    difficultyIndex: kMeansResult.newDifficultyIndex
                };

            })
        ) 
        return Stream;
    }

    let dataStream = PPI_stream(PPI_array, 1000)

    dataStream.subscribe( data => {
           // console.log(`differens (x, y, z): ${diffs}`);

            //tilføjer data til plotly løbende
            Plotly.extendTraces('tester', {
                x: [[data.latestVector[0]]],
                y: [[data.latestVector[1]]],
                z: [[data.latestVector[2]]],
                'marker.color': [[data.assignColor]]
            }, [3]); //data index 3

            //TODO: Last step i k-means: sæt funktionen ind der modtager den mindste distance og cluster til decision tree
            //console.log(`Ny vektor tilhører ${data.difficultyIndex}`);
            //console.log(`Afstand til centroid: ${kMeansResult.distance.toFixed(3)}`);
        }) 


    let lastDifficultyIndex = 1; //starter i FLOW

    let C1_sum: number[][] = []
    let C2_sum: number[][] = []
    let C3_sum: number[][] = []

    //Afstand fra alle centroids til latestVector
    export function euclideanDistance (newVector: number[], array: number [][]) {

        //regner alle distancer mellem centroids og nyeste datapunkt
        const distances = centroids_array.map((centroid) => {
            return Math.hypot(...centroid.map((value, i) => value - newVector[i]!));
        });

        //Finder den mindste distance og assigner index for sværhedsgrad
        const minDistance = Math.min(...distances);
        const newDifficultyIndex = distances.indexOf(minDistance);

        const lastDist = distances[lastDifficultyIndex]!;
        const improvementThreshold = 0.05; //buffer
        
        // Beregn den procentvise forskel mellem ny og gammel afstand
        const percentageChange = Math.abs(minDistance - lastDist) / lastDist;
        //Sammenligner forskel på sidste måling og nuværende måling. skifter kun centroid hvis froskellen er større end 5%
        if (newDifficultyIndex !== lastDifficultyIndex && percentageChange > improvementThreshold) {
            //console.log(`SKIFTER CENTROID: Fra ${lastDifficultyIndex} til ${newDifficultyIndex}`);
            lastDifficultyIndex = newDifficultyIndex;
        } else {
            //console.log(`stays in ${lastDifficultyIndex} because value change is less than ${improvementThreshold}`);
        }
        
        return {
            newDifficultyIndex,// 0      1       2
            difficulty: ["EASY", "FLOW", "HARD"][newDifficultyIndex],
            distance: minDistance,
            getVector: newVector
        }
    }


    function dataSum ({newDifficultyIndex, getVector}, array: number [][]) {

        let centroidsCount: number [] = [0,0,0]; // easy, flow, hard
        let counter: number = 0, arrayCount: number;

        //Sums up data points in each cluster
        if (newDifficultyIndex !== undefined) {

            //counts datapoints for each centroid
            centroidsCount[newDifficultyIndex]++
            let index = newDifficultyIndex
            console.log(`Sum of centroid ${index + 1}: is ${centroidsCount[index]}`)

            counter++
            arrayCount = array.length;
            console.log(`counter is ${counter} and array length is ${arrayCount}`);

            if (counter == arrayCount) {
                console.log(centroidsCount);
                return centroidsCount
            } else if (counter !== arrayCount) {
                console.log(`Error on centroidsCount: counter is ${counter} and array length is ${arrayCount}`)
            }
        } else {
            console.log("Error, No index assigned");
        }
    }

    /*
             if(newDifficultyIndex)
        switch (newDifficultyIndex) {
            case 0:
                C1_sum.push(newVector)
                break;
            case 1:
                C2_sum.push(newVector)
                break;
            case 2:
                C3_sum.push(newVector)
                break;
            default:
                console.log('no index assigned');
        }*/

    //dataSum(clusterID, PPI_array)
    

    //tjek at det samlet antal af cluster medlemmer er lig med array.length
    function updateCentroids (array: number [][] ) {
        
        

        if (array.length === makeData.samples)
        console.log("length of flat array:", PPI_array.length); 
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
            marker: { size: 6, color: color, opacity: 0.3 }
        }

    }
    
    const PPI_static = createTrace(PPI_array, 'Data points', 'gray')



    //3 manual centroids
    const centroids = {
        EASY: [0.75, 1, 0.75],
        FLOW: [0.5, 0.5, 0.35],
        HARD: [0.25, 0.25, 0.15]
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

     const PPI_dynamic = {
        x: [], y: [], z: [],
        mode: 'markers',
        type: 'scatter3d',
        name: 'Data points',
        marker: { size: 5, color: [], opacity: 0.5 }
    }

//DATA OF PLOTLY
    var data = [centroid1, centroid2, centroid3, PPI_dynamic ];

    //layout of plot
const layout = {
    title: 'k-means',
    scene: {
        xaxis: {
            title: 'Time',
            range: [0, 1.2],
            autorange: false // no zoom
        },
        yaxis: {
            title: 'Keys',
            range: [0, 1.2],
            autorange: false
        },
        zaxis: {
            title: 'Step ratio',
            range: [0, 1.2],
            autorange: false
        },
        dragmode: 'turntable',
        //hovermode: false
    },
    margin: { l: 0, r: 0, b: 0, t: 40 }
};

    //PLOTLY
    if (TESTER) {
        if (data && data.length > 0) {
            setTimeout(() => {
                Plotly.newPlot(TESTER, data, layout);
                PPI_stream(PPI_array, 0);
            }, 100)
        }
    } else {
        console.error("Kunne ikke finde 'tester' elementet");
    }


//};



