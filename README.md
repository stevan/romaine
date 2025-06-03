# Romaine

A TypeScript implementation of lattice-based data structures, focusing on mathematical correctness and type safety.

## Features

- Generic implementation of join-semilattices
- Type-safe scalar values with Known/Unknown states
- Mathematically verified properties (commutativity, associativity, idempotence)
- Mutable and immutable operations
- Comprehensive test suite

## Installation

```bash
npm install romaine
```

## Usage

```typescript
import { ScalarLattice, Known, Unknown } from 'romaine';

// Create a new lattice with a known value
const lattice = new ScalarLattice<number>(Known(10));

// Join with other values
lattice.mutatingJoin(Unknown());
console.log(lattice.contents); // { type: 'KNOWN', value: 10 }

lattice.mutatingJoin(Known(20));
console.log(lattice.contents); // { type: 'KNOWN', value: 20 }
```

## Mathematical Properties

The implementation guarantees the following lattice properties:

1. **Partial Order**: For all a, b: a ≤ b iff join(a,b) = b
2. **Commutativity**: For all a, b: join(a,b) = join(b,a)
3. **Associativity**: For all a, b, c: join(join(a,b),c) = join(a,join(b,c))
4. **Idempotence**: For all a: join(a,a) = a

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## License

MIT
