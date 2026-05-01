# ml-nearest-vector

[![NPM version](https://img.shields.io/npm/v/ml-nearest-vector.svg)](https://www.npmjs.com/package/ml-nearest-vector)
[![npm download](https://img.shields.io/npm/dm/ml-nearest-vector.svg)](https://www.npmjs.com/package/ml-nearest-vector)
[![test coverage](https://img.shields.io/codecov/c/github/mljs/spectra-processing.svg)](https://codecov.io/gh/mljs/spectra-processing)
[![license](https://img.shields.io/npm/l/ml-nearest-vector.svg)](https://github.com/mljs/spectra-processing/blob/main/LICENSE)

> Find the nearest point to a sample point

## Installation

```
$ npm install ml-nearest-vector
```

## [API Documentation](https://mljs.github.io/nearest-vector/)

## Example

```js
import nearestVector, {findNearestVector} from 'ml-nearest-vector');

const nearestVector = require('ml-nearest-vector');

let centers = [[1, 2, 1], [-1, -1, -1]];
// returns the index of the nearest vector
nearestVector(centers, [1, 2, 1]) === 0;

// returns the nearest vector itself
findNearstVector(centers, [1, 2, 1]); // [1, 2, 1]
```

## License

[MIT](./LICENSE)
