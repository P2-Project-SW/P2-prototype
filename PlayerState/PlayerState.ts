console.log("playerState.ts LOADED");

export type PlayerState = {
    currentTime: number;
    collectedKeys: number;
    rightSteps: number;
    wrongSteps: number;
};

export type MinMax = {
    time: [number, number];
    path: [number, number];
    keys: [number, number];
};

export const playerState = {
    currentTime: 0,
    collectedKeys: 0,
    rightSteps: 0,
    wrongSteps: 0
};

export const minMax: MinMax = {
    time: [0, 0],
    path: [0, 0],
    keys: [0, 0]
};






export function resetPlayerState() {
    playerState.currentTime = 0;
    playerState.collectedKeys = 0;
    playerState.rightSteps = 0;
    playerState.wrongSteps = 0;
}

export function setMinMaxForMap(size: number) {
    if (size === 15) {
        minMax.time = [0, 60];
        minMax.path = [0, 200];
        minMax.keys = [0, 1];
    }
    else if (size === 25) {
        minMax.time = [0, 120];
        minMax.path = [0, 400];
        minMax.keys = [0, 2];
        
    }
    else if (size === 35) {
        minMax.time = [0, 180];
        minMax.path = [0, 700];
        minMax.keys = [0, 3];

    }
    else if (size === 51) {
        minMax.time = [0, 300];
        minMax.path = [0, 1200];
        minMax.keys = [0, 4];
    }
}
