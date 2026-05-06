import { getActiveMap, getTileSize, maps } from "../2D Array/2dArray.js";
export { keyPosition };
//move this to another file
//import { keyPosition } from "../KeyGeneration/KeyGeneration.js"
function keyPosition() {
    //create new div
    const svg = document.createElement("svg");
    svg.classList.add("key");
    svg.id = ("keyId");
    const svgCode = `<svg width="10" height="10" id="keyCircle"><circle cx="5" cy="5" r="4" fill="yellow" />
    </svg>`;
    const svgContainer = document.getElementById('svgContainer');
    if (svgContainer === null)
        return;
    svgContainer.innerHTML = svgCode;
    //remove div
    /*if(x > 0 && y > 0) {
        const currentDiv = document.getElementById("key");
        currentDiv!.remove();
    }*/
    /*
    //create new div
    const svg = document.createElement("svg");
    svg.classList.add("key");
    svg.id = ("keyId");
    */
    const mapContainer = document.getElementById("map"); //gets map from id
    if (mapContainer === null)
        return;
    /*
    svg.innerHTML = ""; //make div empthy

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

    //ad svg style in HTML
    svg.style.width = `${TILE_SIZE}px`;
    svg.style.height = `${TILE_SIZE}px`;
    svg.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    svg.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    svg.style.backgroundColor = "d4b500";
    svg.style.borderRadius = "3px";
    svg.style.position = "absolute";

    //add the svg to the mapContainer
    mapContainer.appendChild(svg);
    */
}
keyPosition();
/*
map: (typeof maps) [keyof typeof maps], y : number, x : number
    <svg width="10" height="10" id="keyCircle">
        <circle cx="5" cy="5" r="4" fill="yellow" />
    </svg>
*/
window.keyPosition = keyPosition;
//# sourceMappingURL=KeyGeneration.js.map