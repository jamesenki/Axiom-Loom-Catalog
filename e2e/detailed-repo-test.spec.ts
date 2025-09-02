import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://10.0.0.109:3000';

test.describe('Detailed Repository Button Testing', () => {
  test('Check individual repository cards for API buttons', async ({ page }) => {
    console.log('🔍 Examining individual repository cards for API buttons...');
    
    test.setTimeout(60000);
    
    try {
      await page.goto(BASE_URL, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      });
      await page.waitForTimeout(3000);
      
      // Take full page screenshot first
      await page.screenshot({ path: 'detailed-homepage.png', fullPage: true });
      
      // Get all repository cards and examine them individually
      const repoCards = await page.locator('[data-testid*="repo"], .repo-card, .repository-card').all();
      console.log(`Found ${repoCards.length} repository cards`);
      
      let repoWithButtons = 0;
      
      for (let i = 0; i < Math.min(5, repoCards.length); i++) {
        const card = repoCards[i];
        
        // Get the repository name
        const repoName = await card.locator('h3, .title, [data-testid="repo-title"]').first().textContent() || `Repository ${i+1}`;
        console.log(`\n🔍 Examining: ${repoName}`);
        
        // Check for buttons within this card
        const buttonsInCard = await card.locator('button').all();
        console.log(`   Found ${buttonsInCard.length} buttons in this card`);
        
        for (const button of buttonsInCard) {
          const buttonText = await button.textContent();
          console.log(`   Button text: "${buttonText}"`);
          
          if (buttonText?.toLowerCase().includes('graphql')) {
            console.log('   🎯 Found GraphQL button!');
            repoWithButtons++;
            
            // Click on the repository first to go to detail page
            await card.click();
            await page.waitForTimeout(3000);
            
            const repoDetailScreenshot = `detailed-repo-${i+1}-detail.png`;
            await page.screenshot({ path: repoDetailScreenshot, fullPage: true });
            
            // Now try clicking GraphQL button
            const graphqlBtn = page.locator('button:has-text("GraphQL"), button:has-text("graphql")').first();
            if (await graphqlBtn.isVisible()) {
              await graphqlBtn.click();
              await page.waitForTimeout(5000);
              
              const graphqlResultScreenshot = `detailed-graphql-${i+1}.png`;
              await page.screenshot({ path: graphqlResultScreenshot, fullPage: true });
              
              const resultUrl = page.url();
              const pageContent = await page.textContent('body');
              
              console.log(`   GraphQL result URL: ${resultUrl}`);
              console.log(`   Page contains "coming soon": ${pageContent?.toLowerCase().includes('coming soon')}`);
            }
            
            // Go back to homepage
            await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000);
            break; // Found GraphQL, move to next repo
          }
          
          if (buttonText?.toLowerCase().includes('grpc')) {
            console.log('   🎯 Found gRPC button!');
            repoWithButtons++;
            
            // Click on the repository first to go to detail page
            await card.click();
            await page.waitForTimeout(3000);
            
            const repoDetailScreenshot = `detailed-repo-${i+1}-grpc-detail.png`;
            await page.screenshot({ path: repoDetailScreenshot, fullPage: true });
            
            // Now try clicking gRPC button
            const grpcBtn = page.locator('button:has-text("gRPC"), button:has-text("grpc")').first();
            if (await grpcBtn.isVisible()) {
              const beforeUrl = page.url();
              await grpcBtn.click();
              await page.waitForTimeout(5000);
              
              const afterUrl = page.url();
              const grpcResultScreenshot = `detailed-grpc-${i+1}.png`;
              await page.screenshot({ path: grpcResultScreenshot, fullPage: true });
              
              console.log(`   gRPC navigation: ${beforeUrl} → ${afterUrl}`);
              console.log(`   Redirected to home: ${afterUrl === BASE_URL}`);
            }
            
            // Go back to homepage
            await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000);
            break; // Found gRPC, move to next repo
          }
        }
        
        // Check if this repository card has API-related links or text
        const cardText = await card.textContent();
        if (cardText?.toLowerCase().includes('api') || 
            cardText?.toLowerCase().includes('graphql') || 
            cardText?.toLowerCase().includes('grpc') ||
            cardText?.toLowerCase().includes('postman')) {
          console.log(`   📋 Repository mentions APIs: ${cardText?.substring(0, 100)}...`);
        }
      }
      
      console.log(`\n🎯 SUMMARY: Found ${repoWithButtons} repositories with API buttons`);
      
    } catch (error) {
      console.error('Error during detailed testing:', error);
    }
  });
});