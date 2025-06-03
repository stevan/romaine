/**
 * Core interfaces defining the mathematical properties and operations of lattices
 */

/**
 * Represents the core operations of a join-semilattice.
 * A join-semilattice is a partially ordered set that has a least upper bound (join)
 * for any pair of elements.
 *
 * Properties that must hold:
 * 1. Partial Order: For all a, b: a ≤ b iff join(a,b) = b
 * 2. Commutativity: For all a, b: join(a,b) = join(b,a)
 * 3. Associativity: For all a, b, c: join(join(a,b),c) = join(a,join(b,c))
 * 4. Idempotence: For all a: join(a,a) = a
 */
export interface JoinSemiLattice<T> {
    /** Returns the least upper bound of two elements */
    join(a: T, b: T): T;

    /** Implements the partial order relation (≤) */
    lessThanOrEqual(a: T, b: T): boolean;

    /** The least element (⊥) of the lattice */
    readonly bottom: T;

    /** The greatest element (⊤) of the lattice, if it exists */
    readonly top: T | undefined;

    /** Tests equality of two elements */
    equals(a: T, b: T): boolean;
}

/**
 * Interface for verifying mathematical properties of a lattice
 */
export interface LatticeProperties<T> {
    /** Verifies: join(a,b) = join(b,a) */
    isCommutative(a: T, b: T): boolean;

    /** Verifies: join(join(a,b),c) = join(a,join(b,c)) */
    isAssociative(a: T, b: T, c: T): boolean;

    /** Verifies: join(a,a) = a */
    isIdempotent(a: T): boolean;
}

/**
 * Interface for mutable operations on a lattice
 */
export interface MutableLattice<T> extends JoinSemiLattice<T> {
    /** Current value in the lattice */
    readonly contents: T;

    /** Version number for tracking changes */
    readonly version: number;

    /** Mutates the current value by joining it with another */
    mutatingJoin(other: T): void;
}
