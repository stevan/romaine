import { PowersetLattice } from '../implementations/PowersetLattice';

export type CellIndex = [number, number]; // [row, col]
export type SudokuGrid = Array<Array<PowersetLattice<number>>>;

/**
 * A specialized Sudoku solver using lattice theory.
 * Each cell is represented as a PowersetLattice of possible values (1-9).
 * As we solve, we reduce the possibilities in each cell using lattice operations.
 */
export class SudokuSolver {
    private grid: SudokuGrid;
    private readonly ALL_VALUES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    constructor(initial?: number[][]) {
        this.grid = Array(9).fill(null).map(() =>
            Array(9).fill(null).map(() =>
                new PowersetLattice<number>(new Set(this.ALL_VALUES), this.ALL_VALUES)
            )
        );

        if (initial) {
            this.initializeGrid(initial);
        }
    }

    /**
     * Initialize the grid with known values
     */
    private initializeGrid(values: number[][]): void {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = values[row][col];
                if (value !== 0) {
                    this.setCell([row, col], value);
                }
            }
        }
    }

    /**
     * Set a cell to a specific value
     */
    private setCell(pos: CellIndex, value: number): void {
        const [row, col] = pos;
        this.grid[row][col] = new PowersetLattice<number>(
            new Set([value]),
            this.ALL_VALUES
        );
        this.propagateConstraints(pos);
    }

    /**
     * Get the possible values for a cell
     */
    getPossibilities(pos: CellIndex): Set<number> {
        const [row, col] = pos;
        return this.grid[row][col].contents;
    }

    /**
     * Check if a value can be placed in a cell
     */
    private canPlace(pos: CellIndex, value: number): boolean {
        return this.getPossibilities(pos).has(value);
    }

    /**
     * Get all cells in the same row
     */
    private getRowCells(row: number): CellIndex[] {
        return Array(9).fill(null).map((_, col) => [row, col] as CellIndex);
    }

    /**
     * Get all cells in the same column
     */
    private getColCells(col: number): CellIndex[] {
        return Array(9).fill(null).map((_, row) => [row, col] as CellIndex);
    }

    /**
     * Get all cells in the same 3x3 box
     */
    private getBoxCells(pos: CellIndex): CellIndex[] {
        const [row, col] = pos;
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        const cells: CellIndex[] = [];

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                cells.push([boxRow + r, boxCol + c]);
            }
        }
        return cells;
    }

    /**
     * Propagate constraints after setting a value
     */
    private propagateConstraints(pos: CellIndex): void {
        const [row, col] = pos;
        const value = Array.from(this.getPossibilities(pos))[0];

        // Remove the value from all related cells
        const relatedCells = new Set([
            ...this.getRowCells(row),
            ...this.getColCells(col),
            ...this.getBoxCells(pos)
        ]);

        for (const [r, c] of relatedCells) {
            if (r === row && c === col) continue;

            const possibilities = this.grid[r][c].contents;
            possibilities.delete(value);
            this.grid[r][c] = new PowersetLattice<number>(possibilities, this.ALL_VALUES);
        }
    }

    /**
     * Solve the Sudoku puzzle using lattice operations
     */
    solve(): boolean {
        let changed = true;
        while (changed) {
            changed = false;

            // Find cells with only one possibility
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const possibilities = this.getPossibilities([row, col]);
                    if (possibilities.size === 1 && !this.isCellFixed([row, col])) {
                        const value = Array.from(possibilities)[0];
                        this.setCell([row, col], value);
                        changed = true;
                    }
                }
            }

            // If no single possibilities found, look for unique possibilities in groups
            if (!changed) {
                changed = this.findUniqueValues();
            }
        }

        return this.isSolved();
    }

    /**
     * Check if a cell has been definitively set
     */
    private isCellFixed(pos: CellIndex): boolean {
        const [row, col] = pos;
        return this.grid[row][col].contents.size === 1;
    }

    /**
     * Find values that can only go in one place in a row/column/box
     */
    private findUniqueValues(): boolean {
        let changed = false;

        // Check rows
        for (let row = 0; row < 9; row++) {
            const cells = this.getRowCells(row);
            changed = changed || this.findUniqueInGroup(cells);
        }

        // Check columns
        for (let col = 0; col < 9; col++) {
            const cells = this.getColCells(col);
            changed = changed || this.findUniqueInGroup(cells);
        }

        // Check boxes
        for (let box = 0; box < 9; box++) {
            const boxRow = Math.floor(box / 3) * 3;
            const boxCol = (box % 3) * 3;
            const cells = this.getBoxCells([boxRow, boxCol]);
            changed = changed || this.findUniqueInGroup(cells);
        }

        return changed;
    }

    /**
     * Find values that can only go in one place in a group of cells
     */
    private findUniqueInGroup(cells: CellIndex[]): boolean {
        let changed = false;
        const valueCounts = new Map<number, CellIndex[]>();

        // Count where each value can go
        for (const pos of cells) {
            const possibilities = this.getPossibilities(pos);
            for (const value of possibilities) {
                if (!valueCounts.has(value)) {
                    valueCounts.set(value, []);
                }
                valueCounts.get(value)!.push(pos);
            }
        }

        // If a value can only go in one place, put it there
        for (const [value, positions] of valueCounts) {
            if (positions.length === 1 && !this.isCellFixed(positions[0])) {
                this.setCell(positions[0], value);
                changed = true;
            }
        }

        return changed;
    }

    /**
     * Check if the puzzle is solved
     */
    isSolved(): boolean {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const possibilities = this.getPossibilities([row, col]);
                if (possibilities.size !== 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Get the current state of the grid
     */
    getGrid(): number[][] {
        return Array(9).fill(null).map((_, row) =>
            Array(9).fill(null).map((_, col) => {
                const possibilities = this.getPossibilities([row, col]);
                return possibilities.size === 1 ? Array.from(possibilities)[0] : 0;
            })
        );
    }
}
