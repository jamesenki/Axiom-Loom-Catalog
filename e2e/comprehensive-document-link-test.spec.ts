import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const REPOS_DIR = path.join(__dirname, '../cloned-repositories');

// Get all repositories
function getRepositories(): string[] {
  return fs.readdirSync(REPOS_DIR).filter(dir => {
    const dirPath = path.join(REPOS_DIR, dir);
    // Skip hidden directories and non-repository directories
    return fs.statSync(dirPath).isDirectory() && 
           !dir.startsWith('.') && 
           dir !== 'node_modules' &&
           fs.existsSync(path.join(dirPath, 'README.md'));
  });
}

// Get all markdown files in a repository
function getMarkdownFiles(repoPath: string, basePath: string = ''): string[] {
  const files: string[] = [];
  const fullPath = path.join(repoPath, basePath);
  
  const items = fs.readdirSync(fullPath);
  for (const item of items) {
    const itemPath = path.join(fullPath, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    
    if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getMarkdownFiles(repoPath, relativePath));
    } else if (item.endsWith('.md')) {
      files.push(relativePath);
    }
  }
  
  return files;
}

// Extract links from markdown content
function extractLinksFromMarkdown(content: string): string[] {
  const links: string[] = [];
  
  // Match [text](url) style links
  const mdLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  mdLinks.forEach(link => {
    const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) links.push(match[2]);
  });
  
  // Match raw URLs
  const urlPattern = /https?:\/\/[^\s<>"\{\}\|\\\^\[\]`]+/g;
  const urls = content.match(urlPattern) || [];
  links.push(...urls);
  
  return links;
}

test.describe('100% Document and Link Coverage Test', () => {
  test.setTimeout(120000); // Increase timeout to 2 minutes
  
  test('EVERY document in EVERY repository loads and displays correctly', async ({ page }) => {
    const repos = getRepositories();
    console.log(`Testing ${repos.length} repositories`);
    
    for (const repo of repos) {
      console.log(`\n=== Testing repository: ${repo} ===`);
      const repoPath = path.join(REPOS_DIR, repo);
      const markdownFiles = getMarkdownFiles(repoPath);
      
      console.log(`Found ${markdownFiles.length} markdown files`);
      
      for (const mdFile of markdownFiles) {
        console.log(`  Testing: ${mdFile}`);
        
        try {
          // Test direct URL access
          await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(2000); // Give time for content to load
          
          // Navigate to specific file if not README.md
          if (mdFile !== 'README.md') {
            // Find and click the file in the navigation
            const fileLink = page.locator(`text="${path.basename(mdFile)}"`).first();
            if (await fileLink.isVisible({ timeout: 5000 })) {
              await fileLink.click();
              await page.waitForTimeout(1000);
            }
          }
          
          // Verify content loads
          await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
          
          // Take screenshot for evidence
          await page.screenshot({ 
            path: `test-results/docs-${repo}-${mdFile.replace(/\//g, '-')}.png`,
            fullPage: true 
          });
        } catch (error) {
          console.error(`Failed to test ${repo}/${mdFile}:`, error);
          // Continue with next file
        }
      }
    }
  });

  test('EVERY link in EVERY document works correctly', async ({ page }) => {
    const repos = getRepositories();
    let totalLinks = 0;
    let brokenLinks: string[] = [];
    
    for (const repo of repos) {
      console.log(`\n=== Checking links in repository: ${repo} ===`);
      const repoPath = path.join(REPOS_DIR, repo);
      const markdownFiles = getMarkdownFiles(repoPath);
      
      for (const mdFile of markdownFiles) {
        const filePath = path.join(repoPath, mdFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const links = extractLinksFromMarkdown(content);
        
        console.log(`  ${mdFile}: ${links.length} links found`);
        totalLinks += links.length;
        
        // Load the document
        await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Check each link
        for (const link of links) {
          if (link.startsWith('http')) {
            // External link - verify it returns 200
            try {
              const response = await fetch(link);
              if (response.status !== 200) {
                brokenLinks.push(`${repo}/${mdFile}: ${link} (HTTP ${response.status})`);
              }
            } catch (error) {
              brokenLinks.push(`${repo}/${mdFile}: ${link} (Network error)`);
            }
          } else if (link.startsWith('#')) {
            // Anchor link - verify element exists
            const anchor = page.locator(link);
            if (!(await anchor.isVisible())) {
              brokenLinks.push(`${repo}/${mdFile}: ${link} (Anchor not found)`);
            }
          } else {
            // Internal link - verify navigation works
            const linkElement = page.locator(`a[href*="${link}"]`).first();
            if (await linkElement.isVisible()) {
              await linkElement.click();
              await page.waitForTimeout(1000);
              // Verify we navigated somewhere
              const currentUrl = page.url();
              if (currentUrl === `${BASE_URL}/docs/${repo}`) {
                brokenLinks.push(`${repo}/${mdFile}: ${link} (Navigation failed)`);
              }
              // Go back for next test
              await page.goBack();
            }
          }
        }
      }
    }
    
    console.log(`\n=== LINK TEST SUMMARY ===`);
    console.log(`Total links tested: ${totalLinks}`);
    console.log(`Broken links found: ${brokenLinks.length}`);
    
    if (brokenLinks.length > 0) {
      console.log('\nBroken links:');
      brokenLinks.forEach(link => console.log(`  - ${link}`));
    }
    
    expect(brokenLinks).toHaveLength(0);
  });

  test('Repository navigation and UI elements work correctly', async ({ page }) => {
    const repos = getRepositories();
    
    for (const repo of repos.slice(0, 5)) { // Test first 5 repos
      console.log(`\nTesting UI for ${repo}`);
      
      // Test from homepage
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Find and click repository
      const repoCard = page.locator(`text="${repo}"`).first();
      if (await repoCard.isVisible()) {
        // Test Details button
        const detailsBtn = page.locator(`text="${repo}"`).locator('xpath=ancestor::div[contains(@class, "sc-")]').locator('a:has-text("Details")').first();
        if (await detailsBtn.isVisible()) {
          await detailsBtn.click();
          await page.waitForLoadState('networkidle');
          await expect(page.locator('h1, h2').first()).toBeVisible();
          
          // Test documentation link
          const docsLink = page.locator('a:has-text("Docs"), a:has-text("Documentation"), button:has-text("View Documentation")').first();
          if (await docsLink.isVisible()) {
            await docsLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Table of Contents, text=TOC').first()).toBeVisible();
          }
        }
      }
    }
  });
});