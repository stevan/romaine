import { MutableLattice, LatticeProperties } from '../types/lattice';

interface Interval {
    min: number;
    max: number;
}

/**
 * Implements a lattice of intervals ordered by inclusion.
 * An interval [a,b] is less than or equal to [c,d] if [a,b] ⊆ [c,d].
 *
 * Properties:
 * - Bottom (⊥) is empty interval (represented as null)
 * - No top element (would be [-∞,∞])
 * - Join is the smallest interval containing both intervals
 */
export class IntervalLattice implements MutableLattice<Interval | null>, LatticeProperties<Interval | null> {
    private _version: number = 1;

    constructor(
        private _contents: Interval | null
    ) {
        if (_contents && _contents.min > _contents.max) {
            throw new Error('Invalid interval: min must be less than or equal to max');
        }
    }

    get contents(): Interval | null { return this._contents ? { ...this._contents } : null; }
    get version(): number { return this._version; }

    get bottom(): null { return null; }
    get top(): undefined { return undefined; }

    join(a: Interval | null, b: Interval | null): Interval | null {
        if (!a) return b;
        if (!b) return a;
        return {
            min: Math.min(a.min, b.min),
            max: Math.max(a.max, b.max)
        };
    }

    mutatingJoin(other: Interval | null): void {
        const result = this.join(this._contents, other);
        if (!this.equals(result, this._contents)) {
            this._contents = result;
            this._version++;
        }
    }

    lessThanOrEqual(a: Interval | null, b: Interval | null): boolean {
        if (!a) return true; // null is ≤ everything
        if (!b) return false; // non-null is not ≤ null
        return a.min >= b.min && a.max <= b.max;
    }

    equals(a: Interval | null, b: Interval | null): boolean {
        if (!a && !b) return true;
        if (!a || !b) return false;
        return a.min === b.min && a.max === b.max;
    }

    isCommutative(a: Interval | null, b: Interval | null): boolean {
        const joinAB = this.join(a, b);
        const joinBA = this.join(b, a);
        return this.equals(joinAB, joinBA);
    }

    isAssociative(a: Interval | null, b: Interval | null, c: Interval | null): boolean {
        const joinABC = this.join(this.join(a, b), c);
        const joinABC2 = this.join(a, this.join(b, c));
        return this.equals(joinABC, joinABC2);
    }

    isIdempotent(a: Interval | null): boolean {
        return this.equals(this.join(a, a), a);
    }

    // Additional useful methods for intervals
    intersects(a: Interval | null, b: Interval | null): boolean {
        if (!a || !b) return false;
        return a.min <= b.max && b.min <= a.max;
    }

    contains(interval: Interval | null, value: number): boolean {
        if (!interval) return false;
        return value >= interval.min && value <= interval.max;
    }
}
