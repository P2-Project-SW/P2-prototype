//Array creator 

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


// Maps with different sizes

const maps = {
    small:  { grid: create2D(7, 7),  active: false },
    medium: { grid: create2D(10, 10), active: false },
    large:  { grid: create2D(20, 20), active: false }
};


//Map selector function

function pickMap(name) {
    // turn all maps off
    for (const key in maps) {
        maps[key].active = false;
    }

    // turn ONE map on
    if (maps[name]) {
        maps[name].active = true;
    }
}


// Map printer function

function printMap() {
    for (const key in maps) {
        if (maps[key].active) {
            maps[key].grid.forEach(row => console.log(row.join(" ")));
        }
    }
}

// Example 

pickMap("medium");
printMap();







