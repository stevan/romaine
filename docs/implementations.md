# Lattice Implementations

This document describes the various lattice implementations provided by Romaine, their mathematical properties, and potential use cases.

## ScalarLattice<T>

### Description
A lattice structure for handling scalar values that can be in one of three states: unknown, known with a specific value, or in conflict. This lattice is particularly useful for tracking the evolution of a single value in a system where conflicts need to be detected and handled explicitly.

### Mathematical Properties
- **Structure**: Complete lattice
- **Bottom Element (⊥)**: `Unknown<T>`
- **Top Element (⊤)**: `Conflict<T>`
- **Ordering**:
  - `Unknown` ≤ `Known(x)` ≤ `Conflict` for any x
  - `Known(x)` and `Known(y)` are incomparable when x ≠ y
  - `Conflict` is greater than all other elements
- **Join Operation**:
  - `join(Unknown, x) = x` for any x
  - `join(Known(x), Known(x)) = Known(x)`
  - `join(Known(x), Known(y)) = Conflict(x, y)` when x ≠ y
  - `join(Conflict, x) = Conflict` for any x

### Use Cases
1. **Configuration Management**:
   - Tracking configuration values that may be set from multiple sources
   - Environment variable overrides (local vs deployed)
   - Feature flag values across environments

2. **Distributed Systems**:
   - State synchronization between nodes
   - Last-write-wins registers with conflict detection
   - Distributed cache invalidation

3. **User Interface State**:
   - Form field validation states
   - Multi-user collaborative editing
   - Undo/redo state management

4. **Data Validation**:
   - Schema validation with partial data
   - API response validation
   - Progressive form completion
   - Data migration state tracking

### Fun and Games
1. **Game State Management**:
   - Character status effects (stacking vs non-stacking buffs)
   - Achievement progress tracking (unknown → in-progress → completed)
   - Player rank/level progression
   - Quest state tracking (undiscovered → active → completed)

2. **Puzzle Games**:
   - Sudoku cell possibilities (as demonstrated in our solver)
   - Minesweeper cell states (unknown → flagged/revealed)
   - Crossword puzzle cell states
   - Logic puzzle constraint solving

## IntervalLattice

### Description
A lattice of closed intervals on the real number line, ordered by inclusion. This implementation handles both proper intervals and the empty interval (represented as null), making it suitable for range-based computations and constraints.

### Mathematical Properties
- **Structure**: Join-semilattice with bottom
- **Bottom Element (⊥)**: `null` (empty interval)
- **Top Element**: None (would be [-∞,∞])
- **Ordering**:
  - `[a,b]` ≤ `[c,d]` if and only if `[a,b]` ⊆ `[c,d]` (subset ordering)
  - Empty interval (null) ≤ every interval
- **Join Operation**:
  - `join([a,b], [c,d]) = [min(a,c), max(b,d)]`
  - `join(null, x) = x` for any interval x

### Use Cases
1. **Time Window Management**:
   - Meeting slot availability
   - Business hours calculation
   - Rate limiting windows
   - Event scheduling

2. **Resource Allocation**:
   - Hotel room booking systems
   - Conference room scheduling
   - Database connection timeouts

3. **Range Filtering**:
   - Price range filters in e-commerce
   - Date range selection
   - Numeric input validation

### Fun and Games
1. **Game Physics**:
   - Collision detection bounding boxes
   - Character movement ranges
   - Weapon/spell range calculations
   - Power meter ranges (min/max power for actions)

2. **Game Mechanics**:
   - Damage ranges for weapons/spells
   - Character stat ranges (min/max health, mana, etc.)
   - Level-up thresholds
   - Difficulty scaling ranges

## ProductLattice<A, B>

### Description
A product construction that combines two lattices into a new lattice where operations are performed component-wise. This provides a way to compose simpler lattices into more complex ones while preserving their mathematical properties.

### Mathematical Properties
- **Structure**: Inherits from component lattices
- **Bottom Element (⊥)**: `(⊥₁, ⊥₂)` where ⊥₁, ⊥₂ are bottoms of component lattices
- **Top Element (⊤)**:
  - `(⊤₁, ⊤₂)` if both component lattices have tops
  - Undefined if either component lacks a top
- **Ordering**:
  - `(a₁, b₁)` ≤ `(a₂, b₂)` if and only if `a₁ ≤ a₂` and `b₁ ≤ b₂`
- **Join Operation**:
  - `join((a₁, b₁), (a₂, b₂)) = (join(a₁, a₂), join(b₁, b₂))`

### Use Cases
1. **Application State**:
   - Combined loading and error states
   - Multi-step form validation
   - Transaction status monitoring

2. **Resource Management**:
   - Combined CPU and memory limits
   - Database connection pool management
   - Cloud resource allocation

3. **Security**:
   - Role-based access control with multiple dimensions
   - OAuth2 scope combinations

### Fun and Games
1. **Game World Coordinates**:
   - 2D/3D position tracking
   - Movement validation (combining position and speed)
   - Area effect calculations (damage + range)
   - Character stats combinations (health + shield)

2. **Game UI States**:
   - Inventory slot states (item + quantity)
   - Equipment slots (item + durability)
   - Resource bars (current + maximum)
   - Mini-game states (position + score)

## PowersetLattice<T>

### Description
A lattice of sets ordered by inclusion, representing all possible subsets of a given universe set. This implementation is particularly useful for tracking collections of elements where the relationships between sets are important.

### Mathematical Properties
- **Structure**: Complete lattice
- **Bottom Element (⊥)**: Empty set `∅`
- **Top Element (⊤)**: Universe set `U`
- **Ordering**:
  - `A ≤ B` if and only if `A ⊆ B` (subset ordering)
- **Join Operation**:
  - `join(A, B) = A ∪ B` (set union)

### Use Cases
1. **Permission Systems**:
   - Role-based access control
   - API access scopes
   - Document sharing permissions

2. **Dependency Management**:
   - Build system dependencies
   - Service deployment ordering
   - Database migration dependencies

3. **Collection Management**:
   - Shopping cart item tracking
   - Project tag management
   - Event listener registration

### Fun and Games
1. **Game Collections**:
   - Inventory systems
   - Spell/ability loadouts
   - Character equipment sets
   - Achievement tracking

2. **Game World State**:
   - Room/area discovery tracking
   - Collected items in a level
   - Unlocked abilities/powers
   - Team composition possibilities
