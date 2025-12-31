# Development Guide

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Code Quality

### Linting

Run ESLint to check for code issues:

```bash
pnpm lint
```

Automatically fix ESLint issues:

```bash
pnpm lint:fix
```

### Formatting

Check code formatting:

```bash
pnpm format:check
```

Format code:

```bash
pnpm format
```

## Building

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── styles/        # CSS styles
├── App.tsx        # Main App component
└── main.tsx       # Application entry point
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` type
- Use meaningful variable names

### React

- Use functional components
- Use hooks for state management
- Follow React best practices
- Keep components small and focused

### CSS

- Use CSS modules or CSS-in-JS
- Follow BEM naming convention for plain CSS
- Keep styles scoped to components

## Architecture

### State Management

The application uses a custom hook `useAppState` for centralized state management:

```typescript
const {
  state,           // Current application state
  setVisaPeriod,   // Set visa validity period
  addTrip,         // Add a new trip
  updateTrip,      // Update an existing trip
  deleteTrip,      // Delete a trip
  clearAllData,    // Clear all data
} = useAppState()
```

### Data Flow

1. User interacts with components
2. Components call hooks to update state
3. State changes trigger re-renders
4. State is automatically persisted to localStorage

### Validation Logic

All validation logic is centralized in `src/utils/validator.ts`:

- `getDaysInAustraliaForWindow`: Calculate days spent in Australia within 18-month window
- `isViolation`: Check if a date violates Condition 8558
- `validateTrip`: Validate a trip against all rules
- `getDayStatus`: Get the status of a specific day
- `getWindowUsage`: Get window usage information for a date

## Testing

(To be added)

### Unit Tests

Test individual functions and utilities:

```bash
pnpm test
```

### Component Tests

Test React components:

```bash
pnpm test:components
```

### E2E Tests

Test complete user flows:

```bash
pnpm test:e2e
```

## Deployment

### Build

```bash
pnpm build
```

The build output will be in the `dist/` directory.

### Deploy

The application can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Configure repository settings
- **Cloudflare Pages**: Connect repository

### Environment Variables

(None currently required)

## Performance Optimization

### Code Splitting

Vite automatically handles code splitting for optimal loading.

### Lazy Loading

Use React.lazy for route-based code splitting:

```typescript
const Calendar = React.lazy(() => import('./components/Calendar'))
```

### Memoization

Use React.memo for expensive components:

```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
})
```

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:

```bash
# Clear build cache
rm -rf dist tsconfig.*.tsbuildinfo

# Rebuild
pnpm build
```

### Development Server Issues

If the dev server won't start:

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Contributing

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

Follow conventional commits:

- `feat: add calendar component`
- `fix: correct date calculation`
- `docs: update README`
- `refactor: improve validation logic`

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Write or update tests
4. Ensure all tests pass: `pnpm test:run`
5. Ensure code quality: `pnpm lint && pnpm format:check`
6. Update documentation
7. Submit pull request

## Testing

### Test Structure

Tests are located in `src/utils/__tests__/` and follow the naming convention `*.test.ts`.

### Running Tests

```bash
# Watch mode (recommended during development)
pnpm test

# Run once
pnpm test:run

# With UI (interactive browser interface)
pnpm test:ui

# With coverage report
pnpm test:coverage
```

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '../yourModule'

describe('YourModule', () => {
  describe('yourFunction', () => {
    it('should handle normal case', () => {
      const result = yourFunction('input')
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      const result = yourFunction('')
      expect(result).toBe('default')
    })
  })
})
```

### Test Coverage

Core utilities have high test coverage:
- **dateUtils**: Date manipulation functions
- **validator**: Condition 8558 validation logic
- **tripUtils**: Trip management helpers

Focus on testing:
- Business logic
- Edge cases (leap years, boundary dates)
- Error conditions
- Sliding window calculations

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Vitest Documentation](https://vitest.dev)
- [Australian Immigration - Condition 8558](https://immi.homeaffairs.gov.au)
