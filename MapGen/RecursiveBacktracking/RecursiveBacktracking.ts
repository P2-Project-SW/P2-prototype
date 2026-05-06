import {create2D} from "../../2D Array/create2D.js"     //creates a 2D-array
export {recursiveBacktracker}

enum direction {
    UP,
    DOWN,
    RIGHT,
    LEFT
};

function recursiveBacktracker(sizeOfMap : number) : number[][] {
    let map: number[][] = create2D(sizeOfMap, sizeOfMap); //the maze map
    
    const mapHeight : number = map.length;
    const mapWidth : number = map[0]!.length;

    chooseStartCell(map); //choose a random start cell and generate the map

    //create entrance on the left side
    map[1]![0] = 2;
    map[1]![1] = 1; //connects the entrance to the maze

    //create exit on the right side
    map[mapHeight-2]![mapWidth-1] = 3;
    map[mapHeight-2]![mapWidth-2] = 1; //connects the exit to the maze

    return map;
}

function chooseStartCell(map: number[][]){
    let validY : number[] = [];
    let validX : number[] = [];
    
    const mapHeight : number = map.length;
    const mapWidth : number = map[0]!.length;

    //only odd coordinates are used as actual maze cells
    for (let y = 1; y < mapHeight - 1; y += 2) {
        validY.push(y);
    }
    for (let x = 1; x < mapWidth - 1; x += 2) {
        validX.push(x);
    }

    //choose a random start cell
    let indexSy : number = Math.floor((Math.random() * validY.length));
    let indexSx : number = Math.floor((Math.random() * validX.length));
    let sy : number = validY[indexSy]!;
    let sx : number = validX[indexSx]!;

    generateMazeFromCell(map, sy, sx);
}

function generateMazeFromCell(map : number[][], y : number, x : number) {
    //mark the current cell as map
    map[y]![x] = 1;

    //list of possible directions
    let li : number[] = [0, 1, 2, 3];

    while (li.length > 0) {
        const mapHeight : number = map.length;
        const mapWidth : number = map[0]!.length;

        //pick a random direction from the list
        const indexDir : number = Math.floor(Math.random() * li.length);
        const dir : number = li[indexDir]!;

        let nx : number, ny : number; //neighbor cell
        let mx : number, my : number; //wall cell between current cell and neighbor
        
        //remove the chosen direction so it is not used again
        li.splice(indexDir, 1); 

        if (dir === direction.UP) {
            nx = x;
            mx = x;
            ny = y - 2;
            my = y - 1;
        } else if (dir === direction.DOWN) {
            nx = x;
            mx = x;
            ny = y + 2;
            my = y + 1;
        } else if (dir === direction.RIGHT) {
            nx = x + 2;
            mx = x + 1;
            ny = y;
            my = y;
        } else if (dir === direction.LEFT) {
            nx = x - 2;
            mx = x - 1;
            ny = y;
            my = y;
        } else {
            nx = x;
            mx = x;
            ny = y;
            my = y;
        }

        //continue if the neighbor is inside the maze and has not yet been visited
        if(nx > 0 && nx < mapWidth - 1 && ny > 0 && ny < mapHeight - 1 && map[ny]![nx] !== 1) {
            map[my]![mx] = 1; //marks wall between current cell and neighbor cell as map
            
            //continue recursively from the neighbor cell
            generateMazeFromCell(map, ny, nx);
        }
    }
}