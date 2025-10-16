# AI Predictive Maintenance Engine Workflow Tests

This directory contains comprehensive E2E tests specifically designed to validate the exact user workflow for the AI Predictive Maintenance Engine Architecture documentation flow.

## Test Overview

The tests follow the EXACT user workflow specified:

1. **Navigation**: Navigate to `http://10.0.0.109:3000/`
2. **Discovery**: Find the "AI Predictive Maintenance Engine Architecture" card
3. **Click Documentation**: Click specifically the "Documentation" button (not other buttons)
4. **Verify URL**: Ensure navigation to `http://10.0.0.109:3000/docs/ai-predictive-maintenance-engine-architecture`
5. **Screenshot Capture**: Take comprehensive screenshots at each step
6. **Content Verification**: Check if README content is displayed
7. **Link Testing**: Look for and test Demo/Implementation Guide links within README content
8. **Error Detection**: Report any 404 errors or broken navigation

## Test Files

### 1. `ai-predictive-maintenance-workflow.spec.ts`
**Purpose**: Basic workflow test following the exact specified steps
**Features**:
- Direct workflow implementation
- Screenshot capture at each step
- Basic error detection and reporting
- Link validation within README content

### 2. `ai-predictive-maintenance-enhanced.spec.ts`
**Purpose**: Enhanced version with comprehensive debugging and error handling
**Features**:
- Multiple fallback strategies for element discovery
- Comprehensive console error logging
- Network request monitoring
- Detailed debugging information
- Advanced content analysis
- Extended timeout handling

## Configuration

### `playwright.config.ip.ts`
Specialized Playwright configuration for testing against the specific IP address `10.0.0.109:3000`:
- Extended timeouts for network operations
- Single worker for sequential testing
- Enhanced error reporting
- Screenshot capture on failure
- Specialized browser launch options

## Running the Tests

### Quick Start
```bash
# Run basic workflow test
npm run test:ip

# Run enhanced test with debugging
npm run test:ip:enhanced

# Run with browser visible (headed mode)
npm run test:ip:headed

# Run in debug mode with step-by-step execution
npm run test:ip:debug
```

### Manual Execution
```bash
# Using the test runner script
./run-ip-test.sh

# Direct Playwright execution
npx playwright test ai-predictive-maintenance-workflow.spec.ts --config=playwright.config.ip.ts

# With specific browser
npx playwright test ai-predictive-maintenance-enhanced.spec.ts --config=playwright.config.ip.ts --project=chromium
```

## Test Output

### Screenshots
All tests capture comprehensive screenshots saved to `e2e/screenshots/`:
- `01-homepage-loaded.png` - Initial homepage load
- `02-debug-no-card-found.png` - Debug screenshot if card not found
- `03-debug-no-doc-button.png` - Debug screenshot if documentation button not found
- `04-before-doc-button-click.png` - Before clicking documentation
- `05-documentation-page-loaded.png` - Documentation page after navigation
- `06-debug-no-readme.png` - Debug if README content not found
- `07-no-demo-links-found.png` - Debug if no demo links found
- `08-before-link-X-click.png` - Before clicking each demo link
- `09-after-link-X-click.png` - After clicking each demo link
- `10-final-test-complete.png` - Final test completion

### Reports
- `test-results/ip-results.json` - Detailed JSON test results
- `playwright-report-ip/` - HTML report for visual analysis

## Error Handling

The tests include comprehensive error handling for common issues:

### Element Discovery Issues
- Multiple selector strategies for finding the target card
- Fallback mechanisms for button discovery
- Comprehensive page content analysis when elements aren't found

### Network Issues
- Extended timeouts for slower connections
- Network request monitoring and logging
- Retry mechanisms for transient failures

### Content Issues
- Analysis of page structure when expected content isn't found
- Listing of available content for debugging
- Screenshot capture at failure points

## Test Strategies

### Card Discovery
1. **Exact Text Match**: `text="AI Predictive Maintenance Engine Architecture"`
2. **Partial Text Match**: `text="Predictive Maintenance"`
3. **Heading Search**: Search through all headings for matching content
4. **Element Content Search**: Check text content of all elements
5. **Interactive Element Search**: Focus on links and buttons

### Documentation Button Discovery
1. **Exact Text Button**: `button:has-text("Documentation")`
2. **Exact Text Link**: `a:has-text("Documentation")`
3. **Partial Text Matching**: `button:has-text("Doc")`
4. **Data Test ID**: `[data-testid*="documentation"]`
5. **Aria Label**: `[aria-label*="Documentation"]`
6. **Title Attribute**: `[title*="Documentation"]`

### Link Testing
- Identifies Demo, Implementation Guide, and similar links
- Tests actual navigation and response codes
- Captures screenshots of link destinations
- Reports 404 errors and broken links
- Validates content loading

## Advanced Features

### Network Monitoring
- Tracks all HTTP requests and responses
- Identifies failed requests (4xx, 5xx status codes)
- Logs network timing information
- Detects connectivity issues

### Console Logging
- Captures JavaScript console errors
- Tracks warnings and debug messages
- Provides detailed error context
- Helps identify client-side issues

### Content Analysis
- Analyzes page structure and content
- Detects README-like content patterns
- Validates documentation formatting
- Identifies broken or missing content

## Troubleshooting

### Common Issues

**Card Not Found**
- Check if the repository data has loaded
- Verify the exact card title in the UI
- Review debug screenshots for page content

**Documentation Button Not Found**
- Ensure the card contains the expected buttons
- Check if button text differs from expected
- Review card structure in debug output

**Navigation Failures**
- Verify the target URL is accessible
- Check network connectivity to `10.0.0.109:3000`
- Review browser console for JavaScript errors

**Link Testing Failures**
- Verify README content contains the expected links
- Check if links are relative vs absolute
- Ensure target pages exist and are accessible

### Debug Information

The enhanced test provides extensive debug information:
- Page content analysis
- Element discovery attempts
- Network request/response logging
- Console error capture
- Screenshot evidence at each step

## Maintenance

### Updating Selectors
If UI changes require selector updates:
1. Run tests in debug mode to see current page structure
2. Update selectors in the test files
3. Test with both basic and enhanced test versions
4. Update this documentation with new patterns

### Adding New Test Cases
1. Follow the existing pattern structure
2. Add comprehensive screenshot capture
3. Include error handling and fallbacks
4. Document new test scenarios in this file

## Integration

These tests are designed to integrate with:
- CI/CD pipelines for regression testing
- Manual QA workflows
- Deployment validation processes
- User acceptance testing procedures

The tests provide detailed output suitable for automated reporting and human review.