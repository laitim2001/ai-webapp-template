# Testing Framework

Comprehensive testing suite for the AI Web App Template with Jest, React Testing Library, and Playwright.

## 📋 Overview

This testing framework provides complete test coverage for:
- **Unit Tests** - Component and utility function testing
- **API Tests** - HTTP endpoint and business logic testing
- **Integration Tests** - Multi-component and system integration testing
- **E2E Tests** - End-to-end user journey testing with Playwright

## 📦 Test Suite Contents

**Total**: 34 files, ~15,500 lines of test code

### Test Structure
```
03-testing/
├── jest.config.js.template          # Jest configuration
├── jest.setup.js.template           # Jest setup and globals
├── playwright.config.ts.template    # Playwright E2E configuration
├── __tests__/                       # Unit & API tests (28 files)
│   ├── auth/                        # Authentication tests
│   ├── api/                         # API endpoint tests
│   ├── components/                  # React component tests
│   ├── lib/                         # Library/utility tests
│   └── workflow/                    # Workflow engine tests
└── tests/                           # Integration tests (3 files)
    ├── integration/                 # System integration tests
    └── knowledge-base.test.ts       # Knowledge base E2E test
```

## 🚀 Quick Start

### Installation

```bash
# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest jest-environment-jsdom @types/jest
npm install --save-dev @playwright/test
npm install --save-dev ts-jest
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth/login

# Run E2E tests
npx playwright test

# Run E2E tests with UI
npx playwright test --ui
```

## 📝 Test Categories

### 1. Authentication Tests (3 files, ~780 lines)

**Component Tests**:
- `__tests__/auth/login.test.tsx` - Login form component testing
  - Form validation
  - Submit handling
  - Error states
  - Loading states

**API Tests**:
- `__tests__/api/auth/login.test.ts` - Login API endpoint testing
  - Valid credentials
  - Invalid credentials
  - Rate limiting
  - Token generation

- `__tests__/api/auth/register.test.ts` - Registration API testing
  - User creation
  - Validation rules
  - Duplicate prevention
  - Email verification

### 2. API Middleware Tests (10 files, ~3,200 lines)

Located in `__tests__/lib/middleware/`:

- `api-versioning.test.ts` - API version handling
- `cors.test.ts` - CORS configuration
- `rate-limiter.test.ts` - Rate limiting logic
- `request-id.test.ts` - Request ID generation
- `request-transformer.test.ts` - Request transformation
- `request-validator.test.ts` - Input validation
- `response-cache.test.ts` - Response caching
- `response-transformer.test.ts` - Response formatting
- `route-matcher.test.ts` - Route matching logic
- `security-headers.test.ts` - Security headers

### 3. Knowledge Base Tests (5 files, ~4,500 lines)

**Component Tests**:
- `components/knowledge/advanced-search-builder.test.tsx`
- `components/knowledge/knowledge-base-list.test.tsx`
- `components/knowledge/knowledge-document-edit.test.tsx`
- `components/knowledge/knowledge-document-view.test.tsx`

**API Tests**:
- `api/knowledge-base/advanced-search.test.ts`

**Integration Tests**:
- `tests/knowledge-base.test.ts` - Full system integration

### 4. Library Tests (7 files, ~3,500 lines)

- `lib/ai/embeddings.test.ts` - AI embedding service
- `lib/collaboration/edit-lock-manager.test.ts` - Concurrent editing
- `lib/error-handling.test.ts` - Error handling utilities
- `lib/knowledge/full-text-search.test.ts` - Full-text search
- `lib/knowledge/search-history-manager.test.ts` - Search history
- `lib/pdf/pdf-generator.test.ts` - PDF generation
- `lib/pdf/proposal-pdf-template.test.ts` - PDF templates
- `lib/template/template-engine.test.ts` - Template engine
- `lib/template/template-manager.test.ts` - Template management

### 5. Workflow Tests (1 file, ~800 lines)

- `workflow/engine.test.ts` - Workflow engine testing
  - State transitions
  - Approval flows
  - Status updates
  - Validation logic

### 6. Integration Tests (3 files, ~1,600 lines)

Located in `tests/integration/`:

- `crm-integration.test.ts` - CRM system integration
- `system-integration.test.ts` - Full system integration
- `knowledge-base.test.ts` - Knowledge base E2E flows

## 🔧 Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📖 Writing Tests

### Unit Test Example

```typescript
// __tests__/lib/utils.test.ts
import { formatDate, calculateTotal } from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('2025-01-15');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('calculateTotal', () => {
    it('should sum numbers correctly', () => {
      expect(calculateTotal([1, 2, 3])).toBe(6);
    });

    it('should handle empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });
});
```

### Component Test Example

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button disabled>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### API Test Example

```typescript
// __tests__/api/auth/login.test.ts
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

describe('POST /api/auth/login', () => {
  it('should return token for valid credentials', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();
  });

  it('should return 401 for invalid credentials', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill in credentials
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');

  // Click login button
  await page.click('button[type="submit"]');

  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard');

  // Verify user info is displayed
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

## 🧪 Test Best Practices

### 1. Test Organization
- Group related tests with `describe` blocks
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. Test Isolation
- Each test should be independent
- Clean up after tests (database, mocks)
- Use `beforeEach`/`afterEach` for setup/teardown

### 3. Mocking
```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: 'Test' }))
}));

// Mock modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));
```

### 4. Coverage Goals
- Aim for 80%+ code coverage
- Focus on critical paths
- Don't test third-party libraries
- Test edge cases and error scenarios

## 🐛 Debugging Tests

### Debug in VS Code

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Playwright Tests

```bash
# Run with headed browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Run specific test with debug
npx playwright test login.spec.ts --debug
```

## 📊 Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

Coverage includes:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm test -- --coverage
      - run: npx playwright install --with-deps
      - run: npx playwright test

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🔄 Version History

- **v1.0.0** - Initial extraction from AI Sales Enablement Platform
  - 31 test files (28 unit + 3 integration)
  - ~15,500 lines of test code
  - Jest + React Testing Library + Playwright
  - 80%+ coverage target

---

Part of **AI Web App Template v5.0**
