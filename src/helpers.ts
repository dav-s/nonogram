import { TileState } from "./enums";
import { Grid, Vector, VectorClue } from "./types";

export function vectorToClue(vector: Vector): VectorClue {
  const clue: VectorClue = [];
  let onFill = false;
  let currentLength = 0;

  vector.forEach((state) => {
    if (state === TileState.FILLED) {
      onFill = true;
      currentLength++;
    } else if (onFill) {
      clue.push(currentLength);
      currentLength = 0;
      onFill = false;
    }
  });
  if (onFill) {
    clue.push(currentLength);
  }
  if (clue.length === 0) {
    return [0];
  }
  return clue;
}

export function vectorSatisfiesClue(vector: Vector, clue: VectorClue): boolean {
  return arraysAreEqual(vectorToClue(vector), clue);
}

export function coalesceToVector(nums: number[]): Vector {
  return nums.map((num) => (!!num ? TileState.FILLED : TileState.UNKNOWN));
}

export function coalesceToGrid(nums: number[][]): Grid {
  return nums.map(coalesceToVector);
}

export function transpose<T>(grid: T[][]): T[][] {
  return grid[0].map((_, col) => grid.map((row) => row[col]));
}

export function arraysAreEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
