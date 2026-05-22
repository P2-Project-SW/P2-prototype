console.log("playerState.ts LOADED");


export const playerState = {
    currentTime: 0,
    collectedKeys: 0,
    rightSteps: 0,
    wrongSteps: 0
};

export const minMax = {
    time: [0, 0] as [number, number],
    path: [0, 0] as [number, number],
    keys: [0, 0] as [number, number]
};

export const weights = {
    Time: 1,
    Path: 1,
    Keys: 1
} as const;



let timerInterval: number | null = null;

export function startPlayerTimer() {
    if (timerInterval !== null) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        playerState.currentTime++;
    }, 1000);
}


export function resetPlayerState() {
    playerState.currentTime = 0;
    playerState.collectedKeys = 0;
    playerState.rightSteps = 0;
    playerState.wrongSteps = 0;
}

export function setMinMaxForMap(size: number) {
    if (size === 15) {
        minMax.time = [0, 60] as [number, number];
        minMax.path = [0, 1] as [number, number];
        minMax.keys = [0, 1] as [number, number];

    }
    else if (size === 25) {
        minMax.time = [0, 120] as [number, number];
        minMax.path = [0, 1] as [number, number];
        minMax.keys = [0, 2] as [number, number];

    
        
    }
    else if (size === 35) {
        minMax.time = [0, 180] as [number, number];
        minMax.path = [0, 1] as [number, number];
        minMax.keys = [0, 3] as [number, number];

    }
    else if (size === 51) {
        minMax.time = [0, 300] as [number, number];
        minMax.path = [0, 1] as [number, number];
        minMax.keys = [0, 4] as [number, number];
    }
}
