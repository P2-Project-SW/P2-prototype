import { getTileSize, maps } from "../2D Array/2dArray.js";
export { playerMovement };
document.addEventListener("keydown", (event) => {
    //console.log(event.key)
});
function playerMovement(map) {
    const div = document.createElement("div");
    div.classList.add("player");
    const container = document.getElementById("map");
    console.log("container:", container);
    if (container === null)
        return;
    div.innerHTML = "";
    let startRow = 0;
    let startCol = 0;
    for (let i = 0; i < map.grid.length; i++) {
        for (let j = 0; j < map.grid[0].length; j++) {
            if (map.grid[i][j] === 2) {
                startRow = i;
                startCol = j;
            }
        }
    }
    const mapGap = 2;
    const mapPadding = 10;
    const TILE_SIZE = getTileSize(map);
    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * startRow + startRow * mapGap + mapPadding}px`;
    div.style.left = `${TILE_SIZE * startCol + startCol * mapGap + mapPadding}px`;
    div.style.backgroundColor = "aqua";
    div.style.borderRadius = "3px";
    div.style.position = "absolute";
    container.appendChild(div);
}
//# sourceMappingURL=PlayerMovement.js.map