import {map, create2D} from "../../2dArray.js"     //import the mapsize from the js file, MapGen
let size_of_mapA: number = 10;
let directions: number[] = [];



function recursiveBacktracker(sizeofmap: number, directions: number[]): void {
    // let map: number[][] = create2D(sizeofmap, sizeofmap);
    let map: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    
    const mapHeight = map.length;
    const mapWidth = map[0]!.length;

    for(let i = 0; i < map.length ; i++){
        for(let j = 0; j < map.length ; j++){
            if(i % 2 === 1 || j % 2 === 1) {
                map[i]![j] = 1; // free tile
            }

            if(i === 0 || j === 0 || i === mapHeight - 1 || j === mapWidth - 1){
                map[i]![j] = 0.5; // visited
            }
        }
    }
}

function generate(map: number[][], x: number, y: number) {
    map[x]![y] = 0.5;

    const right = map[x]![y+2];
    const up = map[x-2]![y];
    const left = map[x]![y-2];
    const down = map[x+2]![y];

    if(right === 0.5 && up === 0.5 && left === 0.5 && down === 0.5) {
        //pass
    } else {
        
    }
}

//Choose a random adjacent cell. Only create a passage if that cell has not been visited yet.

//Repeat the process until there are no more adjacent cells to choose from.

//Start backtracking until you can choose a cell again.

//The algorithm is done when you return to the starting cell.



//Kig på naboer, som ikke er besøgt endnu
//Vælg en tilfældig nabo
//“Bryd væggen” mellem dem
//Gå videre derfra
//Når der ikke er flere muligheder, går funktionen automatisk tilbage til forrige celle
//Fortsæt indtil alt er besøgt





/* 
let top_left_border: number = 0;
let low_right_border: number = sizeofmap - 1;
//Add a visited variable to cell object (here the object is aldready made)
for (let i: number = 0; i < sizeofmap; i++) {
    directions[i] = []; //create directions array

    for(let j: number = 0; j < sizeofmap; j++) {
        mapsize[i][j].visited = false; //set visited variable to false
        directions[i][j] = {}; //create object for directions

        if (i > top_left_border) {
            directions[i][j].up = mapsize[i-1][j];
        } 
        if (i < low_right_border) {
            directions[i][j].down = mapsize[i+1][j];
        }
        if (j > top_left_border) {
            directions[i][j].left = mapsize[i][j-1];
        } 
        if (j < low_right_border) {
            directions[i][j].right = mapsize[i][j+1];
        }
    }
}
startcell.visited = true;

if (up && up.visited == false) {

}
*/