import * as fs from 'fs';
import * as path from 'path';

const REPOS_DIR = path.join(__dirname, '../../cloned-repositories');

describe('Document API Integration Tests', () => {
  const repositories = fs.readdirSync(REPOS_DIR)
    .filter(name => fs.statSync(path.join(REPOS_DIR, name)).isDirectory())
    .filter(name => !name.startsWith('.'));

  describe('Repository File Access', () => {
    test('all repositories have accessible documentation', () => {
      const accessResults = repositories.map(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const readmePath = path.join(repoPath, 'README.md');
        const docsPath = path.join(repoPath, 'docs');
        
        return {
          repository: repo,
          hasReadme: fs.existsSync(readmePath),
          readmeSize: fs.existsSync(readmePath) ? fs.statSync(readmePath).size : 0,
          hasDocs: fs.existsSync(docsPath),
          docCount: fs.existsSync(docsPath) ? 
            fs.readdirSync(docsPath).filter(f => f.endsWith('.md')).length : 0
        };
      });

      // All repos should have documentation
      accessResults.forEach(result => {
        expect(result.hasReadme || result.hasDocs).toBe(true);
        if (result.hasReadme) {
          expect(result.readmeSize).toBeGreaterThan(100);
        }
      });

      console.log('\nRepository Documentation Summary:');
      accessResults.forEach(r => {
        console.log(`  ${r.repository}: README=${r.hasReadme} (${r.readmeSize} bytes), Docs=${r.docCount}`);
      });
    });
  });

  describe('Markdown Content Quality', () => {
    test('documents have proper structure for rendering', () => {
      let totalDocs = 0;
      let wellStructuredDocs = 0;
      const issues: string[] = [];

      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        
        const checkMarkdownQuality = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              checkMarkdownQuality(filePath);
            } else if (file.endsWith('.md')) {
              totalDocs++;
              const content = fs.readFileSync(filePath, 'utf-8');
              const relativePath = path.relative(REPOS_DIR, filePath);
              
              // Quality checks
              const hasTitle = /^#\s+.+/m.test(content);
              const hasContent = content.trim().length > 200;
              const hasStructure = /^#{2,}\s+.+/m.test(content); // Has subsections
              const isReadable = !content.includes('\x00'); // No null bytes
              
              if (hasTitle && hasContent && isReadable) {
                wellStructuredDocs++;
              } else {
                if (!hasTitle) issues.push(`${relativePath}: Missing title`);
                if (!hasContent) issues.push(`${relativePath}: Too short (${content.length} chars)`);
                if (!isReadable) issues.push(`${relativePath}: Contains unreadable characters`);
              }
            }
          });
        };
        
        checkMarkdownQuality(repoPath);
      });

      const qualityPercentage = (wellStructuredDocs / totalDocs) * 100;
      console.log(`\nDocument Quality: ${wellStructuredDocs}/${totalDocs} (${qualityPercentage.toFixed(1)}%) well-structured`);
      
      if (issues.length > 0) {
        console.log('\nQuality Issues (first 10):');
        issues.slice(0, 10).forEach(issue => console.log(`  ${issue}`));
      }

      expect(qualityPercentage).toBeGreaterThan(90);
    });
  });

  describe('Link Resolution', () => {
    test('documents have resolvable internal links', () => {
      const linkStats = {
        total: 0,
        internal: 0,
        external: 0,
        broken: 0,
        resolvable: 0
      };

      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        
        const checkLinks = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              checkLinks(filePath);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
              
              let match;
              while ((match = linkRegex.exec(content)) !== null) {
                linkStats.total++;
                const linkPath = match[2];
                
                if (linkPath.startsWith('http') || linkPath.includes('://')) {
                  linkStats.external++;
                } else if (!linkPath.startsWith('#')) {
                  linkStats.internal++;
                  
                  const docDir = path.dirname(filePath);
                  const resolvedPath = path.resolve(docDir, linkPath.split('#')[0]);
                  
                  if (fs.existsSync(resolvedPath)) {
                    linkStats.resolvable++;
                  } else {
                    linkStats.broken++;
                  }
                }
              }
            }
          });
        };
        
        checkLinks(repoPath);
      });

      const resolutionRate = linkStats.internal > 0 ? 
        (linkStats.resolvable / linkStats.internal) * 100 : 100;

      console.log('\nLink Statistics:');
      console.log(`  Total Links: ${linkStats.total}`);
      console.log(`  Internal: ${linkStats.internal}`);
      console.log(`  External: ${linkStats.external}`);
      console.log(`  Resolvable: ${linkStats.resolvable}`);
      console.log(`  Broken: ${linkStats.broken}`);
      console.log(`  Resolution Rate: ${resolutionRate.toFixed(1)}%`);

      expect(resolutionRate).toBeGreaterThan(50); // Allow some broken links
    });
  });

  describe('API Documentation Coverage', () => {
    test('API repositories have proper documentation', () => {
      const apiRepos = repositories.filter(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        return fs.existsSync(path.join(repoPath, 'docs', 'api-specs')) ||
               fs.existsSync(path.join(repoPath, 'apis')) ||
               fs.existsSync(path.join(repoPath, 'api'));
      });

      console.log(`\nAPI Repositories Found: ${apiRepos.length}/${repositories.length}`);

      apiRepos.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const apiDocs = [];

        // Check various API doc locations
        const apiPaths = [
          path.join(repoPath, 'docs', 'api-specs'),
          path.join(repoPath, 'apis'),
          path.join(repoPath, 'api'),
          path.join(repoPath, 'docs', 'api')
        ];

        apiPaths.forEach(apiPath => {
          if (fs.existsSync(apiPath)) {
            const files = fs.readdirSync(apiPath);
            const apiFiles = files.filter(f => 
              f.endsWith('.yaml') || 
              f.endsWith('.yml') || 
              f.endsWith('.json') ||
              f.endsWith('.md')
            );
            apiDocs.push(...apiFiles);
          }
        });

        console.log(`  ${repo}: ${apiDocs.length} API doc files`);
        expect(apiDocs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Formatting', () => {
    test('documents use consistent markdown formatting', () => {
      const formattingStats = {
        totalFiles: 0,
        consistentHeadings: 0,
        properCodeBlocks: 0,
        validTables: 0,
        cleanFormatting: 0
      };

      repositories.slice(0, 5).forEach(repo => { // Check first 5 repos
        const repoPath = path.join(REPOS_DIR, repo);
        const readmePath = path.join(repoPath, 'README.md');
        
        if (fs.existsSync(readmePath)) {
          formattingStats.totalFiles++;
          const content = fs.readFileSync(readmePath, 'utf-8');
          
          // Check heading consistency (ATX style)
          const hasConsistentHeadings = !/^#{7,}/m.test(content); // No more than 6 levels
          if (hasConsistentHeadings) formattingStats.consistentHeadings++;
          
          // Check code blocks are properly closed
          const codeBlocks = content.match(/```/g) || [];
          if (codeBlocks.length % 2 === 0) formattingStats.properCodeBlocks++;
          
          // Check tables are valid (if any)
          const tableLines = content.split('\n').filter(line => line.includes('|'));
          const hasValidTables = tableLines.length === 0 || 
            tableLines.some(line => line.match(/\|.*\|.*\|/));
          if (hasValidTables) formattingStats.validTables++;
          
          // Overall clean formatting
          const hasCleanFormatting = hasConsistentHeadings && 
            (codeBlocks.length % 2 === 0) && hasValidTables;
          if (hasCleanFormatting) formattingStats.cleanFormatting++;
        }
      });

      const cleanPercentage = formattingStats.totalFiles > 0 ?
        (formattingStats.cleanFormatting / formattingStats.totalFiles) * 100 : 0;

      console.log('\nFormatting Statistics:');
      console.log(`  Files Checked: ${formattingStats.totalFiles}`);
      console.log(`  Consistent Headings: ${formattingStats.consistentHeadings}`);
      console.log(`  Proper Code Blocks: ${formattingStats.properCodeBlocks}`);
      console.log(`  Valid Tables: ${formattingStats.validTables}`);
      console.log(`  Clean Formatting: ${formattingStats.cleanFormatting} (${cleanPercentage.toFixed(1)}%)`);

      expect(cleanPercentage).toBeGreaterThan(80);
    });
  });
});