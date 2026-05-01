import { squaredEuclidean } from 'ml-distance-euclidean';

const defaultOptions: IOptions = {
  distanceFunction: squaredEuclidean,
};

type Vector = number[];
type Matrix = number[][];

interface IOptions {
  distanceFunction?: (vector1: Vector, vector2: Vector) => number;
  similarityFunction?: (vector1: Vector, vector2: Vector) => number;
}

export function nearestVector(
  listVectors: Matrix,
  vector: number[],
  options: IOptions = defaultOptions,
) {
  const distanceFunction =
    options.distanceFunction || defaultOptions.distanceFunction;
  const similarityFunction =
    options.similarityFunction || defaultOptions.similarityFunction;

  let vectorIndex = -1;
  if (typeof similarityFunction === 'function') {
    // maximum similarity
    let maxSim = Number.MIN_VALUE;
    for (let j = 0; j < listVectors.length; j++) {
      const sim = similarityFunction(vector, listVectors[j]);
      if (sim > maxSim) {
        maxSim = sim;
        vectorIndex = j;
      }
    }
  } else if (typeof distanceFunction === 'function') {
    // minimum distance
    let minDist = Number.MAX_VALUE;
    for (let i = 0; i < listVectors.length; i++) {
      const dist = distanceFunction(vector, listVectors[i]);
      if (dist < minDist) {
        minDist = dist;
        vectorIndex = i;
      }
    }
  } else {
    throw new Error("A similarity or distance function it's required");
  }

  return vectorIndex;
}

export function findNearestVector(
  vectorList: Matrix,
  vector: Vector,
  options: IOptions = defaultOptions,
) {
  const index = nearestVector(vectorList, vector, options);
  return vectorList[index];
}
