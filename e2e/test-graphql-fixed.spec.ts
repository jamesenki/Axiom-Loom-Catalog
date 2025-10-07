import { test, expect } from '@playwright/test';

test.describe('GraphQL Playground - Fixed Test', () => {
  test('GraphQL schemas should load and display correctly', async ({ page }) => {
    console.log('=== TESTING GRAPHQL SCHEMAS ===');
    
    // Navigate to repository page
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Click GraphQL button
    const graphqlButton = page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")');
    await graphqlButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give it time to load schemas
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/graphql-fixed-test.png', fullPage: true });
    
    // Check that we're on the right page
    expect(currentUrl).toContain('/graphql/appliances-co-water-heater-platform');
    
    // Look for the specific elements that GraphQLSchemaViewer renders
    console.log('1. Looking for page title...');
    const pageTitle = page.locator('h1:has-text("GraphQL Schemas")');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    console.log('✓ Page title found');
    
    // Look for repository description
    console.log('2. Looking for repository description...');
    const repoDesc = page.locator('text=Repository: appliances-co-water-heater-platform');
    await expect(repoDesc).toBeVisible();
    console.log('✓ Repository description found');
    
    // Should NOT see "No GraphQL Schemas Found"
    console.log('3. Checking for "No GraphQL Schemas Found"...');
    const noSchemasMessage = page.locator('text=No GraphQL Schemas Found');
    await expect(noSchemasMessage).not.toBeVisible();
    console.log('✓ No "No GraphQL Schemas Found" message (good)');
    
    // Look for schema cards - these should contain the schema names
    console.log('4. Looking for schema cards...');
    const schemaCards = page.locator('h3:has(svg)'); // SchemaName elements with FileCode icons
    const cardCount = await schemaCards.count();
    console.log(`Found ${cardCount} schema cards`);
    
    // Should have 3 schema cards (mutations.graphql, queries.graphql, schema.graphql)
    expect(cardCount).toBeGreaterThanOrEqual(1);
    
    // Look for specific schema file names
    console.log('5. Looking for specific schema files...');
    const schemaFile = page.locator('text=schema.graphql');
    await expect(schemaFile).toBeVisible();
    console.log('✓ schema.graphql found');
    
    const queriesFile = page.locator('text=queries.graphql');
    await expect(queriesFile).toBeVisible();
    console.log('✓ queries.graphql found');
    
    const mutationsFile = page.locator('text=mutations.graphql');
    await expect(mutationsFile).toBeVisible();
    console.log('✓ mutations.graphql found');
    
    // Look for schema content - should contain GraphQL type definitions
    console.log('6. Looking for schema content...');
    const schemaContent = page.locator('pre'); // SchemaContent elements are <pre> tags
    const contentCount = await schemaContent.count();
    console.log(`Found ${contentCount} schema content blocks`);
    expect(contentCount).toBeGreaterThanOrEqual(1);
    
    // Check that schema content contains expected GraphQL syntax
    console.log('7. Checking schema content...');
    const typeQuery = page.locator('text=type Query');
    await expect(typeQuery).toBeVisible();
    console.log('✓ "type Query" found in schema content');
    
    const waterHeaterType = page.locator('text=WaterHeater');
    const waterHeaterCount = await waterHeaterType.count();
    console.log(`Found ${waterHeaterCount} WaterHeater references`);
    expect(waterHeaterCount).toBeGreaterThan(0);
    
    // Check for download buttons
    console.log('8. Looking for download buttons...');
    const downloadButtons = page.locator('button:has-text("Download")');
    const downloadCount = await downloadButtons.count();
    console.log(`Found ${downloadCount} download buttons`);
    expect(downloadCount).toBeGreaterThanOrEqual(3); // One for each schema file
    
    console.log('✅ ALL GRAPHQL TESTS PASSED - Schemas are loading and displaying correctly!');
  });
});