/**
 * Permission Middleware Tests
 *
 * Tests for API route permission middleware
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import {
  withPermission,
  withRole,
  withResourcePermission,
  withAll,
  withAny,
  requireAdmin,
  requireManager,
  getParamId,
} from '../permission-middleware';
import { Role, Permission } from '../rbac';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

jest.mock('../rbac', () => ({
  ...jest.requireActual('../rbac'),
  getUserRole: jest.fn(),
  requirePermission: jest.fn(),
  requireRole: jest.fn(),
  checkPermission: jest.fn(),
}));

jest.mock('../audit-log', () => ({
  logAuditEvent: jest.fn(),
}));

import { getServerSession } from 'next-auth';
import * as rbac from '../rbac';
import * as auditLog from '../audit-log';

describe('Permission Middleware', () => {
  let mockRequest: NextRequest;
  let mockHandler: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request
    mockRequest = {
      nextUrl: {
        pathname: '/api/customers',
      },
      method: 'GET',
      json: jest.fn(),
    } as any;

    // Mock handler
    mockHandler = jest.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );
  });

  describe('withPermission Middleware', () => {
    it('should allow request with valid permission', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockResolvedValue(undefined);

      const middleware = withPermission(Permission.READ_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(rbac.requirePermission).toHaveBeenCalledWith('user-1', Permission.READ_CUSTOMER);
      expect(mockHandler).toHaveBeenCalled();
      expect(response.status).not.toBe(403);
    });

    it('should deny request without permission', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockRejectedValue(
        new Error('Insufficient permissions')
      );

      const middleware = withPermission(Permission.DELETE_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);

      const body = await response.json();
      expect(body.error).toContain('permissions');
    });

    it('should deny unauthenticated request', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const middleware = withPermission(Permission.READ_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toContain('Authentication required');
    });

    it('should log audit event on success', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockResolvedValue(undefined);

      const middleware = withPermission(Permission.READ_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(auditLog.logAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          action: 'permission_check',
          success: true,
        })
      );
    });

    it('should log audit event on failure', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockRejectedValue(
        new Error('Permission denied')
      );

      const middleware = withPermission(Permission.DELETE_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(auditLog.logAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          action: 'permission_denied',
          success: false,
        })
      );
    });

    it('should support custom error message', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockRejectedValue(new Error());

      const middleware = withPermission(Permission.DELETE_CUSTOMER, {
        errorMessage: 'Custom error message',
      });
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);
      const body = await response.json();

      expect(body.error).toBe('Custom error message');
    });

    it('should support soft mode', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requirePermission as jest.Mock).mockRejectedValue(new Error());

      const middleware = withPermission(Permission.DELETE_CUSTOMER, {
        soft: true,
      });
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      // Should still call handler in soft mode
      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('withRole Middleware', () => {
    it('should allow request with valid role', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockResolvedValue(undefined);

      const middleware = withRole([Role.ADMIN, Role.SALES_MANAGER]);
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(rbac.requireRole).toHaveBeenCalledWith('user-1', [
        Role.ADMIN,
        Role.SALES_MANAGER,
      ]);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny request with insufficient role', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockRejectedValue(
        new Error('Insufficient role')
      );

      const middleware = withRole([Role.ADMIN]);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });

  describe('withResourcePermission Middleware', () => {
    it('should allow access to owned resource', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.checkPermission as jest.Mock).mockResolvedValue(true);

      const getResourceId = () => 'customer-1';
      const middleware = withResourcePermission('update', 'customer', getResourceId);
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(rbac.checkPermission).toHaveBeenCalledWith(
        'user-1',
        'update',
        'customer',
        'customer-1'
      );
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny access to non-owned resource', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.checkPermission as jest.Mock).mockResolvedValue(false);

      const getResourceId = () => 'customer-1';
      const middleware = withResourcePermission('update', 'customer', getResourceId);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });

  describe('Combined Middlewares', () => {
    it('should allow request when all middlewares pass', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockResolvedValue(undefined);
      (rbac.requirePermission as jest.Mock).mockResolvedValue(undefined);

      const combined = withAll(
        withRole([Role.ADMIN]),
        withPermission(Permission.DELETE_CUSTOMER)
      );
      const wrappedHandler = combined(mockHandler);

      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny request when any middleware fails', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockResolvedValue(undefined);
      (rbac.requirePermission as jest.Mock).mockRejectedValue(new Error());

      const combined = withAll(
        withRole([Role.ADMIN]),
        withPermission(Permission.DELETE_CUSTOMER)
      );
      const wrappedHandler = combined(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });

    it('should allow request when any middleware in withAny passes', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      // First middleware fails, second passes
      (rbac.requireRole as jest.Mock)
        .mockRejectedValueOnce(new Error())
        .mockResolvedValueOnce(undefined);

      const combined = withAny(
        withRole([Role.ADMIN]),
        withRole([Role.SALES_MANAGER])
      );
      const wrappedHandler = combined(mockHandler);

      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny request when all middlewares in withAny fail', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockRejectedValue(new Error());

      const combined = withAny(
        withRole([Role.ADMIN]),
        withRole([Role.SALES_MANAGER])
      );
      const wrappedHandler = combined(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });

  describe('Convenience Functions', () => {
    it('should require admin role', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockResolvedValue(undefined);

      const middleware = requireAdmin();
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(rbac.requireRole).toHaveBeenCalledWith('user-1', [Role.ADMIN]);
    });

    it('should require manager role', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' },
      });

      (rbac.requireRole as jest.Mock).mockResolvedValue(undefined);

      const middleware = requireManager();
      const wrappedHandler = middleware(mockHandler);

      await wrappedHandler(mockRequest);

      expect(rbac.requireRole).toHaveBeenCalledWith('user-1', [
        Role.ADMIN,
        Role.SALES_MANAGER,
      ]);
    });
  });

  describe('Utility Functions', () => {
    it('should extract ID from URL params', () => {
      const context = { params: { id: 'customer-123' } };
      const getId = getParamId('id');

      const id = getId(mockRequest, context);

      expect(id).toBe('customer-123');
    });

    it('should return empty string if param not found', () => {
      const context = { params: {} };
      const getId = getParamId('id');

      const id = getId(mockRequest, context);

      expect(id).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle session errors gracefully', async () => {
      (getServerSession as jest.Mock).mockRejectedValue(new Error('Session error'));

      const middleware = withPermission(Permission.READ_CUSTOMER);
      const wrappedHandler = middleware(mockHandler);

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(401);
    });
  });
});
