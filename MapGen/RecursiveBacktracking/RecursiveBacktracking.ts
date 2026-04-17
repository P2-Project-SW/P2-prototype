import {maps, create2D} from "../../2dArray.js"     //import the mapsize from the js file, MapGen
export {recursiveBacktracker}

enum direction {
    UP,
    DOWN,
    RIGHT,
    LEFT
};

function recursiveBacktracker(sizeOfMap: number, /*directions: number[]*/) : number[][] {
    let map: number[][] = create2D(sizeOfMap, sizeOfMap);
    let visited : number[][] = create2D(sizeOfMap, sizeOfMap);
    //let map: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    
    const mapHeight : number = map.length;
    const mapWidth : number = map[0]!.length;

    for(let i = 0; i < mapHeight ; i++){
        for(let j = 0; j < mapWidth ; j++){
            if(i % 2 === 1 || j % 2 === 1) {
                map[i]![j] = 1; // free tile
            }

            if(i === 0 || j === 0 || i === mapHeight - 1 || j === mapWidth - 1){
                visited[i]![j] = 0.5; // visited
            }
        }
    }

    let validX: number[] = [];

    for (let x = 2; x < map.length; x += 2) {
        validX.push(x);
    }

    //choose random cell
    let indexSy: number = Math.floor((Math.random() * validX.length));
    let indexSx: number = Math.floor((Math.random() * validX.length));
    let sy: number = validX[indexSy]!;
    let sx: number = validX[indexSx]!;

    generate(visited, sy, sx);
    return map;
}

function generate(map: number[][], y: number, x: number) {
    map[y]![x] = 0.5;

    const right = map[y]![x+2];
    const up = map[y-2]![x];
    const left = map[y]![x-2];
    const down = map[y+2]![x];

    if(right === 0.5 && up === 0.5 && left === 0.5 && down === 0.5) {
        //pass
    } else {
        let li: number[] = [0, 1, 2, 3];

        while (li.length > 0) {
            const mapHeight : number = map.length;
            const mapWidth : number = map[0]!.length;
            const indexDir: number = Math.floor(Math.random() * li.length);
            const dir: number = li[indexDir]!;
            let nx: number;
            let mx: number;
            let ny: number;
            let my: number;
            
            if (li.length === 0) {
                console.log(undefined);
            } else {
                li.splice(indexDir, 1); //removes the element from the array
            }

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
            } else if (dir === direction.LEFT) {
                nx = x - 2;
                mx = x - 1;
                ny = y;
                my = y;
            } else if (dir === direction.RIGHT) {
                nx = x + 2;
                mx = x + 1;
                ny = y;
                my = y;
            } else {
                nx = x;
                mx = x;
                ny = y;
                my = y;
            }

            if(nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight && map[ny]![nx] !== 0.5) {
                map[my]![mx] = 0.5;
                generate(map, ny, nx);
            }
        }
    }
}

//Choose a random adjacent cell. Only create a passage if that cell has not been visited yet.

//Repeat the process until there are no more adjacent cells to choose from.

//Start backtracking until you can choose a cell again.

//The algorithm is done when you return to the starting cell.