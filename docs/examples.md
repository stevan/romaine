# Examples

This document provides examples of how Romaine's lattice types can be used in various applications.

## Implemented Examples

These examples have working implementations in the codebase:

### [Sudoku Solver](examples/sudoku-solver.md)
A constraint satisfaction puzzle solver that uses PowersetLattice to track possible values and solve Sudoku puzzles. Implementation available in `src/examples/SudokuSolver.ts`.

## Theoretical Examples

These examples demonstrate potential applications of lattice theory across different domains.

### Gaming and Interactive Entertainment

#### Chess Engine
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

#### Roguelike Game
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

### Static Analysis and Type Systems

#### Type Inference Engine
A type inference system could use lattices to model type relationships:

- **PowersetLattice**:
  - Type constraints and possibilities
  - Method overload resolution
  - Type intersection and union operations

- **ProductLattice**:
  - Generic type parameters
  - Function type signatures (parameter-types × return-type)

- **ScalarLattice**:
  - Type specificity hierarchy
  - Subtyping relationships
  - Type compatibility levels

#### Data Flow Analysis
Static analysis for code optimization and bug detection:

- **PowersetLattice**:
  - Reaching definitions
  - Live variable analysis
  - Available expressions

- **ScalarLattice**:
  - Variable state (uninitialized → initialized → used)
  - Null safety levels
  - Resource lifecycle states

### Distributed Systems

#### Conflict-Free Replicated Data Types (CRDTs)
Implementation of various CRDTs using lattice properties:

- **PowersetLattice**:
  - Observed-Remove Set
  - Two-Phase Set
  - Unique Set

- **ScalarLattice**:
  - Version vectors
  - Lamport timestamps
  - State merging

#### Distributed Cache Coherency
Cache consistency protocol implementation:

- **ScalarLattice**:
  - Cache line states (invalid → shared → exclusive → modified)
  - Version ordering
  - Consistency levels

- **ProductLattice**:
  - Cache entry (value × timestamp)
  - Node state (data × metadata)

### Machine Learning

#### Feature Space Analysis
Feature selection and transformation:

- **PowersetLattice**:
  - Feature subset selection
  - Attribute dependencies
  - Feature interaction groups

- **IntervalLattice**:
  - Numerical feature ranges
  - Confidence intervals
  - Prediction bounds

#### Model Interpretability
Understanding and explaining model decisions:

- **ScalarLattice**:
  - Decision tree paths
  - Rule confidence levels
  - Feature importance hierarchies

- **ProductLattice**:
  - Feature contribution scores (feature × importance)
  - Decision boundaries (feature-space × classification)

### Security and Access Control

#### Permission System
Role-based access control implementation:

- **PowersetLattice**:
  - Permission sets
  - Role capabilities
  - Resource access rights

- **ProductLattice**:
  - User-role assignments
  - Resource-permission mappings

#### Information Flow Control
Security level tracking:

- **ScalarLattice**:
  - Security clearance levels
  - Data sensitivity classifications
  - Trust boundaries

- **PowersetLattice**:
  - Taint tracking
  - Data flow paths
  - Security compartments
