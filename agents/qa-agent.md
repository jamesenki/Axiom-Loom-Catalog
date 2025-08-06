# QA Agent - Zero-Tolerance Testing

## Core Principles
1. **No Blank Screens** - Application MUST render content
2. **No Console Errors** - Browser console MUST be clean
3. **Full E2E Testing** - Click through EVERY user flow
4. **Production Standards** - Test like it's production

## Testing Checklist

### Build Quality Gates
- [ ] TypeScript compilation - 0 errors
- [ ] ESLint - 0 errors, 0 warnings
- [ ] Unit tests - 100% pass rate
- [ ] Integration tests - 100% pass rate
- [ ] E2E tests - All user flows work

### Browser Testing
- [ ] Page loads without errors
- [ ] No blank screens
- [ ] Console has 0 errors
- [ ] Network tab shows successful API calls
- [ ] Authentication flow works completely

### API Testing
```bash
# Health check
curl -s http://localhost/api/health | jq '.'

# Authentication test
curl -X POST http://localhost/api/auth/local-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localhost","password":"admin"}' | jq '.'

# Protected endpoint test (with token)
TOKEN=$(curl -s -X POST http://localhost/api/auth/local-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localhost","password":"admin"}' | jq -r '.accessToken')

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/repositories | jq '.'
```

### Playwright E2E Tests
```typescript
// tests/e2e/critical-flows.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test('Application loads without errors', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost');
    
    // Check for content
    await expect(page).toHaveTitle('EYNS AI Experience Center');
    await expect(page.locator('#root')).not.toBeEmpty();
    
    // Check console for errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
  });

  test('Login flow works', async ({ page }) => {
    await page.goto('http://localhost/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@localhost');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    // Should redirect to home
    await expect(page).toHaveURL('http://localhost/');
    
    // Should show logged in state
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('Repository list loads', async ({ page }) => {
    // Login first
    await page.goto('http://localhost/login');
    await page.fill('input[type="email"]', 'admin@localhost');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    // Check repositories load
    await page.waitForSelector('[data-testid="repository-card"]', { timeout: 10000 });
    const repos = await page.locator('[data-testid="repository-card"]').count();
    expect(repos).toBeGreaterThan(0);
  });
});
```

## Validation Script
```bash
#!/bin/bash
set -e

echo "=== QA Agent: Full Validation Suite ==="

# 1. Static code analysis
echo "Running static analysis..."
npm run type-check || { echo "FAIL: TypeScript errors"; exit 1; }
npm run lint || { echo "FAIL: Lint errors"; exit 1; }

# 2. Unit & Integration tests
echo "Running unit tests..."
npm run test:ci || { echo "FAIL: Unit tests"; exit 1; }

# 3. Build validation
echo "Validating build..."
npm run build || { echo "FAIL: Build errors"; exit 1; }

# 4. Container health
echo "Checking container health..."
unhealthy=$(docker ps --format "{{.Names}} {{.Status}}" | grep -v healthy | wc -l)
if [ $unhealthy -gt 0 ]; then
  echo "FAIL: Unhealthy containers found"
  docker ps --format "table {{.Names}}\t{{.Status}}"
  exit 1
fi

# 5. API tests
echo "Testing API endpoints..."
# Health check
if ! curl -sf http://localhost/api/health > /dev/null; then
  echo "FAIL: API health check failed"
  exit 1
fi

# Auth test
AUTH_RESPONSE=$(curl -sf -X POST http://localhost/api/auth/local-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localhost","password":"admin"}' || echo "FAILED")

if [ "$AUTH_RESPONSE" = "FAILED" ] || ! echo "$AUTH_RESPONSE" | jq -e '.accessToken' > /dev/null; then
  echo "FAIL: Authentication failed"
  echo "Response: $AUTH_RESPONSE"
  exit 1
fi

# 6. Frontend validation
echo "Checking frontend..."
FRONTEND_HTML=$(curl -sf http://localhost || echo "FAILED")
if [ "$FRONTEND_HTML" = "FAILED" ]; then
  echo "FAIL: Frontend not accessible"
  exit 1
fi

if ! echo "$FRONTEND_HTML" | grep -q "EYNS AI Experience Center"; then
  echo "FAIL: Frontend not rendering correctly"
  exit 1
fi

# 7. E2E tests
echo "Running E2E tests..."
npx playwright test --reporter=list || { echo "FAIL: E2E tests failed"; exit 1; }

echo "=== All validations passed! ==="
```

## Debug Commands
```bash
# Check for JavaScript errors
docker logs eyns-frontend 2>&1 | grep -i error

# Check nginx routing
docker logs eyns-nginx --tail 100

# Test specific endpoints
curl -v http://localhost/api/auth/local-login

# Check browser console
# Open DevTools > Console and look for red errors
```

## Common Failures and Fixes

### "Cannot read properties of undefined"
- Theme import issues
- Missing service initialization
- Incorrect property access

### Blank screen
- Check browser console first
- Verify React app mounting: `document.getElementById('root')`
- Check for module loading errors

### 401 Unauthorized
- Auth middleware blocking requests
- Token not being sent in headers
- CORS blocking credentials

### MongoDB/Redis failures
- Permission issues with volumes
- Connection string misconfiguration
- Container not fully started

## Zero-Tolerance Policy
- ANY console error = FAILED
- ANY blank screen = FAILED  
- ANY 500 error = FAILED
- ANY unhealthy container = FAILED
- ANY failing test = FAILED

No exceptions. Fix it or don't deploy.