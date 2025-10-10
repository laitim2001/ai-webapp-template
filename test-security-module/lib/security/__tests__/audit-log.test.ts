/**
 * Audit Log System Tests
 *
 * Tests for audit logging, querying, and GDPR compliance
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  logAuditEvent,
  queryAuditLogs,
  getAuditLogStats,
  getUserAuditTrail,
  getFailedAccessAttempts,
  detectSuspiciousActivity,
  anonymizeUserAuditLogs,
  deleteOldAuditLogs,
  logLogin,
  logFailedLogin,
  logDataAccess,
  logPermissionDenied,
} from '../audit-log';

// Mock database adapter
jest.mock('@/lib/db/database-adapter', () => ({
  databaseAdapter: {
    create: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

import { databaseAdapter } from '@/lib/db/database-adapter';

describe('Audit Log System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Logging Events', () => {
    it('should log audit event successfully', async () => {
      (databaseAdapter.create as jest.Mock).mockResolvedValue({});

      await logAuditEvent({
        userId: 'user-1',
        action: 'read',
        resource: 'customer',
        resourceId: 'customer-1',
        success: true,
      });

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'read',
          resource: 'customer',
          resourceId: 'customer-1',
          success: true,
        }),
      });
    });

    it('should handle logging errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (databaseAdapter.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Should not throw
      await expect(
        logAuditEvent({
          userId: 'user-1',
          action: 'test',
          resource: 'test',
          success: true,
        })
      ).resolves.not.toThrow();

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should log event with metadata', async () => {
      (databaseAdapter.create as jest.Mock).mockResolvedValue({});

      await logAuditEvent({
        userId: 'user-1',
        action: 'bulk_export',
        resource: 'customers',
        success: true,
        metadata: { count: 100, format: 'CSV' },
      });

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          metadata: JSON.stringify({ count: 100, format: 'CSV' }),
        }),
      });
    });

    it('should log event with IP and user agent', async () => {
      (databaseAdapter.create as jest.Mock).mockResolvedValue({});

      await logAuditEvent({
        userId: 'user-1',
        action: 'login',
        resource: 'auth',
        success: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        }),
      });
    });
  });

  describe('Convenience Logging Functions', () => {
    beforeEach(() => {
      (databaseAdapter.create as jest.Mock).mockResolvedValue({});
    });

    it('should log successful login', async () => {
      await logLogin('user-1', '192.168.1.1', 'Mozilla/5.0');

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'login',
          resource: 'auth',
          success: true,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        }),
      });
    });

    it('should log failed login', async () => {
      await logFailedLogin('user-1', 'Invalid password', '192.168.1.1');

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'login_failed',
          resource: 'auth',
          success: false,
          metadata: JSON.stringify({ reason: 'Invalid password' }),
        }),
      });
    });

    it('should log data access', async () => {
      await logDataAccess('user-1', 'customer', 'customer-1', 'read');

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'read_customer',
          resource: 'customer',
          resourceId: 'customer-1',
          success: true,
        }),
      });
    });

    it('should log permission denied', async () => {
      await logPermissionDenied('user-1', 'delete', 'customer', 'customer-1');

      expect(databaseAdapter.create).toHaveBeenCalledWith('auditLog', {
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'delete_denied',
          resource: 'customer',
          resourceId: 'customer-1',
          success: false,
        }),
      });
    });
  });

  describe('Querying Audit Logs', () => {
    it('should query logs by user ID', async () => {
      const mockLogs = [
        { userId: 'user-1', action: 'read', resource: 'customer' },
        { userId: 'user-1', action: 'update', resource: 'customer' },
      ];

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const logs = await queryAuditLogs({ userId: 'user-1' });

      expect(logs).toEqual(mockLogs);
      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: { userId: 'user-1' },
        orderBy: { timestamp: 'desc' },
        take: 100,
        skip: 0,
      });
    });

    it('should query logs by action', async () => {
      (databaseAdapter.findMany as jest.Mock).mockResolvedValue([]);

      await queryAuditLogs({ action: 'login' });

      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: { action: 'login' },
        orderBy: { timestamp: 'desc' },
        take: 100,
        skip: 0,
      });
    });

    it('should query logs by success status', async () => {
      (databaseAdapter.findMany as jest.Mock).mockResolvedValue([]);

      await queryAuditLogs({ success: false });

      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: { success: false },
        orderBy: { timestamp: 'desc' },
        take: 100,
        skip: 0,
      });
    });

    it('should query logs within date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue([]);

      await queryAuditLogs({ startDate, endDate });

      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
        skip: 0,
      });
    });

    it('should apply limit and offset', async () => {
      (databaseAdapter.findMany as jest.Mock).mockResolvedValue([]);

      await queryAuditLogs({ limit: 50, offset: 100 });

      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: {},
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 100,
      });
    });
  });

  describe('Audit Log Statistics', () => {
    it('should calculate statistics correctly', async () => {
      const mockLogs = [
        { userId: 'user-1', action: 'read', resource: 'customer', success: true },
        { userId: 'user-1', action: 'update', resource: 'customer', success: true },
        { userId: 'user-2', action: 'delete', resource: 'customer', success: false },
        { userId: 'user-2', action: 'read', resource: 'workflow', success: true },
      ];

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const stats = await getAuditLogStats();

      expect(stats.totalEvents).toBe(4);
      expect(stats.successfulEvents).toBe(3);
      expect(stats.failedEvents).toBe(1);
      expect(stats.uniqueUsers).toBe(2);
      expect(stats.eventsByAction).toEqual({
        read: 2,
        update: 1,
        delete: 1,
      });
      expect(stats.eventsByResource).toEqual({
        customer: 3,
        workflow: 1,
      });
    });

    it('should handle empty logs', async () => {
      (databaseAdapter.findMany as jest.Mock).mockResolvedValue([]);

      const stats = await getAuditLogStats();

      expect(stats.totalEvents).toBe(0);
      expect(stats.successfulEvents).toBe(0);
      expect(stats.failedEvents).toBe(0);
      expect(stats.uniqueUsers).toBe(0);
    });
  });

  describe('User Audit Trail', () => {
    it('should get user audit trail', async () => {
      const mockLogs = [
        { userId: 'user-1', action: 'login', timestamp: new Date() },
        { userId: 'user-1', action: 'read', timestamp: new Date() },
      ];

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const trail = await getUserAuditTrail('user-1', 50);

      expect(trail).toEqual(mockLogs);
      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: { userId: 'user-1' },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
      });
    });
  });

  describe('Failed Access Attempts', () => {
    it('should get failed access attempts within time window', async () => {
      const mockFailedLogs = [
        { userId: 'user-1', action: 'login_failed', success: false },
        { userId: 'user-2', action: 'permission_denied', success: false },
      ];

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockFailedLogs);

      const failed = await getFailedAccessAttempts(24);

      expect(failed).toEqual(mockFailedLogs);
      expect(databaseAdapter.findMany).toHaveBeenCalledWith('auditLog', {
        where: {
          success: false,
          timestamp: {
            gte: expect.any(Date),
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 1000,
        skip: 0,
      });
    });
  });

  describe('Suspicious Activity Detection', () => {
    it('should detect excessive failed attempts', async () => {
      const mockLogs = Array(15).fill({
        userId: 'user-1',
        action: 'login_failed',
        success: false,
        timestamp: new Date(),
      });

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const isSuspicious = await detectSuspiciousActivity('user-1', 1);

      expect(isSuspicious).toBe(true);
    });

    it('should detect rapid automated requests', async () => {
      const baseTime = Date.now();
      const mockLogs = Array(150)
        .fill(null)
        .map((_, i) => ({
          userId: 'user-1',
          action: 'read',
          success: true,
          timestamp: new Date(baseTime + i * 100), // 100ms apart
        }));

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const isSuspicious = await detectSuspiciousActivity('user-1', 1);

      expect(isSuspicious).toBe(true);
    });

    it('should not flag normal activity', async () => {
      const mockLogs = [
        { userId: 'user-1', action: 'read', success: true, timestamp: new Date() },
        { userId: 'user-1', action: 'update', success: true, timestamp: new Date() },
      ];

      (databaseAdapter.findMany as jest.Mock).mockResolvedValue(mockLogs);

      const isSuspicious = await detectSuspiciousActivity('user-1', 1);

      expect(isSuspicious).toBe(false);
    });
  });

  describe('GDPR Compliance', () => {
    it('should anonymize user audit logs', async () => {
      (databaseAdapter.updateMany as jest.Mock).mockResolvedValue({ count: 10 });

      const count = await anonymizeUserAuditLogs('user-1');

      expect(count).toBe(10);
      expect(databaseAdapter.updateMany).toHaveBeenCalledWith('auditLog', {
        where: { userId: 'user-1' },
        data: {
          userId: expect.stringContaining('ANON-'),
          metadata: expect.stringContaining('anonymized'),
        },
      });
    });

    it('should delete old audit logs', async () => {
      (databaseAdapter.deleteMany as jest.Mock).mockResolvedValue({ count: 50 });

      const count = await deleteOldAuditLogs(90);

      expect(count).toBe(50);
      expect(databaseAdapter.deleteMany).toHaveBeenCalledWith('auditLog', {
        where: {
          timestamp: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('should handle deletion errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (databaseAdapter.deleteMany as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const count = await deleteOldAuditLogs(90);

      expect(count).toBe(0);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should return empty array on query error', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (databaseAdapter.findMany as jest.Mock).mockRejectedValue(new Error('Query failed'));

      const logs = await queryAuditLogs({ userId: 'user-1' });

      expect(logs).toEqual([]);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should return zero stats on error', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (databaseAdapter.findMany as jest.Mock).mockRejectedValue(new Error('Stats failed'));

      const stats = await getAuditLogStats();

      expect(stats.totalEvents).toBe(0);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });
});
