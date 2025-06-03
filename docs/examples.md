# Examples

This document provides examples of how Romaine's lattice types can be used in various applications.

## Implemented Examples

These examples have working implementations in the codebase:

### [Sudoku Solver](examples/sudoku-solver.md)
A constraint satisfaction puzzle solver that uses PowersetLattice to track possible values and solve Sudoku puzzles. Implementation available in `src/examples/SudokuSolver.ts`.

## Theoretical Examples

These examples demonstrate potential applications of lattice theory but are not yet implemented.

### Chess Engine

A chess implementation could leverage multiple lattices for different aspects of the game:

- **ScalarLattice**:
  - Piece positions during fog of war variants
  - Move validation states
  - Game phase tracking (opening → middlegame → endgame)

- **IntervalLattice**:
  - Move ranges for pieces (particularly useful for queens, bishops, and rooks)
  - Pawn advancement tracking
  - Time control windows

- **ProductLattice**:
  - Board coordinates (rank × file)
  - Move representation (from-position × to-position)
  - Piece state (type × position)

- **PowersetLattice**:
  - Available legal moves
  - Captured pieces
  - Pawn promotion options
  - Threatened squares
  - Control of the center

### Roguelike Game

A roguelike game could use lattices to manage various game systems:

- **ScalarLattice**:
  - Fog of war (unknown → seen → visible)
  - Item identification (unidentified → partially-known → identified)
  - Monster awareness states (unaware → suspicious → hunting)
  - Character conditions (healthy → injured → critical)

- **IntervalLattice**:
  - Line of sight calculations
  - Attack ranges
  - Sound propagation
  - Light radius calculations
  - Monster spawn ranges

- **ProductLattice**:
  - Status effects (type × duration)
  - Equipment stats (base-value × enchantment)
  - Position and movement (location × direction)
  - Combat calculations (damage × armor)

- **PowersetLattice**:
  - Discovered items and spells
  - Explored areas
  - Known monster types
  - Available abilities
  - Inventory management
  - Quest objectives
