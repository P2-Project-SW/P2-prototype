import { getActiveMap, getTileSize, maps } from "../2D Array/2dArray.js";
export { keyPosition };
function keyPosition(map, y, x) {
    //remove div
    /*if(x > 0 && y > 0) {
        const currentDiv = document.getElementById("key");
        currentDiv!.remove();
    }*/
    //create new div
    const div = document.createElement("div");
    div.classList.add("key");
    div.id = ("keyId");
    const mapContainer = document.getElementById("map"); //gets map from id
    //console.log("container:", container);
    if (mapContainer === null)
        return;
    div.innerHTML = ""; //make div empthy
    let validY = [];
    let validX = [];
    const mapHeight = map.grid.length;
    const mapWidth = map.grid[0].length;
    //only odd coordinates are used as actual maze cells
    for (let y = 1; y < mapHeight - 1; y += 2) {
        validY.push(y);
    }
    for (let x = 1; x < mapWidth - 1; x += 2) {
        validX.push(x);
    }
    //find random position in map array
    let indexSy = Math.floor((Math.random() * validY.length));
    let indexSx = Math.floor((Math.random() * validX.length));
    let sy = validY[indexSy];
    let sx = validX[indexSx];
    y = sy;
    x = sx;
    const mapStyleGap = 2; //gap between cells
    const mapStylePadding = 10; //edge around the map
    const TILE_SIZE = getTileSize(map);
    //ad div style in HTML
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    div.style.backgroundColor = "d4b500";
    div.style.borderRadius = "3px";
    div.style.position = "absolute";
    //add the div to the mapContainer
    mapContainer.appendChild(div);
}
window.keyPosition = keyPosition;
//# sourceMappingURL=KeyGeneration.js.map