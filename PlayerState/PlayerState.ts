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

export function startPlayerTimer(maxTime: number) {
    playerState.currentTime = 0;
    let remaining = maxTime;

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

export function setMinMaxForMap(map: any) {
    minMax.time = [0, map.maxTime] as [number, number];
    minMax.keys = [0, map.keys] as [number, number];
    minMax.path = [0, 1] as [number, number];
}

