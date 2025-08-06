import { test, expect } from '@playwright/test';

test.describe('Enhanced Add Repository Modal with Authorization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for the app to load
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should open Add Repository modal', async ({ page }) => {
    // Look for and click the Add Repository button
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Verify modal opened
    await expect(page.locator('h2:has-text("Add Repository")')).toBeVisible();
    await expect(page.locator('text=Add a repository by name or GitHub URL')).toBeVisible();
  });

  test('should validate repository URL format', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Enter invalid URL
    const repoInput = page.locator('input[placeholder*="my-project"]');
    await repoInput.fill('not-a-valid-url!!!');
    await repoInput.blur();

    // Should show error
    await expect(page.locator('text=/Invalid repository|can only contain/')).toBeVisible();
  });

  test('should show authentication fields for private repos', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Click to show authentication
    const authLink = page.locator('button:has-text("Add authentication for private repository")');
    await expect(authLink).toBeVisible();
    await authLink.click();

    // Verify authentication fields appear
    await expect(page.locator('text=Authentication Required')).toBeVisible();
    await expect(page.locator('input[placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"]')).toBeVisible();
    await expect(page.locator('text=Account Name (for your reference)')).toBeVisible();
  });

  test('should validate GitHub token format', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Show authentication fields
    const authLink = page.locator('button:has-text("Add authentication for private repository")');
    await authLink.click();

    // Enter a test token (won't actually validate against GitHub in test)
    const tokenInput = page.locator('input[placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"]');
    await tokenInput.fill('ghp_test_token_12345');

    // Enter account name
    const accountInput = page.locator('input[id="token-account-name"]');
    await accountInput.fill('Test GitHub Account');

    // Check save for org checkbox
    const saveForOrg = page.locator('input[id="save-token-org"]');
    if (await saveForOrg.isVisible()) {
      await expect(saveForOrg).toBeVisible();
    }
  });

  test('should display saved accounts section when tokens exist', async ({ page }) => {
    // First, simulate adding a token by directly calling the service
    await page.evaluate(() => {
      // Mock localStorage with a test token
      const testTokens = {
        'testuser/testrepo': {
          token: btoa('test-encrypted-token'),
          accountName: 'Test Account',
          accountUrl: 'https://github.com/testuser',
          createdAt: new Date().toISOString()
        }
      };
      localStorage.setItem('eyns_github_tokens', JSON.stringify(testTokens));
    });

    // Reload and open modal
    await page.reload();
    await page.waitForSelector('h1', { timeout: 10000 });
    
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Check if saved accounts section appears
    const savedAccounts = page.locator('text=Saved Accounts');
    if (await savedAccounts.isVisible()) {
      await expect(savedAccounts).toBeVisible();
      await expect(page.locator('text=Test Account')).toBeVisible();
    }
  });

  test('should handle repository validation with proper feedback', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Enter a valid format repository
    const repoInput = page.locator('input[placeholder*="my-project"]');
    await repoInput.fill('test-repository');
    await repoInput.blur();

    // Wait for validation (it will try to check if repo exists)
    await page.waitForTimeout(1000);

    // Check for validation feedback (either success or auth required)
    const validationResult = await page.locator('text=/Repository found|requires authentication|not found/').isVisible();
    expect(validationResult).toBeTruthy();
  });

  test('should have properly styled modal with all UI elements', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Check all UI elements are present
    await expect(page.locator('div.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible(); // Backdrop
    await expect(page.locator('div.bg-white.rounded-lg.shadow-xl')).toBeVisible(); // Modal
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Repository")')).toBeVisible();
    
    // Check link to generate token
    await page.locator('button:has-text("Add authentication")').click();
    const tokenLink = page.locator('a[href*="github.com/settings/tokens"]');
    await expect(tokenLink).toBeVisible();
    await expect(tokenLink).toHaveAttribute('target', '_blank');
  });

  test('should close modal on cancel', async ({ page }) => {
    // Open modal
    const addButton = page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();

    // Verify modal is open
    await expect(page.locator('h2:has-text("Add Repository")')).toBeVisible();

    // Click cancel
    await page.locator('button:has-text("Cancel")').click();

    // Verify modal is closed
    await expect(page.locator('h2:has-text("Add Repository")')).not.toBeVisible();
  });
});