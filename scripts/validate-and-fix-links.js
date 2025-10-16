#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const REPOS_DIR = path.join(__dirname, '..', 'cloned-repositories');
const LINK_PATTERNS = {
  markdown: /\[([^\]]+)\]\(([^)]+)\)/g,
  reference: /\[([^\]]+)\]:\s*(.+)/g
};

// Known correct mappings for common links
const LINK_MAPPINGS = {
  // Architecture diagrams should point to actual diagram files
  'Architecture Diagrams': 'architecture/',
  'API Specifications': 'docs/api-specs.md',
  'Implementation Guides': 'docs/implementation/',
  'Testing Resources': 'tests/',
  'Developer Guide': 'docs/DEVELOPER_GUIDE.md',
  'Contributing': 'CONTRIBUTING.md'
};

class LinkValidator {
  constructor() {
    this.results = {
      total: 0,
      broken: [],
      fixed: [],
      needsManualReview: []
    };
  }

  // Check if a file exists relative to the README location
  fileExists(baseDir, linkPath) {
    // Handle different link formats
    if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
      return { exists: true, type: 'external' };
    }

    if (linkPath.startsWith('#')) {
      return { exists: true, type: 'anchor' };
    }

    // Clean the link path
    let cleanPath = linkPath;
    if (linkPath.includes('#')) {
      cleanPath = linkPath.split('#')[0];
    }

    // Try different variations
    const variations = [
      cleanPath,
      cleanPath + '.md',
      cleanPath.replace(/\.md$/, ''),
      path.join('docs', cleanPath),
      path.join('docs', cleanPath + '.md')
    ];

    for (const variant of variations) {
      const fullPath = path.join(baseDir, variant);
      if (fs.existsSync(fullPath)) {
        return { exists: true, type: 'file', resolvedPath: variant };
      }
    }

