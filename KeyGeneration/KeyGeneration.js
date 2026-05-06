import { getActiveMap, getTileSize, maps } from "../2D Array/2dArray.js";
export { keyPosition };
//move this to another file
//import { keyPosition } from "../KeyGeneration/KeyGeneration.js"
const WALL = 2;
function keyPosition(map, y, x) {
    //remove existing key
    const currentDiv = document.getElementById("svgContainer");
    if (currentDiv)
        currentDiv.remove();
    //create new div
    const div = document.createElement("div");
    div.classList.add("svgKey");
    div.id = ("svgContainer");
    //assign svgData to variable
    //const svgCode = `<svg width="10" height="10" id="keyCircle"><circle cx="5" cy="5" r="4" fill="yellow" />
    //</svg>`
    //add svgData to the created div
    //const svgContainer = document.getElementById('svgContainer');
    //if(svgContainer === null) return;
    //svgContainer.innerHTML = svgCode;
    const mapContainer = document.getElementById("map"); //gets map from id
    if (mapContainer === null)
        return;
    const mapHeight = map.grid.length;
    const mapWidth = map.grid[0].length;
    let validPositions = [];
    //only odd coordinates are used as actual maze cells
    for (let y = 1; y < mapHeight - 1; y++) {
        for (let x = 1; x < mapWidth - 1; x++) {
            if (map.grid[y][x] !== WALL) {
                validPositions.push({ y: y, x: x });
            }
        }
    }
    const pick = validPositions[Math.floor(Math.random() * validPositions.length)];
    y = pick.y;
    x = pick.x;
    const mapStyleGap = 2; //gap between cells
    const mapStylePadding = 10; //edge around the map
    const TILE_SIZE = getTileSize(map);
    //ad svg style in HTML
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    div.style.backgroundColor = "yellow";
    div.style.borderRadius = "20px";
    div.style.position = "absolute";
    //add the svg to the mapContainer
    mapContainer.appendChild(div);
}
//in case we need to call it in another function
window.keyPosition = keyPosition;
//# sourceMappingURL=KeyGeneration.js.map