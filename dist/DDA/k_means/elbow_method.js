import { makeData, centroids_array } from './K_means_centroids.js';
//plotly div
const elbowGraph = document.getElementById("elbowGraph");
//elbow data
const boxMullerData = [
    makeData(100, centroids_array[0], 0.10),
    makeData(100, centroids_array[1], 0.10),
    makeData(100, centroids_array[2], 0.10),
];
function createTrace(data, name, color) {
    return {
        x: data.map(p => p[0]),
        y: data.map(p => p[1]),
        z: data.map(p => p[2]),
        mode: 'markers',
        type: 'scatter3d',
        name: name,
        marker: { size: 6, color: color, opacity: 0.5 }
    };
}
const elbowTrace = createTrace(boxMullerData, 'random', 'gray');
const data = [elbowTrace];
//layout of plot
const layout = {
    title: 'k-means elbow method',
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
if (elbowGraph) {
    if (data && data.length > 0) {
        Plotly.newPlot(elbowGraph, data, layout);
    }
}
else {
    console.error("Kunne ikke finde 'tester' elementet");
}
//# sourceMappingURL=elbow_method.js.map