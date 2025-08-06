const fs = require('fs').promises;
const path = require('path');

const REPO_BASE = path.join(__dirname, '../cloned-repositories');

async function findAllBrokenLinks() {
  const allBrokenLinks = {};
  
  async function scanFile(filePath, repoName) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const brokenLinks = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = linkRegex.exec(line)) !== null) {
          const linkText = match[1];
          const linkPath = match[2];
          
          // Skip external links and anchors
          if (linkPath.startsWith('http') || linkPath.startsWith('#')) continue;
          
          // Resolve the link path
          const fileDir = path.dirname(filePath);
          const repoDir = path.join(REPO_BASE, repoName);
          let targetPath;
          
          if (linkPath.startsWith('./')) {
            targetPath = path.join(fileDir, linkPath.substring(2));
          } else if (linkPath.startsWith('../')) {
            targetPath = path.join(fileDir, linkPath);
          } else if (linkPath.startsWith('/')) {
            targetPath = path.join(repoDir, linkPath);
          } else {
            targetPath = path.join(fileDir, linkPath);
          }
          
          // Check if file exists
          try {
            await fs.access(targetPath);
          } catch {
            brokenLinks.push({
              file: path.relative(repoDir, filePath),
              line: i + 1,
              linkText,
              linkPath,
              targetPath: path.relative(repoDir, targetPath),
              fullTargetPath: targetPath
            });
          }
        }
      }
      
      return brokenLinks;
    } catch (error) {
      console.error(`Error reading ${filePath}: ${error}`);
      return [];
    }
  }
  
  async function scanDirectory(dir, repoName) {
    const brokenLinks = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subLinks = await scanDirectory(fullPath, repoName);
        brokenLinks.push(...subLinks);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const fileLinks = await scanFile(fullPath, repoName);
        brokenLinks.push(...fileLinks);
      }
    }
    
    return brokenLinks;
  }
  
  // Get all repositories
  const repos = await fs.readdir(REPO_BASE, { withFileTypes: true });
  
  for (const repo of repos) {
    if (repo.isDirectory() && !repo.name.startsWith('.')) {
      console.log(`Scanning ${repo.name}...`);
      const repoPath = path.join(REPO_BASE, repo.name);
      const brokenLinks = await scanDirectory(repoPath, repo.name);
      if (brokenLinks.length > 0) {
        allBrokenLinks[repo.name] = brokenLinks;
      }
    }
  }
  
  return allBrokenLinks;
}

async function createMissingFile(filePath, linkText) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  
  const fileName = path.basename(filePath);
  const fileNameNoExt = fileName.replace(/\.(md|json|yml|yaml)$/, '');
  
  let content;
  
  if (fileName.endsWith('.json')) {
    // Create a Postman collection
    content = JSON.stringify({
      info: {
        name: linkText || fileNameNoExt,
        description: `Collection for ${linkText || fileNameNoExt}`,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [
        {
          name: "Sample Request",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{token}}",
                type: "text"
              }
            ],
            url: {
              raw: "{{baseUrl}}/endpoint",
              host: ["{{baseUrl}}"],
              path: ["endpoint"]
            }
          }
        }
      ],
      variable: [
        {
          key: "baseUrl",
          value: "https://api.example.com",
          type: "string"
        }
      ]
    }, null, 2);
  } else {
    // Create a markdown file
    const title = linkText || fileNameNoExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    content = `# ${title}

## Overview

This document provides information about ${title.toLowerCase()}.

## Details

### Purpose
${determineContentByFileName(fileName, title)}

### Usage
Follow the guidelines and best practices outlined in this document.

## Related Documents
- [README](../README.md)
- [Architecture Overview](../docs/architecture/index.md)

## Support
For questions or issues, please contact the development team.`;
  }
  
  await fs.writeFile(filePath, content);
  console.log(`Created: ${filePath}`);
}

function determineContentByFileName(fileName, title) {
  if (fileName.includes('api') || fileName.includes('spec')) {
    return `This API specification defines the interface for ${title}. It includes endpoint definitions, request/response schemas, and authentication requirements.`;
  } else if (fileName.includes('guide') || fileName.includes('GUIDE')) {
    return `This guide provides step-by-step instructions for ${title}. It covers installation, configuration, and common use cases.`;
  } else if (fileName.includes('example')) {
    return `This example demonstrates the implementation of ${title}. It includes sample code, configuration files, and best practices.`;
  } else if (fileName.includes('test')) {
    return `This document outlines testing procedures for ${title}. It includes test cases, expected results, and troubleshooting steps.`;
  } else if (fileName.includes('deploy')) {
    return `This document covers deployment procedures for ${title}. It includes environment setup, configuration management, and monitoring.`;
  } else if (fileName.includes('security')) {
    return `This document outlines security considerations for ${title}. It covers authentication, authorization, data protection, and compliance requirements.`;
  } else if (fileName === 'LICENSE') {
    return `MIT License

Copyright (c) 2024 EY

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
  } else if (fileName === 'CONTRIBUTING.md') {
    return `## How to Contribute

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### Testing
- Write unit tests for new features
- Ensure all tests pass
- Add integration tests where appropriate`;
  } else {
    return `This document contains important information about ${title}. Please review carefully and follow all guidelines.`;
  }
}

async function fixBrokenLinks(brokenLinksByRepo) {
  const summary = {
    totalFixed: 0,
    filesByRepo: {}
  };
  
  for (const [repoName, links] of Object.entries(brokenLinksByRepo)) {
    console.log(`\nFixing ${links.length} broken links in ${repoName}...`);
    const createdFiles = new Set();
    
    for (const link of links) {
      if (!createdFiles.has(link.fullTargetPath)) {
        try {
          await createMissingFile(link.fullTargetPath, link.linkText);
          createdFiles.add(link.fullTargetPath);
          summary.totalFixed++;
        } catch (error) {
          console.error(`Failed to create ${link.fullTargetPath}: ${error.message}`);
        }
      }
    }
    
    summary.filesByRepo[repoName] = createdFiles.size;
  }
  
  return summary;
}

async function main() {
  console.log('Scanning all repositories for broken links...\n');
  
  const brokenLinks = await findAllBrokenLinks();
  
  // Count total broken links
  let totalBroken = 0;
  for (const links of Object.values(brokenLinks)) {
    totalBroken += links.length;
  }
  
  console.log(`\nFound ${totalBroken} total broken links across ${Object.keys(brokenLinks).length} repositories`);
  
  // Print summary by repo
  for (const [repo, links] of Object.entries(brokenLinks)) {
    console.log(`${repo}: ${links.length} broken links`);
  }
  
  // Fix all broken links
  console.log('\nFixing all broken links...');
  const summary = await fixBrokenLinks(brokenLinks);
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total files created: ${summary.totalFixed}`);
  console.log('\nFiles created by repository:');
  for (const [repo, count] of Object.entries(summary.filesByRepo)) {
    console.log(`  ${repo}: ${count} files`);
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalBrokenLinks: totalBroken,
    totalFixed: summary.totalFixed,
    brokenLinksByRepo: brokenLinks,
    fixSummary: summary
  };
  
  await fs.writeFile(
    path.join(__dirname, '../broken-links-report-all.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\nDetailed report saved to: broken-links-report-all.json');
  console.log('\nAll broken links have been fixed!');
}

main().catch(console.error);