import { PowersetLattice } from '../implementations/PowersetLattice';
import { ScalarLattice } from '../implementations/ScalarLattice';
import { Known, Unknown } from '../types/scalar';

/**
 * Represents a simple type in our system
 */
export type SimpleType = 'number' | 'string' | 'boolean' | 'any' | 'never';

/**
 * A basic type inference system using lattice theory.
 * Demonstrates how lattices can model type relationships and inference rules.
 */
export class TypeInference {
    // Track subtype relationships (e.g., 'number' is a subtype of 'any')
    private subtypeLattice: ScalarLattice<SimpleType>;

    // Track possible types for expressions
    private typePossibilities: Map<string, PowersetLattice<SimpleType>>;

    // Universe of all possible types
    private readonly ALL_TYPES: Set<SimpleType> = new Set(['number', 'string', 'boolean', 'any', 'never']);

    constructor() {
        this.subtypeLattice = new ScalarLattice<SimpleType>(Unknown());
        this.typePossibilities = new Map();
    }

    /**
     * Define a literal value and infer its type
     */
    defineLiteral(name: string, value: unknown): void {
        let inferredType: SimpleType;

        // Infer type from the literal value
        if (typeof value === 'number') inferredType = 'number';
        else if (typeof value === 'string') inferredType = 'string';
        else if (typeof value === 'boolean') inferredType = 'boolean';
        else inferredType = 'any';

        // Create a PowersetLattice with just the inferred type
        this.typePossibilities.set(
            name,
            new PowersetLattice(new Set([inferredType]), this.ALL_TYPES)
        );
    }

    /**
     * Define a variable that could be multiple types
     */
    defineVariable(name: string, possibleTypes: Set<SimpleType>): void {
        this.typePossibilities.set(
            name,
            new PowersetLattice(possibleTypes, this.ALL_TYPES)
        );
    }

    /**
     * Record that one type is a subtype of another
     */
    defineSubtype(subType: SimpleType, superType: SimpleType): void {
        this.subtypeLattice.mutatingJoin(Known(subType));
        // In a full implementation, we'd track the relationship.
        // For this example, we just demonstrate the concept.
    }

    /**
     * Get possible types for a variable
     */
    getPossibleTypes(name: string): Set<SimpleType> {
        return this.typePossibilities.get(name)?.contents || new Set();
    }

    /**
     * Infer types from an addition operation
     */
    inferAddition(left: string, right: string): Set<SimpleType> {
        const leftTypes = this.getPossibleTypes(left);
        const rightTypes = this.getPossibleTypes(right);

        const result = new Set<SimpleType>();

        // Type inference rules for addition:
        // number + number = number
        // string + any = string
        // any + string = string
        if (leftTypes.has('number') && rightTypes.has('number')) {
            result.add('number');
        }
        if (leftTypes.has('string') || rightTypes.has('string')) {
            result.add('string');
        }
        if (leftTypes.has('any') || rightTypes.has('any')) {
            result.add('string');
            result.add('number');
        }

        return result;
    }

    /**
     * Infer types from a comparison operation
     */
    inferComparison(left: string, right: string): Set<SimpleType> {
        // All comparisons result in boolean
        return new Set(['boolean']);
    }

    /**
     * Check if a variable can be assigned to a type
     */
    canAssign(varName: string, targetType: SimpleType): boolean {
        const varTypes = this.getPossibleTypes(varName);

        // Special cases
        if (targetType === 'any') return true;
        if (targetType === 'never') return false;

        // For this simple example, we only allow exact matches
        // A full implementation would check subtype relationships
        return varTypes.has(targetType);
    }
}