    return { exists: false, type: 'file' };
  }

  // Find the best match for a broken link
  findBestMatch(baseDir, linkText, linkPath) {
    // Check if we have a known mapping
    for (const [text, correctPath] of Object.entries(LINK_MAPPINGS)) {
      if (linkText.includes(text)) {
        return correctPath;
      }
    }

    // Try to find files with similar names
    const linkName = path.basename(linkPath).toLowerCase();
    const candidates = [];

    const searchDir = (dir, prefix = '') => {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            searchDir(filePath, path.join(prefix, file));
          } else if (stat.isFile() && file.toLowerCase().includes(linkName.replace(/\.md$/, ''))) {
            candidates.push(path.join(prefix, file));
          }
        }
      } catch (err) {
        // Ignore errors
      }
    };

    searchDir(baseDir);

    // Return the best candidate based on similarity
    if (candidates.length > 0) {
      // Prefer exact matches
      const exactMatch = candidates.find(c => path.basename(c).toLowerCase() === linkName);
      if (exactMatch) return exactMatch;

      // Prefer files in docs directory
      const docsMatch = candidates.find(c => c.includes('docs/'));
      if (docsMatch) return docsMatch;

      return candidates[0];
    }

    return null;
  }

  // Process a single markdown file
  processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const baseDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    
    console.log(`\n📄 Processing: ${filePath}`);
    
    let newContent = content;
    const fileResults = {
      file: filePath,
      broken: [],
      fixed: []
    };

    // Process markdown links
    const links = [...content.matchAll(LINK_PATTERNS.markdown)];
    
    for (const match of links) {
      const [fullMatch, linkText, linkPath] = match;
      this.results.total++;

      const validation = this.fileExists(baseDir, linkPath);
      
      if (!validation.exists && validation.type === 'file') {
        console.log(`  ❌ Broken link: [${linkText}](${linkPath})`);
        
        // Try to find a fix
        const bestMatch = this.findBestMatch(baseDir, linkText, linkPath);
        
        if (bestMatch) {
          const newLink = `[${linkText}](${bestMatch})`;
          newContent = newContent.replace(fullMatch, newLink);
          
          console.log(`  ✅ Fixed: ${fullMatch} → ${newLink}`);
          fileResults.fixed.push({
            original: fullMatch,
            fixed: newLink,
            linkText,
            oldPath: linkPath,
            newPath: bestMatch
          });
        } else {
          fileResults.broken.push({
            linkText,
            linkPath,
            fullMatch
          });
          this.results.needsManualReview.push({
            file: filePath,
            link: fullMatch,
            suggestion: this.suggestFix(linkText, linkPath)
          });
        }
      }
    }

    // Save the file if we made changes
    if (fileResults.fixed.length > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`  💾 Saved ${fileResults.fixed.length} fixes to ${fileName}`);
    }

    if (fileResults.broken.length > 0) {
      this.results.broken.push(fileResults);
    }
    if (fileResults.fixed.length > 0) {
      this.results.fixed.push(fileResults);
    }
  }

  // Suggest fixes for broken links based on context
  suggestFix(linkText, linkPath) {
    const suggestions = [];

    // API-related links
    if (linkText.toLowerCase().includes('api') || linkPath.includes('api')) {
      suggestions.push('docs/api-specs.md', 'architecture/api-*.md');
    }

    // Architecture/diagram links
    if (linkText.toLowerCase().includes('architecture') || linkText.toLowerCase().includes('diagram')) {
      suggestions.push('architecture/', 'docs/architecture/', 'diagrams/');
    }

    // Guide/documentation links
    if (linkText.toLowerCase().includes('guide') || linkText.toLowerCase().includes('documentation')) {
      suggestions.push('docs/', 'guides/', 'README.md');
    }

    // Test-related links
    if (linkText.toLowerCase().includes('test') || linkPath.includes('test')) {
      suggestions.push('tests/', 'test/', '__tests__/');
    }

    return suggestions.length > 0 ? suggestions : ['Check docs/ or create the missing file'];
  }

  // Find all README files in repositories
  findReadmeFiles() {
    const readmeFiles = [];

    const searchRepos = (dir) => {
      try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            // Check if this is a repository directory
            const readmePath = path.join(filePath, 'README.md');
            if (fs.existsSync(readmePath)) {
              readmeFiles.push(readmePath);
            }
            
            // Also search subdirectories for other markdown files
            searchRepos(filePath);
          } else if (stat.isFile() && file.endsWith('.md')) {
            readmeFiles.push(filePath);
          }
        }
      } catch (err) {
        console.error(`Error searching ${dir}:`, err.message);
      }
    };

    searchRepos(REPOS_DIR);
    return readmeFiles;
  }

  // Generate a report of all findings
  generateReport() {
    const reportPath = path.join(__dirname, '..', 'LINK_VALIDATION_REPORT.md');
    
    let report = `# Link Validation Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total links checked: ${this.results.total}\n`;
    report += `- Files with broken links: ${this.results.broken.length}\n`;
    report += `- Files with fixed links: ${this.results.fixed.length}\n`;
    report += `- Links needing manual review: ${this.results.needsManualReview.length}\n\n`;

    if (this.results.fixed.length > 0) {
      report += `## Fixed Links\n\n`;
      for (const fileResult of this.results.fixed) {
        report += `### ${fileResult.file}\n\n`;
        for (const fix of fileResult.fixed) {
          report += `- ✅ \`${fix.original}\` → \`${fix.fixed}\`\n`;
        }
        report += `\n`;
      }
    }

    if (this.results.needsManualReview.length > 0) {
      report += `## Needs Manual Review\n\n`;
      for (const item of this.results.needsManualReview) {
        report += `### ${item.file}\n\n`;
        report += `- Link: \`${item.link}\`\n`;
        report += `- Suggestions: ${item.suggestion.join(', ')}\n\n`;
      }
    }

    fs.writeFileSync(reportPath, report);
    console.log(`\n📊 Report saved to: ${reportPath}`);
  }

  // Main execution
  run() {
    console.log('🔍 Starting link validation and fixing...\n');
    
    const readmeFiles = this.findReadmeFiles();
    console.log(`Found ${readmeFiles.length} markdown files to process\n`);

    for (const file of readmeFiles) {
      this.processFile(file);
    }

    this.generateReport();
    
    console.log('\n✨ Link validation complete!');
    console.log(`Fixed ${this.results.fixed.length} files automatically`);
    console.log(`${this.results.needsManualReview.length} links need manual review`);
  }
}

// Run the validator
const validator = new LinkValidator();
validator.run();