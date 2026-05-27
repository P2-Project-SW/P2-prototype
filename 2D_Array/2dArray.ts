import { recursiveBacktracker } from "../MapGen/RecursiveBacktracking/RecursiveBacktracking.js";
//import { keyPosition } from "../KeyGeneration/KeyGeneration.js";
export { getTileSize, getActiveMap, generateDynamicMap };
import { movePlayerPosition, resetPlayerDiv as resetPlayerPosition } from "../PlayerMovement/PlayerView.js";
import { resetPlayerState, setMinMaxForMap, startPlayerTimer} from "../PlayerState/PlayerState.js";

 

export const STARTPOSITION = { y: 1, x: 0 }
export const TILE = { WALL: 0, PATH: 1, START: 2, END: 3, KEY: 4 }
// Map sizes, key spawn ranges and key amount

let currentActiveMap: any = null;

function getActiveMap () {
    return currentActiveMap
}

function generateDynamicMap (size: number, range: number, keys: number) {
    currentActiveMap = {
        size: size,
        range: range,
        keys: keys,
        maxTime: size === 15 ? 120 :
         size === 25 ? 180 :
         size === 35 ? 240 :
         size === 51 ? 300 : 120,
        active: true,
        activeKey: null,
        hasSpawnedKey: false,
        grid: recursiveBacktracker(size)
    };

    renderMap(currentActiveMap)
}
/*
const maps = {
    small:  { grid: recursiveBacktracker(15), active: false, range: 8, keys: 2},
    medium: { grid: recursiveBacktracker(25), active: false, range: 10, keys: 3},
    large:  { grid: recursiveBacktracker(35), active: false, range: 12, keys: 3},
    xl:     { grid: recursiveBacktracker(51), active: false, range: 14, keys: 4}  //no initial 10x10 map?
};


type MapName = keyof typeof maps;
*
console.log("Gitignore test");

// Test if gitignore worked
//Bounds validation from maps
function isInBounds(map : (typeof maps)[keyof typeof maps], row : number, col : number) : boolean {
    const rows = map.grid.length;
    const cols = map.grid[0]!.length;

    return row >= 0 && row < rows && col >= 0 && col < cols; 
}
*/

//Change tile sizes based on map size
function getTileSize(map : any) {
    const cols = map.grid[0]!.length;

    if (cols <= 15) return 40;   // small map → big tiles
    if (cols <= 25) return 30;   // medium map → medium tiles
    if (cols <= 35) return 22;   // large map → smaller tiles
    return 14;                   // XL map → compact tiles
}

/*
// Function that picks a map and sets it to "active"
function pickMap(name: MapName) {

    console.log(typeof maps);
    for (const key of Object.keys(maps) as MapName[]) {
        maps[key].active = false;
    }

    maps[name].active = true;
    renderActiveMap();
}
/*
// Function find the active map and return it
function getActiveMap() : (typeof maps)[keyof typeof maps] | null {
    for (const key of Object.keys(maps) as MapName[]) {
        if (maps[key].active) return maps[key];
    }
    return null;
}

//Function to render the chosen map
function renderActiveMap() {
    const active = getActiveMap();
    if (active) renderMap(active);
}
*/

//Function to render the map grid in the HTML file
function renderMap(map: any) {
    const container = document.getElementById("map");
    if (container === null) return;
        
    container.innerHTML = "";

    const rows = map.grid.length;
    const cols = map.grid[0]!.length;
    const TILE_SIZE = getTileSize(map);

    container.style.gridTemplateColumns = `repeat(${cols}, ${TILE_SIZE}px)`;
    container.style.gridAutoRows = `${TILE_SIZE}px`;

    map.grid.forEach((row: any, y: any) => {
        row.forEach((cell: any, x: any) => {
            const div = document.createElement("div");
            div.classList.add("cell");

            //generates keys
            div.setAttribute("key-x", x.toString());
            div.setAttribute("key-y", y.toString());

            if (cell === TILE.WALL) div.classList.add("wall");
            if (cell === TILE.PATH) div.classList.add("path");
            if (cell === TILE.START) div.classList.add("start");
            if (cell === TILE.END) div.classList.add("end");

            container.appendChild(div);
        });
    });
    //keyPosition(map, STARTPOSITION.y, STARTPOSITION.x);
    resetPlayerPosition();
    movePlayerPosition(map, 1, 0);
    resetPlayerState();

    //const size = map.grid.length;
    setMinMaxForMap(map);
    startPlayerTimer(map.maxTime);
}


