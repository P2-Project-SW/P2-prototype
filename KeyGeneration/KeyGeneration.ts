import { getActiveMap, getTileSize, maps } from "../2D Array/2dArray.js";
import { TILE } from "../Constants/constants.js";
export { keyPosition, clearKeyPosition }
export let currentKeyPosition = { y : 0, x : 0}

function keyPosition(map: (typeof maps) [keyof typeof maps], playerY : number, playerX : number) {
    //remove existing key
    const currentDiv = document.getElementById("svgContainer");
    if (currentDiv) currentDiv.remove();

    //create new div
    const div = document.createElement("div");
    div.classList.add("svgKey");
    div.id = ("svgContainer");

    const mapContainer = document.getElementById("map"); //gets map from id
    if(mapContainer === null) return;

    const mapHeight : number = map.grid.length;
    const mapWidth : number = map.grid[0]!.length;

    const validPositions: { y : number, x : number}[] = [];

    let RangeStartY = playerY - map.range;
    let RangeEndY = playerY + map.range;
    let RangeStartX = playerX - map.range;
    let RangeEndX = playerX + map.range;

    for (let y = RangeStartY; y < RangeEndY; y++) { //start from - range from the player up to + range from the player (on y axis)
        for (let x = RangeStartX; x < RangeEndX; x++) { //start from - range from the player up to + range from the player (on x axis)
            if(y > 0 && y < mapHeight - 1 && x > 0 && x < mapWidth - 1 && map.grid[y]![x] !== TILE.WALL) { //if y and x is inside map and the cell is not a wall
                validPositions.push({ y : y, x : x }); //push cell position into array
            }
        }
    }

    if(validPositions.length === 0) return;
    const pick = validPositions[Math.floor(Math.random() * validPositions.length)]!; //choose random position in array

    const mapStyleGap = 2; //gap between cells
    const mapStylePadding = 10; //edge around the map
    const TILE_SIZE = getTileSize(map);

    //ad svg style in HTML
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * pick.y + pick.y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    div.style.left = `${TILE_SIZE * pick.x + pick.x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    div.style.position = "absolute";
    div.style.fontSize = `${TILE_SIZE * 0.8}px`;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = `🗝️`;

    //add the svg to the mapContainer
    mapContainer.appendChild(div);

    currentKeyPosition = pick;
}

function clearKeyPosition() {
    currentKeyPosition = { y: -1, x: -1};
}

//in case we need to call it in another function
(window as any).keyPosition = keyPosition;
