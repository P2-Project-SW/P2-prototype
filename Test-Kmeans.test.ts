import { describe, it, expect} from "vitest";
import { euclideanDistance } from "../P2-prototype/DDA/k_means/k_means";

type EuclideanResult = { newDifficultyIndex: number; difficulty: string; distance: number };
 
const array = [
    [0.70, 0.90, 0.70],
    [0.52, 0.52, 0.37],
    [0.20, 0.20, 0.10],
];
 
describe("euclideanDistance", () => {
    it("should return EASY for a vector close to the EASY centroid", () => {
        const result = euclideanDistance([0.75, 1.0, 0.75], array) as EuclideanResult;
        expect(result.difficulty).toBe("EASY");
    });
 
    it("should return FLOW for a vector close to the FLOW centroid", () => {
        const result = euclideanDistance([0.52, 0.52, 0.37], array) as EuclideanResult;
        expect(result.difficulty).toBe("FLOW");
    });
 
    it("should return HARD for a vector close to the HARD centroid", () => {
        const result = euclideanDistance([0.25, 0.25, 0.15], array) as EuclideanResult;
        expect(result.difficulty).toBe("HARD");
    });
 
    it("should return a distance that is a positive number", () => {
        const result = euclideanDistance([0.5, 0.5, 0.5], array) as EuclideanResult;
        expect(result.distance).toBeGreaterThan(0);
    });
 
    it("should return an index of 0, 1, or 2", () => {
        const result = euclideanDistance([0.5, 0.5, 0.5], array) as EuclideanResult;
        expect([0, 1, 2]).toContain(result.newDifficultyIndex);
    });
});
 