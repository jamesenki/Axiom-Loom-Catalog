import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';

test('Fix rentalFleets CONTRIBUTING.md issue', async ({ page }) => {
  console.log('\n🔍 Investigating rentalFleets CONTRIBUTING.md issue...\n');
  
  // 1. Check if file actually exists
  const filePath = path.join(__dirname, '../cloned-repositories/rentalFleets/CONTRIBUTING.md');
  const fileExists = fs.existsSync(filePath);
  console.log(`File exists on disk: ${fileExists}`);
  
  // 2. List actual .md files in rentalFleets root
  const repoPath = path.join(__dirname, '../cloned-repositories/rentalFleets');
  const actualMdFiles = fs.readdirSync(repoPath).filter(f => f.endsWith('.md'));
  console.log('\nActual .md files in rentalFleets root:');
  actualMdFiles.forEach(f => console.log(`  - ${f}`));
  
  // 3. Check what the API returns
  console.log('\n📡 Checking API response...');
  const apiResponse = await fetch(`${BASE_URL.replace('3000', '3001')}/api/repository/rentalFleets/files`);
  const fileTree = await apiResponse.json();
  
  // Find CONTRIBUTING.md in the API response
  const findFile = (items, target) => {
    for (const item of items) {
      if (item.name === target) return true;
      if (item.children) {
        if (findFile(item.children, target)) return true;
      }
    }
    return false;
  };
  
  const contributingInApi = findFile(fileTree, 'CONTRIBUTING.md');
  console.log(`CONTRIBUTING.md in API response: ${contributingInApi}`);
  
  // 4. Check what appears in the UI
  await page.goto(`${BASE_URL}/docs/rentalFleets`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'test-results/rentalFleets-sidebar.png', fullPage: true });
  
  const contributingLink = page.locator('text="CONTRIBUTING.md"').first();
  const contributingVisible = await contributingLink.isVisible({ timeout: 2000 });
  console.log(`\nCONTRIBUTING.md visible in UI: ${contributingVisible}`);
  
  if (contributingVisible && !fileExists) {
    console.log('\n❌ BUG CONFIRMED: CONTRIBUTING.md is shown in UI but file does not exist!');
    
    // Click it to confirm 404
    await contributingLink.click();
    await page.waitForTimeout(2000);
    
    const hasError = await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
    console.log(`Shows 404 error: ${hasError}`);
    
    await page.screenshot({ path: 'test-results/rentalFleets-contributing-404.png', fullPage: true });
    
    console.log('\n🔧 FIX NEEDED:');
    console.log('The file tree API is returning CONTRIBUTING.md for rentalFleets when it does not exist.');
    console.log('This needs to be fixed in the /api/repository/:repoName/files endpoint.');
    
    // The issue is likely in src/api/repositoryFiles.js
    console.log('\nCheck: src/api/repositoryFiles.js - it may be returning cached or incorrect data.');
  } else if (!contributingVisible && !fileExists) {
    console.log('\n✅ GOOD: CONTRIBUTING.md is not shown (file does not exist)');
  } else if (contributingVisible && fileExists) {
    console.log('\n✅ GOOD: CONTRIBUTING.md is shown and file exists');
  }
  
  // Fail the test if the bug exists
  expect(!(contributingVisible && !fileExists)).toBe(true);
});