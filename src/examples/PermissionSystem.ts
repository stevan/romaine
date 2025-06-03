import { PowersetLattice } from '../implementations/PowersetLattice';

/**
 * A basic Role-Based Access Control (RBAC) system using lattice theory.
 * Uses PowersetLattice to model sets of permissions and roles.
 */
export class PermissionSystem {
    // Role name -> Set of permissions
    private roles: Map<string, PowersetLattice<string>>;

    // Username -> Set of roles
    private userRoles: Map<string, PowersetLattice<string>>;

    // Resource name -> Set of required permissions
    private resourcePermissions: Map<string, PowersetLattice<string>>;

    // Track all known permissions for lattice universe
    private allPermissions: Set<string>;
    // Track all known roles for lattice universe
    private allRoles: Set<string>;

    constructor() {
        this.roles = new Map();
        this.userRoles = new Map();
        this.resourcePermissions = new Map();
        this.allPermissions = new Set();
        this.allRoles = new Set();
    }

    /**
     * Define a new role with its set of permissions
     */
    defineRole(role: string, permissions: Set<string>): void {
        // Add to known roles
        this.allRoles.add(role);

        // Add to known permissions
        permissions.forEach(p => this.allPermissions.add(p));

        // Create lattice for role's permissions
        this.roles.set(
            role,
            new PowersetLattice(permissions, this.allPermissions)
        );
    }

    /**
     * Assign a role to a user
     */
    assignRole(username: string, role: string): void {
        if (!this.roles.has(role)) {
            throw new Error(`Role ${role} does not exist`);
        }

        // Get or create user's role set
        const currentRoles = this.userRoles.get(username)?.contents || new Set<string>();
        currentRoles.add(role);

        this.userRoles.set(
            username,
            new PowersetLattice(currentRoles, this.allRoles)
        );
    }

    /**
     * Define required permissions for a resource
     */
    defineResource(resource: string, requiredPermissions: Set<string>): void {
        // Add to known permissions
        requiredPermissions.forEach(p => this.allPermissions.add(p));

        this.resourcePermissions.set(
            resource,
            new PowersetLattice(requiredPermissions, this.allPermissions)
        );
    }

    /**
     * Get all permissions granted to a user through their roles
     */
    private getUserPermissions(username: string): PowersetLattice<string> {
        const userRoleLattice = this.userRoles.get(username);
        if (!userRoleLattice) {
            return new PowersetLattice(new Set(), this.allPermissions);
        }

        // Combine permissions from all roles
        const permissions = new Set<string>();
        userRoleLattice.contents.forEach(role => {
            const rolePerms = this.roles.get(role)?.contents || new Set();
            rolePerms.forEach(p => permissions.add(p));
        });

        return new PowersetLattice(permissions, this.allPermissions);
    }

    /**
     * Check if a user can access a resource
     */
    canAccess(username: string, resource: string): boolean {
        const resourcePerms = this.resourcePermissions.get(resource);
        if (!resourcePerms) {
            throw new Error(`Resource ${resource} does not exist`);
        }

        const userPerms = this.getUserPermissions(username);

        // User can access if their permissions are a superset of required permissions
        // This is equivalent to checking if resource permissions ≤ user permissions in the lattice
        return resourcePerms.contents.size <= userPerms.contents.size &&
               Array.from(resourcePerms.contents).every(p => userPerms.contents.has(p));
    }

    /**
     * List all permissions a user has
     */
    listUserPermissions(username: string): Set<string> {
        return this.getUserPermissions(username).contents;
    }
}
