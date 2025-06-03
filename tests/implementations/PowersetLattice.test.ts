import { PowersetLattice } from '../../src';

/**
 * Test suite for verifying the mathematical properties of PowersetLattice
 */
function testLatticeProperties<T>(lattice: PowersetLattice<T>, examples: Array<Parameters<typeof lattice.join>[0]>): void {
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

describe('PowersetLattice', () => {
    let lattice: PowersetLattice<number>;
    const universe = new Set([1, 2, 3]);
    const examples = [
        new Set<number>(), // empty set
        new Set([1]),     // singleton
        new Set([1, 2]),  // pair
        new Set([1, 2, 3]) // full set
    ];

    beforeEach(() => {
        lattice = new PowersetLattice<number>(new Set([1]), universe);
    });

    describe('Mathematical Properties', () => {
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

    describe('Mutable Operations', () => {
        test('version increments on change', () => {
            const initialVersion = lattice.version;
            lattice.mutatingJoin(new Set([2]));
            expect(lattice.version).toBe(initialVersion + 1);
        });

        test('version stays same on no change', () => {
            const initialVersion = lattice.version;
            lattice.mutatingJoin(new Set([1]));
            expect(lattice.version).toBe(initialVersion);
        });

        test('joining preserves existing elements', () => {
            const initialSet = new Set([1]);
            lattice.mutatingJoin(new Set([2]));
            expect(lattice.contents).toEqual(new Set([1, 2]));
        });
    });

    describe('Lattice Operations', () => {
        test('bottom element is empty set', () => {
            expect(lattice.bottom).toEqual(new Set());
        });

        test('top element is universe', () => {
            expect(lattice.top).toEqual(universe);
        });

        test('subset ordering works correctly', () => {
            const empty = new Set<number>();
            const singleton = new Set([1]);
            const pair = new Set([1, 2]);

            expect(lattice.lessThanOrEqual(empty, singleton)).toBe(true);
            expect(lattice.lessThanOrEqual(singleton, pair)).toBe(true);
            expect(lattice.lessThanOrEqual(empty, pair)).toBe(true);
            expect(lattice.lessThanOrEqual(pair, singleton)).toBe(false);
        });

        test('join is set union', () => {
            const a = new Set([1]);
            const b = new Set([2]);
            const expected = new Set([1, 2]);
            expect(lattice.join(a, b)).toEqual(expected);
        });

        test('equality checks work correctly', () => {
            const a = new Set([1, 2]);
            const b = new Set([1, 2]);
            const c = new Set([1, 3]);
            expect(lattice.equals(a, b)).toBe(true);
            expect(lattice.equals(a, c)).toBe(false);
        });
    });
});
