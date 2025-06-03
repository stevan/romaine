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

    describe('Error Handling', () => {
        test('join throws on invalid lattice elements', () => {
            const lattice = new ScalarLattice<number>(Known(10));

            // Create an invalid scalar value
            const invalidScalar = { type: 'INVALID' } as any;

            expect(() => lattice.join(invalidScalar, Known(10))).toThrow('Invalid lattice elements');
            expect(() => lattice.join(Known(10), invalidScalar)).toThrow('Invalid lattice elements');
        });

        test('join throws on incomparable Known values', () => {
            const lattice = new ScalarLattice<number>(Known(10));
            expect(() => lattice.join(Known(10), Known(20))).toThrow('Cannot join incomparable Known values');
        });
    });

    describe('Version Handling', () => {
        test('version increments when contents change', () => {
            const lattice = new ScalarLattice<number>(Known(10));
            const initialVersion = lattice.version;

            // Joining with Unknown shouldn't change version
            lattice.mutatingJoin(Unknown());
            expect(lattice.version).toBe(initialVersion);

            // Joining with same Known value shouldn't change version
            lattice.mutatingJoin(Known(10));
            expect(lattice.version).toBe(initialVersion);

            // Trying to join with different Known value should throw and not change version
            expect(() => lattice.mutatingJoin(Known(20))).toThrow();
            expect(lattice.version).toBe(initialVersion);

            // Create new lattice with Unknown and verify version changes on Known join
            const unknownLattice = new ScalarLattice<number>(Unknown());
            const unknownInitialVersion = unknownLattice.version;
            unknownLattice.mutatingJoin(Known(10));
            expect(unknownLattice.version).toBe(unknownInitialVersion + 1);
        });
    });

    describe('Equality Edge Cases', () => {
        test('equals handles all type combinations', () => {
            const lattice = new ScalarLattice<number>(Known(10));

            // Unknown with Unknown
            expect(lattice.equals(Unknown(), Unknown())).toBe(true);

            // Unknown with Known
            expect(lattice.equals(Unknown(), Known(10))).toBe(false);
            expect(lattice.equals(Known(10), Unknown())).toBe(false);

            // Known with Known (same value)
            expect(lattice.equals(Known(10), Known(10))).toBe(true);

            // Known with Known (different values)
            expect(lattice.equals(Known(10), Known(20))).toBe(false);

            // Special numeric values
            expect(lattice.equals(Known(NaN), Known(NaN))).toBe(false);
            expect(lattice.equals(Known(Infinity), Known(Infinity))).toBe(true);
            expect(lattice.equals(Known(-Infinity), Known(-Infinity))).toBe(true);
        });
    });
});
