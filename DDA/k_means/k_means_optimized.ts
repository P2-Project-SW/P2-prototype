// @ts-nocheck 
import Plotly from 'plotly.js-dist-min';
import { interval, Observable, Subscription, timer } from 'rxjs';
import { startWith, map, pairwise, tap, take, scan,  } from 'rxjs/operators';

import { centroids_array, makeData } from './Elbow_method/data_gen.js'
import { optimalK } from './Elbow_method/elbow_method.js'; //giver bundle problemer

// CONSTANTS
type ClusterInfo = {
    index: number;
    label: string;
    color: string;
    currentDist: number;
};

type LatestData = {
    vector: number[];
    cluster: ClusterInfo;
};

type StreamAcc = {
    lastIndex: number;
    sums: number[][];
    members: number[];
    centroids: Centroids;
    isDone: boolean;
    latest: LatestData | null;
};

const initialAcc: StreamAcc = {
    lastIndex: 1, // første cluster assigned er FLOW
    sums: [[0,0,0], [0,0,0], [0,0,0]],
    members: [0, 0, 0],
    centroids: initialCen,
    isDone: false,
    latest: null
};

type Centroids = {
    EASY: number[],
    FLOW: number[],
    HARD: number[]
}

let initialCen: Centroids = {
    EASY: [0.75, 1, 0.75],
    FLOW: [0.5, 0.5, 0.35],
    HARD: [0.25, 0.25, 0.15]
}


const DIFFICULTY_LABELS = ["EASY", "FLOW", "HARD"]; // C1, C2, C3
const CENTROID_COLORS = ['red', 'blue', 'green']; 


let isGameDone: boolean = false; // reciever from playermovement og styrer om centroids bliver opdateret
let hasUpdatedPlot: boolean = false; //tjekker om plots er updated
let currentSubscription: Subscription | null = null; //initiliazes Subscription

// FUNCTION CALLS

setTimeout(endGame, 5000);


//TODO: kald startNewGame i playermovement når spillet starter 
export function startNewGame (playerData: number[][] ) { 
    //resets variabler der styrer updatecentroids
    isGameDone = false; 
    hasUpdatedPlot = false;
    
    // Start new stream
    dataStream = PPI_stream(playerData, 0);
    subscribeToStream(dataStream);
}
 
//TODO: kald endGame i playermovement når spillet slutter
export function endGame () {
    isGameDone = true
}


//calculates euclidean distance from datapoints to centroids
export function euclideanDistance (centroids: Centroids, newVector: number[]) {

    //regner alle distancer mellem centroids og nyeste datapunkt
    const distances = Object.values(centroids).map((centroid) => {
        return Math.hypot(...centroid.map((value, i) => value - newVector[i]!));
    });

    //finder mindste distance af alle distancerne
    const minDistance = Math.min(...distances);

    return { minDistance, distances }
}

// tildeler en cluster og farve til datapunktet
function assignCluster (dist: { minDistance: number, distances: number[] }, lastIndex: number ) {
    const newIndex = dist.distances.indexOf(dist.minDistance);

    const lastDist = dist.distances[lastIndex]!; 
    const threshold = 0.05; //buffer

    //Procentvise forskel fra sidste distance til nye 
    const diff = Math.abs(dist.minDistance - lastDist) /lastDist
    // newindex hvis differencen (afstand) mellem sidste og nuværende centroid ikke er større en buffer så skifter den ikke centroid
    const finalIndex = (newIndex !== lastIndex && diff > threshold) ? newIndex : lastIndex;
    
    return {
        index: finalIndex,
        label: DIFFICULTY_LABELS[finalIndex],
        color: CENTROID_COLORS[finalIndex],
        currentDist: dist.minDistance
    }
}

// plotter playerdata fra et array -> playerData
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

// updatere centroids positioner -> summen af alle data/data medlemmer = [ny x, ny y, ny z]
function updateCentroids(sums: number[][], members: number[]): Centroids {
    const updated: Centroids = {
        EASY: members[0] > 0 
            ? sums[0]!.map(sum => sum / members[0]) 
            : initialCen.EASY,
        
        FLOW: members[1] > 0 
            ? sums[1]!.map(sum => sum / members[1]) 
            : initialCen.FLOW,
        
        HARD: members[2] > 0 
            ? sums[2]!.map(sum => sum / members[2]) 
            : initialCen.HARD
    };
    
    // updates initialCen så næste game uses that
    initialCen = updated;
    console.log('Centroid positions are updated:', updated);
    
    return updated;
}

//OTHER

    //const PPI_static = createTrace(PPI_array, 'Data points', 'gray')

//DATA STREAM 

//kunstig box-muller data -> blev brugt til testing af kmeans
const PPI_array= [
    makeData(10, centroids_array[0]!, 0.10),
    makeData(10, centroids_array[1]!, 0.10),
    makeData(10, centroids_array[2]!, 0.10),
    ].flat();


