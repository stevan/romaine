import { MutableLattice, LatticeProperties, JoinSemiLattice } from '../types/lattice';
import { ProductValue, createProduct } from '../types/product';

/**
 * Implements a product lattice which combines two lattices into a new lattice.
 * The ordering is component-wise: (a1,b1) ≤ (a2,b2) iff a1 ≤ a2 and b1 ≤ b2
 *
 * Properties:
 * - Bottom is (⊥₁,⊥₂)
 * - Top is (⊤₁,⊤₂) if both lattices have tops
 * - Join is component-wise
 */
export class ProductLattice<A, B> implements MutableLattice<ProductValue<A, B>>, LatticeProperties<ProductValue<A, B>> {
    private _version: number = 1;

    constructor(
        private _contents: ProductValue<A, B>,
        private _firstLattice: JoinSemiLattice<A>,
        private _secondLattice: JoinSemiLattice<B>
    ) {}

    get contents(): ProductValue<A, B> {
        return { ...this._contents };
    }

    get version(): number { return this._version; }

    get bottom(): ProductValue<A, B> {
        return createProduct(
            this._firstLattice.bottom,
            this._secondLattice.bottom
        );
    }

    get top(): ProductValue<A, B> | undefined {
        const top1 = this._firstLattice.top;
        const top2 = this._secondLattice.top;
        if (top1 === undefined || top2 === undefined) return undefined;
        return createProduct(top1, top2);
    }

    join(a: ProductValue<A, B>, b: ProductValue<A, B>): ProductValue<A, B> {
        return createProduct(
            this._firstLattice.join(a.first, b.first),
            this._secondLattice.join(a.second, b.second)
        );
    }

    mutatingJoin(other: ProductValue<A, B>): void {
        const result = this.join(this._contents, other);
        if (!this.equals(result, this._contents)) {
            this._contents = result;
            this._version++;
        }
    }

    lessThanOrEqual(a: ProductValue<A, B>, b: ProductValue<A, B>): boolean {
        return this._firstLattice.lessThanOrEqual(a.first, b.first) &&
               this._secondLattice.lessThanOrEqual(a.second, b.second);
    }

    equals(a: ProductValue<A, B>, b: ProductValue<A, B>): boolean {
        return this._firstLattice.equals(a.first, b.first) &&
               this._secondLattice.equals(a.second, b.second);
    }

    isCommutative(a: ProductValue<A, B>, b: ProductValue<A, B>): boolean {
        const joinAB = this.join(a, b);
        const joinBA = this.join(b, a);
        return this.equals(joinAB, joinBA);
    }

    isAssociative(a: ProductValue<A, B>, b: ProductValue<A, B>, c: ProductValue<A, B>): boolean {
        const joinABC = this.join(this.join(a, b), c);
        const joinABC2 = this.join(a, this.join(b, c));
        return this.equals(joinABC, joinABC2);
    }

    isIdempotent(a: ProductValue<A, B>): boolean {
        return this.equals(this.join(a, a), a);
    }
}
