import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const REPOS_DIR = path.join(__dirname, '../cloned-repositories');

test.describe('Find All 404 Document Errors', () => {
  test.setTimeout(180000); // 3 minutes
  
  test('Find all documents that show 404 errors', async ({ page }) => {
    const repos = fs.readdirSync(REPOS_DIR).filter(dir => {
      const dirPath = path.join(REPOS_DIR, dir);
      return fs.statSync(dirPath).isDirectory() && 
             !dir.startsWith('.') && 
             dir !== 'node_modules';
    });
    
    const brokenDocs = [];
    console.log(`\n🔍 Checking ${repos.length} repositories for 404 errors\n`);
    
    for (const repo of repos) {
      console.log(`\n📁 Checking ${repo}...`);
      
      try {
        // Go to docs page
        await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Check for 404 error
        const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                        await page.locator('text="Failed to fetch file content"').isVisible({ timeout: 1000 }) ||
                        await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
        
        if (hasError) {
          console.log(`   ❌ 404 ERROR on main docs page!`);
          brokenDocs.push(`${repo} - main docs page`);
          await page.screenshot({ 
            path: `test-results/404-ERROR-${repo}-main.png`,
            fullPage: true 
          });
        } else {
          console.log(`   ✅ Main docs page loads`);
          
          // Get all markdown links on the page
          const mdLinks = await page.locator('a').evaluateAll(links => 
            links.map(link => ({
              text: link.textContent,
              href: link.getAttribute('href')
            })).filter(l => l.text && l.text.endsWith('.md'))
          );
          
          console.log(`   Found ${mdLinks.length} markdown links to test`);
          
          // Test first 5 links
          for (const link of mdLinks.slice(0, 5)) {
            console.log(`   Testing link: ${link.text}`);
            
            const linkElement = page.locator(`text="${link.text}"`).first();
            if (await linkElement.isVisible({ timeout: 2000 })) {
              await linkElement.click();
              await page.waitForTimeout(1500);
              
              // Check for error
              const linkHasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                                  await page.locator('text="Failed to fetch file content"').isVisible({ timeout: 1000 }) ||
                                  await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
              
              if (linkHasError) {
                console.log(`      ❌ 404 ERROR!`);
                brokenDocs.push(`${repo}/${link.text}`);
                await page.screenshot({ 
                  path: `test-results/404-ERROR-${repo}-${link.text.replace(/[\/\\]/g, '-')}.png`,
                  fullPage: true 
                });
              } else {
                console.log(`      ✅ Loads OK`);
              }
              
              // Go back
              await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded' });
              await page.waitForTimeout(1000);
            }
          }
        }
      } catch (error) {
        console.log(`   ⚠️  Error testing ${repo}: ${error.message}`);
      }
    }
    
    // Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 404 ERROR REPORT');
    console.log('='.repeat(60));
    
    if (brokenDocs.length === 0) {
      console.log('✅ NO 404 ERRORS FOUND!');
    } else {
      console.log(`❌ FOUND ${brokenDocs.length} DOCUMENTS WITH 404 ERRORS:\n`);
      brokenDocs.forEach(doc => console.log(`   - ${doc}`));
      
      // Write report
      fs.writeFileSync('test-results/404-errors-report.txt', 
        `404 ERRORS FOUND:\n\n${brokenDocs.join('\n')}\n\nTotal: ${brokenDocs.length} broken documents`
      );
    }
    
    expect(brokenDocs.length).toBe(0);
  });
});