import { maps, create2D } from "../../2dArray.js"; //import the mapsize from the js file, MapGen
export { recursiveBacktracker };
var direction;
(function (direction) {
    direction[direction["UP"] = 0] = "UP";
    direction[direction["DOWN"] = 1] = "DOWN";
    direction[direction["RIGHT"] = 2] = "RIGHT";
    direction[direction["LEFT"] = 3] = "LEFT";
})(direction || (direction = {}));
;
function recursiveBacktracker(sizeOfMap) {
    let map = create2D(sizeOfMap, sizeOfMap);
    let visited = create2D(sizeOfMap, sizeOfMap);
    //let map: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {
            if (i % 2 === 1 || j % 2 === 1) {
                map[i][j] = 1; // free tile
            }
            //mark borders as visited
            if (i === 0 || j === 0 || i === mapHeight - 1 || j === mapWidth - 1) {
                visited[i][j] = 0.5; // visited
            }
        }
    }
    chooseStartCell(visited);
    convertVisitedToMap(visited, map);
    return map;
}
function chooseStartCell(visited) {
    let validNumbers = [];
    for (let x = 2; x < visited.length; x += 2) {
        validNumbers.push(x);
    }
    //choose random cell
    let indexSy = Math.floor((Math.random() * validNumbers.length));
    let indexSx = Math.floor((Math.random() * validNumbers.length));
    let sy = validNumbers[indexSy];
    let sx = validNumbers[indexSx];
    generateMazeFromCell(visited, sy, sx);
}
function generateMazeFromCell(visited, y, x) {
    visited[y][x] = 0.5;
    let up, down, left, right;
    if (y >= 2) {
        up = visited[y - 2][x];
    }
    if (y < visited.length - 3) {
        down = visited[y + 2][x];
    }
    if (x >= 2) {
        left = visited[y][x - 2];
    }
    if (x < visited[0].length - 3) {
        right = visited[y][x + 2];
    }
    if (right === 0.5 && up === 0.5 && left === 0.5 && down === 0.5) {
        //pass
    }
    else {
        let li = [0, 1, 2, 3];
        while (li.length > 0) {
            const visitedHeight = visited.length;
            const visitedWidth = visited[0].length;
            const indexDir = Math.floor(Math.random() * li.length);
            const dir = li[indexDir];
            let nx, ny, mx, my;
            if (li.length === 0) {
                console.log(undefined);
            }
            else {
                li.splice(indexDir, 1); //removes the element from the array
            }
            if (dir === direction.UP) {
                nx = x;
                mx = x;
                ny = y - 2;
                my = y - 1;
            }
            else if (dir === direction.DOWN) {
                nx = x;
                mx = x;
                ny = y + 2;
                my = y + 1;
            }
            else if (dir === direction.LEFT) {
                nx = x - 2;
                mx = x - 1;
                ny = y;
                my = y;
            }
            else if (dir === direction.RIGHT) {
                nx = x + 2;
                mx = x + 1;
                ny = y;
                my = y;
            }
            else {
                nx = x;
                mx = x;
                ny = y;
                my = y;
            }
            if (nx >= 0 && nx < visitedWidth && ny >= 0 && ny < visitedHeight && visited[ny][nx] !== 0.5) {
                visited[my][mx] = 0.5;
                generateMazeFromCell(visited, ny, nx);
            }
        }
    }
}
function convertVisitedToMap(visited, map) {
    //0.5 cells from visited array is made into 1 cells in map array 
    for (let i = 1; i < visited.length - 1; i++) {
        for (let j = 1; j < visited[0].length - 1; j++) {
            if (visited[i][j] === 0.5) {
                map[i][j] = 1;
            }
        }
    }
}
//Choose a random adjacent cell. Only create a passage if that cell has not been visited yet.
//Repeat the process until there are no more adjacent cells to choose from.
//Start backtracking until you can choose a cell again.
//The algorithm is done when you return to the starting cell.
//# sourceMappingURL=RecursiveBacktracking.js.map