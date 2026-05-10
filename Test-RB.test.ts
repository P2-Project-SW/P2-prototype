import { describe, it, expect } from "vitest";
import { recursiveBacktracker } from "./MapGen/RecursiveBacktracking/RecursiveBacktracking";
import { create2D } from "./2D Array/create2D";
import { maps } from "./2D Array/2dArray";


describe("recursiveBacktracker and create2D", () => {

    const size = maps.small.grid.length;

    it("create2D makes a correct array", () => {
        const array = create2D(size, size);

        expect(array.length).toBe(size);
        array.forEach(row => expect(row.length).toBe(size));
    });

    it("spawns in the map and has the correct size", () => {
        const map = recursiveBacktracker(size);

        expect(map.length).toBe(size);
        map.forEach(row => expect(row.length).toBe(size));
        expect(map[1]![0]).toBe(2);
        expect(map[size - 2]![size - 1]).toBe(3);
    });

});


// Check at den sponer i map
// Check at den length der kommer fra 2d array passer over ens med length