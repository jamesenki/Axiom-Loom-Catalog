# EYNS AI Experience Center - Development Rules

**Version**: 1.0  
**Date**: July 28, 2025  
**Enforcement**: Mandatory for all contributors

## 🏗️ Architecture Principles

### Clean Architecture
- **Domain Independence**: Business logic must not depend on frameworks, UI, or external concerns
- **Dependency Inversion**: High-level modules must not depend on low-level modules
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed Principle**: Open for extension, closed for modification
- **Interface Segregation**: Clients should not depend on interfaces they don't use

### Clean Code Standards
- **Meaningful Names**: Use intention-revealing names for variables, functions, and classes
- **Functions**: Keep functions small (< 20 lines), do one thing well
- **Comments**: Code should be self-documenting; comments explain WHY, not WHAT
- **Error Handling**: Use exceptions, not error codes; handle errors gracefully
- **Formatting**: Consistent indentation, spacing, and organization

## 🔄 Development Workflow

### Trunk-Based Development
- **Single Branch**: All development happens on `main` branch
- **Small Commits**: Frequent, small commits with clear messages
- **Feature Flags**: Use feature flags for incomplete features
- **Continuous Integration**: All commits must pass automated tests
- **No Long-Lived Branches**: Avoid feature branches lasting > 1 day

### Commit Standards
```bash
# Format: <type>(<scope>): <description>
feat(sync): add manual repository sync button
fix(docs): resolve emoji rendering in markdown viewer
test(api): add integration tests for GitHub API calls
refactor(ui): extract repository card component
docs(spec): update requirements checklist
```

### Increment Rules
- **After Each Value Increment**: Update checklist and commit immediately
- **Commit Message**: Must reference checklist item completed
- **Testing**: All new functionality must have tests before commit
- **Documentation**: Update relevant docs with each functional change

## 🧪 Testing Requirements

### 100% Test Coverage (Enforced)
- **Unit Tests**: Every function, component, and class
- **Integration Tests**: All API calls and external dependencies
- **End-to-End Tests**: Complete user journeys with Playwright
- **Performance Tests**: Load time and sync performance validation
- **Accessibility Tests**: WCAG 2.1 AA compliance verification

### Test Structure
```typescript
// Unit Test Example
describe('RepositorySync', () => {
  it('should sync repository content successfully', async () => {
    // Arrange
    const mockRepo = createMockRepository();
    
    // Act
    const result = await syncRepository(mockRepo);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.lastSyncTime).toBeDefined();
  });
});
```

### Playwright E2E Rules
- **User Journey Focus**: Test complete workflows, not individual components
- **Cross-Browser**: Test on Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Validate responsive design and touch interactions
- **Visual Regression**: Screenshot comparison for UI consistency
- **Performance**: Measure and validate load times

## 📝 TypeScript Standards

### Strict Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Safety Rules
- **No `any` Types**: Use proper typing or `unknown` with type guards
- **Interface First**: Define interfaces before implementations
- **Generic Constraints**: Use proper generic constraints for reusability
- **Null Safety**: Handle null/undefined explicitly
- **Type Guards**: Use type guards for runtime type checking

### Code Organization
```typescript
// File structure example
src/
├── domain/           # Business logic (no framework dependencies)
├── infrastructure/   # External concerns (GitHub API, storage)
├── application/      # Use cases and application services
├── presentation/     # React components and UI logic
└── shared/          # Common utilities and types
```

## 🔧 Code Quality Tools

### Required Tools
- **ESLint**: Code linting with strict rules
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality gates
- **SonarQube**: Code quality and security analysis
- **TypeScript**: Strict type checking

### Pre-Commit Hooks
```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test:unit
npm run format:check
```

### Quality Gates
- **Build**: Must compile without errors or warnings
- **Lint**: Zero ESLint violations
- **Tests**: 100% test coverage, all tests pass
- **Types**: Zero TypeScript errors
- **Format**: Code must be properly formatted

## 🚀 Deployment Standards

### Continuous Delivery
- **Automated Pipeline**: Every commit triggers build and test
- **Environment Promotion**: Dev → Staging → Production
- **Zero-Downtime**: Rolling deployments with health checks
- **Rollback Ready**: Ability to rollback within 5 minutes
- **Infrastructure as Code**: All infrastructure defined in code

### Environment Configuration
```bash
# Environment variables
REACT_APP_GITHUB_TOKEN=<token>
REACT_APP_GITHUB_ORG=20230011612_EYGS
REACT_APP_ENVIRONMENT=<dev|staging|prod>
REACT_APP_API_BASE_URL=<api-url>
```

