/**
 * Core type definitions for scalar values that can be either known or unknown
 */

export type Unknown<T> = { type: 'UNKNOWN' }
export type Known<T> = { type: 'KNOWN', value: T }
export type Conflict<T> = { type: 'CONFLICT', values: [T, T] }
export type Scalar<T> = Known<T> | Unknown<T> | Conflict<T>

// Type guards
export function isUnknown<T>(s: Scalar<T>): s is Unknown<T> { return s.type === 'UNKNOWN' }
export function isKnown<T>(s: Scalar<T>): s is Known<T> { return s.type === 'KNOWN' }
export function isConflict<T>(s: Scalar<T>): s is Conflict<T> { return s.type === 'CONFLICT' }

// Constructors
export function Known<T>(v: T): Scalar<T> { return { type: 'KNOWN', value: v } }
export function Unknown<T>(): Scalar<T> { return { type: 'UNKNOWN' } }
export function Conflict<T>(a: T, b: T): Scalar<T> { return { type: 'CONFLICT', values: [a, b] } }
