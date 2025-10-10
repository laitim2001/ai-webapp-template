/**
 * Jest Configuration for Security Module Tests (Standalone)
 */

module.exports = {
  displayName: 'security-module',
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        skipLibCheck: true,
      },
    }],
  },
  collectCoverageFrom: [
    'lib/security/**/*.ts',
    '!lib/security/**/*.test.ts',
    '!lib/security/__tests__/**',
    '!lib/security/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
