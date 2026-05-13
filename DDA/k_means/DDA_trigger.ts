import { DDA_updater } from './k_means_optimized.js';


DDA_updater.subscribe(cluster => {
    if (cluster) {
        console.log("subscriber har modtaget cluster data", cluster);
    }
}
)