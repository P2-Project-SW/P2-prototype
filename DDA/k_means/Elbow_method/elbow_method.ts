// @ts-nocheck 

import Plotly from 'plotly.js-dist'; 
import { Observable, range } from 'rxjs';   

import { centroids_array, makeData } from './data_gen.js'

//plotly divs
const elbowGraph = document.getElementById("elbowGraph")
const dataGraph = document.getElementById("dataGraph")

//elbow data
const boxMullerData = [
    makeData(100, centroids_array[0]!, 0.10),
    makeData(100, centroids_array[1]!, 0.10),
    makeData(100, centroids_array[2]!, 0.10),
]

//makeData(10, centroids_array[0], 0.10)

//console.log("raw data ",boxMullerData);

const flattenedData = boxMullerData.flat();
 
//console.log("Flattened Data:", flattenedData);

let k_range = Array.from({ length: 9 }, (a, i) => i + 1 );

function manualKMeans(data: number[][], k: number) {
    let centroids = data.slice(0, k); 
    let wcss = 0;

    for (let iter = 0; iter < 10; iter++) {
        wcss = 0;
        const clusters = Array.from({ length: k }, () => []);

        data.forEach((point) => {
            let minDist = Infinity;
            let closestIdx = 0;

            centroids.forEach((c, cIdx) => {
                const dist = Math.sqrt(point.reduce((acc, val, i) => acc + Math.pow(val - c[i], 2), 0));
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = cIdx;
                }
            });

            clusters[closestIdx].push(point);
            wcss += Math.pow(minDist, 2);
        });

        centroids = clusters.map((points, i) => {
            if (points.length === 0) return centroids[i];
            const avg = new Array(points[0].length).fill(0);
            points.forEach(p => p.forEach((val, dim) => avg[dim] += val));
            return avg.map(val => val / points.length);
        });
    }
    return { error: wcss };
}

function testForK(data: number[][], kValues: number[]) {
    const WCSS: number[] = []; // Dette er din Inertia
    const distortions: number[] = []; // Dette er din Distortion

    kValues.forEach(k => {
        const result = manualKMeans(data, k);
        
        // 1. Inertia (WCSS): Summen af de kvadrerede afstande
        const inertia = result.error;
        WCSS.push(inertia);
        
        // 2. Distortion: Gennemsnitlig kvadreret afstand (Inertia / n)
        const distortion = inertia / data.length;
        distortions.push(distortion);
        
        console.log(`k: ${k} | Inertia (WCSS): ${inertia.toFixed(2)} | Distortion: ${distortion.toFixed(2)}`);
    });

    return { kValues, WCSS, distortions };
}

const elbowResult = testForK(flattenedData, k_range);

function findElbowManually(K: number[], inertias: number[]): number {
    // Start- og slutpunkter for den rette linje (p1 til p2)
    const p1 = { x: K[0], y: inertias[0] };
    const p2 = { x: K[K.length - 1], y: inertias[K.length - 1] };
    
    let maxDistance = -1;
    let elbowK = K[0];
    
    for (let i = 0; i < K.length; i++) {
        const p0 = { x: K[i], y: inertias[i] };
        
        // Formel for afstand fra et punkt (p0) til en linje (p1-p2)
        const numerator = Math.abs(
            (p2.y - p1.y) * p0.x - 
            (p2.x - p1.x) * p0.y + 
            p2.x * p1.y - 
            p2.y * p1.x
        );
        const denominator = Math.sqrt(
            Math.pow(p2.y - p1.y, 2) + 
            Math.pow(p2.x - p1.x, 2)
        );
        const distance = numerator / denominator;
        
        if (distance > maxDistance) {
            maxDistance = distance;
            elbowK = K[i];
        }
    }
    
    return elbowK;
}

// Brug den efter din testForK funktion:
const optimalK = findElbowManually(elbowResult.kValues, elbowResult.WCSS);
console.log(`%c Albuen findes manuelt ved K = ${optimalK}/${elbowResult.kValues}`, "color: yellow; font-weight: bold; background: black;");


const elbow_trace = {
    x: elbowResult.kValues,
    y: elbowResult.WCSS,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Inertia (WCSS)',
} as any;

const layout2D = {
    title: `Elbow Method (Optimal K = ${optimalK})`,
    xaxis: {
        title: 'centroids (k)', 
        autorange: true
    },
    yaxis: {
        title: 'WCSS',
        autorange: true
    },
    margin: { l: 50, r: 20, b: 50, t: 60 }
};

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

const clusterData = createTrace(flattenedData, 'random', 'gray');
 
console.log("Flattened Data:", flattenedData);

const elbowTrace = createTrace(flattenedData, 'random', 'gray')

var data = [elbowTrace]

//layout of plot
const layout3D = {
    title: 'k-means elbow method',
    scene: {
        xaxis: {
            title: 'Time',
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

var data1 = [elbow_trace]
var data2 = [clusterData]

//PLOTLY
if (elbowGraph) {
    if (data1 && data1.length > 0) {
        Plotly.newPlot(elbowGraph, data1, layout2D as any);
    }
} else {
    console.error("Kunne ikke finde 'elbowGraph' elementet");
}
//PLOTLY data
if (dataGraph) {
    if (data2 && data2.length > 0) {
        Plotly.newPlot(dataGraph, data2, layout3D as any);
    }
} else {
    console.error("Kunne ikke finde 'dataGraph' elementet");
}
