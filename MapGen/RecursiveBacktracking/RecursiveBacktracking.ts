import {maps, create2D} from "../../2dArray.js"     //import the mapsize from the js file, MapGen
export {recursiveBacktracker}

let size_of_mapA: number = 10;
let directions: number[] = [];
const mapHeight : number = map.length;
const mapWidth : number = map[0]!.length;

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
    return map;
}

function generate(map: number[][], x: number, y: number) {
    map[y]![x] = 0.5;

    const right = map[y]![x+2];
    const up = map[y-2]![x];
    const left = map[y]![x-2];
    const down = map[y+2]![x];

    if(right === 0.5 && up === 0.5 && left === 0.5 && down === 0.5) {
        //pass
    } else {
        let li: number[] = [1, 2, 3, 4];

        while (li.length > 0) {
            const dir: number = Math.floor(Math.random() * li.length);
            let nx: number;
            let mx: number;
            let ny: number;
            let my: number;

            if (li.length === 0) {
                console.log(undefined);
            } else {
                const result: number = li[dir]!;
                li.splice(result, 1); //removes the element from the array
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

            if(nx >= 0 && ny <= map[0]!.length && ny >= 0 && ny <= map.length && map[ny]![nx] !== 0.5) {
                map[my]![mx] = 0.5;
                generate(map, nx, ny);
            }
        }
    }
}

//Choose a random adjacent cell. Only create a passage if that cell has not been visited yet.

//Repeat the process until there are no more adjacent cells to choose from.

//Start backtracking until you can choose a cell again.

//The algorithm is done when you return to the starting cell.