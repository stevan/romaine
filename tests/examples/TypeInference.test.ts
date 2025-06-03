import { TypeInference, SimpleType } from '../../src/examples/TypeInference';

describe('TypeInference', () => {
    let typeSystem: TypeInference;

    beforeEach(() => {
        typeSystem = new TypeInference();
    });

    describe('Literal Type Inference', () => {
        test('infers types from literals correctly', () => {
            typeSystem.defineLiteral('num', 42);
            typeSystem.defineLiteral('str', 'hello');
            typeSystem.defineLiteral('bool', true);
            typeSystem.defineLiteral('unknown', null);

            expect(typeSystem.getPossibleTypes('num')).toEqual(new Set(['number']));
            expect(typeSystem.getPossibleTypes('str')).toEqual(new Set(['string']));
            expect(typeSystem.getPossibleTypes('bool')).toEqual(new Set(['boolean']));
            expect(typeSystem.getPossibleTypes('unknown')).toEqual(new Set(['any']));
        });
    });

    describe('Variable Type Definition', () => {
        test('handles multiple possible types', () => {
            typeSystem.defineVariable('strOrNum', new Set(['string', 'number']));
            expect(typeSystem.getPossibleTypes('strOrNum')).toEqual(new Set(['string', 'number']));
        });

        test('handles empty type set', () => {
            typeSystem.defineVariable('noType', new Set());
            expect(typeSystem.getPossibleTypes('noType')).toEqual(new Set());
        });
    });

    describe('Operation Type Inference', () => {
        test('infers addition types correctly', () => {
            // Set up variables
            typeSystem.defineVariable('num1', new Set(['number']));
            typeSystem.defineVariable('num2', new Set(['number']));
            typeSystem.defineVariable('str', new Set(['string']));
            typeSystem.defineVariable('any', new Set(['any']));

            // Test number + number
            expect(typeSystem.inferAddition('num1', 'num2')).toEqual(new Set(['number']));

            // Test string + any
            expect(typeSystem.inferAddition('str', 'any')).toEqual(new Set(['string', 'number']));

            // Test any + number
            expect(typeSystem.inferAddition('any', 'num1')).toEqual(new Set(['string', 'number']));
        });

        test('infers comparison types correctly', () => {
            typeSystem.defineVariable('num', new Set(['number']));
            typeSystem.defineVariable('str', new Set(['string']));

            expect(typeSystem.inferComparison('num', 'str')).toEqual(new Set(['boolean']));
        });
    });

    describe('Type Assignment', () => {
        test('checks type assignment compatibility', () => {
            typeSystem.defineVariable('num', new Set(['number']));
            typeSystem.defineVariable('strOrNum', new Set(['string', 'number']));

            // Direct matches
            expect(typeSystem.canAssign('num', 'number')).toBe(true);
            expect(typeSystem.canAssign('num', 'string')).toBe(false);

            // Special types
            expect(typeSystem.canAssign('num', 'any')).toBe(true);
            expect(typeSystem.canAssign('num', 'never')).toBe(false);

            // Multiple possibilities
            expect(typeSystem.canAssign('strOrNum', 'number')).toBe(true);
            expect(typeSystem.canAssign('strOrNum', 'string')).toBe(true);
            expect(typeSystem.canAssign('strOrNum', 'boolean')).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('handles undefined variables', () => {
            expect(typeSystem.getPossibleTypes('undefined_var')).toEqual(new Set());
            expect(typeSystem.canAssign('undefined_var', 'any')).toBe(true);
            expect(typeSystem.inferAddition('undefined_var', 'also_undefined')).toEqual(new Set());
        });

        test('handles empty type sets', () => {
            typeSystem.defineVariable('empty', new Set());
            expect(typeSystem.getPossibleTypes('empty')).toEqual(new Set());
            expect(typeSystem.canAssign('empty', 'any')).toBe(true);
        });
    });
});
