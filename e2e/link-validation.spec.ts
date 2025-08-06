import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

test.describe('Comprehensive Link Validation - 100% Coverage', () => {
  const REPO_BASE = path.join(__dirname, '../cloned-repositories');
  const API_BASE = 'http://localhost:3000';
  
  interface LinkLocation {
    repo: string;
    file: string;
    line: number;
    linkText: string;
    linkPath: string;
    absolutePath?: string;
  }

  interface LinkResult {
    location: LinkLocation;
    status: 'valid' | 'broken' | 'error';
    message?: string;
    actualContent?: string;
  }

  // Extract all links from markdown content
  function extractLinks(content: string, repo: string, file: string): LinkLocation[] {
    const links: LinkLocation[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Match markdown links [text](path)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = linkRegex.exec(line)) !== null) {
        const linkText = match[1];
        const linkPath = match[2];
        
        // Skip external links
        if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
          continue;
        }
        
        // Skip anchor links
        if (linkPath.startsWith('#')) {
          continue;
        }
        
        links.push({
          repo,
          file,
          line: index + 1,
          linkText,
          linkPath
        });
      }
    });
    
    return links;
  }

  // Get all markdown files in a directory recursively
  async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subFiles = await getAllMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Get all repositories
  async function getAllRepositories(): Promise<string[]> {
    const repos: string[] = [];
    const entries = await fs.readdir(REPO_BASE, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        repos.push(entry.name);
      }
    }
    
    return repos;
  }

  // Extract all links from all documents in all repositories
  async function extractAllLinks(): Promise<LinkLocation[]> {
    const allLinks: LinkLocation[] = [];
    const repos = await getAllRepositories();
    
    for (const repo of repos) {
      const repoPath = path.join(REPO_BASE, repo);
      const mdFiles = await getAllMarkdownFiles(repoPath);
      
      for (const mdFile of mdFiles) {
        try {
          const content = await fs.readFile(mdFile, 'utf-8');
          const relativePath = path.relative(repoPath, mdFile);
          const links = extractLinks(content, repo, relativePath);
          
          // Resolve absolute paths for each link
          for (const link of links) {
            const fileDir = path.dirname(mdFile);
            let absolutePath: string;
            
            if (link.linkPath.startsWith('./')) {
              absolutePath = path.join(fileDir, link.linkPath.substring(2));
            } else if (link.linkPath.startsWith('../')) {
              absolutePath = path.join(fileDir, link.linkPath);
            } else if (link.linkPath.startsWith('/')) {
              absolutePath = path.join(repoPath, link.linkPath);
            } else {
              absolutePath = path.join(fileDir, link.linkPath);
            }
            
            link.absolutePath = path.normalize(absolutePath);
          }
          
          allLinks.push(...links);
        } catch (error) {
          console.error(`Error reading file ${mdFile}: ${error}`);
        }
      }
    }
    
    return allLinks;
  }

  test('Validate ALL links in ALL documents in ALL repositories', async ({ page }) => {
    // Set a longer timeout for this comprehensive test
    test.setTimeout(300000); // 5 minutes
    
    console.log('Starting comprehensive link validation...');
    
    // Extract all links
    const allLinks = await extractAllLinks();
    console.log(`Found ${allLinks.length} total links to validate`);
    
    const results: LinkResult[] = [];
    const brokenLinks: LinkResult[] = [];
    
    // Group links by repository for better reporting
    const linksByRepo = new Map<string, LinkLocation[]>();
    for (const link of allLinks) {
      if (!linksByRepo.has(link.repo)) {
        linksByRepo.set(link.repo, []);
      }
      linksByRepo.get(link.repo)!.push(link);
    }
    
    // Test each repository's links
    for (const [repo, repoLinks] of linksByRepo) {
      console.log(`\nValidating ${repoLinks.length} links in repository: ${repo}`);
      
      // Navigate to the repo's main page first
      await page.goto(`${API_BASE}/docs/${repo}`);
      
      for (const link of repoLinks) {
        try {
          // Check if it's a local file link
          if (link.absolutePath) {
            try {
              await fs.access(link.absolutePath);
              
              // For .md files, also verify they can be loaded through the API
              if (link.linkPath.endsWith('.md')) {
                const docPath = link.linkPath.replace(/^\.\//, '');
                const response = await page.request.get(`${API_BASE}/api/repository/${repo}/file?path=${encodeURIComponent(docPath)}`);
                
                if (response.ok()) {
                  const content = await response.text();
                  results.push({
                    location: link,
                    status: 'valid',
                    actualContent: content.substring(0, 100) + '...'
                  });
                } else {
                  brokenLinks.push({
                    location: link,
                    status: 'broken',
                    message: `API returned ${response.status()}: ${response.statusText()}`
                  });
                }
              } else {
                results.push({
                  location: link,
                  status: 'valid',
                  message: 'File exists on disk'
                });
              }
            } catch (error) {
              brokenLinks.push({
                location: link,
                status: 'broken',
                message: `File not found: ${link.absolutePath}`
              });
            }
          }
        } catch (error) {
          results.push({
            location: link,
            status: 'error',
            message: error.toString()
          });
        }
      }
    }
    
    // Print summary
    console.log(`\n${'='.repeat(80)}`);
    console.log('LINK VALIDATION SUMMARY');
    console.log(`${'='.repeat(80)}`);
    console.log(`Total links tested: ${results.length + brokenLinks.length}`);
    console.log(`Valid links: ${results.filter(r => r.status === 'valid').length}`);
    console.log(`Broken links: ${brokenLinks.length}`);
    console.log(`Errors: ${results.filter(r => r.status === 'error').length}`);
    
    if (brokenLinks.length > 0) {
      console.log(`\n${'='.repeat(80)}`);
      console.log('BROKEN LINKS REPORT');
      console.log(`${'='.repeat(80)}`);
      
      for (const broken of brokenLinks) {
        console.log(`\nRepository: ${broken.location.repo}`);
        console.log(`File: ${broken.location.file}:${broken.location.line}`);
        console.log(`Link Text: "${broken.location.linkText}"`);
        console.log(`Link Path: ${broken.location.linkPath}`);
        console.log(`Error: ${broken.message}`);
      }
    }
    
    // Create a detailed report file
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalLinks: results.length + brokenLinks.length,
        validLinks: results.filter(r => r.status === 'valid').length,
        brokenLinks: brokenLinks.length,
        errors: results.filter(r => r.status === 'error').length
      },
      brokenLinks: brokenLinks.map(b => ({
        repo: b.location.repo,
        file: b.location.file,
        line: b.location.line,
        linkText: b.location.linkText,
        linkPath: b.location.linkPath,
        error: b.message
      })),
      allResults: [...results, ...brokenLinks].map(r => ({
        repo: r.location.repo,
        file: r.location.file,
        line: r.location.line,
        linkText: r.location.linkText,
        linkPath: r.location.linkPath,
        status: r.status,
        message: r.message
      }))
    };
    
    await fs.writeFile(
      path.join(__dirname, '../../link-validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\nDetailed report saved to: link-validation-report.json`);
    
    // Assert that there are no broken links
    expect(brokenLinks).toHaveLength(0);
  });

  test('Verify Mermaid and PlantUML diagrams render correctly', async ({ page }) => {
    // Test documents known to have diagrams
    const diagramDocs = [
      { repo: 'future-mobility-consumer-platform', path: 'docs/architecture/technical-design.md' },
      { repo: 'future-mobility-consumer-platform', path: 'docs/architecture/security.md' },
      { repo: 'future-mobility-consumer-platform', path: 'docs/architecture/deployment.md' },
      { repo: 'nslabsdashboards', path: 'docs/development/DEVELOPER_GUIDE.md' }
    ];
    
    for (const doc of diagramDocs) {
      console.log(`\nChecking diagrams in ${doc.repo}/${doc.path}`);
      
      // Navigate to the document
      await page.goto(`${API_BASE}/docs/${doc.repo}`);
      await page.waitForTimeout(500);
      
      // Click on the document link
      const encodedPath = encodeURIComponent(doc.path);
      await page.goto(`${API_BASE}/docs/${doc.repo}?path=${encodedPath}`);
      await page.waitForTimeout(1000);
      
      // Check for Mermaid diagrams
      const mermaidDiagrams = await page.locator('.mermaid svg').count();
      if (mermaidDiagrams > 0) {
        console.log(`✓ Found ${mermaidDiagrams} rendered Mermaid diagrams`);
        
        // Verify they're not showing as raw text
        const rawMermaidText = await page.locator('text=/```mermaid/').count();
        expect(rawMermaidText).toBe(0);
      }
      
      // Check for PlantUML diagrams
      const plantumlDiagrams = await page.locator('img[src*="plantuml"]').count();
      if (plantumlDiagrams > 0) {
        console.log(`✓ Found ${plantumlDiagrams} rendered PlantUML diagrams`);
        
        // Verify they're not showing as raw text
        const rawPlantUMLText = await page.locator('text=/```plantuml/').count();
        expect(rawPlantUMLText).toBe(0);
      }
      
      // Check that diagram placeholders are not visible
      const placeholders = await page.locator('text=/\\[MERMAID:.*:START\\]/').count();
      expect(placeholders).toBe(0);
    }
  });
});