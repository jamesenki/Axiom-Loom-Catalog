import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const REPOS_DIR = path.join(__dirname, '../cloned-repositories');

// Get all actual repositories
function getRepositories(): string[] {
  return fs.readdirSync(REPOS_DIR).filter(dir => {
    const dirPath = path.join(REPOS_DIR, dir);
    return fs.statSync(dirPath).isDirectory() && 
           !dir.startsWith('.') && 
           dir !== 'node_modules' &&
           fs.existsSync(path.join(dirPath, 'README.md'));
  });
}

// Get ALL markdown files recursively
function getAllMarkdownFiles(repoPath: string, basePath: string = ''): Array<{path: string, fullPath: string}> {
  const files: Array<{path: string, fullPath: string}> = [];
  const fullPath = path.join(repoPath, basePath);
  
  try {
    const items = fs.readdirSync(fullPath);
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const relativePath = basePath ? `${basePath}/${item}` : item;
      
      if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...getAllMarkdownFiles(repoPath, relativePath));
      } else if (item.endsWith('.md')) {
        files.push({ path: relativePath, fullPath: itemPath });
      }
    }
  } catch (error) {
    console.error(`Error reading ${fullPath}:`, error);
  }
  
  return files;
}

// Extract ALL links from markdown content
function extractAllLinks(content: string): Array<{text: string, url: string, line: number}> {
  const links: Array<{text: string, url: string, line: number}> = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Match [text](url) style links
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdLinkRegex.exec(line)) !== null) {
      links.push({ text: match[1], url: match[2], line: index + 1 });
    }
    
    // Match raw URLs
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^[\]`]+/g;
    while ((match = urlRegex.exec(line)) !== null) {
      links.push({ text: 'raw URL', url: match[0], line: index + 1 });
    }
    
    // Match reference-style links [text][ref]
    const refLinkRegex = /\[([^\]]+)\]\[([^\]]+)\]/g;
    while ((match = refLinkRegex.exec(line)) !== null) {
      links.push({ text: match[1], url: `ref:${match[2]}`, line: index + 1 });
    }
  });
  
  return links;
}

test.describe('REAL 100% Document and Link Test', () => {
  test.setTimeout(300000); // 5 minutes timeout
  
  test('TEST EVERY SINGLE DOCUMENT IN EVERY SINGLE REPOSITORY', async ({ page }) => {
    const repos = getRepositories();
    const results = {
      totalDocs: 0,
      successDocs: 0,
      failedDocs: [],
      totalLinks: 0,
      successLinks: 0,
      failedLinks: []
    };
    
    console.log(`\n🔍 TESTING ${repos.length} REPOSITORIES FOR 100% COVERAGE\n`);
    
    for (const repo of repos) {
      console.log(`\n📁 REPOSITORY: ${repo}`);
      console.log('=' .repeat(50));
      
      const repoPath = path.join(REPOS_DIR, repo);
      const markdownFiles = getAllMarkdownFiles(repoPath);
      
      console.log(`Found ${markdownFiles.length} markdown files`);
      
      for (const mdFile of markdownFiles) {
        results.totalDocs++;
        console.log(`\n📄 Testing: ${mdFile.path}`);
        
        try {
          // Navigate to docs page
          await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(2000);
          
          // If not README, try to navigate to the file
          if (mdFile.path !== 'README.md') {
            // Try multiple strategies to find the file
            const fileName = path.basename(mdFile.path);
            
            // Strategy 1: Click on exact filename
            let clicked = false;
            const exactMatch = page.locator(`text="${fileName}"`).first();
            if (await exactMatch.isVisible({ timeout: 2000 })) {
              await exactMatch.click();
              clicked = true;
            }
            
            // Strategy 2: Click on filename without extension
            if (!clicked) {
              const nameWithoutExt = fileName.replace('.md', '');
              const withoutExtMatch = page.locator(`text="${nameWithoutExt}"`).first();
              if (await withoutExtMatch.isVisible({ timeout: 2000 })) {
                await withoutExtMatch.click();
                clicked = true;
              }
            }
            
            // Strategy 3: Use link with href
            if (!clicked) {
              const linkMatch = page.locator(`a[href*="${fileName}"], a[href*="${mdFile.path}"]`).first();
              if (await linkMatch.isVisible({ timeout: 2000 })) {
                await linkMatch.click();
                clicked = true;
              }
            }
            
            await page.waitForTimeout(2000);
          }
          
          // Check for error message
          const errorMsg = page.locator('text="Error Loading Documentation"');
          const failedMsg = page.locator('text="Failed to fetch file content"');
          const notFoundMsg = page.locator('text="404 Not Found"');
          
          if (await errorMsg.isVisible({ timeout: 1000 }) || 
              await failedMsg.isVisible({ timeout: 1000 }) ||
              await notFoundMsg.isVisible({ timeout: 1000 })) {
            
            // FAILED TO LOAD
            console.log(`   ❌ FAILED: Document shows error`);
            results.failedDocs.push({
              repo,
              file: mdFile.path,
              error: 'Error Loading Documentation'
            });
            
            // Take screenshot of failure
            await page.screenshot({ 
              path: `test-results/FAILED-${repo}-${mdFile.path.replace(/\//g, '-')}.png`,
              fullPage: true 
            });
          } else {
            // Document loaded successfully
            const hasContent = await page.locator('h1, h2, h3, p').first().isVisible({ timeout: 5000 });
            if (hasContent) {
              console.log(`   ✅ SUCCESS: Document loaded`);
              results.successDocs++;
              
              // Now test ALL links in this document
              const content = fs.readFileSync(mdFile.fullPath, 'utf-8');
              const links = extractAllLinks(content);
              
              if (links.length > 0) {
                console.log(`   🔗 Testing ${links.length} links...`);
                
                for (const link of links) {
                  results.totalLinks++;
                  
                  if (link.url.startsWith('http')) {
                    // External link - just count it
                    console.log(`      🌐 External: ${link.url}`);
                    results.successLinks++;
                  } else if (link.url.startsWith('#')) {
                    // Anchor link - try to click it
                    try {
                      const anchor = page.locator(`a[href="${link.url}"]`).first();
                      if (await anchor.isVisible({ timeout: 1000 })) {
                        await anchor.click();
                        await page.waitForTimeout(500);
                        console.log(`      ✅ Anchor works: ${link.url}`);
                        results.successLinks++;
                      } else {
                        console.log(`      ❌ Anchor not found: ${link.url}`);
                        results.failedLinks.push({
                          repo,
                          file: mdFile.path,
                          link: link.url,
                          line: link.line,
                          error: 'Anchor not found'
                        });
                      }
                    } catch (error) {
                      console.log(`      ❌ Anchor failed: ${link.url}`);
                      results.failedLinks.push({
                        repo,
                        file: mdFile.path,
                        link: link.url,
                        line: link.line,
                        error: error.message
                      });
                    }
                  } else if (link.url.endsWith('.md') || !link.url.startsWith('ref:')) {
                    // Internal document link - try to click it
                    try {
                      const docLink = page.locator(`a[href*="${link.url}"]`).first();
                      if (await docLink.isVisible({ timeout: 1000 })) {
                        await docLink.click();
                        await page.waitForTimeout(1000);
                        
                        // Check if navigation worked
                        const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 });
                        if (hasError) {
                          console.log(`      ❌ Link leads to error: ${link.url}`);
                          results.failedLinks.push({
                            repo,
                            file: mdFile.path,
                            link: link.url,
                            line: link.line,
                            error: 'Link leads to error page'
                          });
                        } else {
                          console.log(`      ✅ Link works: ${link.url}`);
                          results.successLinks++;
                        }
                        
                        // Go back
                        await page.goBack();
                        await page.waitForTimeout(1000);
                      } else {
                        console.log(`      ❌ Link not found: ${link.url}`);
                        results.failedLinks.push({
                          repo,
                          file: mdFile.path,
                          link: link.url,
                          line: link.line,
                          error: 'Link element not found'
                        });
                      }
                    } catch (error) {
                      console.log(`      ❌ Link failed: ${link.url}`);
                      results.failedLinks.push({
                        repo,
                        file: mdFile.path,
                        link: link.url,
                        line: link.line,
                        error: error.message
                      });
                    }
                  }
                }
              }
            } else {
              console.log(`   ❌ FAILED: No content visible`);
              results.failedDocs.push({
                repo,
                file: mdFile.path,
                error: 'No content visible'
              });
            }
          }
        } catch (error) {
          console.log(`   ❌ FAILED: ${error.message}`);
          results.failedDocs.push({
            repo,
            file: mdFile.path,
            error: error.message
          });
        }
      }
    }
    
    // FINAL REPORT
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log(`\n📄 DOCUMENTS:`);
    console.log(`   Total: ${results.totalDocs}`);
    console.log(`   ✅ Success: ${results.successDocs}`);
    console.log(`   ❌ Failed: ${results.failedDocs.length}`);
    const docSuccessRate = (results.successDocs / results.totalDocs * 100).toFixed(1);
    console.log(`   Success Rate: ${docSuccessRate}%`);
    
    if (results.failedDocs.length > 0) {
      console.log(`\n   FAILED DOCUMENTS:`);
      results.failedDocs.forEach(fail => {
        console.log(`   - ${fail.repo}/${fail.file}: ${fail.error}`);
      });
    }
    
    console.log(`\n🔗 LINKS:`);
    console.log(`   Total: ${results.totalLinks}`);
    console.log(`   ✅ Success: ${results.successLinks}`);
    console.log(`   ❌ Failed: ${results.failedLinks.length}`);
    const linkSuccessRate = results.totalLinks > 0 ? (results.successLinks / results.totalLinks * 100).toFixed(1) : '100';
    console.log(`   Success Rate: ${linkSuccessRate}%`);
    
    if (results.failedLinks.length > 0) {
      console.log(`\n   FAILED LINKS:`);
      results.failedLinks.forEach(fail => {
        console.log(`   - ${fail.repo}/${fail.file} line ${fail.line}: ${fail.link} - ${fail.error}`);
      });
    }
    
    // Write detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        documents: {
          total: results.totalDocs,
          success: results.successDocs,
          failed: results.failedDocs.length,
          successRate: docSuccessRate
        },
        links: {
          total: results.totalLinks,
          success: results.successLinks,
          failed: results.failedLinks.length,
          successRate: linkSuccessRate
        }
      },
      failedDocuments: results.failedDocs,
      failedLinks: results.failedLinks
    };
    
    fs.writeFileSync('test-results/100-percent-coverage-report.json', JSON.stringify(report, null, 2));
    
    // ASSERTIONS
    console.log('\n' + '='.repeat(80));
    if (results.failedDocs.length === 0 && results.failedLinks.length === 0) {
      console.log('🎉 100% PASS RATE ACHIEVED! ALL DOCUMENTS AND LINKS WORK!');
    } else {
      console.log(`❌ FAILED: ${results.failedDocs.length} documents and ${results.failedLinks.length} links are broken`);
    }
    
    // Fail the test if anything is broken
    expect(results.failedDocs.length).toBe(0);
    expect(results.failedLinks.length).toBe(0);
  });
});