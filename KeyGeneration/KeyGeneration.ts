import { getTileSize, maps } from "../2D Array/2dArray.js";
export { keyPosition }

const WALL = 0;

function keyPosition(map: (typeof maps) [keyof typeof maps]) {
    //remove existing key
    const currentDiv = document.getElementById("svgContainer");
    if (currentDiv) currentDiv!.remove();

    //create new div
    const div = document.createElement("div");
    div.classList.add("svgKey");
    div.id = ("svgContainer");

    const mapContainer = document.getElementById("map"); //gets map from id
    if(mapContainer === null) return;

    const mapHeight : number = map.grid.length;
    const mapWidth : number = map.grid[0]!.length;

    const validPositions: { y : number, x : number}[] = [];

    for (let y = 1; y < mapHeight - 1; y++) {
        for (let x = 1; x < mapWidth - 1; x++) {
            if(map.grid[y]![x] !== WALL) {
                validPositions.push({ y : y, x : x });
            }
        }
    }

    const pick = validPositions[Math.floor(Math.random() * validPositions.length)]!;

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
}

//in case we need to call it in another function
(window as any).keyPosition = keyPosition;
