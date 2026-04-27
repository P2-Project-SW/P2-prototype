export { create2D };
// 2D Array Creator
function create2D(rows, cols, value = 0) {
    const arr = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row[c] = value;
        }
        arr[r] = row;
    }
    return arr;
}
//# sourceMappingURL=create2D.js.map