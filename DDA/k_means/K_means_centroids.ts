declare var Plotly: any;


window.onload = () => {

    //plotly div
    const TESTER = document.getElementById('tester');

    //3 manual centroids
    const centroids = {
        EASY: [0.75, 1, 0.75],
        FLOW:  [0.5, 0.5, 0.35],
        HARD: [0.25, 0.25, 0.15]
    }

//Data generation L:16-51
    const centroids_array: number[][] = [
        //[normal time, normal keys, normal step ratio]
        [0.75, 1, 0.75], // EASY (Index 0)
        [0.5, 0.5, 0.35], // FLOW (Index 1)
        [0.25, 0.25, 0.15] // HARD (Index 2)
    ]

    function makeData(samples: number, centroid: any[], stdDev = 0.05) {
        let dataPoints: number[][] = [];

        if (!centroid) return dataPoints;

        for (let i = 0; i < samples; i++) {  

            // Box-Muller for 3D (x, y, z)
            let u1 = Math.random(), u2 = Math.random();
            let u3 = Math.random(), u4 = Math.random();

            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
            let z2 = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);

            dataPoints.push([
                centroid[0] + z0 * stdDev,
                centroid[1] + z1 * stdDev,
                centroid[2] + z2 * stdDev
            ]);
        }
        return dataPoints; 
    }

    //! = not empty
    const easyCentroid = makeData(3, centroids_array[0]!); //returns above 1
    const flowCentroid = makeData(3, centroids_array[1]!);
    const HardCentroid = makeData(3, centroids_array[2]!);


// TRACES
    function createTrace (data: number[][], name: string, color: string){
        return {
            x: data.map(p => p[0]),
            y: data.map(p => p[1]),
            z: data.map(p=>p[2]),
            mode: 'markers',
            type: 'scatter3d',
            name: name,
            marker: {size: 6, color: color, opacity: 0.5}
        }
        
    }
    
   
    const easyTrace = createTrace(easyCentroid, 'Easy', 'red');  
    const flowTrace = createTrace(flowCentroid, 'Flow', 'blue');   
    const hardTrace =  createTrace(HardCentroid, 'Hard', 'green'); 
    

    var centroid1 = {
        x: [centroids.EASY[0]],
        y: [centroids.EASY[1]],
        z: [centroids.EASY[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 1',
        text: ['C1'],
        marker: {color: 'red' ,size: 12}
    }

    var centroid2 = {
        x: [centroids.FLOW[0]],
        y: [centroids.FLOW[1]],
        z: [centroids.FLOW[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 2',
        text: ['C2'],
        marker: {color: 'blue', size: 12}
    }

    var centroid3 = {
        x: [centroids.HARD[0]],
        y: [centroids.HARD[1]],
        z: [centroids.HARD[2]],
        type: 'scatter3d',
        mode: 'markers+text',
        name: 'Centroid 3',
        text: ['C3'],
        marker: {color: 'green', size: 12}
    }


//DATA OF PLOTLY
    var data = [centroid1, centroid2, centroid3, easyTrace, flowTrace, hardTrace];

    //layout of plot
   const layout = {
    title: 'k-means centroids',
    scene: {
        xaxis: {
            text: 'AVG time',
            range: [0, 1],
            autorange: false // no zoom
        },
        yaxis: {
            text: 'Keys',
            range: [0, 1],
            autorange: false
        },
        zaxis: {
            text: 'Step ratio',
            range: [0, 1],
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
            }, 100)
        }

    } else {
        console.error("Kunne ikke finde 'tester' elementet");
    }
};



