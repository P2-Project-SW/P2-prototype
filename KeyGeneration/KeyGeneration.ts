import { getActiveMap, getTileSize, maps } from "../2D Array/2dArray.js";
export { keyPosition }

//move this to another file
//import { keyPosition } from "../KeyGeneration/KeyGeneration.js"

function keyPosition(map: (typeof maps) [keyof typeof maps], y : number, x : number) {
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
    if(mapContainer === null) return;

    div.innerHTML = ""; //make div empthy

    let validY : number[] = [];
    let validX : number[] = [];
    
    const mapHeight : number = map.grid.length;
    const mapWidth : number = map.grid[0]!.length;

    //only odd coordinates are used as actual maze cells
    for (let y = 1; y < mapHeight - 1; y += 2) {
        validY.push(y);
    }
    for (let x = 1; x < mapWidth - 1; x += 2) {
        validX.push(x);
    }
    //find random position in map array
    let indexSy : number = Math.floor((Math.random() * validY.length));
    let indexSx : number = Math.floor((Math.random() * validX.length));
    let sy : number = validY[indexSy]!;
    let sx : number = validX[indexSx]!;

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

(window as any).keyPosition = keyPosition;
