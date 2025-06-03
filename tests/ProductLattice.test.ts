import { ProductLattice, PowersetLattice, IntervalLattice } from '../src';
import { ProductValue, createProduct } from '../src/types/product';
import { Interval, createInterval } from '../src/types/interval';

/**
 * Test suite for verifying the mathematical properties of ProductLattice
 */
function testLatticeProperties<A, B>(lattice: ProductLattice<A, B>, examples: Array<Parameters<typeof lattice.join>[0]>): void {
    describe('Lattice Properties', () => {
        test('commutativity', () => {
            for (const a of examples) {
                for (const b of examples) {
                    expect(lattice.isCommutative(a, b)).toBe(true);
                }
            }
        });

        test('associativity', () => {
            for (const a of examples) {
                for (const b of examples) {
                    for (const c of examples) {
                        expect(lattice.isAssociative(a, b, c)).toBe(true);
                    }
                }
            }
        });

        test('idempotence', () => {
            for (const a of examples) {
                expect(lattice.isIdempotent(a)).toBe(true);
            }
        });
    });
}

describe('ProductLattice', () => {
    // We'll test with a product of PowersetLattice and IntervalLattice
    let setLattice: PowersetLattice<number>;
    let intervalLattice: IntervalLattice;
    let productLattice: ProductLattice<Set<number>, Interval | null>;

    const universe = new Set([1, 2, 3]);
    const examples: ProductValue<Set<number>, Interval | null>[] = [
        createProduct(new Set(), null),                              // (⊥,⊥)
        createProduct(new Set([1]), createInterval(0, 1)),          // singleton set, unit interval
        createProduct(new Set([1, 2]), createInterval(-1, 1)),      // pair set, symmetric interval
        createProduct(universe, createInterval(-10, 10)),            // full set, large interval
    ];

    beforeEach(() => {
        setLattice = new PowersetLattice(new Set([1]), universe);
        intervalLattice = new IntervalLattice(createInterval(0, 1));
        productLattice = new ProductLattice(
            createProduct(new Set([1]), createInterval(0, 1)),
            setLattice,
            intervalLattice
        );
    });

    describe('Mathematical Properties', () => {
        test('commutativity', () => {
            for (const a of examples) {
                for (const b of examples) {
                    expect(productLattice.isCommutative(a, b)).toBe(true);
                }
            }
        });

        test('associativity', () => {
            for (const a of examples) {
                for (const b of examples) {
                    for (const c of examples) {
                        expect(productLattice.isAssociative(a, b, c)).toBe(true);
                    }
                }
            }
        });

        test('idempotence', () => {
            for (const a of examples) {
                expect(productLattice.isIdempotent(a)).toBe(true);
            }
        });
    });

    describe('Mutable Operations', () => {
        test('version increments on change', () => {
            const initialVersion = productLattice.version;
            productLattice.mutatingJoin(createProduct(new Set([2]), createInterval(1, 2)));
            expect(productLattice.version).toBe(initialVersion + 1);
        });

        test('version stays same on no change', () => {
            const initialVersion = productLattice.version;
            productLattice.mutatingJoin(createProduct(new Set([1]), createInterval(0, 1)));
            expect(productLattice.version).toBe(initialVersion);
        });

        test('joining preserves existing elements', () => {
            const initial = productLattice.contents;
            productLattice.mutatingJoin(createProduct(new Set([2]), createInterval(1, 2)));
            expect(productLattice.contents.first.has(1)).toBe(true);
            expect(productLattice.contents.second?.min).toBe(0);
        });
    });

    describe('Lattice Operations', () => {
        test('bottom element is product of bottoms', () => {
            const bottom = productLattice.bottom;
            expect(bottom.first).toEqual(new Set());
            expect(bottom.second).toBeNull();
        });

        test('top element is undefined when any component has no top', () => {
            // IntervalLattice has no top element, so the product should have no top
            const top = productLattice.top;
            expect(top).toBeUndefined();
        });

        test('component-wise ordering works correctly', () => {
            const a = createProduct(new Set([1]), createInterval(0, 1));
            const b = createProduct(new Set([1, 2]), createInterval(-1, 2));
            const c = createProduct(new Set([1, 2, 3]), createInterval(-2, 3));

            expect(productLattice.lessThanOrEqual(a, b)).toBe(true);
            expect(productLattice.lessThanOrEqual(b, c)).toBe(true);
            expect(productLattice.lessThanOrEqual(a, c)).toBe(true);
            expect(productLattice.lessThanOrEqual(c, a)).toBe(false);
        });

        test('join is component-wise', () => {
            const a = createProduct(new Set([1]), createInterval(0, 1));
            const b = createProduct(new Set([2]), createInterval(1, 2));
            const result = productLattice.join(a, b);

            expect(result.first).toEqual(new Set([1, 2]));
            expect(result.second).toEqual(createInterval(0, 2));
        });

        test('equality checks work correctly', () => {
            const a = createProduct(new Set([1, 2]), createInterval(0, 1));
            const b = createProduct(new Set([1, 2]), createInterval(0, 1));
            const c = createProduct(new Set([1, 3]), createInterval(0, 2));

            expect(productLattice.equals(a, b)).toBe(true);
            expect(productLattice.equals(a, c)).toBe(false);
        });
    });

    describe('Top Element Cases', () => {
        test('top is undefined when any component has no top', () => {
            // IntervalLattice has no top element
            const intervalLattice = new IntervalLattice(createInterval(0, 1));

            // PowersetLattice has a top element (universe)
            const setLattice = new PowersetLattice(new Set([1]), universe);

            // Product with one topless lattice
            const productLattice1 = new ProductLattice(
                createProduct(new Set([1]), createInterval(0, 1)),
                setLattice,
                intervalLattice
            );
            expect(productLattice1.top).toBeUndefined();

            // Product with both lattices having tops
            const setLattice2 = new PowersetLattice(new Set([1]), new Set([1, 2]));
            const productLattice2 = new ProductLattice(
                createProduct(new Set([1]), new Set([1])),
                setLattice,
                setLattice2
            );
            expect(productLattice2.top).toEqual(
                createProduct(universe, new Set([1, 2]))
            );
        });
    });
});
