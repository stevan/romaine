import { ScalarLattice, Known, Unknown, Conflict } from '../src';

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
        Known(20),
        Conflict(10, 20)
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
        test('version increments on conflict', () => {
            const initialVersion = lattice.version;
            lattice.mutatingJoin(Known(20));
            expect(lattice.version).toBe(initialVersion + 1);
            expect(lattice.contents).toEqual(Conflict(10, 20));
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

        test('joining with Conflict preserves Conflict', () => {
            const conflict = Conflict(10, 20);
            lattice.mutatingJoin(conflict);
            expect(lattice.contents).toEqual(conflict);

            // Further joins should not change the Conflict state
            lattice.mutatingJoin(Known(30));
            expect(lattice.contents).toEqual(conflict);
        });
    });

    describe('Lattice Operations', () => {
        test('bottom element is Unknown', () => {
            expect(lattice.bottom).toEqual(Unknown());
        });

        test('top element exists and is Conflict', () => {
            const lattice = new ScalarLattice<number>(Known(10));
            expect(lattice.top).toEqual(Conflict(10, 10));
        });

        test('Unknown is less than everything', () => {
            const unknown = Unknown<number>();
            const known = Known(10);
            const conflict = Conflict(10, 20);

            expect(lattice.lessThanOrEqual(unknown, known)).toBe(true);
            expect(lattice.lessThanOrEqual(unknown, conflict)).toBe(true);
            expect(lattice.lessThanOrEqual(known, unknown)).toBe(false);
        });

        test('Known values maintain original ordering', () => {
            const a = Known(10);
            const b = Known(10);
            const c = Known(20);
            expect(lattice.lessThanOrEqual(a, b)).toBe(true);
            expect(lattice.lessThanOrEqual(a, c)).toBe(false);
            expect(lattice.lessThanOrEqual(c, a)).toBe(false);
        });

        test('Conflict is greater than everything', () => {
            const conflict = Conflict(10, 20);
            const known = Known(10);
            const unknown = Unknown<number>();

            expect(lattice.lessThanOrEqual(known, conflict)).toBe(true);
            expect(lattice.lessThanOrEqual(unknown, conflict)).toBe(true);
            expect(lattice.lessThanOrEqual(conflict, known)).toBe(false);
            expect(lattice.lessThanOrEqual(conflict, unknown)).toBe(false);
        });

        test('joining incomparable Known values creates Conflict', () => {
            expect(lattice.join(Known(10), Known(20))).toEqual(Conflict(10, 20));
        });

        test('joining with Conflict preserves Conflict', () => {
            const conflict = Conflict(10, 20);
            expect(lattice.join(conflict, Known(30))).toEqual(conflict);
            expect(lattice.join(Known(30), conflict)).toEqual(conflict);
        });
    });

    describe('Equality Edge Cases', () => {
        test('equals handles all type combinations', () => {
            // Unknown with Unknown
            expect(lattice.equals(Unknown(), Unknown())).toBe(true);

            // Unknown with Known/Conflict
            expect(lattice.equals(Unknown(), Known(10))).toBe(false);
            expect(lattice.equals(Unknown(), Conflict(10, 20))).toBe(false);

            // Known with Known
            expect(lattice.equals(Known(10), Known(10))).toBe(true);
            expect(lattice.equals(Known(10), Known(20))).toBe(false);

            // Conflict with Conflict (order shouldn't matter)
            expect(lattice.equals(Conflict(10, 20), Conflict(10, 20))).toBe(true);
            expect(lattice.equals(Conflict(10, 20), Conflict(20, 10))).toBe(true);
            expect(lattice.equals(Conflict(10, 20), Conflict(20, 30))).toBe(false);

            // Special numeric values
            expect(lattice.equals(Known(NaN), Known(NaN))).toBe(false);
            expect(lattice.equals(Known(Infinity), Known(Infinity))).toBe(true);
            expect(lattice.equals(Known(-Infinity), Known(-Infinity))).toBe(true);
        });
    });

    describe('Error Handling', () => {
        test('join handles invalid lattice elements', () => {
            const invalidScalar = { type: 'INVALID' } as any;
            expect(() => lattice.join(invalidScalar, Known(10))).toThrow('Invalid lattice elements');
            expect(() => lattice.join(Known(10), invalidScalar)).toThrow('Invalid lattice elements');
        });
    });
});
