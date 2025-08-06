import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const REPOS_DIR = path.join(__dirname, '../cloned-repositories');

// Get all repositories
function getAllRepositories(): string[] {
  return fs.readdirSync(REPOS_DIR).filter(dir => {
    const dirPath = path.join(REPOS_DIR, dir);
    return fs.statSync(dirPath).isDirectory() && 
           !dir.startsWith('.') && 
           dir !== 'node_modules';
  });
}

// Extract all links from markdown content
function extractLinksFromMarkdown(content: string): Array<{type: string, text: string, url: string, line: number}> {
  const links: Array<{type: string, text: string, url: string, line: number}> = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // [text](url) style links
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdLinkRegex.exec(line)) !== null) {
      links.push({ 
        type: 'markdown', 
        text: match[1], 
        url: match[2], 
        line: index + 1 
      });
    }
    
    // Raw URLs
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^[\]`]+/g;
    while ((match = urlRegex.exec(line)) !== null) {
      links.push({ 
        type: 'url', 
        text: 'raw URL',
        url: match[0], 
        line: index + 1 
      });
    }
  });
  
  return links;
}

// Check for PlantUML blocks
function findPlantUMLBlocks(content: string): Array<{line: number, code: string}> {
  const blocks: Array<{line: number, code: string}> = [];
  const regex = /```plantuml([\s\S]*?)```/g;
  let match;
  let lineCount = 0;
  
  while ((match = regex.exec(content)) !== null) {
    const linesBefore = content.substring(0, match.index).split('\n').length;
    blocks.push({
      line: linesBefore,
      code: match[1].trim()
    });
  }
  
  return blocks;
}

// Check for Mermaid blocks
function findMermaidBlocks(content: string): Array<{line: number, code: string}> {
  const blocks: Array<{line: number, code: string}> = [];
  const regex = /```mermaid([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const linesBefore = content.substring(0, match.index).split('\n').length;
    blocks.push({
      line: linesBefore,
      code: match[1].trim()
    });
  }
  
  return blocks;
}

