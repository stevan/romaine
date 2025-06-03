# Permission System

The Permission System demonstrates how lattices can model Role-Based Access Control (RBAC) systems. This example shows how PowersetLattice can elegantly handle permission sets and role assignments. Implementation available in `src/examples/PermissionSystem.ts`.

## Overview
A basic RBAC system manages access to resources through roles and permissions. The system uses PowersetLattice to track both role permissions and user-role assignments, ensuring consistent and mathematically sound access control.

## Implementation Details

- **PowersetLattice**: Used for tracking sets of permissions and roles
  - Universe: All possible permissions/roles in the system
  - Each role is a PowersetLattice of permissions
  - Each user has a PowersetLattice of assigned roles
  - Resources define required permissions using PowersetLattice

## Key Features

1. **Role Management**:
   - Define roles with specific permission sets
   - Roles can have overlapping permissions
   - Permission sets form a natural lattice structure

2. **User-Role Assignment**:
   - Users can have multiple roles
   - Permissions combine through role assignments
   - Role assignments tracked in PowersetLattice

3. **Resource Access Control**:
   - Resources specify required permissions
   - Access granted if user's permissions are a superset
   - Efficient permission checking using lattice operations

4. **Permission Propagation**:
   - Changes to role permissions automatically propagate
   - User permissions updated through lattice operations
   - Consistent access control across the system

## Implementation Example
```typescript
// Define roles with permissions
rbac.defineRole('reader', new Set(['read']));
rbac.defineRole('editor', new Set(['read', 'write']));
rbac.defineRole('admin', new Set(['read', 'write', 'delete']));

// Assign roles to users
rbac.assignRole('alice', 'reader');
rbac.assignRole('bob', 'editor');

// Define resource requirements
rbac.defineResource('document', new Set(['read', 'write']));

// Check access
if (rbac.canAccess('bob', 'document')) {
    console.log('Access granted');
}
```

## Usage
```typescript
// Create a new RBAC system
const rbac = new PermissionSystem();

// Set up roles and permissions
rbac.defineRole('reader', new Set(['read']));
rbac.defineRole('editor', new Set(['read', 'write']));

// Assign roles to users
rbac.assignRole('alice', 'reader');
rbac.assignRole('bob', 'editor');

// Define resource access requirements
rbac.defineResource('public_doc', new Set(['read']));
rbac.defineResource('team_doc', new Set(['read', 'write']));

// Check access permissions
console.log(rbac.canAccess('alice', 'public_doc')); // true
console.log(rbac.canAccess('alice', 'team_doc')); // false
console.log(rbac.canAccess('bob', 'team_doc')); // true
```
