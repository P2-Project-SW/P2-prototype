import { getTileSize } from "../2D_Array/2dArray.js";

export function movePlayerPosition(map: any, y: number, x: number) {
    const currentDiv = document.getElementById("playerId");
    currentDiv?.remove();
    
    const div = document.createElement("div");
    div.classList.add("player");
    div.id = "playerId";

    const mapContainer = document.getElementById("map");
    if (mapContainer === null) return;

    const mapStyleGap = 2;
    const mapStylePadding = 10;
    const TILE_SIZE = getTileSize(map);

    div.style.width = `${TILE_SIZE}px`;
    div.style.height = `${TILE_SIZE}px`;
    div.style.top = `${TILE_SIZE * y + y * mapStyleGap + mapStylePadding}px`;
    div.style.left = `${TILE_SIZE * x + x * mapStyleGap + mapStylePadding}px`;
    div.style.position = "absolute";
    div.style.fontSize = `${TILE_SIZE * 0.8}px`;
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = `🧝`;
    
    mapContainer.appendChild(div);
}

export function resetPlayerDiv() {
    const currentDiv = document.getElementById("playerId");
    currentDiv?.remove();
}
