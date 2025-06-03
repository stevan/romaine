import { IntervalLattice } from '../src';
import { Interval, createInterval } from '../src/types/interval';

/**
 * Test suite for verifying the mathematical properties of IntervalLattice
 */
function testLatticeProperties(lattice: IntervalLattice, examples: Array<Parameters<typeof lattice.join>[0]>): void {
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

describe('IntervalLattice', () => {
    let lattice: IntervalLattice;
    const examples: (Interval | null)[] = [
        null,                       // empty interval (bottom)
        createInterval(0, 0),       // point interval
        createInterval(0, 1),       // unit interval
        createInterval(-1, 1),      // symmetric interval
        createInterval(-10, 10),    // large interval
    ];

    beforeEach(() => {
        lattice = new IntervalLattice(createInterval(0, 1));
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
            lattice.mutatingJoin(createInterval(1, 2));
            expect(lattice.version).toBe(initialVersion + 1);
        });

        test('version stays same on no change', () => {
            const initialVersion = lattice.version;
            lattice.mutatingJoin(createInterval(0, 1));
            expect(lattice.version).toBe(initialVersion);
        });

        test('joining expands interval', () => {
            lattice.mutatingJoin(createInterval(2, 3));
            expect(lattice.contents).toEqual(createInterval(0, 3));
        });
    });

    describe('Lattice Operations', () => {
        test('bottom element is null', () => {
            expect(lattice.bottom).toBeNull();
        });

        test('no top element exists', () => {
            expect(lattice.top).toBeUndefined();
        });

        test('inclusion ordering works correctly', () => {
            const small = createInterval(0, 1);
            const medium = createInterval(-1, 2);
            const large = createInterval(-2, 3);

            expect(lattice.lessThanOrEqual(small, medium)).toBe(true);
            expect(lattice.lessThanOrEqual(medium, large)).toBe(true);
            expect(lattice.lessThanOrEqual(small, large)).toBe(true);
            expect(lattice.lessThanOrEqual(large, small)).toBe(false);
        });

        test('join creates smallest containing interval', () => {
            const a = createInterval(0, 1);
            const b = createInterval(2, 3);
            const expected = createInterval(0, 3);
            expect(lattice.join(a, b)).toEqual(expected);
        });

        test('equality checks work correctly', () => {
            const a = createInterval(0, 1);
            const b = createInterval(0, 1);
            const c = createInterval(0, 2);
            expect(lattice.equals(a, b)).toBe(true);
            expect(lattice.equals(a, c)).toBe(false);
        });
    });

    describe('Additional Interval Operations', () => {
        test('intersects works correctly', () => {
            const a = createInterval(0, 2);
            const b = createInterval(1, 3);
            const c = createInterval(3, 4);

            expect(lattice.intersects(a, b)).toBe(true);
            expect(lattice.intersects(b, c)).toBe(true);
            expect(lattice.intersects(a, c)).toBe(false);
        });

        test('contains works correctly', () => {
            const interval = createInterval(0, 2);

            expect(lattice.contains(interval, 0)).toBe(true);
            expect(lattice.contains(interval, 1)).toBe(true);
            expect(lattice.contains(interval, 2)).toBe(true);
            expect(lattice.contains(interval, -1)).toBe(false);
            expect(lattice.contains(interval, 3)).toBe(false);
        });

        test('invalid intervals throw error', () => {
            expect(() => new IntervalLattice({ min: 2, max: 1 })).toThrow();
            expect(() => createInterval(2, 1)).toThrow();
        });
    });

    describe('Defensive Copying', () => {
        test('contents getter returns defensive copy', () => {
            const interval = createInterval(0, 1);
            const lattice = new IntervalLattice(interval);

            // Get contents and modify it
            const contents = lattice.contents;
            if (contents) {
                contents.min = -1;
                contents.max = 2;
            }

            // Original should be unchanged
            expect(lattice.contents).toEqual(createInterval(0, 1));
        });
    });

    describe('Ordering Edge Cases', () => {
        test('lessThanOrEqual handles edge cases', () => {
            const lattice = new IntervalLattice(createInterval(0, 1));

            // Empty interval (null) is less than everything
            expect(lattice.lessThanOrEqual(null, createInterval(0, 1))).toBe(true);
            expect(lattice.lessThanOrEqual(null, null)).toBe(true);

            // Non-empty interval is not less than empty interval
            expect(lattice.lessThanOrEqual(createInterval(0, 1), null)).toBe(false);

            // Point intervals
            expect(lattice.lessThanOrEqual(
                createInterval(1, 1),
                createInterval(0, 2)
            )).toBe(true);

            // Equal bounds
            expect(lattice.lessThanOrEqual(
                createInterval(0, 1),
                createInterval(0, 1)
            )).toBe(true);

            // Touching intervals
            expect(lattice.lessThanOrEqual(
                createInterval(1, 2),
                createInterval(0, 2)
            )).toBe(true);
        });

        test('equals handles edge cases', () => {
            const lattice = new IntervalLattice(createInterval(0, 1));

            // Empty intervals
            expect(lattice.equals(null, null)).toBe(true);
            expect(lattice.equals(null, createInterval(0, 1))).toBe(false);
            expect(lattice.equals(createInterval(0, 1), null)).toBe(false);

            // Point intervals
            expect(lattice.equals(
                createInterval(1, 1),
                createInterval(1, 1)
            )).toBe(true);

            // Different intervals with same bounds
            expect(lattice.equals(
                createInterval(0, 1),
                createInterval(0, 1)
            )).toBe(true);
        });
    });

    describe('Additional Operations Edge Cases', () => {
        test('intersects handles edge cases', () => {
            const lattice = new IntervalLattice(createInterval(0, 1));

            // Empty intervals never intersect
            expect(lattice.intersects(null, createInterval(0, 1))).toBe(false);
            expect(lattice.intersects(createInterval(0, 1), null)).toBe(false);
            expect(lattice.intersects(null, null)).toBe(false);

            // Point intervals
            expect(lattice.intersects(
                createInterval(1, 1),
                createInterval(1, 2)
            )).toBe(true);

            // Touching intervals
            expect(lattice.intersects(
                createInterval(0, 1),
                createInterval(1, 2)
            )).toBe(true);

            // Non-intersecting intervals
            expect(lattice.intersects(
                createInterval(0, 1),
                createInterval(2, 3)
            )).toBe(false);
        });

        test('contains handles edge cases', () => {
            const lattice = new IntervalLattice(createInterval(0, 1));

            // Empty interval contains nothing
            expect(lattice.contains(null, 0)).toBe(false);

            // Point interval contains its point
            expect(lattice.contains(createInterval(1, 1), 1)).toBe(true);

            // Interval bounds
            const interval = createInterval(0, 1);
            expect(lattice.contains(interval, 0)).toBe(true);  // Lower bound
            expect(lattice.contains(interval, 1)).toBe(true);  // Upper bound
            expect(lattice.contains(interval, 0.5)).toBe(true);  // Middle
            expect(lattice.contains(interval, -0.1)).toBe(false);  // Below
            expect(lattice.contains(interval, 1.1)).toBe(false);  // Above
        });
    });
});
