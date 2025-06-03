import { SudokuSolver } from '../src/examples/SudokuSolver';

describe('SudokuSolver', () => {
    test('solves a simple Sudoku puzzle', () => {
        const puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];

        const solution = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ];

        const solver = new SudokuSolver(puzzle);
        expect(solver.solve()).toBe(true);
        expect(solver.getGrid()).toEqual(solution);
    });

    test('tracks possibilities correctly', () => {
        const puzzle = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 5, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        const solver = new SudokuSolver(puzzle);
        const centerCell = solver.getPossibilities([4, 4]);
        expect(centerCell).toEqual(new Set([5]));

        // Check that 5 is removed from possibilities in same row
        expect(solver.getPossibilities([4, 0]).has(5)).toBe(false);
        expect(solver.getPossibilities([4, 8]).has(5)).toBe(false);

        // Check that 5 is removed from possibilities in same column
        expect(solver.getPossibilities([0, 4]).has(5)).toBe(false);
        expect(solver.getPossibilities([8, 4]).has(5)).toBe(false);

        // Check that 5 is removed from possibilities in same box
        expect(solver.getPossibilities([3, 3]).has(5)).toBe(false);
        expect(solver.getPossibilities([5, 5]).has(5)).toBe(false);
    });

    test('handles invalid puzzles', () => {
        const invalidPuzzle = [
            [5, 5, 0, 0, 0, 0, 0, 0, 0], // Two 5s in the same row
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        const solver = new SudokuSolver(invalidPuzzle);
        expect(solver.solve()).toBe(false);
    });

    describe('Constraint Checking', () => {
        test('canPlace correctly identifies valid moves', () => {
            const puzzle = [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ];

            const solver = new SudokuSolver(puzzle);

            // Test cell with multiple possibilities
            const possibilities = solver.getPossibilities([0, 2]);
            expect(possibilities.size).toBeGreaterThan(1);
        });

        test('handles unique values in groups', () => {
            const puzzle = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1]  // Only 1 in last row
            ];

            const solver = new SudokuSolver(puzzle);
            solver.solve();

            // After solving, the 1 in the last row should have eliminated 1 as a possibility
            // in all other cells in the same row, column, and box
            const lastRowCells = Array(8).fill(null).map((_, i) => solver.getPossibilities([8, i]));
            lastRowCells.forEach(possibilities => {
                expect(possibilities.has(1)).toBe(false);
            });

            const lastColCells = Array(8).fill(null).map((_, i) => solver.getPossibilities([i, 8]));
            lastColCells.forEach(possibilities => {
                expect(possibilities.has(1)).toBe(false);
            });

            // Check box cells (last box)
            const boxCells = [
                [6, 6], [6, 7], [6, 8],
                [7, 6], [7, 7], [7, 8],
                [8, 6], [8, 7]  // [8, 8] is the 1
            ];
            boxCells.forEach(([row, col]) => {
                expect(solver.getPossibilities([row, col]).has(1)).toBe(false);
            });
        });
    });
});
