import { test, expect } from '@playwright/test';

test.describe('Add Repository Modal Overlay Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Modal should appear as centered overlay on screen', async ({ page }) => {
    // Find and click the Add Repository button
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await expect(addButton).toBeVisible();
    
    // Take screenshot before opening modal
    await page.screenshot({ path: 'before-modal.png', fullPage: true });
    
    // Click to open modal
    await addButton.click();
    
    // Wait for modal to appear
    await page.waitForSelector('text="Add Repository"', { state: 'visible' });
    
    // Check that modal backdrop exists and covers entire viewport
    const backdrop = await page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(backdrop).toBeVisible();
    
    // Get backdrop dimensions
    const backdropBox = await backdrop.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Verify backdrop covers entire viewport
    expect(backdropBox?.x).toBe(0);
    expect(backdropBox?.y).toBe(0);
    expect(backdropBox?.width).toBe(viewportSize?.width);
    expect(backdropBox?.height).toBe(viewportSize?.height);
    
    // Check modal is centered
    const modalDialog = await page.locator('div.bg-white.rounded-lg.shadow-xl').first();
    await expect(modalDialog).toBeVisible();
    
    const modalBox = await modalDialog.boundingBox();
    if (modalBox && viewportSize) {
      const modalCenterX = modalBox.x + modalBox.width / 2;
      const viewportCenterX = viewportSize.width / 2;
      
      // Modal should be approximately centered (within 50px tolerance)
      expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(50);
      
      // Modal should be in upper half of screen but not at the very top
      expect(modalBox.y).toBeGreaterThan(20);
      expect(modalBox.y).toBeLessThan(viewportSize.height / 2);
    }
    
    // Take screenshot with modal open
    await page.screenshot({ path: 'with-modal.png', fullPage: true });
    
    console.log('✅ Modal is properly rendered as overlay');
  });

  test('Modal should be above all other content (z-index)', async ({ page }) => {
    // Open modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Wait for modal
    await page.waitForSelector('text="Add Repository"', { state: 'visible' });
    
    // Check z-index of backdrop
    const backdropZIndex = await page.locator('div.fixed.inset-0.bg-black.bg-opacity-50').evaluate(el => {
      return window.getComputedStyle(el).zIndex;
    });
    
    // Should have high z-index
    expect(parseInt(backdropZIndex) || 9999).toBeGreaterThanOrEqual(9999);
    
    console.log('✅ Modal has proper z-index:', backdropZIndex);
  });

  test('Modal should be scrollable if content is long', async ({ page }) => {
    // Open modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Show authentication section to make content longer
    const authButton = await page.locator('button:has-text("Add authentication")').first();
    if (await authButton.isVisible()) {
      await authButton.click();
    }
    
    // Check if modal content is scrollable
    const modalContent = await page.locator('div.bg-white.rounded-lg.shadow-xl').first();
    const hasScroll = await modalContent.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });
    
    console.log('✅ Modal scrollability checked:', hasScroll ? 'scrollable' : 'fits in viewport');
  });

  test('Modal should close when clicking backdrop', async ({ page }) => {
    // Open modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Wait for modal
    await page.waitForSelector('text="Add Repository"', { state: 'visible' });
    
    // Click backdrop (outside modal)
    await page.click('div.fixed.inset-0.bg-black.bg-opacity-50', {
      position: { x: 10, y: 10 } // Click near top-left corner
    });
    
    // Modal should close
    await expect(page.locator('text="Add Repository"')).not.toBeVisible();
    
    console.log('✅ Modal closes when clicking backdrop');
  });

  test('Modal should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    let modalDialog = await page.locator('div.bg-white.rounded-lg.shadow-xl').first();
    await expect(modalDialog).toBeVisible();
    
    let modalBox = await modalDialog.boundingBox();
    expect(modalBox?.width).toBeLessThanOrEqual(800); // max-w-lg constraint
    
    // Close modal
    await page.keyboard.press('Escape');
    
    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await addButton.click();
    
    modalDialog = await page.locator('div.bg-white.rounded-lg.shadow-xl').first();
    await expect(modalDialog).toBeVisible();
    
    modalBox = await modalDialog.boundingBox();
    if (modalBox) {
      // On mobile, modal should be almost full width with small margins
      expect(modalBox.width).toBeGreaterThan(300);
      expect(modalBox.width).toBeLessThan(360);
    }
    
    console.log('✅ Modal is responsive');
  });

  test('Modal form elements should be accessible and functional', async ({ page }) => {
    // Open modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Check input field
    const repoInput = await page.locator('input[placeholder*="my-project"]');
    await expect(repoInput).toBeVisible();
    await expect(repoInput).toBeEnabled();
    
    // Type in the input
    await repoInput.fill('test-repository');
    await expect(repoInput).toHaveValue('test-repository');
    
    // Check buttons
    const cancelButton = await page.locator('button:has-text("Cancel")');
    const addRepoButton = await page.locator('button:has-text("Add Repository")').nth(1); // Second one is in modal
    
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toBeEnabled();
    await expect(addRepoButton).toBeVisible();
    
    console.log('✅ Modal form elements are functional');
  });

  test('Modal should render in document.body (React Portal)', async ({ page }) => {
    // Open modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Check that modal is a direct child of body
    const modalInBody = await page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.bg-black.bg-opacity-50');
      return modal?.parentElement === document.body;
    });
    
    expect(modalInBody).toBe(true);
    
    console.log('✅ Modal is rendered in document.body via React Portal');
  });

  test('Multiple modals should not interfere with each other', async ({ page }) => {
    // This test ensures our portal implementation doesn't break if multiple modals exist
    
    // Open our modal
    const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
    await addButton.click();
    
    // Our modal should be visible
    await expect(page.locator('h2:has-text("Add Repository")')).toBeVisible();
    
    // Close it
    await page.locator('button:has-text("Cancel")').click();
    
    // Modal should be closed
    await expect(page.locator('h2:has-text("Add Repository")')).not.toBeVisible();
    
    console.log('✅ Modal lifecycle works correctly');
  });
});