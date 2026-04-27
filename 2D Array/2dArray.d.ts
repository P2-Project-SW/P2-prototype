export { maps, getTileSize };
declare const maps: {
    small: {
        grid: number[][];
        active: boolean;
    };
    medium: {
        grid: number[][];
        active: boolean;
    };
    large: {
        grid: number[][];
        active: boolean;
    };
    xl: {
        grid: number[][];
        active: boolean;
    };
};
declare function getTileSize(map: (typeof maps)[keyof typeof maps]): 40 | 30 | 22 | 14;
//# sourceMappingURL=2dArray.d.ts.map