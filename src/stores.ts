import create from "zustand";
import { TileState } from "./enums";
import { Grid } from "./types";

interface PuzzleState {
  grid: Grid;
  //   getTile: (row: number, column: number) => State;
  toggleTile: (row: number, column: number) => void;
  setGrid: (grid: Grid) => void;
}

const cloneGrid = (grid: Grid) => grid.map((row) => row.map((state) => state));

export const usePuzzleStore = create<PuzzleState>((set) => ({
  grid: [[]],
  toggleTile: (row, column) =>
    set((state) => {
      const newGrid = cloneGrid(state.grid);
      newGrid[row][column] =
        newGrid[row][column] === TileState.FILLED
          ? TileState.UNKNOWN
          : TileState.FILLED;
      return {
        grid: newGrid,
      };
    }),
  setGrid: (grid) => set((_state) => ({ grid: grid })),
}));
