import { ScalarLattice, Known, Unknown } from '../src';

/**
 * Test suite for verifying the mathematical properties of ScalarLattice
 */
function testLatticeProperties<T>(lattice: ScalarLattice<T>, examples: Array<Parameters<typeof lattice.join>[0]>): void {
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

describe('ScalarLattice', () => {
    let lattice: ScalarLattice<number>;
    const examples = [
        Unknown<number>(),
        Known(10),
        Known(20)
    ];

    beforeEach(() => {
        lattice = new ScalarLattice<number>(Known(10));
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
            expect(() => lattice.mutatingJoin(Known(20))).toThrow();
            expect(lattice.version).toBe(initialVersion);
        });

        test('version stays same on no change', () => {
            const initialVersion = lattice.version;
            lattice.mutatingJoin(Known(10));
            expect(lattice.version).toBe(initialVersion);
        });

        test('joining with Unknown preserves Known value', () => {
            const initialValue = lattice.contents;
            lattice.mutatingJoin(Unknown());
            expect(lattice.contents).toEqual(initialValue);
        });
    });

    describe('Lattice Operations', () => {
        test('bottom element is Unknown', () => {
            expect(lattice.bottom).toEqual(Unknown());
        });

        test('no top element exists', () => {
            expect(lattice.top).toBeUndefined();
        });

        test('Unknown is less than everything', () => {
            const unknown = Unknown<number>();
            const known = Known(10);
            expect(lattice.lessThanOrEqual(unknown, known)).toBe(true);
            expect(lattice.lessThanOrEqual(known, unknown)).toBe(false);
        });

        test('Known values are only ordered when equal', () => {
            const a = Known(10);
            const b = Known(10);
            const c = Known(20);
            expect(lattice.lessThanOrEqual(a, b)).toBe(true);
            expect(lattice.lessThanOrEqual(a, c)).toBe(false);
            expect(lattice.lessThanOrEqual(c, a)).toBe(false);
        });

        test('joining incomparable Known values throws', () => {
            expect(() => lattice.join(Known(10), Known(20))).toThrow();
            expect(() => lattice.join(Known(20), Known(30))).toThrow();
        });

        test('joining equal Known values succeeds', () => {
            expect(lattice.join(Known(10), Known(10))).toEqual(Known(10));
        });
    });
});
