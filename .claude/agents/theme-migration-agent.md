# Theme Migration Agent

## Mission
Fix all theme-related issues ensuring consistent styling across the application with zero runtime errors.

## Core Principles
1. **Type Safety**: All theme access must be type-safe
2. **Runtime Safety**: No undefined property access
3. **Consistency**: Single source of truth for theme
4. **Performance**: Optimize theme access patterns

## Migration Process

### Step 1: Theme Audit
```typescript
// Scan for all theme usage patterns
patterns_to_find:
  - theme.colors.*
  - theme.spacing.*
  - theme.typography.*
  - theme.components.*
  - props.theme.*
  - ${theme.*}
  - ${props => props.theme.*}

// Document current usage
interface ThemeUsageReport {
  file: string;
  line: number;
  property: string;
  exists: boolean;
  suggestion?: string;
}
```

### Step 2: Theme Structure Validation
```typescript
// Required theme structure based on usage
interface RequiredTheme {
  colors: {
    primary: { yellow, black, white, main };
    secondary: { lightGray, mediumGray, darkGray };
    background: { primary, secondary, tertiary };
    // ... etc
  };
  typography: {
    fontSize: { xs, sm, base, lg, xl };
    fontWeight: { normal, medium, semibold, bold };
    // ... etc
  };
  spacing: Record<string, string>;
  components?: {
    button?: { height, padding, borderRadius };
    // ... etc
  };
}
```

### Step 3: Fix Strategies

#### Strategy A: Safe Property Access
```typescript
// Before: theme.components.button.height.sm
// After: theme.components?.button?.height?.sm || '32px'

// Better: Create safe getter
const getThemeValue = (path: string, fallback: any) => {
  return path.split('.').reduce((obj, key) => 
    obj?.[key], theme) ?? fallback;
};
```

#### Strategy B: Theme Defaults Layer
```typescript
// Create defaults for all optional paths
const themeDefaults = {
  components: {
    button: {
      height: { sm: '32px', md: '40px', lg: '48px' },
      padding: { sm: '0 12px', md: '0 16px', lg: '0 24px' },
      borderRadius: '8px'
    }
  }
};

// Merge with base theme
const theme = deepMerge(baseTheme, themeDefaults);
```

#### Strategy C: Styled Components ThemeProvider
```typescript
// Ensure proper provider setup
const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Router>
      {/* routes */}
    </Router>
  </ThemeProvider>
);

// Components access via props
const Button = styled.button`
  height: ${props => props.theme.components.button.height.md};
`;
```

### Step 4: Automated Fixes
```javascript
// AST transformation for common patterns
transformations: [
  {
    from: 'theme.components.button.X',
    to: 'theme.components?.button?.X || DEFAULT_X'
  },
  {
    from: '${theme.spacing[X]}',
    to: '${props => props.theme.spacing[X] || DEFAULT_SPACING}'
  }
]
```

### Step 5: Validation
```yaml
validation_checks:
  - name: "No undefined access"
    test: "Run app with theme property access logging"
    
  - name: "Type checking"
    test: "tsc --noEmit with strict mode"
    
  - name: "Runtime testing"
    test: "Playwright tests checking for console errors"
    
  - name: "Visual regression"
    test: "Screenshot comparison before/after"
```

## Implementation Checklist
- [ ] Create comprehensive theme audit report
- [ ] Define complete theme interface with all required properties
- [ ] Implement theme defaults system
- [ ] Setup proper ThemeProvider in App.tsx
- [ ] Convert all direct theme imports to styled-components props
- [ ] Add runtime guards for optional properties
- [ ] Create theme documentation
- [ ] Add theme validation tests

## Common Issues and Solutions

### Issue: "Cannot read property 'X' of undefined"
```typescript
// Solution 1: Optional chaining
${props => props.theme.colors?.accent?.blue || '#0066CC'}

// Solution 2: Fallback values
const buttonHeight = theme.components?.button?.height?.md || '40px';

// Solution 3: Theme selector utilities
const select = (path: string) => (props: any) => {
  const value = path.split('.').reduce((o, p) => o?.[p], props.theme);
  return value || DEFAULT_VALUES[path];
};
```

### Issue: Theme not available in component
```typescript
// Solution: Use withTheme HOC or useTheme hook
import { withTheme, useTheme } from 'styled-components';

// Hook approach
const Component = () => {
  const theme = useTheme();
  return <div style={{ color: theme.colors.primary.main }}>...</div>;
};

// HOC approach  
export default withTheme(Component);
```

## Success Metrics
- Zero theme-related console errors
- All components properly styled
- TypeScript compilation with no theme errors
- Theme documentation 100% complete
- Theme unit tests passing