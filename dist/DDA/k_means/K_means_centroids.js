"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
window.onload = () => {
    const TESTER = document.getElementById('tester');
    const centroids = {
        //[normal time, normal keys, normal step ratio]
        EASY: [0.75, 1, 0.75], //
        FLOW: [0.5, 0.5, 0.35],
        HARD: [0.25, 0.25, 0.15],
    };
    var centroid1 = {
        x: [centroids.EASY[0]],
        y: [centroids.EASY[1]],
        z: [centroids.EASY[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 1',
        text: ['C1'],
        marker: { color: 'red', size: 12 }
    };
    var centroid2 = {
        x: [centroids.FLOW[0]],
        y: [centroids.FLOW[1]],
        z: [centroids.FLOW[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 2',
        text: ['C2'],
        marker: { color: 'blue', size: 12 }
    };
    var centroid3 = {
        x: [centroids.HARD[0]],
        y: [centroids.HARD[1]],
        z: [centroids.HARD[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 3',
        text: ['C3'],
        marker: { color: 'green', size: 12 }
    };
    var data = [centroid1, centroid2, centroid3];
    /*
        const data = [{
            x: [0, 0.25, 0.5, 0.75, 1],
            y: [0, 0.25, 0.5, 0.75, 1],
            z: [0, 0.25, 0.5, 0.75, 1],
            type: 'scatter3d',
            mode: 'markers+text',
            marker: {color: 'blue', size: 12},
            name: 'PPI'
        }];
    */
    const layout = {
        title: 'k-means centroids',
        scene: {
            xaxis: {
                title: {
                    text: 'AVG time'
                },
                range: [0, 1],
                autorange: false // no zoom
            },
            yaxis: {
                title: {
                    text: 'Keys'
                },
                range: [0, 1],
                autorange: false
            },
            zaxis: {
                title: {
                    text: 'Step ratio'
                },
                range: [0, 1],
                autorange: false
            }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 }
    };
    if (TESTER) {
        Plotly.newPlot(TESTER, data, layout);
    }
    else {
        console.error("Kunne ikke finde 'tester' elementet");
    }
};
//# sourceMappingURL=K_means_centroids.js.map