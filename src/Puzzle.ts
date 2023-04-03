import { transpose, vectorSatisfiesClue, vectorToClue } from "./helpers";
import { VectorClue, Grid } from "./types";

export default class Puzzle {
  private rowClues: VectorClue[];
  private columnClues: VectorClue[];

  constructor(rowClues: VectorClue[], columnClues: VectorClue[]) {
    this.rowClues = rowClues;
    this.columnClues = columnClues;
  }

  public static fromGrid(grid: Grid): Puzzle {
    return new Puzzle(
      grid.map(vectorToClue),
      transpose(grid).map(vectorToClue)
    );
  }

  public getRowClues(): VectorClue[] {
    return this.rowClues;
  }

  public getColumnClues(): VectorClue[] {
    return this.columnClues;
  }

  public getNumberOfRows(): number {
    return this.rowClues.length;
  }

  public getNumberOfColumns(): number {
    return this.columnClues.length;
  }

  public gridSatisfiesPuzzle(grid: Grid): boolean {
    return (
      grid.every((row, i) => vectorSatisfiesClue(row, this.rowClues[i])) &&
      transpose(grid).every((column, i) =>
        vectorSatisfiesClue(column, this.columnClues[i])
      )
    );
  }

  public print() {
    console.log(this.columnClues);
    console.log(this.rowClues);
  }
}