// Selve streamet som bruger pipe(). her sker der en del
/*
først indlæser den arrayet og bruger pairwise() til at fange et par: sidste og nyeste vector, så den kan sammenligne dem.
pairwise():
bruges til at finde differencen mellem vektorerne ()

Scan():
Scan er en inbygget funktion der bruger en accumulater, hvilket betyder den 
kan "akkumulere" tidligere datapunkter. bruges eksempelvis til at holde styr på sidste valge cluster (L:189-192)

*/ 
function PPI_stream (playerData: number[][], dataInterval: number) {

    return interval(dataInterval).pipe(
        take(playerData.length),
        map((index: number) => playerData[index]),
        startWith([playerData[0]]), //springer ikke første vector over
        pairwise(),
        tap((pair: [number[], number[]]) => console.log(`O/P of pairwise: ${JSON.stringify(pair)}`)),

        scan ((acc: StreamAcc, [prev, curr]: [number[], number[]]) => {
            console.log(`previous vector: ${prev} and current vector ${curr}`);

            //kalder på funktioner, finder paramtre fra accumulater -> nye udregninger -> gemmer dem.
            const dists = euclideanDistance(initialCen, curr);
            const cluster = assignCluster(dists, acc.lastIndex);
            const newSums = [...acc.sums];
            const newMembers = [...acc.members]

            //akkumulere summen af data for hver cluster og antal medlemmer
            newSums[cluster.index] = newSums[cluster.index]!.map((val, i) => val + curr[i]!);
            newMembers[cluster.index]++;

           let updatedCentroids = acc.centroids;
           let gameIsDone = isGameDone;

           if (gameIsDone && !acc.isDone) {  
                updatedCentroids = updateCentroids(newSums, newMembers);
                console.log('game is done! Centroids updated.');
            }

            return {
                lastIndex: cluster.index,
                sums: newSums,
                members: newMembers,
                centroids: updatedCentroids,
                isDone: gameIsDone,
                latest: {
                    vector: curr,
                    cluster: cluster
                },
            };
        }, initialAcc)
    ) 
}


let dataStream = PPI_stream(PPI_array, 100);
subscribeToStream(dataStream); 


// Subscribe or unsubscribes to stream
function subscribeToStream(stream: Observable<StreamAcc>) {

    if (currentSubscription) {
        currentSubscription.unsubscribe()
        console.log("old stream unsubscribed");
    }
    
    currentSubscription = stream.subscribe(data => {
        Plotly.extendTraces('tester', {
            x: [[data.latest.vector[0]]],
            y: [[data.latest.vector[1]]],
            z: [[data.latest.vector[2]]],
            'marker.color': [[data.latest.cluster.color]]
        }, [3]);
        
        if (data.isDone && !hasUpdatedPlot) {
            Plotly.update('tester', {
                x: [[data.centroids.EASY[0]], [data.centroids.FLOW[0]], [data.centroids.HARD[0]]],
                y: [[data.centroids.EASY[1]], [data.centroids.FLOW[1]], [data.centroids.HARD[1]]],
                z: [[data.centroids.EASY[2]], [data.centroids.FLOW[2]], [data.centroids.HARD[2]]]
            }, {}, [0, 1, 2]);
            
            hasUpdatedPlot = true;
            console.log(`plotly has updated centroids: C1: ${data.centroids.EASY}, C2: ${data.centroids.FLOW}, C3: ${data.centroids.HARD}`);
        }

        console.log(`Cluster: ${data.latest.cluster.label}, Distance: ${data.latest.cluster.currentDist}`);
    });

    return currentSubscription;
}

 //PLOTLY

const TESTER = document.getElementById('tester');


var centroid1 = {
    x: [initialCen.EASY[0]],
    y: [initialCen.EASY[1]],
    z: [initialCen.EASY[2]],
    type: 'scatter3d',
    mode: 'markers+text',
    name: 'Centroid 1',
    text: ['C1'],
    marker: { color: CENTROID_COLORS[0], size: 8 }
}

var centroid2 = {
    x: [initialCen.FLOW[0]],
    y: [initialCen.FLOW[1]],
    z: [initialCen.FLOW[2]],
    type: 'scatter3d',
    mode: 'markers+text',
    name: 'Centroid 2',
    text: ['C2'],
    marker: { color: CENTROID_COLORS[1], size: 8 }
}

var centroid3 = {
    x: [initialCen.HARD[0]],
    y: [initialCen.HARD[1]],
    z: [initialCen.HARD[2]],
    type: 'scatter3d',
    mode: 'markers+text',
    name: 'Centroid 3',
    text: ['C3'],
    marker: { color: CENTROID_COLORS[2], size: 8 }
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
        }, 100)
    }
} else {
    console.error("Kunne ikke finde 'tester' elementet");
}