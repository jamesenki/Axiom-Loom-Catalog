/**
 * Comprehensive Markdown Link Validation Test
 *
 * This test validates ALL links in ALL markdown files for the
 * vehicle-to-cloud-communications-architecture repository.
 *
 * Test Coverage:
 * 1. Finds all .md files in the repository
 * 2. Extracts all markdown links from each file
 * 3. Categorizes links (internal, external, images, anchors)
 * 4. Tests each internal markdown link for proper loading
 * 5. Verifies image links exist in public/repo-images
 * 6. Generates comprehensive test report
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
const REPO_NAME = 'vehicle-to-cloud-communications-architecture';
const REPO_PATH = path.join(
  '/Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center',
  'cloned-repositories',
  REPO_NAME
);
const BASE_URL = 'http://localhost:3000';
const IMAGE_PATH = path.join(
  '/Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center',
  'public',
  'repo-images',
  REPO_NAME
);

// Link categorization
interface Link {
  text: string;
  url: string;
  title?: string;
  sourceFile: string;
  lineNumber: number;
  type: 'internal' | 'external' | 'image' | 'anchor' | 'relative-anchor';
}

interface TestReport {
  totalFiles: number;
  totalLinks: number;
  linksByType: {
    internal: number;
    external: number;
    image: number;
    anchor: number;
    relativeAnchor: number;
  };
  brokenLinks: Array<{
    link: Link;
    error: string;
  }>;
  workingLinks: number;
  duration: number;
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip common directories that don't contain documentation
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        findMarkdownFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract all links from markdown content
 * Supports: [text](url), [text](url "title"), ![alt](image.png)
 */
function extractLinks(content: string, sourceFile: string): Link[] {
  const links: Link[] = [];
  const lines = content.split('\n');

  // Regex patterns for different link types
  // Pattern 1: Standard links [text](url) or [text](url "title")
  const standardLinkRegex = /\[([^\]]+)\]\(([^)]+?)(?:\s+"([^"]+)")?\)/g;
  // Pattern 2: Image links ![alt](image.png)
  const imageLinkRegex = /!\[([^\]]*)\]\(([^)]+?)\)/g;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Extract standard links
    let match;
    while ((match = standardLinkRegex.exec(line)) !== null) {
      const [, text, url, title] = match;
      links.push({
        text: text.trim(),
        url: url.trim(),
        title: title?.trim(),
        sourceFile,
        lineNumber,
        type: categorizeLink(url.trim())
      });
    }

    // Extract image links
    while ((match = imageLinkRegex.exec(line)) !== null) {
      const [, alt, url] = match;
      links.push({
        text: alt.trim(),
        url: url.trim(),
        sourceFile,
        lineNumber,
        type: 'image'
      });
    }
  });

  return links;
}

/**
 * Categorize link type
 */
function categorizeLink(url: string): Link['type'] {
  // External links
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'external';
  }

  // Anchor links
  if (url.startsWith('#')) {
    return 'anchor';
  }

  // Relative anchor links (file.md#section)
  if (url.includes('#')) {
    return 'relative-anchor';
  }

  // Image files
  if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(url)) {
    return 'image';
  }

  // Internal markdown links
  if (url.endsWith('.md')) {
    return 'internal';
  }

  // Default to internal for relative paths
  return 'internal';
}

/**
 * Convert file path to app URL
 * Example: docs/API_REFERENCE.md -> /docs/vehicle-to-cloud-communications-architecture/API_REFERENCE.md
 */
function convertToAppUrl(linkUrl: string, sourceFile: string): string {
  // Remove anchor if present
  const [filePath, anchor] = linkUrl.split('#');

  // Resolve relative path from source file
  const sourceDir = path.dirname(sourceFile);
  const absolutePath = path.resolve(sourceDir, filePath);

  // Get path relative to repository root
  const relativePath = path.relative(REPO_PATH, absolutePath);

  // Build app URL
  const appPath = `/docs/${REPO_NAME}/${relativePath}`;

  // Add anchor back if present
  return anchor ? `${appPath}#${anchor}` : appPath;
}

/**
 * Test if an internal markdown link works
 */
