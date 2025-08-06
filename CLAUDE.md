# Instructions for Claude AI Assistant

## Project Overview
Axiom Loom Catalog is a comprehensive developer portal showcasing repositories, APIs, and documentation. Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!

## Critical Build and Deployment Requirements

### NEVER Deploy Without Validation
**CORE PRINCIPLE: NO DEPLOYMENT WITHOUT SUCCESSFUL BUILD VALIDATION**

Before ANY deployment:
1. Run `./scripts/validate-build.sh` - MUST pass
2. Fix ALL TypeScript errors - Zero tolerance
3. Fix ALL ESLint errors - Zero tolerance  
4. Ensure ALL tests pass - 100% required
5. Manually test in browser - No console errors allowed

### Build Validation Checklist
- [ ] `npm run type-check` - 0 errors
- [ ] `npm run lint` - 0 errors
- [ ] `npm run build` - Completes successfully
- [ ] `npm run test:ci` - All tests pass
- [ ] Manual UI testing - No errors

## Critical Testing Requirements

### Mandatory Regression Testing Before Every Deployment
**CORE PRINCIPLE: EVERY CODE CHANGE MUST PASS FULL REGRESSION SUITE**

Before ANY deployment or restart:
1. Run the full test suite: `npm test`
2. Run E2E tests: `npm run test:e2e`
3. Manually test all critical user flows
4. Verify all API endpoints return 200 status
5. Check browser console for any errors

### Required Test Coverage for New Features
When adding ANY new feature:
1. **Component Tests**: Test that components render correctly
2. **Navigation Tests**: Test all links and navigation paths
3. **API Tests**: Test all new API endpoints
4. **Integration Tests**: Test component + API interactions
5. **E2E Tests**: Test complete user flows

### Critical Areas That MUST Be Tested
1. **All Navigation Links**: Every link must be tested to ensure no 404s
2. **API Endpoints**: Every endpoint must have unit and integration tests
3. **Route Definitions**: Every route must be tested for proper rendering
4. **Error Scenarios**: Test what happens when APIs fail
5. **Query Parameters**: Test all URL parameter variations

### 100% Document and Link Coverage
**CORE PRINCIPLE: WE TEST EVERY DOCUMENT IN EVERY REPO FOR CONTENT AND WE TEST EVERY LINK IN EVERY DOCUMENT AND THEN WE TEST THE DOCUMENTS AND ITS CONTENT APPEAR WHEN THE LINK IS CLICKED**

When implementing features or fixing bugs:
1. Always ensure document links work correctly
2. Test navigation between markdown files
3. Verify external links open in new tabs
4. Ensure internal links navigate within the app
5. Test that clicking links loads the correct content

### Performance Requirements
- Use local-first caching for repositories
- Only sync on user request (not on load)
- Optimize all API calls
- Implement lazy loading for components

### UI/UX Requirements
- All repositories with Postman collections must show Postman button
- GraphQL repositories must have working playground links
- Marketing descriptions must be human-friendly (no markdown syntax)
- Repository detail pages must show business value and categorizations
- Document navigation must support relative links

### Code Quality Standards
- Fix all TypeScript compilation errors before claiming completion
- Run build and ensure no errors
- Test all features manually
- Use proper error handling
- Follow existing code patterns

### Testing Approach - MANDATORY FOR FRONTEND UIs
**CORE PRINCIPLE: NO SUCCESS WITHOUT FULL REGRESSION SUITE**

For ANY project with frontend UIs, you MUST NOT finish or declare success until:

1. **Content Testing**: Verify all text, images, and components render correctly
2. **Click-through User Experience**: Test every button, link, form, and navigation
3. **Backend Integration**: Verify all API calls, data flow, and error handling
4. **Link Validation**: Test every internal and external link works correctly  
5. **Full Regression Suite**: Run complete end-to-end tests that simulate real users

**DEPLOYMENT PIPELINE REQUIREMENTS:**
- Unit tests for utility functions
- Integration tests for API endpoints  
- E2E tests with Playwright for user journeys
- Automated click-through testing of ALL UI elements
- Link validation for all documents
- Backend API integration verification
- Error boundary and error handling validation
- Performance and load testing
- Cross-browser compatibility testing

**YOU WILL NOT DECLARE SUCCESS OR FINISH UNTIL:**
- Real browser tests pass showing actual user experience
- Every UI element has been clicked and verified
- Every API endpoint has been tested end-to-end  
- Error scenarios have been tested and verified
- Users can complete full workflows without issues

### Key Features to Maintain
1. Repository browsing with marketing descriptions
2. API detection (OpenAPI, GraphQL, gRPC)
3. Postman collection discovery
4. Document viewer with link navigation
5. Search functionality
6. Sync on demand (not automatic)
7. Local caching for performance

## Remember
- Test everything before claiming it works
- No broken links, ever
- Performance matters - cache aggressively
- User experience is paramount