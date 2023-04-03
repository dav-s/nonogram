import { useEffect } from "react";
import Cube from "./Cube";
import { TileState } from "./enums";
import Puzzle from "./Puzzle";
import Number from "./Number";
import { usePuzzleStore } from "./stores";
import { transpose, vectorToClue } from "./helpers";

type Props = {
  puzzle: Puzzle;
  onComplete?: () => void;
};

export default function PuzzleRunner({ puzzle, onComplete }: Props) {
  const grid = usePuzzleStore((state) => state.grid);
  const setGrid = usePuzzleStore((state) => state.setGrid);

  useEffect(() => {
    setGrid(
      new Array(puzzle.getNumberOfRows())
        .fill(0)
        .map(() =>
          new Array(puzzle.getNumberOfColumns()).fill(TileState.UNKNOWN)
        )
    );
  }, [puzzle]);

  useEffect(() => {
    if (onComplete && puzzle.gridSatisfiesPuzzle(grid)) {
      onComplete();
    }
  }, [puzzle, grid, onComplete]);

  return (
    <group scale={[-1, -1, 1]}>
      {/* grid */}
      {grid.flatMap((row, i) =>
        row.map((_state, j) => <Cube coordinates={[i, j]} key={i + "," + j} />)
      )}
      {/* row clues */}
      {grid.flatMap((row, i) =>
        vectorToClue(row)
          .reverse()
          .map((number, j) => (
            <Number
              number={number}
              coordinates={[i, -(j + 1)]}
              key={i + "," + -(j + 1)}
            />
          ))
      )}
      {/* column clues */}
      {transpose(grid).flatMap((column, i) =>
        vectorToClue(column)
          .reverse()
          .map((number, j) => (
            <Number
              number={number}
              coordinates={[-(j + 1), i]}
              key={-(j + 1) + "," + i}
            />
          ))
      )}
    </group>
  );
}