async function testInternalLink(page: Page, link: Link): Promise<{ success: boolean; error?: string }> {
  try {
    const appUrl = convertToAppUrl(link.url, link.sourceFile);
    const fullUrl = `${BASE_URL}${appUrl}`;

    // Navigate to the URL with increased timeout
    const response = await page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Check for 404 or error responses
    if (!response || response.status() >= 400) {
      return {
        success: false,
        error: `HTTP ${response?.status() || 'unknown'} error`
      };
    }

    // Wait for content to be present
    try {
      await page.waitForSelector('.markdown-content, .documentation-content, article, main', {
        timeout: 5000
      });
    } catch (e) {
      return {
        success: false,
        error: 'Content area did not load within 5 seconds'
      };
    }

    // Check for error messages
    const errorMessage = page.locator('text=/Error Loading Documentation|404|Not Found/i').first();
    const hasError = await errorMessage.count() > 0;

    if (hasError) {
      const errorText = await errorMessage.textContent();
      return {
        success: false,
        error: `Error message displayed: ${errorText}`
      };
    }

    // Verify content actually loaded (check for markdown content)
    const contentArea = page.locator('.markdown-content, .documentation-content, article, main');
    const hasContent = await contentArea.count() > 0;

    if (!hasContent) {
      return {
        success: false,
        error: 'No content area found'
      };
    }

    // Check if content has text (not empty)
    const contentText = await contentArea.first().textContent();
    if (!contentText || contentText.trim().length < 10) {
      return {
        success: false,
        error: 'Content area is empty or too short'
      };
    }

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Test if an image file exists
 */
function testImageLink(link: Link): { success: boolean; error?: string } {
  try {
    // Get the relative path from source file
    const sourceDir = path.dirname(link.sourceFile);
    const absoluteImagePath = path.resolve(sourceDir, link.url);

    // Check if file exists in original repo
    if (fs.existsSync(absoluteImagePath)) {
      return { success: true };
    }

    // Also check in public/repo-images
    const imageRelativePath = path.relative(REPO_PATH, absoluteImagePath);
    const publicImagePath = path.join(IMAGE_PATH, imageRelativePath);

    if (fs.existsSync(publicImagePath)) {
      return { success: true };
    }

    return {
      success: false,
      error: `Image not found at ${absoluteImagePath} or ${publicImagePath}`
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Main test suite
 */
test.describe('Vehicle-to-Cloud Communications Architecture - Complete Link Validation', () => {
  // Increase timeout for comprehensive testing
  test.setTimeout(600000); // 10 minutes

  test('should validate ALL links in ALL markdown files', async ({ page }) => {
    const startTime = Date.now();
    const report: TestReport = {
      totalFiles: 0,
      totalLinks: 0,
      linksByType: {
        internal: 0,
        external: 0,
        image: 0,
        anchor: 0,
        relativeAnchor: 0
      },
      brokenLinks: [],
      workingLinks: 0,
      duration: 0
    };

    console.log('\n='.repeat(80));
    console.log('COMPREHENSIVE MARKDOWN LINK VALIDATION TEST');
    console.log('='.repeat(80));
    console.log(`Repository: ${REPO_NAME}`);
    console.log(`Repository Path: ${REPO_PATH}`);
    console.log(`Base URL: ${BASE_URL}`);
    console.log('='.repeat(80));

    // Step 1: Find all markdown files
    console.log('\nStep 1: Finding all markdown files...');
    const markdownFiles = findMarkdownFiles(REPO_PATH);
    report.totalFiles = markdownFiles.length;

    console.log(`Found ${markdownFiles.length} markdown files:`);
    markdownFiles.forEach(file => {
      const relativePath = path.relative(REPO_PATH, file);
      console.log(`  - ${relativePath}`);
    });

    // Step 2: Extract all links from all files
    console.log('\nStep 2: Extracting links from all markdown files...');
    const allLinks: Link[] = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractLinks(content, file);
      allLinks.push(...links);

      const relativePath = path.relative(REPO_PATH, file);
      if (links.length > 0) {
        console.log(`  ${relativePath}: ${links.length} links`);
      }
    }

    report.totalLinks = allLinks.length;
    console.log(`\nTotal links found: ${allLinks.length}`);

    // Step 3: Categorize links
    console.log('\nStep 3: Categorizing links...');
    allLinks.forEach(link => {
      if (link.type === 'internal') {
        report.linksByType.internal++;
      } else if (link.type === 'external') {
        report.linksByType.external++;
      } else if (link.type === 'image') {
        report.linksByType.image++;
      } else if (link.type === 'anchor') {
        report.linksByType.anchor++;
      } else if (link.type === 'relative-anchor') {
        report.linksByType.relativeAnchor++;
      }
    });

    console.log('Link Distribution:');
    console.log(`  Internal Markdown Links: ${report.linksByType.internal}`);
    console.log(`  External Links: ${report.linksByType.external}`);
    console.log(`  Image Links: ${report.linksByType.image}`);
    console.log(`  Anchor Links: ${report.linksByType.anchor}`);
    console.log(`  Relative Anchor Links: ${report.linksByType.relativeAnchor}`);

    // Step 4: Test internal markdown links
    console.log('\nStep 4: Testing internal markdown links...');
    const internalLinks = allLinks.filter(l => l.type === 'internal' || l.type === 'relative-anchor');

    for (let i = 0; i < internalLinks.length; i++) {
      const link = internalLinks[i];
      const relativePath = path.relative(REPO_PATH, link.sourceFile);

      console.log(`\n[${i + 1}/${internalLinks.length}] Testing: ${link.url}`);
      console.log(`  Source: ${relativePath}:${link.lineNumber}`);
      console.log(`  Text: "${link.text}"`);

      const result = await testInternalLink(page, link);

      if (result.success) {
        console.log('  ✓ PASS - Link works correctly');
        report.workingLinks++;
      } else {
        console.log(`  ✗ FAIL - ${result.error}`);
        report.brokenLinks.push({
          link,
          error: result.error || 'Unknown error'
        });
      }

      // Small delay between tests to avoid overwhelming the server
      await page.waitForTimeout(100);
    }

    // Step 5: Test image links
    console.log('\nStep 5: Testing image links...');
    const imageLinks = allLinks.filter(l => l.type === 'image');

    for (let i = 0; i < imageLinks.length; i++) {
      const link = imageLinks[i];
      const relativePath = path.relative(REPO_PATH, link.sourceFile);

      console.log(`\n[${i + 1}/${imageLinks.length}] Testing image: ${link.url}`);
      console.log(`  Source: ${relativePath}:${link.lineNumber}`);

      const result = testImageLink(link);

      if (result.success) {
        console.log('  ✓ PASS - Image file exists');
        report.workingLinks++;
      } else {
        console.log(`  ✗ FAIL - ${result.error}`);
        report.brokenLinks.push({
          link,
          error: result.error || 'Unknown error'
        });
      }
    }

    // Step 6: Note external links (don't test to avoid rate limiting)
    console.log('\nStep 6: External links (noted but not tested to avoid rate limiting)...');
    const externalLinks = allLinks.filter(l => l.type === 'external');
    if (externalLinks.length > 0) {
      console.log(`Found ${externalLinks.length} external links:`);
      externalLinks.slice(0, 10).forEach(link => {
        const relativePath = path.relative(REPO_PATH, link.sourceFile);
        console.log(`  - ${link.url} (${relativePath}:${link.lineNumber})`);
      });
      if (externalLinks.length > 10) {
        console.log(`  ... and ${externalLinks.length - 10} more`);
      }
    }

    // Calculate duration
    report.duration = Date.now() - startTime;

    // Generate final report
    console.log('\n' + '='.repeat(80));
    console.log('TEST REPORT');
    console.log('='.repeat(80));
    console.log(`Total Markdown Files: ${report.totalFiles}`);
    console.log(`Total Links Found: ${report.totalLinks}`);
    console.log('\nLinks by Type:');
    console.log(`  Internal Markdown Links: ${report.linksByType.internal}`);
    console.log(`  External Links: ${report.linksByType.external} (not tested)`);
    console.log(`  Image Links: ${report.linksByType.image}`);
    console.log(`  Anchor Links: ${report.linksByType.anchor} (not tested)`);
    console.log(`  Relative Anchor Links: ${report.linksByType.relativeAnchor}`);
    console.log('\nTest Results:');
    console.log(`  Working Links: ${report.workingLinks}`);
    console.log(`  Broken Links: ${report.brokenLinks.length}`);
    console.log(`  Test Duration: ${(report.duration / 1000).toFixed(2)}s`);

    if (report.brokenLinks.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('BROKEN LINKS DETAILS');
      console.log('='.repeat(80));

      report.brokenLinks.forEach((broken, index) => {
        const relativePath = path.relative(REPO_PATH, broken.link.sourceFile);
        console.log(`\n${index + 1}. ${broken.link.url}`);
        console.log(`   Type: ${broken.link.type}`);
        console.log(`   Source: ${relativePath}:${broken.link.lineNumber}`);
        console.log(`   Link Text: "${broken.link.text}"`);
        console.log(`   Error: ${broken.error}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('TEST COMPLETE');
    console.log('='.repeat(80) + '\n');

    // Save report to file
    const reportPath = path.join(
      '/Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center',
      'test-results',
      'markdown-link-validation-report.json'
    );

    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Detailed report saved to: ${reportPath}`);

    // Assert that there are no broken links
    expect(report.brokenLinks.length).toBe(0);
  });
});
