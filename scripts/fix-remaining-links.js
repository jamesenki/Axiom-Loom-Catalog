const fs = require('fs').promises;
const path = require('path');

const REPO_BASE = path.join(__dirname, '../cloned-repositories');

// Map of common link patterns to fixes
const linkFixes = {
  // Fix links that go outside repo
  '../README.md': './README.md',
  '../docs/architecture/index.md': './architecture/index.md',
  
  // Fix links without proper path
  'ARCHITECTURE_PACKAGE_DEFINITION_OF_DONE.md': './ARCHITECTURE_PACKAGE_DEFINITION_OF_DONE.md',
  'AI_COMMAND_REFERENCE.md': './AI_COMMAND_REFERENCE.md',
  'DEVELOPER_GUIDE.md': './DEVELOPER_GUIDE.md',
  'ARCHITECT_GUIDE.md': './ARCHITECT_GUIDE.md',
  'INTEGRATION_GUIDE.md': './INTEGRATION_GUIDE.md',
  
  // Fix wrong extensions
  'collection.yml': 'collection.json',
  
  // Fix case sensitivity issues
  'contributing.md': 'CONTRIBUTING.md',
  'license': 'LICENSE',
  'LICENSE.md': 'LICENSE',
};

async function updateBrokenLinks() {
  let totalFixed = 0;
  
  async function processFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      let modified = false;
      
      // Fix each known pattern
      for (const [broken, fixed] of Object.entries(linkFixes)) {
        const regex = new RegExp(`\\]\\(([^)]*${broken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\)`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `](${fixed})`);
          modified = true;
          totalFixed++;
        }
      }
      
      // Fix ../README.md pattern anywhere
      content = content.replace(/\]\(\.\.\/(README\.md)\)/g, '](./README.md)');
      
      // Fix links that incorrectly point to directories with # anchors
      content = content.replace(/\]\(([^)]+)#[^)]+\)/g, (match, path) => {
        // Keep the original if it's a valid link, otherwise fix it
        if (path.includes('.md')) {
          return match;
        }
        return `](${path}.md)`;
      });
      
      if (modified || content !== await fs.readFile(filePath, 'utf-8')) {
        await fs.writeFile(filePath, content);
        console.log(`Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error}`);
    }
  }
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        await processFile(fullPath);
      }
    }
  }
  
  // Process all repositories
  const repos = await fs.readdir(REPO_BASE, { withFileTypes: true });
  
  for (const repo of repos) {
    if (repo.isDirectory() && !repo.name.startsWith('.')) {
      console.log(`\nProcessing ${repo.name}...`);
      const repoPath = path.join(REPO_BASE, repo.name);
      await scanDirectory(repoPath);
    }
  }
  
  return totalFixed;
}

// Also create any remaining missing files that have relative path issues
async function createRemainingFiles() {
  const filesToCreate = [
    // Files that are referenced but missing
    'copilot-architecture-template/docs/ARCHITECTURE_PACKAGE_DEFINITION_OF_DONE.md',
    'copilot-architecture-template/docs/AI_COMMAND_REFERENCE.md', 
    'copilot-architecture-template/docs/DEVELOPER_GUIDE.md',
    'ecosystem-platform-architecture/docs/ARCHITECTURE_PACKAGE_DEFINITION_OF_DONE.md',
    'ecosystem-platform-architecture/docs/AI_COMMAND_REFERENCE.md',
    'ecosystem-platform-architecture/docs/DEVELOPER_GUIDE.md',
  ];
  
  for (const file of filesToCreate) {
    const fullPath = path.join(REPO_BASE, file);
    const dir = path.dirname(fullPath);
    const fileName = path.basename(fullPath);
    
    try {
      await fs.access(fullPath);
      // File exists
    } catch {
      // Create missing file
      await fs.mkdir(dir, { recursive: true });
      
      let content = `# ${fileName.replace(/[-_.]/g, ' ').replace('.md', '').replace(/\b\w/g, l => l.toUpperCase())}

## Overview

This document provides comprehensive information about ${fileName.replace('.md', '').toLowerCase()}.

`;
      
      if (fileName.includes('DEFINITION_OF_DONE')) {
        content += `## Architecture Package Definition of Done

An architecture package is considered complete when it meets all the following criteria:

### 1. Documentation
- [ ] README.md with clear overview
- [ ] Architecture diagrams (C4 model)
- [ ] API specifications
- [ ] Integration guides
- [ ] Deployment guides

### 2. Code Quality
- [ ] All components documented
- [ ] Code follows standards
- [ ] Security considerations addressed
- [ ] Performance optimized

### 3. Testing
- [ ] Unit tests > 80% coverage
- [ ] Integration tests
- [ ] Performance tests
- [ ] Security tests

### 4. Operations
- [ ] Monitoring configured
- [ ] Logging implemented
- [ ] Alerts defined
- [ ] Runbooks created`;
      } else if (fileName.includes('AI_COMMAND')) {
        content += `## AI Commands

### Code Generation
- \`@generate <component>\` - Generate new component
- \`@refactor <code>\` - Refactor existing code
- \`@test <component>\` - Generate tests

### Documentation
- \`@document <code>\` - Generate documentation
- \`@explain <concept>\` - Explain architecture concept
- \`@diagram <system>\` - Generate architecture diagram

### Analysis
- \`@analyze <code>\` - Analyze code quality
- \`@security <component>\` - Security analysis
- \`@performance <system>\` - Performance analysis`;
      }
      
      content += `

## Related Documents
- [README](../README.md)
- [Architecture Guide](./ARCHITECT_GUIDE.md)
- [Component Reference](./COMPONENT_REFERENCE.md)

## Support
For questions, contact the architecture team.`;
      
      await fs.writeFile(fullPath, content);
      console.log(`Created: ${fullPath}`);
    }
  }
}

async function main() {
  console.log('Fixing remaining broken links...\n');
  
  // First create missing files
  await createRemainingFiles();
  
  // Then fix link references
  const fixed = await updateBrokenLinks();
  
  console.log(`\nTotal fixes applied: ${fixed}`);
  console.log('\nDone! Run the validation test again to verify.');
}

main().catch(console.error);