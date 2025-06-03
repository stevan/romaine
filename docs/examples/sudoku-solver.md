# Sudoku Solver

The Sudoku solver demonstrates how lattices can elegantly solve constraint satisfaction problems. This is a fully implemented example that can be found in `src/examples/SudokuSolver.ts`.

## Overview
A Sudoku puzzle is solved by tracking possible values for each cell while enforcing row, column, and box constraints. The solver uses PowersetLattice to manage the state of each cell and propagate constraints through the puzzle.

## Implementation Details

- **PowersetLattice**: Used for tracking possible values in each cell
  - Universe: Numbers 1-9
  - Initial state: Full set {1,2,3,4,5,6,7,8,9} for empty cells
  - Each cell is represented as a PowersetLattice<number>
  - As constraints are applied, possibilities are removed using set operations

## Key Features
1. **Constraint Propagation**:
   - When a cell is filled with a value:
     - That value is removed from possibilities in all cells in the same row
     - That value is removed from possibilities in all cells in the same column
     - That value is removed from possibilities in all cells in the same 3x3 box

2. **Solution Strategy**:
   The solver uses two main strategies:

   a. **Single Possibility Detection**:
      - Track possible values for each empty cell
      - Find cells with only one possible value
      - Set those cells and propagate constraints

   b. **Unique Value Detection**:
      - For each row, column, and box:
      - Find values that can only go in one position
      - Set those cells and propagate constraints

   The solver alternates between these strategies until either:
   - The puzzle is solved
   - No more progress can be made

3. **Grid Management**:
   - Efficient cell grouping functions for rows, columns, and boxes
   - Maintains the grid as a 9x9 array of PowersetLattices
   - Provides methods to:
     - Get possible values for any cell
     - Check if a value can be placed in a cell
     - Verify if the puzzle is solved

4. **Validation**:
   - Ensures values are valid (1-9)
   - Tracks fixed (solved) cells
   - Verifies complete solution

## Implementation Example
```typescript
// Each cell is a PowersetLattice of possible values
type SudokuGrid = Array<Array<PowersetLattice<number>>>;

// Initialize empty grid
this.grid = Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() =>
        new PowersetLattice<number>(
            new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
            this.ALL_VALUES
        )
    )
);
```

## Usage
```typescript
// Create a new solver with an initial grid
const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    // ... rest of the grid ...
];

const solver = new SudokuSolver(puzzle);
if (solver.solve()) {
    const solution = solver.getGrid();
    console.log('Puzzle solved!');
} else {
    console.log('No solution found');
}
