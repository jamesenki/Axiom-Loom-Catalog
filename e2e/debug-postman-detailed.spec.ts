import { test, expect } from '@playwright/test';

test.describe('Detailed Postman Debug', () => {
  test('detailed postman debugging with correct selectors', async ({ page }) => {
    console.log('=== POSTMAN DEBUGGING ===');
    
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Finding and clicking Postman button...');
    const postmanButton = page.locator('button:has-text("Postman"), a:has-text("Postman")');
    await postmanButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give it more time to load
    
    const currentUrl = page.url();
    console.log(`2. Current URL: ${currentUrl}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/postman-detailed.png', fullPage: true });
    
    // Check for the specific elements from PostmanCollectionViewSidebar
    console.log('3. Looking for sidebar title...');
    const sidebarTitle = page.locator('h2:has-text("Collections")');
    const hasSidebarTitle = await sidebarTitle.isVisible();
    console.log(`   Sidebar title visible: ${hasSidebarTitle}`);
    
    if (hasSidebarTitle) {
      const titleText = await sidebarTitle.textContent();
      console.log(`   Sidebar title text: "${titleText}"`);
    }
    
    // Check for loading state
    console.log('4. Checking for loading state...');
    const loadingElement = page.locator('text=Loading, .loading, [data-testid="loading"]');
    const isLoading = await loadingElement.isVisible();
    console.log(`   Loading visible: ${isLoading}`);
    
    // Check for error state
    console.log('5. Checking for error state...');
    const errorElement = page.locator('text=Error, text=Failed, .error');
    const hasError = await errorElement.isVisible();
    console.log(`   Error visible: ${hasError}`);
    
    if (hasError) {
      const errorText = await errorElement.textContent();
      console.log(`   Error text: "${errorText}"`);
    }
    
    // Look for collection items with correct structure
    console.log('6. Looking for CollectionItem elements...');
    const collectionItems = page.locator('[style*="cursor: pointer"]'); // CollectionItem has cursor: pointer
    const itemCount = await collectionItems.count();
    console.log(`   Found ${itemCount} clickable items`);
    
    // Look for FileText icons (part of CollectionIcon)
    console.log('7. Looking for FileText icons...');
    const fileIcons = page.locator('svg'); // FileText icons are SVGs
    const iconCount = await fileIcons.count();
    console.log(`   Found ${iconCount} SVG icons`);
    
    // Check the specific collections we know should exist
    console.log('8. Looking for specific collection names...');
    const waterHeaterCollection = page.locator('text=Water Heater');
    const waterHeaterExists = await waterHeaterCollection.isVisible();
    console.log(`   "Water Heater" text visible: ${waterHeaterExists}`);
    
    const iotCollection = page.locator('text=IoT');
    const iotExists = await iotCollection.isVisible();
    console.log(`   "IoT" text visible: ${iotExists}`);
    
    // Check for back button
    console.log('9. Looking for back button...');
    const backButton = page.locator('text=Back to Repository');
    const hasBackButton = await backButton.isVisible();
    console.log(`   Back button visible: ${hasBackButton}`);
    
    // Check the entire page content
    console.log('10. Analyzing page content...');
    const bodyText = await page.textContent('body');
    const hasCollectionText = bodyText?.includes('Collection');
    const hasPostmanText = bodyText?.includes('Postman');
    console.log(`   Page contains "Collection": ${hasCollectionText}`);
    console.log(`   Page contains "Postman": ${hasPostmanText}`);
    
    // Check network requests
    console.log('11. Making direct API call to verify data...');
    const response = await page.request.get('http://10.0.0.109:3001/api/repository/appliances-co-water-heater-platform/postman-collections');
    const apiData = await response.json();
    console.log(`   API returned ${apiData.length} collections:`, apiData.map((c: any) => c.name));
    
    console.log('=== END DEBUGGING ===');
  });
});