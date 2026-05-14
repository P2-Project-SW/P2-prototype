// DDATick.ts
import { playerState, minMax } from "../../../PlayerState/PlayerState.js";
import { weights, sampleAndStore } from "./DDA.js";

let ddaInterval: number | null = null;

export function startDDATick(intervalMs = 30000) {
    if (ddaInterval !== null) clearInterval(ddaInterval);

    ddaInterval = setInterval(() => {
        const vector = sampleAndStore(playerState, minMax, weights);
        console.log("DDA sample:", vector);
    }, intervalMs);
}

export function stopDDATick() {
    if (ddaInterval !== null) clearInterval(ddaInterval);
    ddaInterval = null;
}
