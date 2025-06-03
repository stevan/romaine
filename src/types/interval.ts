/**
 * Represents a closed interval [min, max] on the real number line.
 * An interval is valid if and only if min ≤ max.
 */
export interface Interval {
    min: number;
    max: number;
}

/**
 * Type guard to check if an interval is valid (min ≤ max)
 */
export function isValidInterval(interval: Interval): boolean {
    return interval.min <= interval.max;
}

/**
 * Creates a new interval with the given bounds.
 * Throws an error if min > max.
 */
export function createInterval(min: number, max: number): Interval {
    if (min > max) {
        throw new Error('Invalid interval: min must be less than or equal to max');
    }
    return { min, max };
}
