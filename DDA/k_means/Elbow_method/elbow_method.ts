// @ts-nocheck 
import (Plotly) from 'plotly.js-dist';

import { kmeans } from 'ml-kmeans';



import { centroids_array, makeData } from './data_gen.js'

//plotly divs
const elbowGraph = document.getElementById("elbowGraph")
const dataGraph = document.getElementById("dataGraph")


//elbow data
const boxMullerData = [
    makeData(10, centroids_array[0]!, 0.10),
    makeData(10, centroids_array[1]!, 0.10),
    makeData(10, centroids_array[2]!, 0.10),
]


//console.log("raw data ",boxMullerData);

const flattenedData = boxMullerData.flat();
 
//console.log("Flattened Data:", flattenedData);




let k_range = Array.from({ length: 10 }, (a, i) => i + 1 );



function testForK(data: number[][], kValues: number[]) {

    const WCSS: number[] = [];
    const distortions: number [] = [];

    kValues.forEach(k => {
        const result = kmeans(data, k, { initialization: 'kmeans++' }) as any;
        
        const error = result.iterations[result.iterations.length - 1].error;
        //error rate of the clustering
        WCSS.push(error);
        //avg range between dp and centroids
        distortions.push(error /data.length)
        console.log(`k: ${k} -> Inertia: ${error.toFixed(2)}`);
    });

    return {kValues, WCSS, distortions};
}

const elbowResult = testForK(flattenedData, k_range);

const elbow_trace = {
    x: elbowResult.kValues,
    y: elbowResult.WCSS,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Inertia (WCSS)'
} as any;


const layout2D = {
    title: 'elbow method (inertia)',
    scene: {
        xaxis: {
            title: 'centroids (k)',
            autorange: true // no zoom
        },
        yaxis: {
            title: 'WCSS',
            autorange: true
        },

    },
    margin: { l: 0, r: 0, b: 0, t: 40 }
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
        Plotly.newPlot(dataGraph, data2 as any, layout3D as any);
    }
} else {
    console.error("Kunne ikke finde 'dataGraph' elementet");
}
