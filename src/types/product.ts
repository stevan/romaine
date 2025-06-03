/**
 * Represents a pair of values from two different lattices.
 * Used to construct product lattices where elements are ordered component-wise.
 */
export interface ProductValue<A, B> {
    first: A;
    second: B;
}

/**
 * Creates a new product value from two components.
 */
export function createProduct<A, B>(first: A, second: B): ProductValue<A, B> {
    return { first, second };
}
