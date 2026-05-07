export function findGoal(grid) {
    const rows = grid.length;
    if (rows === 0)
        return undefined;
    const cols = grid[0].length;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] === 3) {
                return { x, y };
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=helpers.js.map