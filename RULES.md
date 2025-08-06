# EYNS AI Experience Center Testing Rules

## 100% DOCUMENT AND LINK TESTING COVERAGE

### Core Principle
**WE TEST EVERY DOCUMENT IN EVERY REPO FOR CONTENT AND WE TEST EVERY LINK IN EVERY DOCUMENT AND THEN WE TEST THE DOCUMENTS AND ITS CONTENT APPEAR WHEN THE LINK IS CLICKED**

### Testing Requirements

#### 1. Document Content Testing
- **Every markdown file** in every repository must be tested for:
  - File exists and is readable
  - Content loads without errors
  - Markdown renders correctly
  - All headings are navigable
  - Code blocks are syntax highlighted
  - Images load properly
  - Tables render correctly
  - Lists (ordered/unordered) display properly

#### 2. Link Testing
- **Every link** in every document must be tested for:
  - Internal markdown links navigate to the correct document
  - External HTTP/HTTPS links are valid (200 OK)
  - Anchor links (#section) scroll to the correct section
  - Relative links (../docs/api.md) resolve correctly
  - Links with .md extension work properly
  - Links without .md extension resolve correctly

#### 3. Navigation Testing
- **Every navigation action** must be tested:
  - Clicking a link loads the target document
  - Browser back/forward buttons work correctly
  - Deep linking to specific documents works
  - Query parameters are preserved during navigation
  - Hash fragments (#section) are handled properly

#### 4. API Documentation Testing
- **Every API endpoint** must have:
  - Complete documentation
  - Working examples
  - Response samples
  - Error scenarios documented
  - Authentication requirements clear

#### 5. UI Element Testing
- **Every interactive element** must be tested:
  - Buttons are clickable and perform expected actions
  - Forms validate and submit correctly
  - Modals open and close properly
  - Tooltips appear on hover
  - Dropdowns expand and select correctly
  - Search functionality returns relevant results

#### 6. Cross-Repository Testing
- **Every repository integration** must be tested:
  - Repository cards link to detail pages
  - API explorer shows all detected APIs
  - Postman collections are discoverable
  - GraphQL playgrounds launch correctly
  - Documentation links work across repositories

### Test Implementation

#### Playwright E2E Tests
```typescript
// Example test structure
test.describe('Document and Link Coverage', () => {
  test('should load every markdown file', async ({ page }) => {
    const repos = await getRepositories();
    for (const repo of repos) {
      const docs = await getMarkdownFiles(repo);
      for (const doc of docs) {
        await page.goto(`/docs/${repo}/${doc}`);
        await expect(page.locator('main')).toContainText(/.+/);
      }
    }
  });

  test('should validate every link', async ({ page }) => {
    const links = await page.locator('a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href?.startsWith('http')) {
        const response = await fetch(href);
        expect(response.status).toBe(200);
      } else {
        await link.click();
        await expect(page).toHaveURL(new RegExp(href));
      }
    }
  });
});
```

#### Unit Tests
```typescript
// Test markdown link parsing
describe('Markdown Link Navigation', () => {
  it('should parse relative links correctly', () => {
    const links = parseMarkdownLinks(content);
    links.forEach(link => {
      expect(resolvePath(link)).toBeDefined();
    });
  });
});
```

### Continuous Monitoring

#### 1. Pre-commit Hooks
- Validate all markdown files in changed repositories
- Check for broken links in modified documents
- Ensure new documents are added to test suites

#### 2. CI/CD Pipeline
- Run full document and link tests on every PR
- Generate coverage reports for documentation
- Block merges if any links are broken
- Alert on missing documentation

#### 3. Scheduled Tests
- Daily full repository scan for broken links
- Weekly performance tests on document loading
- Monthly accessibility audit on all documents

### Reporting

#### Coverage Metrics
- Total documents tested: X/Y (100% required)
- Total links tested: X/Y (100% required)
- Navigation paths tested: X/Y (100% required)
- API endpoints documented: X/Y (100% required)

#### Failure Reporting
- Exact file and line number of broken link
- Type of failure (404, timeout, navigation error)
- Screenshot at point of failure
- Steps to reproduce

### Developer Guidelines

1. **Before committing:**
   - Run `npm run test:links` locally
   - Verify all new documents are tested
   - Update link tests for new navigation paths

2. **When adding documents:**
   - Add corresponding test cases
   - Verify all links in the document
   - Test navigation to and from the document

3. **When modifying navigation:**
   - Update all affected link tests
   - Test browser history behavior
   - Verify deep linking still works

### Zero Tolerance Policy
- **NO BROKEN LINKS** - Ever
- **NO UNTESTED DOCUMENTS** - Ever
- **NO MISSING NAVIGATION TESTS** - Ever

Every document, every link, every time. No exceptions.