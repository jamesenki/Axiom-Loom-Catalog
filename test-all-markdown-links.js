/**
 * Comprehensive Markdown Link Validation Test (JavaScript version)
 *
 * This is a JavaScript wrapper that runs the TypeScript Playwright test.
 *
 * For the full TypeScript test, see: e2e/test-all-markdown-links.spec.ts
 *
 * Usage:
 *   node test-all-markdown-links.js
 *
 * This will execute the comprehensive link validation test and display results.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log('RUNNING COMPREHENSIVE MARKDOWN LINK VALIDATION TEST');
console.log('='.repeat(80));
console.log('\nRepository: vehicle-to-cloud-communications-architecture');
console.log('Test Type: Full link validation (internal links, images, external links)');
console.log('Expected Duration: ~15-30 seconds');
console.log('\n' + '='.repeat(80) + '\n');

try {
  // Run the Playwright test
  const result = execSync(
    'npx playwright test e2e/test-all-markdown-links.spec.ts --project=chromium --reporter=list',
    {
      cwd: __dirname,
      stdio: 'inherit',
      encoding: 'utf-8'
    }
  );

  console.log('\n' + '='.repeat(80));
  console.log('TEST COMPLETED SUCCESSFULLY');
  console.log('='.repeat(80));
  console.log('\nCheck the detailed report at:');
  console.log('test-results/markdown-link-validation-report.json');
  console.log('\nFor the full markdown report, see:');
  console.log('MARKDOWN_LINK_VALIDATION_REPORT.md');
  console.log('\n');

  process.exit(0);

} catch (error) {
  console.error('\n' + '='.repeat(80));
  console.error('TEST FAILED - BROKEN LINKS DETECTED');
  console.error('='.repeat(80));
  console.error('\nThe test found broken links in the documentation.');
  console.error('See the output above for details.');
  console.error('\nDetailed reports:');
  console.error('  - JSON: test-results/markdown-link-validation-report.json');
  console.error('  - Markdown: MARKDOWN_LINK_VALIDATION_REPORT.md');
  console.error('  - HTML: npx playwright show-report');
  console.error('\n');

  process.exit(1);
}