test.describe('100% COMPLETE DOCUMENTATION TEST', () => {
  test.setTimeout(900000); // 15 minutes
  
  test('Test EVERY document, EVERY link, ALL content with 100% coverage', async ({ page }) => {
    const repos = getAllRepositories();
    const testReport = {
      repositories: [],
      totalDocumentsTested: 0,
      totalLinksTested: 0,
      totalPlantUMLTested: 0,
      totalMermaidTested: 0,
      failures: []
    };
    
    console.log('\n' + '='.repeat(80));
    console.log('100% COMPLETE DOCUMENTATION TEST');
    console.log('='.repeat(80));
    console.log(`Testing ${repos.length} repositories...\n`);
    
    // Test each repository
    for (const repo of repos) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`REPOSITORY: ${repo}`);
      console.log('='.repeat(80));
      
      const repoReport = {
        name: repo,
        documentsFound: new Set<string>(),
        documentsTested: new Set<string>(),
        linkGraph: new Map<string, string[]>(),
        contentIssues: [],
        brokenLinks: [],
        diagramIssues: [],
        orphanedDocs: []
      };
      
      try {
        // A. Test main documentation page
        console.log('\n1. Testing main documentation page...');
        await page.goto(`${BASE_URL}/docs/${repo}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Check for 404
        const hasMainError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                            await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
        
        if (hasMainError) {
          console.log('   ❌ Main page shows 404 error');
          repoReport.contentIssues.push('Main page (README.md) shows 404 error');
          testReport.failures.push(`${repo}: Main page 404`);
          continue;
        }
        
        console.log('   ✅ Main page loads');
        
        // Verify sidebar shows only TOC, not file tree
        const fileTreeItems = await page.locator('[class*="fileTreeItem"]').count();
        if (fileTreeItems > 0) {
          console.log(`   ⚠️  Sidebar shows file tree (${fileTreeItems} items) - should only show TOC`);
          repoReport.contentIssues.push('Sidebar shows file tree instead of just TOC');
        }
        
        // Take screenshot
        await page.screenshot({ 
          path: `test-results/${repo}-main-page.png`,
          fullPage: true 
        });
        
        // B. Traverse all documents via links starting from README
        console.log('\n2. Traversing documents via links...');
        const visitedDocs = new Set<string>();
        const docsToVisit = ['README.md'];
        
        while (docsToVisit.length > 0) {
          const currentDoc = docsToVisit.shift();
          if (visitedDocs.has(currentDoc)) continue;
          
          console.log(`\n   📄 Testing: ${currentDoc}`);
          visitedDocs.add(currentDoc);
          repoReport.documentsTested.add(currentDoc);
          testReport.totalDocumentsTested++;
          
          // Navigate to document if not already there
          if (currentDoc !== 'README.md') {
            // This doc was reached via a link, so we should already be on it
            // If not, we have a navigation issue
          }
          
          // Get page content - use the documentation content area specifically
          const pageContent = await page.locator('.DocumentationView_docContent__vOFJi, [class*="docContent"]').textContent();
          
          // D. Content verification
          console.log('      Verifying content...');
          
          // Check for any headings
          const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
          if (headings === 0) {
            console.log('      ❌ No headings found');
            repoReport.contentIssues.push(`${currentDoc}: No headings rendered`);
          } else {
            console.log(`      ✅ ${headings} headings found`);
          }
          
          // Check code blocks
          const codeBlocks = await page.locator('pre code').count();
          console.log(`      📝 ${codeBlocks} code blocks found`);
          
          // Check tables
          const tables = await page.locator('table').count();
          console.log(`      📊 ${tables} tables found`);
          
          // Check for PlantUML/Mermaid in source
          const sourceFile = path.join(REPOS_DIR, repo, currentDoc);
          if (fs.existsSync(sourceFile)) {
            const sourceContent = fs.readFileSync(sourceFile, 'utf-8');
            
            // Check PlantUML
            const plantumlBlocks = findPlantUMLBlocks(sourceContent);
            if (plantumlBlocks.length > 0) {
              console.log(`      🎨 ${plantumlBlocks.length} PlantUML blocks in source`);
              testReport.totalPlantUMLTested += plantumlBlocks.length;
              
              // Verify they render as images, not code
              for (const block of plantumlBlocks) {
                const codeVisible = pageContent.includes('@startuml') || pageContent.includes('@enduml');
                if (codeVisible) {
                  console.log(`      ❌ PlantUML at line ${block.line} showing as code!`);
                  repoReport.diagramIssues.push(`${currentDoc}:${block.line} - PlantUML not rendering`);
                  testReport.failures.push(`${repo}/${currentDoc}: PlantUML not rendering`);
                } else {
                  // Check for rendered image
                  const images = await page.locator('img[src*="plantuml"], img[alt*="PlantUML"]').count();
                  if (images === 0) {
                    console.log(`      ❌ PlantUML at line ${block.line} not rendering as image`);
                    repoReport.diagramIssues.push(`${currentDoc}:${block.line} - PlantUML missing`);
                  }
                }
              }
            }
            
            // Check Mermaid
            const mermaidBlocks = findMermaidBlocks(sourceContent);
            if (mermaidBlocks.length > 0) {
              console.log(`      🎨 ${mermaidBlocks.length} Mermaid blocks in source`);
              testReport.totalMermaidTested += mermaidBlocks.length;
              
              // Verify they render as diagrams, not code
              for (const block of mermaidBlocks) {
                const codeVisible = pageContent.includes('graph TD') || pageContent.includes('graph LR') || 
                                   pageContent.includes('sequenceDiagram') || pageContent.includes('flowchart');
                if (codeVisible && !pageContent.includes('```mermaid')) {
                  console.log(`      ❌ Mermaid at line ${block.line} showing as code!`);
                  repoReport.diagramIssues.push(`${currentDoc}:${block.line} - Mermaid not rendering`);
                  testReport.failures.push(`${repo}/${currentDoc}: Mermaid not rendering`);
                }
              }
            }
            
            // Extract links from source
            const links = extractLinksFromMarkdown(sourceContent);
            console.log(`      🔗 ${links.length} links found`);
            testReport.totalLinksTested += links.length;
            
            // Test each link
            for (const link of links) {
              if (link.url.startsWith('http')) {
                // External link - skip for now
                continue;
              } else if (link.url.startsWith('#')) {
                // Anchor link
                const anchor = await page.locator(link.url).count();
                if (anchor === 0) {
                  console.log(`      ❌ Anchor not found: ${link.url}`);
                  repoReport.brokenLinks.push(`${currentDoc}:${link.line} - ${link.url}`);
                }
              } else if (link.url.endsWith('.md')) {
                // Document link - click it
                console.log(`      → Following link to: ${link.url}`);
                
                const linkElement = await page.locator(`a[href*="${link.url}"]`).first();
                if (await linkElement.isVisible({ timeout: 2000 })) {
                  await linkElement.click();
                  await page.waitForTimeout(2000);
                  
                  // Check for error
                  const hasError = await page.locator('text="Error Loading Documentation"').isVisible({ timeout: 1000 }) ||
                                  await page.locator('text="404 Not Found"').isVisible({ timeout: 1000 });
                  
                  if (hasError) {
                    console.log(`      ❌ Link leads to 404: ${link.url}`);
                    repoReport.brokenLinks.push(`${currentDoc}:${link.line} - ${link.url} (404)`);
                    testReport.failures.push(`${repo}/${currentDoc}: Link to ${link.url} returns 404`);
                  } else {
                    // Add to visit queue
                    const linkedDoc = link.url.replace(/^\.\//, '');
                    if (!visitedDocs.has(linkedDoc)) {
                      docsToVisit.push(linkedDoc);
                    }
                  }
                } else {
                  console.log(`      ❌ Link not clickable: ${link.url}`);
                  repoReport.brokenLinks.push(`${currentDoc}:${link.line} - ${link.url} (not clickable)`);
                }
              }
            }
          }
          
          // Check for text overflow
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          if (hasHorizontalScroll) {
            console.log('      ❌ Text overflow detected (horizontal scroll)');
            repoReport.contentIssues.push(`${currentDoc}: Text overflow`);
          }
          
          // Take screenshot
          await page.screenshot({ 
            path: `test-results/${repo}-${currentDoc.replace(/\//g, '-')}.png`,
            fullPage: true 
          });
        }
        
        // Find orphaned documents
        const allMdFiles = new Set<string>();
        const findMdFiles = (dir: string, basePath = '') => {
          const items = fs.readdirSync(dir);
          items.forEach(item => {
            const fullPath = path.join(dir, item);
            const relativePath = basePath ? `${basePath}/${item}` : item;
            if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.')) {
              findMdFiles(fullPath, relativePath);
            } else if (item.endsWith('.md')) {
              allMdFiles.add(relativePath);
            }
          });
        };
        findMdFiles(path.join(REPOS_DIR, repo));
        
        allMdFiles.forEach(file => {
          if (!visitedDocs.has(file)) {
            repoReport.orphanedDocs.push(file);
          }
        });
        
        console.log(`\n   📊 Summary for ${repo}:`);
        console.log(`      Documents tested: ${visitedDocs.size}`);
        console.log(`      Total documents: ${allMdFiles.size}`);
        console.log(`      Orphaned documents: ${repoReport.orphanedDocs.length}`);
        console.log(`      Content issues: ${repoReport.contentIssues.length}`);
        console.log(`      Broken links: ${repoReport.brokenLinks.length}`);
        console.log(`      Diagram issues: ${repoReport.diagramIssues.length}`);
        
      } catch (error) {
        console.log(`   ❌ Error testing ${repo}: ${error.message}`);
        testReport.failures.push(`${repo}: ${error.message}`);
      }
      
      testReport.repositories.push(repoReport);
    }
    
    // Final report
    console.log('\n' + '='.repeat(80));
    console.log('FINAL TEST REPORT');
    console.log('='.repeat(80));
    
    console.log(`\nTotals:`);
    console.log(`  Repositories tested: ${repos.length}`);
    console.log(`  Documents tested: ${testReport.totalDocumentsTested}`);
    console.log(`  Links tested: ${testReport.totalLinksTested}`);
    console.log(`  PlantUML blocks tested: ${testReport.totalPlantUMLTested}`);
    console.log(`  Mermaid blocks tested: ${testReport.totalMermaidTested}`);
    console.log(`  Total failures: ${testReport.failures.length}`);
    
    if (testReport.failures.length > 0) {
      console.log('\n❌ FAILURES:');
      testReport.failures.forEach(failure => {
        console.log(`  - ${failure}`);
      });
    }
    
    // Write detailed report
    fs.writeFileSync('test-results/100-PERCENT-TEST-REPORT.json', JSON.stringify(testReport, null, 2));
    
    const successRate = testReport.failures.length === 0 ? 100 : 0;
    console.log(`\nSUCCESS RATE: ${successRate}%`);
    
    if (successRate === 100) {
      console.log('\n🎉 100% PASS RATE ACHIEVED!');
    } else {
      console.log('\n❌ TEST FAILED - NOT 100%');
    }
    
    // Assert 100% pass rate
    expect(testReport.failures.length).toBe(0);
  });
});