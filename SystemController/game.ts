import { pickMap, getActiveMap } from "../2D Array/2dArray.js";
import type { MapName } from "../2D Array/2dArray.js";
import { movePlayerPosition, resetPlayerState } from "../PlayerMovement/PlayerMovement.js";
import { STARTPOSITION } from "../Constants/constants.js";

function startMap(name : MapName) {
    pickMap(name);

    const map = getActiveMap();
    if(map === null) return;

    resetPlayerState();
    movePlayerPosition(map, STARTPOSITION.y, STARTPOSITION.x);
}

startMap('large');

(window as any).startMap = startMap;