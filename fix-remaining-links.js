#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the content validation report
const report = JSON.parse(fs.readFileSync('content-validation-report.json', 'utf-8'));

// Patterns for fixing common link issues
const linkFixes = {
  // GitHub relative links
  '../../issues': 'https://github.com/20230011612_EYGS/{{REPO}}/issues',
  '../../discussions': 'https://github.com/20230011612_EYGS/{{REPO}}/discussions',
  
  // API spec links that include repository path
  '/docs/future-mobility-consumer-platform/docs/api-specs/': './docs/api-specs/',
  '/docs/future-mobility-fleet-platform/docs/api-specs/': './docs/api-specs/',
  '/docs/future-mobility-oems-platform/docs/api-specs/': './docs/api-specs/',
  '/docs/future-mobility-regulatory-platform/docs/api-specs/': './docs/api-specs/',
  '/docs/future-mobility-tech-platform/docs/api-specs/': './docs/api-specs/',
  '/docs/future-mobility-utilities-platform/docs/api-specs/': './docs/api-specs/',
  
  // Fix GITHUB_SETUP_GUIDE references
  'GITHUB_SETUP_GUIDE.md': './GITHUB_SETUP.md',
  
  // Fix example paths
  './docs/examples/ECOMMERCE_EXAMPLE.md': './docs/examples/ecommerce-example.md',
  './docs/examples/HEALTHCARE_EXAMPLE.md': './docs/examples/healthcare-example.md',
  './docs/examples/FINTECH_EXAMPLE.md': './docs/examples/fintech-example.md',
};

// Files that should be created as placeholders
const placeholderFiles = {
  'DEVELOPER_USAGE_GUIDE.md': `# Developer Usage Guide

This guide provides instructions for developers using this architecture template.

## Quick Start

1. Clone the repository
2. Review the component documentation
3. Follow the implementation patterns

## Key Concepts

- Architecture patterns
- API design principles
- Integration guidelines

## Next Steps

See the [Developer Guide](./docs/DEVELOPER_GUIDE.md) for detailed information.
`,
  'BEST_PRACTICES.md': `# Best Practices

This document outlines best practices for using this architecture template.

## Development Best Practices

1. Follow the established patterns
2. Maintain consistent coding standards
3. Document your changes
4. Test thoroughly

## Architecture Best Practices

1. Keep components loosely coupled
2. Design for scalability
3. Implement proper error handling
4. Follow security guidelines

## See Also

- [Architecture Guide](./docs/ARCHITECT_GUIDE.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)
`,
  'MODE_SYSTEM_GUIDE.md': `# Mode System Guide

This guide explains the different modes available in the architecture system.

## Available Modes

1. **Development Mode** - For local development
2. **Testing Mode** - For running tests
3. **Production Mode** - For production deployment

## Configuration

Each mode can be configured through environment variables and configuration files.

## See Also

- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
`,
  'INTEGRATION_GUIDE.md': `# Integration Guide

This guide covers integration patterns and best practices.

## Integration Patterns

1. API Integration
2. Event-driven Integration
3. Database Integration
4. Third-party Service Integration

## Implementation

Follow the patterns outlined in the component documentation.

## See Also

- [API Design Guide](./docs/API_DESIGN_GUIDE.md)
- [Architecture Guide](./docs/ARCHITECT_GUIDE.md)
`
};

// Process broken links
const processedRepos = new Set();
let totalFixed = 0;
let filesCreated = 0;

report.issues.forEach(issue => {
  if (issue.type === 'broken-link') {
    const repoPath = path.join('cloned-repositories', issue.repository);
    const filePath = path.join(repoPath, issue.file);
    
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    // Extract link info
    const match = issue.description.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) return;
    
    const [fullMatch, linkText, linkPath] = match;
    let newPath = linkPath;
    let fixed = false;
    
    // Apply pattern-based fixes
    for (const [pattern, replacement] of Object.entries(linkFixes)) {
      if (linkPath.includes(pattern)) {
        newPath = replacement.replace('{{REPO}}', issue.repository);
        fixed = true;
        break;
      }
    }
    
    // Try to fix API spec paths
    if (!fixed && linkPath.includes('/api-')) {
      // Remove repository-specific path prefix
      newPath = linkPath.replace(/.*\/docs\/api-specs\//, './docs/api-specs/');
      fixed = true;
    }
    
    // If we have a fix, apply it
    if (fixed && newPath !== linkPath) {
      let content = fs.readFileSync(filePath, 'utf-8');
      const newLink = `[${linkText}](${newPath})`;
      content = content.replace(fullMatch, newLink);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed in ${issue.repository}/${issue.file}: ${linkPath} -> ${newPath}`);
      totalFixed++;
    }
    
    // Mark repo for placeholder file creation
    if (!fixed) {
      processedRepos.add(issue.repository);
    }
  }
});

// Create placeholder files for commonly missing documents
processedRepos.forEach(repo => {
  const repoPath = path.join('cloned-repositories', repo);
  
  Object.entries(placeholderFiles).forEach(([filename, content]) => {
    const filePath = path.join(repoPath, filename);
    const docsPath = path.join(repoPath, 'docs', filename);
    
    // Check if file is missing
    if (!fs.existsSync(filePath) && !fs.existsSync(docsPath)) {
      // Decide where to create it
      const targetPath = filename.includes('GUIDE') ? docsPath : filePath;
      const targetDir = path.dirname(targetPath);
      
      // Ensure directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Create the file
      fs.writeFileSync(targetPath, content);
      console.log(`📄 Created placeholder: ${repo}/${path.relative(repoPath, targetPath)}`);
      filesCreated++;
    }
  });
});

console.log(`\n=== Summary ===`);
console.log(`Total links fixed: ${totalFixed}`);
console.log(`Placeholder files created: ${filesCreated}`);
console.log(`\nRemaining broken links will need manual review.`);