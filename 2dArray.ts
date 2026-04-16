// 2D Array Creator
function create2D(rows : number, cols : number, value : number = 0) : number[][] {
    const arr : number[][] = [];
    for (let r = 0; r < rows; r++) {
        const row : number[] = []
        for (let c = 0; c < cols; c++) {
            row[c] = value;
        }
        arr[r] = row;
    }
    return arr;
}


// Map sizes
const maps = {
    small:  { grid: create2D(15, 15), active: false },
    medium: { grid: create2D(25, 25), active: false },
    large:  { grid: create2D(35, 35), active: false },
    xl:     { grid: create2D(51, 51), active: false }  //no initial 10x10 map?
};

type MapName = keyof typeof maps;


//Bounds validation from maps
function isInBounds(map : (typeof maps)[keyof typeof maps], row : number, col : number) : boolean {
    const rows = map.grid.length;
    const cols = map.grid[0]!.length;

    return row >= 0 && row < rows && col >= 0 && col < cols; 
}


//Change tile sizes based on map size
function getTileSize(map : (typeof maps)[keyof typeof maps]) {
    const cols = map.grid[0]!.length;

    if (cols <= 15) return 40;   // small map → big tiles
    if (cols <= 25) return 30;   // medium map → medium tiles
    if (cols <= 35) return 22;   // large map → smaller tiles
    return 14;                   // XL map → compact tiles
}



// Function that picks a map and sets it to "active"
function pickMap(name: MapName) {

    console.log(typeof maps);
    for (const key of Object.keys(maps) as MapName[]) {
        maps[key].active = false;
    }

    maps[name].active = true;
    renderActiveMap();
}

// Function find the active map and return it
function getActiveMap() {
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


//Function to render the map grid in the HTML file
function renderMap(map : (typeof maps)[keyof typeof maps]) {
    const container = document.getElementById("map");
    if (container === null) return;
        
    container.innerHTML = "";

    const rows = map.grid.length;
    const cols = map.grid[0]!.length;

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
function ChooseMapByADD() : MapName {

    return 'large';
}


// Example
const chosen = ChooseMapByADD();
pickMap(chosen);
renderActiveMap();
