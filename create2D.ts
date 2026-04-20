export{create2D};

// 2D Array Creator
function create2D(rows : number, cols : number, value : number = 0) : number[][] {
    const arr : number[][] = [];
    for (let r = 0; r < rows; r++) {
        const row : number[] = []
        for (let c = 0; c < cols; c++) {
            row[c] = value;
        }
        arr[r] = row;
    }
    return arr;
}
