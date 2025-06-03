import { Known, Unknown, Scalar, isKnown, isUnknown, isConflict, Conflict } from '../types/scalar';
import { JoinSemiLattice, LatticeProperties, MutableLattice } from '../types/lattice';

/**
 * Implements a lattice structure for Scalar values where:
 * - Unknown is the bottom element (⊥)
 * - Known values are incomparable with each other unless equal
 * - Conflict is the top element (⊤), representing joined incomparable elements
 */
export class ScalarLattice<T> implements MutableLattice<Scalar<T>>, LatticeProperties<Scalar<T>> {
    private _version: number = 1;

    constructor(
        private _contents: Scalar<T>
    ) {}

    // MutableLattice implementation
    get contents(): Scalar<T> { return this._contents; }
    get version(): number { return this._version; }

    get bottom(): Scalar<T> { return Unknown<T>(); }
    get top(): Scalar<T> | undefined {
        if (isKnown(this._contents)) {
            return Conflict(this._contents.value, this._contents.value);
        }
        return undefined;
    }

    join(a: Scalar<T>, b: Scalar<T>): Scalar<T> {
        if (isConflict(a) || isConflict(b)) return isConflict(a) ? a : b;
        if (isUnknown(a)) return b;
        if (isUnknown(b)) return a;
        if (isKnown(a) && isKnown(b)) {
            if (a.value === b.value) return a;
            return Conflict(a.value, b.value);
        }
        throw new Error("Invalid lattice elements");
    }

    mutatingJoin(other: Scalar<T>): void {
        const result = this.join(this._contents, other);
        if (!this.equals(result, this._contents)) {
            this._contents = result;
            this._version++;
        }
    }

    lessThanOrEqual(a: Scalar<T>, b: Scalar<T>): boolean {
        if (isConflict(b)) return true; // Everything is ≤ Conflict
        if (isConflict(a)) return isConflict(b); // Conflict is only ≤ Conflict
        if (isUnknown(a)) return true; // Unknown is ≤ everything except itself
        if (isUnknown(b)) return false; // Known is not ≤ Unknown
        return isKnown(a) && isKnown(b) && a.value === b.value;
    }

    equals(a: Scalar<T>, b: Scalar<T>): boolean {
        if (isConflict(a) && isConflict(b)) {
            // Order of values doesn't matter for equality
            return (a.values[0] === b.values[0] && a.values[1] === b.values[1]) ||
                   (a.values[0] === b.values[1] && a.values[1] === b.values[0]);
        }
        if (isUnknown(a) && isUnknown(b)) return true;
        if (isKnown(a) && isKnown(b)) return a.value === b.value;
        return false;
    }

    // LatticeProperties implementation
    isCommutative(a: Scalar<T>, b: Scalar<T>): boolean {
        const joinAB = this.join(a, b);
        const joinBA = this.join(b, a);
        return this.equals(joinAB, joinBA);
    }

    isAssociative(a: Scalar<T>, b: Scalar<T>, c: Scalar<T>): boolean {
        const joinABC = this.join(this.join(a, b), c);
        const joinABC2 = this.join(a, this.join(b, c));
        return this.equals(joinABC, joinABC2);
    }

    isIdempotent(a: Scalar<T>): boolean {
        const joinAA = this.join(a, a);
        return this.equals(joinAA, a);
    }
}
