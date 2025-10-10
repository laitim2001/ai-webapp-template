/**
 * RBAC System Tests
 *
 * Tests for Role-Based Access Control core functionality
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import {
  Role,
  Permission,
  getUserRole,
  getRolePermissions,
  roleHasPermission,
  userHasPermission,
  checkPermission,
  requireRole,
  requirePermission,
  getRolesWithPermission,
  roleInheritsFrom,
  getRoleHierarchy,
  getAllRoles,
  parsePermission,
} from '../rbac';

// Mock database adapter
jest.mock('@/lib/db/database-adapter', () => ({
  databaseAdapter: {
    findUnique: jest.fn(),
  },
}));

import { databaseAdapter } from '@/lib/db/database-adapter';

describe('RBAC System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Role Permissions', () => {
    it('should return all permissions for ADMIN role', () => {
      const permissions = getRolePermissions(Role.ADMIN);

      expect(permissions).toContain(Permission.DELETE_CUSTOMER);
      expect(permissions).toContain(Permission.MANAGE_SYSTEM);
      expect(permissions).toContain(Permission.VIEW_AUDIT_LOG);
      expect(permissions.length).toBeGreaterThan(30);
    });

    it('should return correct permissions for SALES_MANAGER role', () => {
      const permissions = getRolePermissions(Role.SALES_MANAGER);

      expect(permissions).toContain(Permission.CREATE_CUSTOMER);
      expect(permissions).toContain(Permission.DELETE_CUSTOMER);
      expect(permissions).toContain(Permission.APPROVE_WORKFLOW);
      expect(permissions).toContain(Permission.VIEW_AUDIT_LOG);
    });

    it('should return correct permissions for SALES_REP role', () => {
      const permissions = getRolePermissions(Role.SALES_REP);

      expect(permissions).toContain(Permission.CREATE_CUSTOMER);
      expect(permissions).toContain(Permission.READ_CUSTOMER);
      expect(permissions).toContain(Permission.UPDATE_CUSTOMER);
      expect(permissions).not.toContain(Permission.DELETE_CUSTOMER);
      expect(permissions).not.toContain(Permission.APPROVE_WORKFLOW);
    });

    it('should return correct permissions for USER role', () => {
      const permissions = getRolePermissions(Role.USER);

      expect(permissions).toContain(Permission.READ_CUSTOMER);
      expect(permissions).toContain(Permission.READ_KNOWLEDGE);
      expect(permissions).not.toContain(Permission.CREATE_CUSTOMER);
      expect(permissions).not.toContain(Permission.DELETE_CUSTOMER);
    });
  });

  describe('Role Hierarchy', () => {
    it('should verify SALES_MANAGER inherits from SALES_REP', () => {
      const inherits = roleInheritsFrom(Role.SALES_MANAGER, Role.SALES_REP);
      expect(inherits).toBe(true);
    });

    it('should verify SALES_REP inherits from USER', () => {
      const inherits = roleInheritsFrom(Role.SALES_REP, Role.USER);
      expect(inherits).toBe(true);
    });

    it('should verify ADMIN does not inherit from other roles', () => {
      expect(roleInheritsFrom(Role.ADMIN, Role.SALES_MANAGER)).toBe(false);
      expect(roleInheritsFrom(Role.ADMIN, Role.SALES_REP)).toBe(false);
      expect(roleInheritsFrom(Role.ADMIN, Role.USER)).toBe(false);
    });

    it('should return complete hierarchy for SALES_MANAGER', () => {
      const hierarchy = getRoleHierarchy(Role.SALES_MANAGER);

      expect(hierarchy).toContain(Role.SALES_MANAGER);
      expect(hierarchy).toContain(Role.SALES_REP);
      expect(hierarchy).toContain(Role.USER);
      expect(hierarchy.length).toBe(3);
    });

    it('should return single role for ADMIN (no inheritance)', () => {
      const hierarchy = getRoleHierarchy(Role.ADMIN);

      expect(hierarchy).toEqual([Role.ADMIN]);
    });
  });

  describe('Permission Checking', () => {
    it('should correctly identify role has permission', () => {
      expect(roleHasPermission(Role.ADMIN, Permission.MANAGE_SYSTEM)).toBe(true);
      expect(roleHasPermission(Role.SALES_MANAGER, Permission.DELETE_CUSTOMER)).toBe(true);
      expect(roleHasPermission(Role.SALES_REP, Permission.CREATE_CUSTOMER)).toBe(true);
      expect(roleHasPermission(Role.USER, Permission.READ_CUSTOMER)).toBe(true);
    });

    it('should correctly identify role does not have permission', () => {
      expect(roleHasPermission(Role.SALES_REP, Permission.DELETE_CUSTOMER)).toBe(false);
      expect(roleHasPermission(Role.SALES_REP, Permission.MANAGE_SYSTEM)).toBe(false);
      expect(roleHasPermission(Role.USER, Permission.CREATE_CUSTOMER)).toBe(false);
      expect(roleHasPermission(Role.USER, Permission.MANAGE_SYSTEM)).toBe(false);
    });

    it('should handle inherited permissions correctly', () => {
      // SALES_MANAGER inherits SALES_REP permissions
      expect(roleHasPermission(Role.SALES_MANAGER, Permission.CREATE_CUSTOMER)).toBe(true);

      // SALES_REP inherits USER permissions
      expect(roleHasPermission(Role.SALES_REP, Permission.READ_CUSTOMER)).toBe(true);
    });
  });

  describe('User Permission Checking', () => {
    it('should return user role from database', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_MANAGER,
      });

      const role = await getUserRole('user-1');

      expect(role).toBe(Role.SALES_MANAGER);
      expect(databaseAdapter.findUnique).toHaveBeenCalledWith('user', {
        where: { id: 'user-1' },
        select: { role: true },
      });
    });

    it('should return null if user not found', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue(null);

      const role = await getUserRole('non-existent');

      expect(role).toBeNull();
    });

    it('should check user has permission', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_MANAGER,
      });

      const hasPermission = await userHasPermission('user-1', Permission.DELETE_CUSTOMER);

      expect(hasPermission).toBe(true);
    });

    it('should return false if user does not have permission', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_REP,
      });

      const hasPermission = await userHasPermission('user-1', Permission.DELETE_CUSTOMER);

      expect(hasPermission).toBe(false);
    });
  });

  describe('Resource-Level Permissions', () => {
    it('should allow ADMIN to access any resource', async () => {
      (databaseAdapter.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'user-1', role: Role.ADMIN })
        .mockResolvedValueOnce({ id: 'customer-1', ownerId: 'other-user' });

      const canRead = await checkPermission('user-1', 'read', 'customer', 'customer-1');

      expect(canRead).toBe(true);
    });

    it('should allow user to access owned resource', async () => {
      (databaseAdapter.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'user-1', role: Role.SALES_REP })
        .mockResolvedValueOnce({
          id: 'customer-1',
          ownerId: 'user-1',
          assignedUsers: [],
        });

      const canUpdate = await checkPermission('user-1', 'update', 'customer', 'customer-1');

      expect(canUpdate).toBe(true);
    });

    it('should deny user access to non-owned resource', async () => {
      (databaseAdapter.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'user-1', role: Role.SALES_REP })
        .mockResolvedValueOnce({
          id: 'customer-1',
          ownerId: 'other-user',
          assignedUsers: [],
        });

      const canUpdate = await checkPermission('user-1', 'update', 'customer', 'customer-1');

      expect(canUpdate).toBe(false);
    });

    it('should allow user to access assigned resource', async () => {
      (databaseAdapter.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'user-1', role: Role.SALES_REP })
        .mockResolvedValueOnce({
          id: 'customer-1',
          ownerId: 'other-user',
          assignedUsers: ['user-1'],
        });

      const canUpdate = await checkPermission('user-1', 'update', 'customer', 'customer-1');

      expect(canUpdate).toBe(true);
    });
  });

  describe('Role Requirements', () => {
    it('should not throw error for authorized user', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.ADMIN,
      });

      await expect(requireRole('user-1', [Role.ADMIN])).resolves.not.toThrow();
    });

    it('should throw error for unauthorized user', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.USER,
      });

      await expect(requireRole('user-1', [Role.ADMIN])).rejects.toThrow('Unauthorized');
    });

    it('should allow multiple roles', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_MANAGER,
      });

      await expect(
        requireRole('user-1', [Role.ADMIN, Role.SALES_MANAGER])
      ).resolves.not.toThrow();
    });
  });

  describe('Permission Requirements', () => {
    it('should not throw error for user with permission', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_MANAGER,
      });

      await expect(
        requirePermission('user-1', Permission.DELETE_CUSTOMER)
      ).resolves.not.toThrow();
    });

    it('should throw error for user without permission', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: Role.SALES_REP,
      });

      await expect(
        requirePermission('user-1', Permission.DELETE_CUSTOMER)
      ).rejects.toThrow('Missing permission');
    });
  });

  describe('Utility Functions', () => {
    it('should get all roles with a specific permission', () => {
      const rolesWithDelete = getRolesWithPermission(Permission.DELETE_CUSTOMER);

      expect(rolesWithDelete).toContain(Role.ADMIN);
      expect(rolesWithDelete).toContain(Role.SALES_MANAGER);
      expect(rolesWithDelete).not.toContain(Role.SALES_REP);
      expect(rolesWithDelete).not.toContain(Role.USER);
    });

    it('should get all available roles', () => {
      const roles = getAllRoles();

      expect(roles).toHaveLength(4);
      expect(roles.map(r => r.role)).toEqual([
        Role.ADMIN,
        Role.SALES_MANAGER,
        Role.SALES_REP,
        Role.USER,
      ]);
    });

    it('should parse permission string correctly', () => {
      const parsed = parsePermission(Permission.DELETE_CUSTOMER);

      expect(parsed.action).toBe('delete');
      expect(parsed.resource).toBe('customer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle database errors gracefully in getUserRole', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const role = await getUserRole('user-1');

      expect(role).toBeNull();
    });

    it('should handle null user role', async () => {
      (databaseAdapter.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        role: null,
      });

      const hasPermission = await userHasPermission('user-1', Permission.READ_CUSTOMER);

      expect(hasPermission).toBe(false);
    });

    it('should handle missing resource in resource access check', async () => {
      (databaseAdapter.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'user-1', role: Role.SALES_REP })
        .mockResolvedValueOnce(null);

      const canAccess = await checkPermission('user-1', 'read', 'customer', 'non-existent');

      expect(canAccess).toBe(false);
    });
  });
});
