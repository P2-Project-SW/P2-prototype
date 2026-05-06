export type Point = { x: number; y: number };
export { aStar };

function key(p: Point): string {
    return `${p.x},${p.y}`;
}


function heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function isWalkable(grid: number[][], x: number, y: number): boolean {
    return grid[y]![x] !== 0;
}


function getNeighbors(p: Point, grid: number[][]): Point[] {
    const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    const rows = grid.length;
    const cols = grid[0]!.length;

    return dirs
        .map(d => ({ x: p.x + d.x, y: p.y + d.y }))
        .filter(n =>
            n.x >= 0 && n.x < cols &&
            n.y >= 0 && n.y < rows &&
            isWalkable(grid, n.x, n.y)
        );
}

function reconstructPath(
    cameFrom: Map<string, string>,
    current: Point
): Point[] {
    const path: Point[] = [current];

    while (cameFrom.has(key(current))) {
        const prev = cameFrom.get(key(current))!;
        const parts = prev.split(",");
        const px = Number(parts[0]!);
        const py = Number(parts[1]!);

        current = { x: px, y: py };

        path.push(current);
    }

    return path.reverse();
}

 function aStar(
    grid: number[][],
    start: Point,
    goal: Point
): Point[] {
    const open: Point[] = [start];
    const closed = new Set<string>();

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const cameFrom = new Map<string, string>();

    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start, goal));

    while (open.length > 0) {
        let current: Point = open[0]!;
        let currentF = fScore.get(key(current)) ?? Infinity;

        for (let i = 1; i < open.length; i++) {
            const candidate: Point = open[i]!;
            const candidateF = fScore.get(key(candidate)) ?? Infinity;

            if (candidateF < currentF) {
                current = candidate;
                currentF = candidateF;
            }
        }

        if (current.x === goal.x && current.y === goal.y) {
            return reconstructPath(cameFrom, current);
        }

        open.splice(open.indexOf(current), 1);
        closed.add(key(current));

        for (const neighbor of getNeighbors(current, grid)) {
            const nKey = key(neighbor);

            if (closed.has(nKey)) continue;

            const tentativeG =
                (gScore.get(key(current)) ?? Infinity) + 1;

            const knownG = gScore.get(nKey);

            if (knownG === undefined || tentativeG < knownG) {
                cameFrom.set(nKey, key(current));
                gScore.set(nKey, tentativeG);
                fScore.set(nKey, tentativeG + heuristic(neighbor, goal));

                if (!open.find(p => p.x === neighbor.x && p.y === neighbor.y)) {
                    open.push(neighbor);
                }
            }
        }
    }

    return [];
}
