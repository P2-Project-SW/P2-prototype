"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plotly = require("plotly.js-dist");
//container for plot
var TESTER = document.getElementById('tester');
//graph content/data: 
const centroids = [{
        x: [0, 0.25, 0.5, 0.75, 1],
        y: [0, 0.25, 0.5, 0.75, 1],
        z: [0, 0.25, 0.5, 0.75, 1],
        type: 'scatter', //graftype
        mode: 'markers+text',
        name: 'PPI',
        marker: { color: 'blue', size: 12 }
    }];
const layout = {
    x: { title: 'AVG Time' },
    y: { title: 'Collectables' },
    z: { title: 'Step Ratio' }
};
//Plotly.newPlot( TESTER, centroids, layout)
//# sourceMappingURL=K_means_centroids.js.map