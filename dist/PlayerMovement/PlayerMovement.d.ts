import { maps } from "../2D Array/2dArray.js";
export { movePlayerPosition, movePlayer, resetPlayerState };
declare function movePlayer(direction: number): void;
declare function movePlayerPosition(map: (typeof maps)[keyof typeof maps], y: number, x: number): void;
declare function resetPlayerState(): void;
//# sourceMappingURL=PlayerMovement.d.ts.map