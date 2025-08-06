import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const REPOS_DIR = path.join(__dirname, '../cloned-repositories');

test.describe('Find ALL Broken Documents and Links', () => {
  test.setTimeout(300000); // 5 minutes
  
  test('Find all broken documents and links across all repos', async ({ page }) => {
    const repos = fs.readdirSync(REPOS_DIR).filter(dir => {
      const dirPath = path.join(REPOS_DIR, dir);
      return fs.statSync(dirPath).isDirectory() && 
             !dir.startsWith('.') && 
             dir !== 'node_modules';
    });
    
    const brokenItems = {
      documents: [],
      links: [],
      sidebarIssues: []
    };
    
    console.log(`\n🔍 Scanning ${repos.length} repositories for broken items...\n`);
    
    // Test each repository
    for (const repo of repos) {
      console.log(`\n📁 ${repo}`);
      
      try {
        // 1. Test main docs page
        await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const mainError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                         await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
        
        if (mainError) {
          console.log('   ❌ Main page shows 404');
          brokenItems.documents.push(`${repo}/README.md (main page)`);
          continue; // Skip to next repo
        }
        
        // 2. Check sidebar visibility
        const sidebar = await page.locator('[class*="docSidebar"]').isVisible({ timeout: 2000 });
        if (!sidebar) {
          console.log('   ❌ No sidebar visible');
          brokenItems.sidebarIssues.push(repo);
          continue;
        }
        
        // 3. Get all visible markdown files in sidebar
        const visibleMdFiles = await page.locator('[class*="fileTreeItem"]').filter({ hasText: /\.md$/ }).all();
        console.log(`   Found ${visibleMdFiles.length} markdown files in sidebar`);
        
        // 4. Test clicking first 5 files
        const filesToTest = Math.min(5, visibleMdFiles.length);
        for (let i = 0; i < filesToTest; i++) {
          const fileName = await visibleMdFiles[i].textContent();
          console.log(`   Testing: ${fileName}`);
          
          await visibleMdFiles[i].click();
          await page.waitForTimeout(1500);
          
          const docError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                          await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
          
          if (docError) {
            console.log(`      ❌ Shows 404 error`);
            brokenItems.documents.push(`${repo}/${fileName}`);
            await page.screenshot({ path: `test-results/BROKEN-${repo}-${fileName?.replace(/[\/\\]/g, '-')}.png` });
          } else {
            console.log(`      ✅ Loads OK`);
            
            // Test first 3 links in the document
            const links = await page.locator('a[href^="#"], a[href$=".md"]').all();
            const linksToTest = Math.min(3, links.length);
            
            for (let j = 0; j < linksToTest; j++) {
              const href = await links[j].getAttribute('href');
              if (href) {
                if (href.startsWith('#')) {
                  // Anchor link - just click it
                  try {
                    await links[j].click();
                    console.log(`         ✅ Anchor: ${href}`);
                  } catch {
                    console.log(`         ❌ Anchor broken: ${href}`);
                    brokenItems.links.push(`${repo}/${fileName} -> ${href}`);
                  }
                } else if (href.endsWith('.md')) {
                  // Document link
                  try {
                    await links[j].click();
                    await page.waitForTimeout(1000);
                    
                    const linkError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 });
                    if (linkError) {
                      console.log(`         ❌ Link 404: ${href}`);
                      brokenItems.links.push(`${repo}/${fileName} -> ${href}`);
                    } else {
                      console.log(`         ✅ Link OK: ${href}`);
                    }
                    
                    await page.goBack();
                    await page.waitForTimeout(1000);
                  } catch {
                    console.log(`         ❌ Link error: ${href}`);
                    brokenItems.links.push(`${repo}/${fileName} -> ${href}`);
                  }
                }
              }
            }
          }
          
          // Navigate back to main docs page for next file
          await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(1500);
        }
        
        // 5. Special check for files that should NOT be in sidebar
        const actualFiles = fs.readdirSync(path.join(REPOS_DIR, repo))
          .filter(f => f.endsWith('.md'));
        
        const sidebarFileNames = await Promise.all(
          visibleMdFiles.map(async el => await el.textContent())
        );
        
        // Check for CONTRIBUTING.md specifically (the rentalFleets issue)
        if (sidebarFileNames.some(name => name?.includes('CONTRIBUTING.md')) && 
            !actualFiles.includes('CONTRIBUTING.md')) {
          console.log('   ❌ CONTRIBUTING.md shown in sidebar but file does not exist!');
          brokenItems.documents.push(`${repo}/CONTRIBUTING.md (file does not exist)`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing ${repo}: ${error.message}`);
      }
    }
    
    // Final Report
    console.log('\n' + '='.repeat(70));
    console.log('📊 BROKEN ITEMS REPORT');
    console.log('='.repeat(70));
    
    console.log(`\n🔴 BROKEN DOCUMENTS (${brokenItems.documents.length}):`);
    if (brokenItems.documents.length > 0) {
      brokenItems.documents.forEach(doc => console.log(`   - ${doc}`));
    } else {
      console.log('   None found! ✅');
    }
    
    console.log(`\n🔴 BROKEN LINKS (${brokenItems.links.length}):`);
    if (brokenItems.links.length > 0) {
      brokenItems.links.forEach(link => console.log(`   - ${link}`));
    } else {
      console.log('   None found! ✅');
    }
    
    console.log(`\n🔴 SIDEBAR ISSUES (${brokenItems.sidebarIssues.length}):`);
    if (brokenItems.sidebarIssues.length > 0) {
      brokenItems.sidebarIssues.forEach(repo => console.log(`   - ${repo}: No sidebar visible`));
    } else {
      console.log('   None found! ✅');
    }
    
    // Write report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        brokenDocuments: brokenItems.documents.length,
        brokenLinks: brokenItems.links.length,
        sidebarIssues: brokenItems.sidebarIssues.length,
        total: brokenItems.documents.length + brokenItems.links.length + brokenItems.sidebarIssues.length
      },
      details: brokenItems
    };
    
    fs.writeFileSync('test-results/BROKEN-ITEMS-REPORT.json', JSON.stringify(report, null, 2));
    
    console.log(`\nTOTAL BROKEN ITEMS: ${report.summary.total}`);
    
    if (report.summary.total === 0) {
      console.log('\n🎉 NO BROKEN ITEMS FOUND - 100% WORKING!');
    } else {
      console.log('\n❌ FOUND BROKEN ITEMS - NEEDS FIXING');
    }
    
    // For the rentalFleets CONTRIBUTING.md issue specifically
    if (brokenItems.documents.some(d => d.includes('rentalFleets') && d.includes('CONTRIBUTING.md'))) {
      console.log('\n⚠️  SPECIFIC ISSUE: rentalFleets/CONTRIBUTING.md is shown in sidebar but file does not exist!');
      console.log('    This needs to be fixed in the file tree API response.');
    }
    
    expect(report.summary.total).toBe(0);
  });
});