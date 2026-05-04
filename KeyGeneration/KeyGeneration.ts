import { getActiveMap } from "../2D Array/2dArray.js";

let keys: any = [];

function setup(map: number[][]) {
    keys[0] = {
        display: function() {
            console.log("Hello");
        }
    }
}

function draw() {
    keys[0].display();
}

function keyPosition(map: number[][], y : number, x : number) {
    //if player is not at beginning, then remove earlier div
    if(x > 0 && y > 0) {
        const currentDiv = document.getElementById("playerId");
        currentDiv!.remove();
    }

    //create new div
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = ("playerId");

    const mapContainer = document.getElementById("map"); //gets map from id
    //console.log("container:", container);
    if(mapContainer === null) return;

    div.innerHTML = ""; //make div empthy

    //find start position in map array (value = 2)
    if(x === 0 && y === 0) {
        for(let i = 0; i < map.grid.length; i++) {
            for(let j = 0; j < map.grid[0]!.length; j++) {
                if(map.grid[i]![j] === 2) {
                    y = i;
                    x = j;
                }
            }
        }
    }

    const mapStyleGap = 2; //gap between cells
    const mapStylePadding = 10; //edge around the map
    const TILE_SIZE = getTileSize(map);

    //ad div style in HTML
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`; //calculates the position : y
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`; //calculates the position : x
    div.style.backgroundColor = "aqua"; 
    div.style.borderRadius = "3px";
    div.style.position = "absolute";

    //add the div to the mapContainer
    mapContainer.appendChild(div);
}