### Security Requirements
- **No Secrets in Code**: Use environment variables or secret management
- **HTTPS Only**: All communication must be encrypted
- **Input Validation**: Validate all user inputs
- **Error Handling**: Don't expose internal errors to users
- **Dependency Scanning**: Regular security scans of dependencies

## 📊 Performance Standards

### Performance Targets (Enforced)
- **Initial Load**: < 2 seconds
- **Repository Sync**: < 5 seconds
- **API Response**: < 500ms average
- **Bundle Size**: < 1MB gzipped
- **Lighthouse Score**: > 90 all categories

### Optimization Rules
- **Lazy Loading**: Load components and data on demand
- **Code Splitting**: Split bundles by routes and features
- **Caching**: Implement proper caching strategies
- **Image Optimization**: Compress and optimize all images
- **Bundle Analysis**: Regular bundle size monitoring

## 🎨 UI/UX Standards

### Design Principles
- **Mobile First**: Design for mobile, enhance for desktop
- **Accessibility**: WCAG 2.1 AA compliance mandatory
- **Consistency**: Use design system components
- **Performance**: Prioritize perceived performance
- **Usability**: User testing for critical flows

### Component Standards
```typescript
// Component structure
interface ComponentProps {
  // Props with clear types
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Hooks at top
  // Event handlers
  // Render logic
  
  return (
    <div className="component-container">
      {/* JSX with semantic HTML */}
    </div>
  );
};
```

### Styling Rules
- **Tailwind CSS**: Use utility-first approach
- **Responsive Design**: Mobile, tablet, desktop breakpoints
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus States**: Visible focus indicators for keyboard navigation
- **Loading States**: Clear loading indicators for all async operations

## 🔍 Code Review Guidelines

### Review Checklist
- [ ] **Functionality**: Does the code do what it's supposed to do?
- [ ] **Tests**: Are there adequate tests with good coverage?
- [ ] **Performance**: Are there any performance implications?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Maintainability**: Is the code easy to understand and modify?

### Review Process
1. **Self Review**: Author reviews their own code first
2. **Automated Checks**: All CI checks must pass
3. **Peer Review**: At least one team member review
4. **Documentation**: Update docs if functionality changes
5. **Merge**: Only after all checks and approvals

## 📚 Documentation Standards

### Required Documentation
- **README**: Clear setup and usage instructions
- **API Docs**: All public APIs documented
- **Architecture**: High-level system design
- **Deployment**: Step-by-step deployment guide
- **Troubleshooting**: Common issues and solutions

### Documentation Rules
- **Keep Updated**: Documentation must match current implementation
- **User Focused**: Write for the intended audience
- **Examples**: Include practical examples
- **Searchable**: Structure for easy searching
- **Version Control**: Documentation in same repo as code

## 🚨 Error Handling

### Error Handling Strategy
- **Fail Fast**: Detect errors early and fail quickly
- **Graceful Degradation**: Provide fallbacks for non-critical features
- **User Friendly**: Show helpful error messages to users
- **Logging**: Log errors with context for debugging
- **Recovery**: Provide ways to recover from errors

### Error Types
```typescript
// Custom error types
class RepositorySyncError extends Error {
  constructor(
    message: string,
    public readonly repositoryName: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'RepositorySyncError';
  }
}
```

## 🔒 Security Guidelines

### Security Requirements
- **Input Validation**: Validate and sanitize all inputs
- **Output Encoding**: Encode outputs to prevent XSS
- **Authentication**: Secure token handling
- **Authorization**: Proper access controls
- **Audit Logging**: Log security-relevant events

### Secure Coding Practices
- **Principle of Least Privilege**: Minimal required permissions
- **Defense in Depth**: Multiple security layers
- **Secure by Default**: Secure default configurations
- **Regular Updates**: Keep dependencies updated
- **Security Testing**: Regular security scans and penetration testing

---

## 🎯 Enforcement

### Automated Enforcement
- **CI Pipeline**: Automated checks for all rules
- **Quality Gates**: Prevent merging non-compliant code
- **Metrics Dashboard**: Track compliance metrics
- **Alerts**: Notify team of violations
- **Reports**: Regular compliance reports

### Manual Enforcement
- **Code Reviews**: Human verification of rule compliance
- **Team Meetings**: Regular discussion of rule updates
- **Training**: Ongoing education on best practices
- **Retrospectives**: Learn from rule violations
- **Continuous Improvement**: Regular rule updates

**These rules are living guidelines that evolve with the project. All team members are responsible for following and improving these standards.**

---

**Last Updated**: July 28, 2025  
**Next Review**: Monthly or after major changes  
**Responsible**: All team members
