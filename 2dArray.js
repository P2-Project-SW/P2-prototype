// 2D Array Creator
function create2D(rows, cols, value = 0) {
    const arr = [];
    for (let r = 0; r < rows; r++) {
        arr[r] = [];
        for (let c = 0; c < cols; c++) {
            arr[r][c] = value;
        }
    }
    return arr;
}


// Map sizes
const maps = {
    small:  { grid: create2D(15, 15), active: false },
    medium: { grid: create2D(25, 25), active: false },
    large:  { grid: create2D(35, 35), active: false },
    xl:     { grid: create2D(51, 51), active: false }
};


//Change tile sizes based on map size
function getTileSize(map) {
    const cols = map.grid[0].length;

    if (cols <= 15) return 40;   // small map → big tiles
    if (cols <= 25) return 30;   // medium map → medium tiles
    if (cols <= 35) return 22;   // large map → smaller tiles
    return 14;                   // XL map → compact tiles
}


// Function that picks a map and sets it to "active"
function pickMap(name) {
    for (const key in maps) {
        maps[key].active = false;
    }
    maps[name].active = true;
}


// Function find the active map and return it
function getActiveMap() {
    for (const key in maps) {
        if (maps[key].active) return maps[key];
    }
    return null;
}


//Function to render the chosen map
function renderActiveMap() {
    const active = getActiveMap();
    if (active) renderMap(active);
}


//Function to render the map grid in the HTML file
function renderMap(map) {
    const container = document.getElementById("map");
    container.innerHTML = "";

    const rows = map.grid.length;
    const cols = map.grid[0].length;

    const TILE_SIZE = getTileSize(map);

    container.style.gridTemplateColumns = `repeat(${cols}, ${TILE_SIZE}px)`;
    container.style.gridAutoRows = `${TILE_SIZE}px`;

    map.grid.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement("div");
            div.classList.add("cell");

            if (cell === 0) div.classList.add("wall");
            if (cell === 1) div.classList.add("path");
            if (cell === 2) div.classList.add("start");
            if (cell === 3) div.classList.add("end");

            container.appendChild(div);
        });
    });
}


// DDA logic?? Not done
function ChooseMapByADD() {
    
    return "large";
}


// Example
const chosen = ChooseMapByADD();
pickMap(chosen);
renderActiveMap();
