# Testing Guide

This document describes the testing approach for the Condition 8558 Calculator project.

## Overview

The project uses Vitest as the testing framework, with a focus on unit testing core business logic.

## Test Setup

### Tools and Libraries

- **Vitest**: Modern, fast test runner built on Vite
- **@testing-library/react**: For component testing (future use)
- **@testing-library/jest-dom**: Additional matchers
- **jsdom**: Browser environment simulation

### Configuration

Testing is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

## Running Tests

### Commands

```bash
# Watch mode - reruns tests on file changes
pnpm test

# Run once - useful for CI/CD
pnpm test:run

# UI mode - interactive browser interface
pnpm test:ui

# Coverage report
pnpm test:coverage
```

### Watch Mode Tips

In watch mode, press:
- `a` to run all tests
- `f` to run only failed tests
- `p` to filter by filename
- `t` to filter by test name
- `q` to quit

## Test Structure

### File Organization

```
src/
├── utils/
│   ├── dateUtils.ts
│   ├── validator.ts
│   └── __tests__/
│       ├── dateUtils.test.ts
│       └── validator.test.ts
```

Tests are co-located with the modules they test in `__tests__` directories.

### Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test descriptions: Clear, specific descriptions of what's being tested
- Test names: Use "should" statements for clarity

## Writing Tests

### Basic Structure

```typescript
import { describe, it, expect } from 'vitest'

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = functionName(input)
      
      // Assert
      expect(result).toBe('expected')
    })
  })
})
```

### Best Practices

1. **Arrange-Act-Assert**: Structure tests in three clear phases
2. **One assertion per test**: Keep tests focused
3. **Descriptive names**: Test names should explain what's being tested
4. **Test edge cases**: Don't just test happy paths
5. **Use specific matchers**: `toBe()`, `toEqual()`, `toBeCloseTo()`, etc.

### Example: Date Utils Tests

```typescript
describe('addDays', () => {
  it('should correctly add days', () => {
    const date = parseDate('2024-01-01')
    const newDate = addDays(date, 10)
    expect(formatDate(newDate)).toBe('2024-01-11')
  })

  it('should handle cross-month cases', () => {
    const date = parseDate('2024-01-25')
    const newDate = addDays(date, 10)
    expect(formatDate(newDate)).toBe('2024-02-04')
  })

  it('should handle leap year', () => {
    const date = parseDate('2024-02-28')
    const newDate = addDays(date, 1)
    expect(formatDate(newDate)).toBe('2024-02-29')
  })
})
```

## Test Coverage

### Current Coverage

The following modules have comprehensive test coverage:

#### dateUtils.ts (30 tests)
- Date parsing and formatting
- Date arithmetic (adding days/months)
- Date comparisons and ranges
- Month calculations
- Edge cases (leap years, month-end overflow)

#### validator.ts (28 tests)
- Window-based day counting
- Condition 8558 violation detection
- Trip validation logic
- Day status calculation
- Boundary cases (548-day window edges)
- Leap year handling

### Coverage Goals

- **Core utilities**: Aim for >90% coverage
- **Business logic**: Test all branches and edge cases
- **Components**: Focus on user interaction logic

### Running Coverage

```bash
pnpm test:coverage
```

This generates a coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Testing Strategies

### Unit Testing

Focus on pure functions and business logic:
- Date utilities
- Validation functions
- Calculation helpers

### Integration Testing

Test how multiple modules work together:
- Validator + date utils
- Trip management + validation

### Edge Cases to Test

1. **Boundary dates**
   - Start/end of visa period
   - 548-day window boundaries
   - Month-end dates

2. **Leap years**
   - February 29th
   - Year-crossing calculations

3. **Invalid inputs**
   - Negative numbers
   - Invalid date formats
   - Null/undefined values

4. **Complex scenarios**
   - Multiple overlapping trips
   - Long-running trips
   - Same-day entry/exit

## Common Testing Patterns

### Testing Date Functions

```typescript
it('should handle date edge case', () => {
  const input = parseDate('2024-01-31')
  const result = addMonths(input, 1)
  expect(formatDate(result)).toBe('2024-02-29')
})
```

### Testing Validation Logic

```typescript
it('should detect violation', () => {
  const trips: Trip[] = [
    { id: '1', entry: '2024-01-01', exit: '2024-12-31' }
  ]
  const checkDate = parseDate('2024-12-31')
  expect(isViolation(checkDate, trips)).toBe(true)
})
```

### Testing with Multiple Scenarios

```typescript
describe('sliding window behavior', () => {
  const trips: Trip[] = [
    { id: '1', entry: '2024-01-01', exit: '2024-12-30' }
  ]

  it('should allow 365 days', () => {
    const date = parseDate('2024-12-30')
    expect(isViolation(date, trips)).toBe(false)
  })

  it('should have fewer days as window moves', () => {
    const laterDate = parseDate('2025-08-01')
    const days = getDaysInAustraliaForWindow(laterDate, trips)
    expect(days).toBeLessThan(365)
  })
})
```

## Debugging Tests

### Using console.log

```typescript
it('should calculate correctly', () => {
  const result = complexCalculation(input)
  console.log('Result:', result) // Will show in test output
  expect(result).toBe(expected)
})
```

### Using .only and .skip

```typescript
// Run only this test
it.only('should focus on this test', () => {
  // ...
})

// Skip this test temporarily
it.skip('should run later', () => {
  // ...
})
```

### Verbose Output

```bash
pnpm test:run --reporter=verbose
```

## Continuous Integration

### Pre-commit Checks

Before committing:

```bash
pnpm test:run && pnpm lint && pnpm format:check
```

### CI Pipeline

Typical CI pipeline should include:

1. Install dependencies: `pnpm install`
2. Run linter: `pnpm lint`
3. Check formatting: `pnpm format:check`
4. Run tests: `pnpm test:run`
5. Build: `pnpm build`

## Future Testing Plans

- [ ] Add component tests using Testing Library
- [ ] Add E2E tests with Playwright
- [ ] Set up visual regression testing
- [ ] Implement mutation testing
- [ ] Add performance benchmarks

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Writing Testable Code](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-decided-to.html)

