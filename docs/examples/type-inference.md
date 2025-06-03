# Type Inference

The Type Inference example demonstrates how lattices can model type relationships and inference rules in a programming language. This implementation shows how different lattice types can work together to build a simple but extensible type system. Implementation available in `src/examples/TypeInference.ts`.

## Overview
A basic type inference system that uses lattices to track possible types for variables and expressions. The system combines PowersetLattice for tracking type possibilities and ScalarLattice for modeling type hierarchies.

## Implementation Details

- **PowersetLattice**: Used for tracking possible types
  - Universe: All possible types in the system
  - Each variable has a PowersetLattice of possible types
  - Type inference produces PowersetLattice results

- **ScalarLattice**: Used for type hierarchy relationships
  - Models subtype relationships
  - Handles special types like 'any' and 'never'
  - Supports type compatibility checking

## Key Features

1. **Type Inference**:
   - Automatic type detection from literals
   - Support for multiple possible types
   - Type inference for operations (e.g., addition)

2. **Type Operations**:
   - Addition type rules:
     - number + number → number
     - string + any → string
     - any + string → string
   - Comparison operations → boolean
   - Support for union types

3. **Type Hierarchy**:
   - Special type handling ('any', 'never')
   - Basic subtype relationships
   - Type compatibility checking

4. **Type Safety**:
   - Tracks all possible types for expressions
   - Prevents invalid type assignments
   - Handles undefined variables safely

## Implementation Example
```typescript
// Define variables with types
typeSystem.defineLiteral('num', 42);
typeSystem.defineLiteral('str', 'hello');
typeSystem.defineVariable('strOrNum', new Set(['string', 'number']));

// Type inference for operations
const additionType = typeSystem.inferAddition('num', 'str');
const comparisonType = typeSystem.inferComparison('num', 'str');

// Type checking
if (typeSystem.canAssign('strOrNum', 'number')) {
    console.log('Assignment is valid');
}
```

## Usage
```typescript
// Create a new type system
const typeSystem = new TypeInference();

// Define some variables with known types
typeSystem.defineLiteral('age', 25);
typeSystem.defineLiteral('name', 'Alice');
typeSystem.defineVariable('input', new Set(['string', 'number']));

// Check inferred types
console.log(typeSystem.getPossibleTypes('age'));     // Set(['number'])
console.log(typeSystem.getPossibleTypes('name'));    // Set(['string'])
console.log(typeSystem.getPossibleTypes('input'));   // Set(['string', 'number'])

// Check operation types
console.log(typeSystem.inferAddition('age', 'name')); // Set(['string'])
console.log(typeSystem.inferComparison('age', 'input')); // Set(['boolean'])

// Verify type assignments
console.log(typeSystem.canAssign('age', 'number'));  // true
console.log(typeSystem.canAssign('input', 'string')); // true
console.log(typeSystem.canAssign('name', 'number')); // false
```
