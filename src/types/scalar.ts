/**
 * Core type definitions for scalar values that can be either known or unknown
 */

export type Unknown<T> = { type: 'UNKNOWN' }
export type Known<T> = { type: 'KNOWN', value: T }
export type Scalar<T> = Known<T> | Unknown<T>

// Type guards
export function isUnknown<T>(s: Scalar<T>): s is Unknown<T> { return s.type === 'UNKNOWN' }
export function isKnown<T>(s: Scalar<T>): s is Known<T> { return s.type === 'KNOWN' }

// Constructors
export function Known<T>(v: T): Scalar<T> { return { type: 'KNOWN', value: v } }
export function Unknown<T>(): Scalar<T> { return { type: 'UNKNOWN' } }
