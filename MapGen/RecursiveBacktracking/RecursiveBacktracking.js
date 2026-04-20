import { create2D } from "../../create2D.js"; //creates a 2D-array
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
    let map = create2D(sizeOfMap, sizeOfMap); //the final maze
    let visited = create2D(sizeOfMap, sizeOfMap); //tracks visited cells
    //let map: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {
            /*if(i % 2 === 1 || j % 2 === 1) {
                map[i]![j] = 1; // free tile
            }*/
            //mark borders as visited - so the algorithm does not go outside the maze
            if (i === 0 || j === 0 || i === mapHeight - 1 || j === mapWidth - 1) {
                visited[i][j] = 0.5; // visited
            }
        }
    }
    chooseStartCell(visited); //choose a random start cell and generate the map
    convertVisitedToMap(visited, map); //copy visited path cells into the final map
    //create entrance on the left side
    map[1][0] = 1;
    map[1][1] = 1; //connects the entrance to the maze
    //create exit on the right side
    map[mapHeight - 2][mapWidth - 1] = 1;
    map[mapHeight - 2][mapWidth - 2] = 1; //connects the exit to the maze
    return map;
}
function chooseStartCell(visited) {
    let validY = [];
    let validX = [];
    //only odd coordinates are used as actual maze cells
    for (let y = 1; y < visited.length - 1; y += 2) {
        validY.push(y);
    }
    for (let x = 1; x < visited[0].length - 1; x += 2) {
        validX.push(x);
    }
    //choose a random start cell
    let indexSy = Math.floor((Math.random() * validY.length));
    let indexSx = Math.floor((Math.random() * validX.length));
    let sy = validY[indexSy];
    let sx = validX[indexSx];
    generateMazeFromCell(visited, sy, sx);
}
function generateMazeFromCell(visited, y, x) {
    //mark the current cell as visited
    visited[y][x] = 0.5;
    //list of possible directions
    let li = [0, 1, 2, 3];
    while (li.length > 0) {
        const visitedHeight = visited.length;
        const visitedWidth = visited[0].length;
        //pick a random direction from the list
        const indexDir = Math.floor(Math.random() * li.length);
        const dir = li[indexDir];
        let nx, ny; //neighbor cell
        let mx, my; //wall cell between current cell and neighbor
        //remove the chosen direction so it is not used again
        li.splice(indexDir, 1);
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
        else if (dir === direction.RIGHT) {
            nx = x + 2;
            mx = x + 1;
            ny = y;
            my = y;
        }
        else if (dir === direction.LEFT) {
            nx = x - 2;
            mx = x - 1;
            ny = y;
            my = y;
        }
        else {
            nx = x;
            mx = x;
            ny = y;
            my = y;
        }
        //only continue if the neighbor is inside the maze and has not yet been visited
        if (nx > 0 && nx < visitedWidth - 1 && ny > 0 && ny < visitedHeight - 1 && visited[ny][nx] !== 0.5) {
            visited[my][mx] = 0.5; //marks wall between current cell and neighbor cell as visited
            //continue recursively from the neighbor cell
            generateMazeFromCell(visited, ny, nx);
        }
    }
}
function convertVisitedToMap(visited, map) {
    //convert visited cells into path cells in the final map 
    for (let i = 1; i < visited.length - 1; i++) {
        for (let j = 1; j < visited[0].length - 1; j++) {
            if (visited[i][j] === 0.5) {
                map[i][j] = 1;
            }
        }
    }
}
//# sourceMappingURL=RecursiveBacktracking.js.map