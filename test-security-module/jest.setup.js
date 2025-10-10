/**
 * Jest Setup File
 *
 * Runs before each test suite
 */

// Add custom matchers (using CommonJS for Jest compatibility)
require('@testing-library/jest-dom');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Global test utilities
global.console = {
  ...console,
  // Suppress console.error in tests unless explicitly enabled
  error: jest.fn(),
  // Suppress console.log in tests unless explicitly enabled
  log: jest.fn(),
};
