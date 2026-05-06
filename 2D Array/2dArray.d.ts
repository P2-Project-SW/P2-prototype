export { maps, getTileSize, getActiveMap };
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
declare function getActiveMap(): (typeof maps)[keyof typeof maps] | null;
//# sourceMappingURL=2dArray.d.ts.map