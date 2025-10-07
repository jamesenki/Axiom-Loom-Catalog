import { test, expect } from '@playwright/test';

test.describe('Use Cases & Applications Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the water heater platform repository
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
  });

  test('should display Use Cases & Applications section in README', async ({ page }) => {
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Look for the Use Cases & Applications section
    const useCasesHeading = page.locator('h2:has-text("Use Cases & Applications")');
    await expect(useCasesHeading).toBeVisible({ timeout: 10000 });
    
    // Should show primary industries
    const hospitalityText = page.locator('text=Hospitality');
    const manufacturingText = page.locator('text=Manufacturing');
    const healthcareText = page.locator('text=Healthcare');
    
    await expect(hospitalityText).toBeVisible();
    await expect(manufacturingText).toBeVisible();
    await expect(healthcareText).toBeVisible();
  });

  test('should show real-world ROI metrics', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Should display actual performance metrics
    const uptimeMetric = page.locator('text=99.8% System Uptime');
    const energyCostReduction = page.locator('text=30-45% Energy Cost Reduction');
    const emergencyRepairs = page.locator('text=60-70% Fewer Emergency Repairs');
    const annualSavings = page.locator('text=$50K-$500K Annual Savings');
    
    await expect(uptimeMetric).toBeVisible();
    await expect(energyCostReduction).toBeVisible();
    await expect(emergencyRepairs).toBeVisible();
    await expect(annualSavings).toBeVisible();
  });

  test('should have link to detailed use cases document', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Should have link to USE_CASES.md
    const useCasesLink = page.locator('a:has-text("View Complete Use Case Analysis")');
    await expect(useCasesLink).toBeVisible();
    
    // Link should point to USE_CASES.md
    const href = await useCasesLink.getAttribute('href');
    expect(href).toContain('USE_CASES.md');
  });

  test('should display specific industry applications', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Should show specific real-world applications, not generic marketing copy
    const content = await page.textContent('body');
    
    // Should mention specific industries and use cases
    expect(content?.toLowerCase()).toContain('hotels');
    expect(content?.toLowerCase()).toContain('hospitals');
    expect(content?.toLowerCase()).toContain('food processing');
    expect(content?.toLowerCase()).toContain('apartment');
    expect(content?.toLowerCase()).toContain('universities');
    
    // Should have specific metrics, not vague statements
    expect(content).toContain('99.8%');
    expect(content).toContain('30-45%');
    expect(content).toContain('60-70%');
    expect(content).toContain('$50K-$500K');
  });

  test('USE_CASES.md file should be accessible', async ({ page }) => {
    // Test that the USE_CASES.md file can be accessed
    const response = await page.request.get('http://localhost:3001/api/repository/appliances-co-water-heater-platform/file?path=USE_CASES.md');
    expect(response.ok()).toBeTruthy();
    
    const content = await response.text();
    
    // Should contain comprehensive use case content
    expect(content).toContain('Real-World Use Cases');
    expect(content).toContain('Hospitality Industry');
    expect(content).toContain('Manufacturing & Industrial');
    expect(content).toContain('Healthcare');
    expect(content).toContain('ROI Example');
    expect(content).toContain('Case Study');
  });

  test('should not show generic marketing copy for use cases', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const content = await page.textContent('body');
    
    // Should not have generic, non-specific language
    expect(content?.toLowerCase()).not.toContain('various industries');
    expect(content?.toLowerCase()).not.toContain('many applications');
    expect(content?.toLowerCase()).not.toContain('improve efficiency');
    expect(content?.toLowerCase()).not.toContain('reduce costs') // unless with specific numbers
    
    // Should have specific, quantified benefits
    expect(content).toContain('%'); // Should have percentage metrics
    expect(content).toContain('$'); // Should have dollar amounts
  });

  test('Use Cases link should work correctly', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const useCasesLink = page.locator('a:has-text("View Complete Use Case Analysis")').first();
    
    if (await useCasesLink.isVisible()) {
      await useCasesLink.click();
      
      // Should navigate to USE_CASES.md document
      await page.waitForLoadState('networkidle');
      
      // Should show use cases document content
      const documentContent = page.locator('text=Real-World Use Cases, text=Hospitality Industry, text=Manufacturing');
      await expect(documentContent.first()).toBeVisible({ timeout: 5000 });
      
      // Should not show error pages
      const errorHeading = page.locator('h1:has-text("Error"), h1:has-text("404"), h1:has-text("Not Found")');
      await expect(errorHeading).not.toBeVisible();
    }
  });
});