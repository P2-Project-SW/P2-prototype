
export type { PlayerState, MinMax, Weights };

interface PlayerState {
    currentTime: number;
    collectedKeys: number;

    rightSteps: number;
    wrongSteps: number;
}

type MinMax = {
    time: [number, number];
    path: [number, number];
    keys: [number, number];
};

interface Weights {
    Time: number;
    Path: number;
    Keys: number;
}

//
// types.ts - Shared type definitions

export type Point = { x: number; y: number };

export interface KMeansOutput {
  index: number;           // Cluster index (0-N)
  label: string;           // "EASY", "MEDIUM", "HARD", etc.
  color: string;           // Hex color for visualization
  currentDist: number;     // Distance to assigned centroid
}

export interface AStarOutput {
  path: Point[];           // Optimal path fra A*
  target: Point;           // Current target (key eller exit)
  targetType: 'key' | 'exit';
}

export interface GameState {
  player_pos: Point;
  optimal_path: Point[];
  target_type: 'key' | 'exit';
  cluster_data: KMeansOutput;
  timestamp: number;
  time_in_cluster: number;
}

