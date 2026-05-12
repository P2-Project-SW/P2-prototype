
export type { PlayerState, MinMax, Weights };

interface PlayerState {
    currentTime: number;
    collectedKeys: number;

    rightSteps: number;
    wrongSteps: number;
}

type MinMax = {
    time: [number, number];
    path: [number, number];
    keys: [number, number];
};

interface Weights {
    Time: number;
    Path: number;
    Keys: number;
}


