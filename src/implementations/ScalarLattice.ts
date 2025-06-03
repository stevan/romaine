import { Known, Unknown, Scalar, isKnown, isUnknown } from '../types/scalar';
import { JoinSemiLattice, LatticeProperties, MutableLattice } from '../types/lattice';

/**
 * Implements a lattice structure for Scalar values where Unknown is the bottom element
 * and Known values form the upper elements with equality-based ordering.
 *
 * The lattice structure is:
 * - Unknown is the bottom element (⊥)
 * - Known values are incomparable with each other unless equal
 * - No top element exists
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
    get top(): undefined { return undefined; } // No greatest element in this lattice

    join(a: Scalar<T>, b: Scalar<T>): Scalar<T> {
        if (isUnknown(a)) return b;
        if (isUnknown(b)) return a;
        if (isKnown(a) && isKnown(b)) {
            if (a.value === b.value) return a;
            throw new Error(`Cannot join incomparable Known values: ${a.value} and ${b.value}`);
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
        if (isUnknown(a)) return true; // Unknown is ≤ everything
        if (isUnknown(b)) return false; // Known is not ≤ Unknown
        return isKnown(a) && isKnown(b) && a.value === b.value;
    }

    equals(a: Scalar<T>, b: Scalar<T>): boolean {
        if (isUnknown(a) && isUnknown(b)) return true;
        if (isKnown(a) && isKnown(b)) return a.value === b.value;
        return false;
    }

    // LatticeProperties implementation
    isCommutative(a: Scalar<T>, b: Scalar<T>): boolean {
        try {
            const joinAB = this.join(a, b);
            const joinBA = this.join(b, a);
            return this.equals(joinAB, joinBA);
        } catch (e) {
            // If both joins throw errors for incomparable elements,
            // we consider it commutative
            return true;
        }
    }

    isAssociative(a: Scalar<T>, b: Scalar<T>, c: Scalar<T>): boolean {
        try {
            const joinABC = this.join(this.join(a, b), c);
            const joinABC2 = this.join(a, this.join(b, c));
            return this.equals(joinABC, joinABC2);
        } catch (e) {
            // If both joins throw errors for incomparable elements,
            // we consider it associative
            return true;
        }
    }

    isIdempotent(a: Scalar<T>): boolean {
        const joinAA = this.join(a, a);
        return this.equals(joinAA, a);
    }
}
