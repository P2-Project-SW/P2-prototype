export type { PlayerState, MinMax };

interface PlayerState {
    currentTime: number;
    pathEfficiency: number;
    collectedKeys: number;
}

type MinMax = {
    time: [number, number];
    path: [number, number];
    keys: [number, number];
};