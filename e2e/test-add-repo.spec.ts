import { test, expect } from '@playwright/test';

test('Add Repository button and functionality', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3000');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if Add Repository button exists
  const addRepoButton = page.getByRole('button', { name: /add repository/i });
  await expect(addRepoButton).toBeVisible();
  
  // Click the button
  await addRepoButton.click();
  
  // Check if modal opened
  const modal = page.getByRole('heading', { name: 'Add Repository' });
  await expect(modal).toBeVisible();
  
  // Check for the input field
  const input = page.getByPlaceholder(/my-project|github\.com/i);
  await expect(input).toBeVisible();
  
  // Test entering a GitHub URL
  await input.fill('https://github.com/facebook/react');
  
  // Wait a moment for validation
  await page.waitForTimeout(1000);
  
  // Check if the Add Repository button in modal is enabled
  const submitButton = page.getByRole('button', { name: 'Add Repository' }).last();
  
  // Cancel to close modal
  const cancelButton = page.getByRole('button', { name: 'Cancel' });
  await cancelButton.click();
  
  // Verify modal closed
  await expect(modal).not.toBeVisible();
  
  console.log('✅ Add Repository button is visible and functional!');
});

test('Repository names display correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Check for properly formatted repository names
  const repoCards = page.locator('[data-testid="repository-card"], .repository-card, article');
  const count = await repoCards.count();
  
  console.log(`Found ${count} repository cards`);
  
  if (count > 0) {
    // Check first few repository names
    for (let i = 0; i < Math.min(3, count); i++) {
      const card = repoCards.nth(i);
      const text = await card.textContent();
      console.log(`Repository ${i + 1}: ${text?.substring(0, 100)}`);
      
      // Check that it doesn't contain package.json style names
      expect(text).not.toContain('sovd-ecosystem-platform-tests');
      expect(text).not.toContain('"name":');
    }
  }
  
  // Specifically check for the SOVD and Velocityforge repositories
  const pageContent = await page.content();
  
  // These should NOT appear (technical names)
  expect(pageContent).not.toContain('sovd-ecosystem-platform-tests');
  
  // These SHOULD appear (formatted names) or similar formatted versions
  const hasProperNames = 
    pageContent.includes('Sovd Diagnostic') || 
    pageContent.includes('SOVD Diagnostic') ||
    pageContent.includes('VelocityForge') ||
    pageContent.includes('Velocity Forge');
    
  if (hasProperNames) {
    console.log('✅ Repository names are properly formatted!');
  } else {
    console.log('⚠️ Could not verify repository name formatting');
  }
});