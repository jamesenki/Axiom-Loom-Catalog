import { test, expect } from '@playwright/test';

test('Test fixed modal overlay', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot before
  await page.screenshot({ path: 'modal-fixed-before.png', fullPage: true });
  console.log('📸 Before screenshot saved');
  
  // Click Add Repository button
  const addButton = await page.locator('button:has-text("Add Repository")').first();
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  // Wait for modal heading to appear
  await page.waitForSelector('h2:has-text("Add Repository")', { state: 'visible', timeout: 5000 });
  console.log('✅ Modal opened');
  
  // Wait a bit for animations
  await page.waitForTimeout(1000);
  
  // Take screenshot after
  await page.screenshot({ path: 'modal-fixed-after.png', fullPage: true });
  console.log('📸 After screenshot saved');
  
  // Check if modal is in the viewport (not at bottom or corner)
  const modalBounds = await page.evaluate(() => {
    // Find all h2 elements and look for "Add Repository"
    const headings = Array.from(document.querySelectorAll('h2'));
    const modalHeading = headings.find(h2 => h2.textContent?.includes('Add Repository'));
    
    if (!modalHeading) {
      return null;
    }
    
    // Get the modal container (parent divs)
    let modalContainer = modalHeading.parentElement?.parentElement;
    const rect = modalContainer?.getBoundingClientRect();
    
    return rect ? {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    } : null;
  });
  
  console.log('📊 Modal position:', modalBounds);
  
  if (modalBounds) {
    // Check modal is centered horizontally (approximately)
    const centerX = modalBounds.left + modalBounds.width / 2;
    const viewportCenterX = modalBounds.viewportWidth / 2;
    const horizontalOffset = Math.abs(centerX - viewportCenterX);
    
    console.log(`✅ Horizontal offset from center: ${horizontalOffset}px`);
    expect(horizontalOffset).toBeLessThan(100); // Within 100px of center
    
    // Check modal is not at the very top or bottom
    expect(modalBounds.top).toBeGreaterThan(20); // Not stuck at top
    expect(modalBounds.top).toBeLessThan(modalBounds.viewportHeight - modalBounds.height - 20); // Not at bottom
    
    console.log('✅ Modal is properly positioned as overlay!');
  }
  
  // Test clicking outside to close
  await page.mouse.click(50, 50); // Click top-left corner
  await page.waitForTimeout(500);
  
  // Check modal is closed
  const modalVisible = await page.locator('h2:has-text("Add Repository")').isVisible();
  expect(modalVisible).toBe(false);
  console.log('✅ Modal closes when clicking backdrop');
});