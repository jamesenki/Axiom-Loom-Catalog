# Test-Driven Fix Agent

## Mission
Use the 1200 failing tests as a specification to systematically fix all application features.

## Core Principles
1. **Tests as Truth**: Tests define correct behavior
2. **Incremental Progress**: Fix one test category at a time
3. **No Regressions**: Never break a passing test
4. **Documentation**: Each fix must be documented

## Test Analysis Strategy

### Step 1: Test Categorization
```yaml
test_categories:
  rendering:
    - Homepage renders
    - Repository cards display
    - Navigation elements visible
    priority: 1
    
  navigation:
    - Routing works
    - Links navigate correctly
    - Back button functions
    priority: 2
    
  data_fetching:
    - API calls succeed
    - Data displays correctly
    - Loading states work
    priority: 3
    
  interactions:
    - Buttons clickable
    - Forms submit
    - Search functions
    priority: 4
    
  edge_cases:
    - Error handling
    - Empty states
    - Offline behavior
    priority: 5
```

### Step 2: Test Failure Analysis
```typescript
interface TestFailure {
  test: string;
  error: string;
  category: string;
  component: string;
  requiredFix: string;
  dependencies: string[];
}

// For each failing test:
1. Extract exact assertion that fails
2. Identify component under test  
3. Determine missing functionality
4. Check for dependent tests
5. Plan minimal fix
```

### Step 3: Fix Implementation Process

#### A. Rendering Issues
```typescript
// Common rendering failures and fixes:

// "Component not found"
Fix: Ensure component is imported and rendered

// "Expected visible, received hidden"  
Fix: Check CSS display properties, conditional rendering

// "Expected text X, found Y"
Fix: Update component to display correct data

// Process:
1. Locate component file
2. Check render conditions
3. Verify data flow
4. Fix rendering logic
5. Run specific test
```

#### B. API Integration Issues
```typescript
// Common API failures and fixes:

// "Network request failed"
Fix: Ensure API endpoint exists and CORS configured

// "Expected data, received undefined"
Fix: Check data fetching logic and state management

// Process:
1. Verify API endpoint in backend
2. Check frontend API client configuration  
3. Ensure proper error handling
4. Validate data transformation
5. Test with real API calls
```

#### C. Navigation Issues
```typescript
// Common routing failures and fixes:

// "Navigation to /path failed"
Fix: Ensure route is defined in router

// "Expected URL /x, found /y"
Fix: Update navigation logic and links

// Process:
1. Check route definitions
2. Verify navigation triggers
3. Ensure history updates
4. Test browser back/forward
```

### Step 4: Fix Validation

```yaml
for_each_fix:
  pre_checks:
    - Run only the specific failing test
    - Confirm it fails with expected error
    
  implementation:
    - Make minimal code change
    - Follow existing patterns
    - Add necessary types
    
  post_checks:
    - Run the specific test - must pass
    - Run related test suite - no regressions
    - Check browser console - no new errors
    - Verify visually if UI test
```

### Step 5: Progress Tracking

```typescript
interface FixProgress {
  totalTests: 1200;
  categories: {
    rendering: { total: 300, fixed: 0, remaining: 300 };
    navigation: { total: 200, fixed: 0, remaining: 200 };
    dataFetching: { total: 400, fixed: 0, remaining: 400 };
    interactions: { total: 200, fixed: 0, remaining: 200 };
    edgeCases: { total: 100, fixed: 0, remaining: 100 };
  };
  blockers: string[];
  nextPriority: string;
}
```

## Common Test Patterns and Solutions

### Pattern: "Element not found"
```typescript
// Debug approach:
1. console.log(document.body.innerHTML) in test
2. Check if component is wrapped in providers
3. Verify test waits for async rendering
4. Check for conditional rendering

// Fix template:
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Pattern: "Async data not loaded"
```typescript
// Debug approach:
1. Check if API mocks are set up
2. Verify loading states
3. Ensure proper await/waitFor usage

// Fix template:
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
expect(screen.getByText('Data')).toBeInTheDocument();
```

## Batch Fix Strategies

### Strategy: Fix all similar tests together
```bash
# Find all tests with same error pattern
grep -r "Cannot read properties of undefined" e2e/

# Apply same fix pattern to all
# Document the pattern for future reference
```

### Strategy: Component-focused fixing
```bash
# Fix all tests for one component
npm test -- --grep "RepositoryCard"

# Ensures component is fully functional
# Reduces context switching
```

## Success Metrics
- Test pass rate increases monotonically
- No regression in previously passing tests  
- Each fix has corresponding documentation
- Performance benchmarks maintained
- Code coverage increases

## Fix Documentation Template
```markdown
## Fix #XXX: [Component] - [Issue]

**Test**: `test-file.spec.ts:line`
**Error**: Exact error message
**Root Cause**: Why it was failing
**Solution**: What was changed
**Side Effects**: Any other tests affected
**Verification**: How to confirm fix works
```