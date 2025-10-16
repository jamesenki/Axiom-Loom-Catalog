import { test, expect } from '@playwright/test';

test('Visual test - Modal should appear as centered popup overlay', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of page before modal
  await page.screenshot({ path: 'modal-test-before.png', fullPage: true });
  console.log('📸 Screenshot saved: modal-test-before.png');
  
  // Find and click Add Repository button
  const addButton = await page.locator('button:has-text("Add Repository"), button:has-text("+ Add Repository")').first();
  await expect(addButton).toBeVisible();
  console.log('✅ Found Add Repository button');
  
  // Click the button
  await addButton.click();
  console.log('✅ Clicked Add Repository button');
  
  // Wait for modal to appear
  await page.waitForSelector('h2:has-text("Add Repository")', { state: 'visible', timeout: 5000 });
  console.log('✅ Modal appeared');
  
  // Wait a bit for animations
  await page.waitForTimeout(500);
  
  // Take screenshot with modal open
  await page.screenshot({ path: 'modal-test-after.png', fullPage: true });
  console.log('📸 Screenshot saved: modal-test-after.png');
  
  // Get modal position info
  const modalInfo = await page.evaluate(() => {
    // Find modal by looking for the portal-rendered element with specific styles
    const allDivs = Array.from(document.querySelectorAll('body > div'));
    const backdrop = allDivs.find(div => {
      const style = window.getComputedStyle(div);
      return style.position === 'fixed' && 
             style.zIndex === '9999' &&
             style.backgroundColor.includes('rgba(0, 0, 0,');
    });
    
    const modal = backdrop ? backdrop.querySelector('div[style*="backgroundColor"]') : null;
    
    if (!backdrop || !modal) {
      return { error: 'Modal elements not found' };
    }
    
    const backdropRect = backdrop.getBoundingClientRect();
    const modalRect = modal.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    
    // Check if modal is child of body
    const inBody = Array.from(document.body.children).some(child => 
      child === backdrop || child.contains(backdrop as Node)
    );
    
    return {
      backdrop: {
        top: backdropRect.top,
        left: backdropRect.left,
        width: backdropRect.width,
        height: backdropRect.height,
        position: window.getComputedStyle(backdrop).position,
        zIndex: window.getComputedStyle(backdrop).zIndex
      },
      modal: {
        top: modalRect.top,
        left: modalRect.left,
        width: modalRect.width,
        height: modalRect.height,
        centerX: modalRect.left + modalRect.width / 2,
        centerY: modalRect.top + modalRect.height / 2
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        centerX: window.innerWidth / 2,
        centerY: window.innerHeight / 2
      },
      body: {
        scrollHeight: document.body.scrollHeight,
        clientHeight: document.body.clientHeight,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      },
      inBody,
      modalParent: backdrop.parentElement?.tagName
    };
  });
  
  console.log('📊 Modal positioning info:', JSON.stringify(modalInfo, null, 2));
  
  // Verify modal is properly positioned
  if (modalInfo.error) {
    throw new Error(modalInfo.error);
  }
  
  // Check if modal is in body (portal)
  expect(modalInfo.inBody).toBe(true);
  console.log('✅ Modal is rendered in document.body');
  
  // Check if backdrop covers viewport
  expect(modalInfo.backdrop.top).toBe(0);
  expect(modalInfo.backdrop.left).toBe(0);
  expect(modalInfo.backdrop.width).toBe(modalInfo.viewport.width);
  expect(modalInfo.backdrop.height).toBe(modalInfo.viewport.height);
  console.log('✅ Backdrop covers entire viewport');
  
  // Check if modal is centered horizontally (within 100px tolerance)
  const horizontalDiff = Math.abs(modalInfo.modal.centerX - modalInfo.viewport.centerX);
  expect(horizontalDiff).toBeLessThan(100);
  console.log(`✅ Modal is horizontally centered (diff: ${horizontalDiff}px)`);
  
  // Check if modal is in visible area
  expect(modalInfo.modal.top).toBeGreaterThanOrEqual(0);
  expect(modalInfo.modal.top).toBeLessThan(modalInfo.viewport.height / 2);
  console.log(`✅ Modal is in visible area (top: ${modalInfo.modal.top}px)`);
  
  // Check z-index
  console.log(`📊 Z-index - Backdrop: ${modalInfo.backdrop.zIndex}`);
  
  console.log('\n✅ All modal positioning tests passed!');
  console.log('📸 Check modal-test-before.png and modal-test-after.png to visually verify');
});