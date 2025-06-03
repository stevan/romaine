import { PermissionSystem } from '../../src/examples/PermissionSystem';

describe('PermissionSystem', () => {
    let rbac: PermissionSystem;

    beforeEach(() => {
        rbac = new PermissionSystem();

        // Set up common roles
        rbac.defineRole('reader', new Set(['read']));
        rbac.defineRole('editor', new Set(['read', 'write']));
        rbac.defineRole('admin', new Set(['read', 'write', 'delete']));

        // Set up resources
        rbac.defineResource('public_doc', new Set(['read']));
        rbac.defineResource('team_doc', new Set(['read', 'write']));
        rbac.defineResource('secret_doc', new Set(['read', 'write', 'delete']));
    });

    test('users with appropriate roles can access resources', () => {
        // Set up users with different roles
        rbac.assignRole('alice', 'reader');
        rbac.assignRole('bob', 'editor');
        rbac.assignRole('carol', 'admin');

        // Reader permissions
        expect(rbac.canAccess('alice', 'public_doc')).toBe(true);
        expect(rbac.canAccess('alice', 'team_doc')).toBe(false);
        expect(rbac.canAccess('alice', 'secret_doc')).toBe(false);

        // Editor permissions
        expect(rbac.canAccess('bob', 'public_doc')).toBe(true);
        expect(rbac.canAccess('bob', 'team_doc')).toBe(true);
        expect(rbac.canAccess('bob', 'secret_doc')).toBe(false);

        // Admin permissions
        expect(rbac.canAccess('carol', 'public_doc')).toBe(true);
        expect(rbac.canAccess('carol', 'team_doc')).toBe(true);
        expect(rbac.canAccess('carol', 'secret_doc')).toBe(true);
    });

    test('users can have multiple roles', () => {
        rbac.assignRole('dave', 'reader');
        rbac.assignRole('dave', 'editor');

        // Should have combined permissions of both roles
        expect(rbac.listUserPermissions('dave')).toEqual(new Set(['read', 'write']));
        expect(rbac.canAccess('dave', 'team_doc')).toBe(true);
    });

    test('handles non-existent users and resources', () => {
        // Non-existent user has no permissions
        expect(rbac.canAccess('unknown', 'public_doc')).toBe(false);

        // Non-existent resource throws error
        expect(() => {
            rbac.canAccess('alice', 'nonexistent_doc')
        }).toThrow('Resource nonexistent_doc does not exist');
    });

    test('handles invalid role assignments', () => {
        expect(() => {
            rbac.assignRole('eve', 'nonexistent_role')
        }).toThrow('Role nonexistent_role does not exist');
    });
});
