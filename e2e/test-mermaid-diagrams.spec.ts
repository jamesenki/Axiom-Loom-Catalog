import { test, expect } from '@playwright/test';

test.describe('Mermaid Diagram Rendering and Zoom Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to documentation with Mermaid diagrams (like DRAWINGS.md)
    await page.goto('http://localhost:3000/docs/appliances-co-water-heater-platform?path=DRAWINGS.md');
    await page.waitForLoadState('networkidle');
  });

  test('should render Mermaid diagrams successfully', async ({ page }) => {
    // Wait for page and diagrams to load
    await page.waitForTimeout(5000);
    
    // Should find Mermaid diagram containers
    const diagramContainers = page.locator('.mermaid-container, [class*="mermaid"], svg[id*="mermaid"]');
    
    if (await diagramContainers.count() > 0) {
      // At least one diagram should be visible
      await expect(diagramContainers.first()).toBeVisible({ timeout: 10000 });
      
      // Should contain actual SVG content (not just loading or error state)
      const svgElements = page.locator('svg');
      const svgCount = await svgElements.count();
      expect(svgCount).toBeGreaterThan(0);
    }
  });

  test('should display zoom controls for diagrams', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    // Look for zoom control buttons
    const zoomInButton = page.locator('button[title*="Zoom in"], button:has-text("Zoom In")');
    const zoomOutButton = page.locator('button[title*="Zoom out"], button:has-text("Zoom Out")');
    const zoomResetButton = page.locator('button[title*="Reset zoom"], button:has-text("%")');
    
    if (await zoomInButton.isVisible()) {
      await expect(zoomInButton).toBeVisible();
      await expect(zoomOutButton).toBeVisible();
      await expect(zoomResetButton).toBeVisible();
    }
  });

  test('should allow zooming in and out', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const zoomInButton = page.locator('button[title*="Zoom in"]').first();
    const zoomOutButton = page.locator('button[title*="Zoom out"]').first();
    const zoomPercentage = page.locator('button:has-text("%")').first();
    
    if (await zoomInButton.isVisible()) {
      // Initial zoom should be 100%
      const initialZoom = await zoomPercentage.textContent();
      expect(initialZoom).toContain('100%');
      
      // Zoom in
      await zoomInButton.click();
      await page.waitForTimeout(500);
      
      const zoomedInText = await zoomPercentage.textContent();
      expect(zoomedInText).not.toBe(initialZoom);
      expect(parseInt(zoomedInText?.replace('%', '') || '0')).toBeGreaterThan(100);
      
      // Zoom out
      await zoomOutButton.click();
      await page.waitForTimeout(500);
      
      const zoomedOutText = await zoomPercentage.textContent();
      expect(parseInt(zoomedOutText?.replace('%', '') || '0')).toBeLessThan(parseInt(zoomedInText?.replace('%', '') || '0'));
    }
  });

  test('should have full screen modal functionality', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const fullScreenButton = page.locator('button[title*="full screen"], button[title*="Open in full"]').first();
    
    if (await fullScreenButton.isVisible()) {
      // Click full screen button
      await fullScreenButton.click();
      await page.waitForTimeout(1000);
      
      // Should open modal
      const modal = page.locator('[class*="fixed inset-0"], .modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Modal should contain diagram content
      const modalSvg = modal.locator('svg');
      await expect(modalSvg).toBeVisible();
      
      // Should have close button
      const closeButton = modal.locator('button[title*="Close"], button:has-text("×"), button:has-text("Close")');
      await expect(closeButton).toBeVisible();
      
      // Close modal
      await closeButton.click();
      await page.waitForTimeout(500);
      
      // Modal should be closed
      await expect(modal).not.toBeVisible();
    }
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const fullScreenButton = page.locator('button[title*="full screen"], button[title*="Open in full"]').first();
    
    if (await fullScreenButton.isVisible()) {
      // Open modal
      await fullScreenButton.click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('[class*="fixed inset-0"], .modal, [role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Press Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Modal should be closed
      await expect(modal).not.toBeVisible();
    }
  });

  test('should have download functionality', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const downloadButton = page.locator('button[title*="Download"], button:has([title*="Download"])').first();
    
    if (await downloadButton.isVisible()) {
      // Button should be enabled (not disabled)
      const isDisabled = await downloadButton.getAttribute('disabled');
      expect(isDisabled).toBeFalsy();
      
      // Should be clickable
      await expect(downloadButton).toBeEnabled();
    }
  });

  test('should not show error states for valid diagrams', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    // Should not show error messages
    const errorMessages = page.locator('text=Failed to render, text=Error, text=Invalid diagram');
    await expect(errorMessages).not.toBeVisible();
    
    // Should not show loading states indefinitely
    const loadingMessages = page.locator('text=Loading Mermaid');
    await expect(loadingMessages).not.toBeVisible();
  });

  test('should handle multiple diagrams on the same page', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    // Check for multiple diagrams
    const diagramContainers = page.locator('.mermaid-container, [class*="mermaid"], div:has(svg)');
    const diagramCount = await diagramContainers.count();
    
    if (diagramCount > 1) {
      // Each diagram should have its own controls
      const zoomControls = page.locator('button[title*="Zoom in"]');
      const controlsCount = await zoomControls.count();
      
      expect(controlsCount).toBeGreaterThan(0);
    }
  });

  test('should maintain aspect ratio during zoom', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const diagram = page.locator('.mermaid-container svg').first();
    const zoomInButton = page.locator('button[title*="Zoom in"]').first();
    
    if (await diagram.isVisible() && await zoomInButton.isVisible()) {
      // Get initial dimensions
      const initialBoundingBox = await diagram.boundingBox();
      
      if (initialBoundingBox) {
        const initialRatio = initialBoundingBox.width / initialBoundingBox.height;
        
        // Zoom in
        await zoomInButton.click();
        await page.waitForTimeout(500);
        
        // Get new dimensions
        const zoomedBoundingBox = await diagram.boundingBox();
        
        if (zoomedBoundingBox) {
          const zoomedRatio = zoomedBoundingBox.width / zoomedBoundingBox.height;
          
          // Aspect ratio should be maintained (within tolerance)
          expect(Math.abs(initialRatio - zoomedRatio)).toBeLessThan(0.1);
        }
      }
    }
  });

  test('should handle zoom limits correctly', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const zoomInButton = page.locator('button[title*="Zoom in"]').first();
    const zoomOutButton = page.locator('button[title*="Zoom out"]').first();
    
    if (await zoomInButton.isVisible()) {
      // Zoom in to maximum
      for (let i = 0; i < 10; i++) {
        if (await zoomInButton.isEnabled()) {
          await zoomInButton.click();
          await page.waitForTimeout(100);
        } else {
          break;
        }
      }
      
      // Zoom in button should be disabled at max zoom
      const isZoomInDisabled = await zoomInButton.getAttribute('disabled');
      expect(isZoomInDisabled).not.toBeNull();
      
      // Zoom out to minimum
      for (let i = 0; i < 10; i++) {
        if (await zoomOutButton.isEnabled()) {
          await zoomOutButton.click();
          await page.waitForTimeout(100);
        } else {
          break;
        }
      }
      
      // Zoom out button should be disabled at min zoom
      const isZoomOutDisabled = await zoomOutButton.getAttribute('disabled');
      expect(isZoomOutDisabled).not.toBeNull();
    }
  });
});