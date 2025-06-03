import { MutableLattice, LatticeProperties } from '../types/lattice';

/**
 * Implements a powerset lattice where elements are sets and the ordering is subset inclusion.
 * For a set S, the powerset lattice consists of all possible subsets of S, ordered by inclusion.
 *
 * Properties:
 * - Bottom (⊥) is empty set
 * - Top (⊤) is the full set
 * - Join is set union
 * - Meet (if implemented) would be set intersection
 */
export class PowersetLattice<T> implements MutableLattice<Set<T>>, LatticeProperties<Set<T>> {
    private _version: number = 1;

    constructor(
        private _contents: Set<T>,
        private _universe: Set<T> // The universe set S
    ) {}

    get contents(): Set<T> { return new Set(this._contents); }
    get version(): number { return this._version; }

    get bottom(): Set<T> { return new Set(); }
    get top(): Set<T> { return new Set(this._universe); }

    join(a: Set<T>, b: Set<T>): Set<T> {
        const result = new Set(a);
        for (const item of b) {
            result.add(item);
        }
        return result;
    }

    mutatingJoin(other: Set<T>): void {
        const oldSize = this._contents.size;
        for (const item of other) {
            this._contents.add(item);
        }
        if (this._contents.size !== oldSize) {
            this._version++;
        }
    }

    lessThanOrEqual(a: Set<T>, b: Set<T>): boolean {
        for (const item of a) {
            if (!b.has(item)) return false;
        }
        return true;
    }

    equals(a: Set<T>, b: Set<T>): boolean {
        if (a.size !== b.size) return false;
        for (const item of a) {
            if (!b.has(item)) return false;
        }
        return true;
    }

    isCommutative(a: Set<T>, b: Set<T>): boolean {
        const joinAB = this.join(a, b);
        const joinBA = this.join(b, a);
        return this.equals(joinAB, joinBA);
    }

    isAssociative(a: Set<T>, b: Set<T>, c: Set<T>): boolean {
        const joinABC = this.join(this.join(a, b), c);
        const joinABC2 = this.join(a, this.join(b, c));
        return this.equals(joinABC, joinABC2);
    }

    isIdempotent(a: Set<T>): boolean {
        return this.equals(this.join(a, a), a);
    }
}
