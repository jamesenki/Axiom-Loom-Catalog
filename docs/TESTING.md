# Testing Guide for Axiom Loom Catalog

## Overview

This document outlines the testing strategy, tools, and best practices for the Axiom Loom Catalog project.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **TypeScript**: Type-safe testing
- **Mock Service Worker (MSW)**: API mocking (planned)
- **Playwright**: E2E testing (planned)

## Test Structure

```
src/
├── components/
│   └── __tests__/        # Component tests
├── services/
│   └── __tests__/        # Service tests
├── test-utils/           # Testing utilities
│   ├── index.tsx         # Custom render and utilities
│   ├── mockServices.ts   # Service mocks
│   └── testSetup.ts      # Global test configuration
└── setupTests.ts         # Jest setup file
```

## Writing Tests

### Component Tests

Use the custom render function from test-utils:

```typescript
import { render, screen } from '../test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Service Tests

Mock external dependencies:

```typescript
import { myService } from '../myService';
import { mockGitHubService } from '../test-utils/mockServices';

jest.mock('../services/github', () => mockGitHubService);

describe('myService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches data correctly', async () => {
    mockGitHubService.fetchFile.mockResolvedValue({ content: 'test' });
    const result = await myService.getData();
    expect(result).toBe('test');
  });
});
```

### Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component/service does, not how
   - Test user interactions and outcomes

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('displays error message when API call fails')
   
   // Bad
   it('test error')
   ```

3. **Arrange-Act-Assert Pattern**
   ```typescript
   it('updates count when button is clicked', () => {
     // Arrange
     render(<Counter initialCount={0} />);
     
     // Act
     fireEvent.click(screen.getByText('Increment'));
     
     // Assert
     expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

4. **Mock External Dependencies**
   - Use the provided mock services
   - Create specific mocks for test scenarios

5. **Test Accessibility**
   ```typescript
   it('has accessible form labels', () => {
     render(<Form />);
     expect(screen.getByLabelText('Email')).toBeInTheDocument();
   });
   ```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## Coverage Requirements

The project enforces the following coverage thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Debugging Tests

1. **Use debug() from React Testing Library**
   ```typescript
   const { debug } = render(<MyComponent />);
   debug(); // Prints DOM to console
   ```

2. **Use screen.debug()**
   ```typescript
   render(<MyComponent />);
   screen.debug(); // Prints accessible DOM
   ```

3. **Run single test in debug mode**
   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand MyComponent.test.tsx
   ```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('loads data on mount', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing User Events

```typescript
it('submits form with user input', async () => {
  const onSubmit = jest.fn();
  render(<Form onSubmit={onSubmit} />);
  
  await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
  await userEvent.click(screen.getByText('Submit'));
  
  expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

### Testing Error States

```typescript
it('displays error when API fails', async () => {
  mockApiService.fetchData.mockRejectedValue(new Error('API Error'));
  
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/API Error/)).toBeInTheDocument();
  });
});
```

## Test Data Factories

Use the provided factory functions for consistent test data:

```typescript
import { createMockRepository, createMockApiDetectionResult } from '../test-utils';

const mockRepo = createMockRepository({
  name: 'custom-repo',
  hasApiDocs: true
});

const mockApiResult = createMockApiDetectionResult({
  hasAnyApis: true,
  apis: {
    rest: [{ file: 'api.yaml' }],
    graphql: [],
    grpc: []
  }
});
```

## Continuous Integration

Tests run automatically on:
- Pull request creation
- Commits to main branch
- Pre-commit hooks (if configured)

## Future Enhancements

1. **Mock Service Worker (MSW)** for API mocking
2. **Playwright** for E2E testing
3. **Visual regression testing**
4. **Performance testing**
5. **Mutation testing**

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)