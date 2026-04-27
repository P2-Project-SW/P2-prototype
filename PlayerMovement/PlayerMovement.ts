import { getTileSize, maps, getActiveMap } from "../2D Array/2dArray.js"
export { playerMovement, movePlayer }

let y = 0;
let x = 0;
let nx = 0;
let ny = 0;

enum directions {
    UP,
    DOWN,
    RIGHT,
    LEFT
}

function movePlayer(direction : number) {
    if(direction === directions.UP) {
        nx = x;
        ny = y - 1;
    } else if(direction === directions.DOWN) {
        nx = x;
        ny = y + 1;
    } else if(direction === directions.RIGHT) {
        nx = x + 1;
        ny = y;
    } else if(direction === directions.LEFT) {
        nx = x - 1;
        ny = y;
    } else {
        nx = x;
        ny = y;
    }

    const map = getActiveMap();
    if (map === null) return;

    playerMovement(map, ny, nx);

    y = ny;
    x = nx;
}


function playerMovement(map : (typeof maps)[keyof typeof maps], y : number, x : number) {
    const div = document.createElement("div");
    div.classList.add("player");

    const container = document.getElementById("map");

    console.log("container:", container);

    if(container === null) return;

    div.innerHTML = "";

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

    const mapStyleGap = 2;
    const mapStylePadding = 10;
    const TILE_SIZE = getTileSize(map);

    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`;
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`;
    div.style.backgroundColor = "aqua";
    div.style.borderRadius = "3px";
    div.style.position = "absolute";

    container.appendChild(div);
}

(window as any).movePlayer = movePlayer;