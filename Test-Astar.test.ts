import { describe, it, expect } from "vitest";
import { aStar } from "../P2-prototype/AStar/AStar";

const grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
];

describe("aStar", () => {
    it("should find a path", () => {
        const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 });
        expect(path.length).toBeGreaterThan(0);
    });

    it("should start at the start point", () => {
        const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 });
        expect(path[0]).toEqual({ x: 0, y: 0 });
    });

    it("should end at the goal point", () => {
        const path = aStar(grid, { x: 0, y: 0 }, { x: 2, y: 2 });
        expect(path[path.length - 1]).toEqual({ x: 2, y: 2 });
    });

    it("should return empty array if there is no path", () => {
        const blockedGrid = [
            [1, 0],
            [0, 1],
        ];
        const path = aStar(blockedGrid, { x: 0, y: 0 }, { x: 1, y: 1 });
        expect(path).toEqual([]);
    });

    it("should return just the start point if start and goal are the same", () => {
        const path = aStar(grid, { x: 0, y: 0 }, { x: 0, y: 0 });
        expect(path).toEqual([{ x: 0, y: 0 }]);
    });
});