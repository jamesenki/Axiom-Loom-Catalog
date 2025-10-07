import { test, expect } from '@playwright/test';

test.describe('Debug GraphQL Playground', () => {
  test('debug GraphQL schema loading', async ({ page }) => {
    console.log('=== GRAPHQL DEBUGGING ===');
    
    await page.goto('http://localhost:3000/repository/appliances-co-water-heater-platform');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('1. Finding and clicking GraphQL button...');
    const graphqlButton = page.locator('button:has-text("GraphQL"), a:has-text("GraphQL")');
    const buttonExists = await graphqlButton.isVisible();
    console.log(`   GraphQL button exists: ${buttonExists}`);
    
    if (buttonExists) {
      await graphqlButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log(`2. Current URL: ${currentUrl}`);
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/graphql-debug.png', fullPage: true });
      
      // Check for "No GraphQL Schemas Found" message
      console.log('3. Checking for "No GraphQL Schemas Found" message...');
      const noSchemasMsg = page.locator('text=No GraphQL Schemas Found');
      const hasNoSchemasMsg = await noSchemasMsg.isVisible();
      console.log(`   "No GraphQL Schemas Found" visible: ${hasNoSchemasMsg}`);
      
      // Check for actual schema content
      console.log('4. Looking for schema content...');
      const schemaContent = page.locator('text=Query, text=Mutation, text=Subscription, text=type, text=scalar');
      const schemaCount = await schemaContent.count();
      console.log(`   Found ${schemaCount} schema-related elements`);
      
      // Look for specific types from our schema
      console.log('5. Looking for specific types...');
      const waterHeaterType = page.locator('text=WaterHeater, text=waterHeater');
      const waterHeaterExists = await waterHeaterType.count();
      console.log(`   Found ${waterHeaterExists} WaterHeater references`);
      
      const dateTimeScalar = page.locator('text=DateTime');
      const dateTimeExists = await dateTimeScalar.count();
      console.log(`   Found ${dateTimeExists} DateTime references`);
      
      // Check page content
      const bodyText = await page.textContent('body');
      const hasGraphQLText = bodyText?.includes('GraphQL');
      const hasSchemaText = bodyText?.includes('schema');
      console.log(`   Page contains "GraphQL": ${hasGraphQLText}`);
      console.log(`   Page contains "schema": ${hasSchemaText}`);
      
      // Check for loading or error states
      console.log('6. Checking for loading/error states...');
      const loading = page.locator('text=Loading, .loading');
      const isLoading = await loading.isVisible();
      console.log(`   Loading visible: ${isLoading}`);
      
      const error = page.locator('text=Error, text=Failed, .error');
      const hasError = await error.isVisible();
      console.log(`   Error visible: ${hasError}`);
      
      if (hasError) {
        const errorText = await error.textContent();
        console.log(`   Error text: "${errorText}"`);
      }
      
      // Try to make API call to verify schema data
      console.log('7. Testing GraphQL schema API directly...');
      try {
        const schemaResponse = await page.request.get('http://10.0.0.109:3001/api/repository/appliances-co-water-heater-platform/file?path=graphql/schema.graphql');
        const schemaData = await schemaResponse.text();
        const hasWaterHeater = schemaData.includes('WaterHeater');
        const hasQuery = schemaData.includes('type Query');
        console.log(`   Schema API works: ${schemaResponse.ok()}`);
        console.log(`   Schema contains WaterHeater: ${hasWaterHeater}`);
        console.log(`   Schema contains Query type: ${hasQuery}`);
      } catch (err) {
        console.log(`   Schema API error: ${err}`);
      }
      
    } else {
      console.log('GraphQL button not found');
    }
    
    console.log('=== END GRAPHQL DEBUGGING ===');
  });
});