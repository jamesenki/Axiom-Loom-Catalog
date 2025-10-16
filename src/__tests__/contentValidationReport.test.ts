import * as fs from 'fs';
import * as path from 'path';

const REPOS_DIR = path.join(__dirname, '../../cloned-repositories');

interface ValidationIssue {
  type: 'missing-file' | 'broken-link' | 'missing-image' | 'syntax-error';
  repository: string;
  file: string;
  line?: number;
  description: string;
}

describe('Content Validation Report', () => {
  const repositories = fs.readdirSync(REPOS_DIR)
    .filter(name => fs.statSync(path.join(REPOS_DIR, name)).isDirectory())
    .filter(name => !name.startsWith('.'));

  const issues: ValidationIssue[] = [];

  beforeAll(() => {
    console.log('\n=== CONTENT VALIDATION REPORT ===\n');
    console.log(`Validating ${repositories.length} repositories...\n`);
  });

  afterAll(() => {
    // Generate summary report
    const summary = {
      totalIssues: issues.length,
      byType: {
        'missing-file': issues.filter(i => i.type === 'missing-file').length,
        'broken-link': issues.filter(i => i.type === 'broken-link').length,
        'missing-image': issues.filter(i => i.type === 'missing-image').length,
        'syntax-error': issues.filter(i => i.type === 'syntax-error').length,
      },
      byRepository: {} as Record<string, number>
    };

    repositories.forEach(repo => {
      const repoIssues = issues.filter(i => i.repository === repo).length;
      if (repoIssues > 0) {
        summary.byRepository[repo] = repoIssues;
      }
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total Issues Found: ${summary.totalIssues}`);
    console.log('\nBy Type:');
    Object.entries(summary.byType).forEach(([type, count]) => {
      if (count > 0) console.log(`  ${type}: ${count}`);
    });
    console.log('\nBy Repository:');
    Object.entries(summary.byRepository)
      .sort((a, b) => b[1] - a[1])
      .forEach(([repo, count]) => {
        console.log(`  ${repo}: ${count} issues`);
      });

    // Save detailed report
    const reportPath = path.join(__dirname, '../../content-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary,
      issues: issues.slice(0, 100) // First 100 issues for review
    }, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);
  });

  describe('Critical Files', () => {
    test('all repositories should have README', () => {
      const missingReadmes: string[] = [];
      
      repositories.forEach(repo => {
        const readmePath = path.join(REPOS_DIR, repo, 'README.md');
        if (!fs.existsSync(readmePath)) {
          missingReadmes.push(repo);
          issues.push({
            type: 'missing-file',
            repository: repo,
            file: 'README.md',
            description: 'Missing README.md file'
          });
        }
      });

      console.log(`\nMissing READMEs: ${missingReadmes.length}`);
      if (missingReadmes.length > 0) {
        console.log('  Repositories:', missingReadmes.join(', '));
      }
      
      expect(missingReadmes.length).toBeLessThan(5); // Allow some missing
    });
  });

  describe('Link Validation', () => {
    test('count broken internal links', () => {
      let totalBrokenLinks = 0;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
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
              const relativeFile = path.relative(repoPath, filePath);
              
              let match;
              while ((match = linkRegex.exec(content)) !== null) {
                const linkPath = match[2];
                
                // Skip external links and anchors
                if (linkPath.startsWith('http') || linkPath.startsWith('#') || linkPath.includes('://')) {
                  continue;
                }
                
                const docDir = path.dirname(filePath);
                const resolvedPath = path.resolve(docDir, linkPath.split('#')[0]);
                
                if (!fs.existsSync(resolvedPath)) {
                  totalBrokenLinks++;
                  if (issues.length < 1000) { // Limit issues stored
                    issues.push({
                      type: 'broken-link',
                      repository: repo,
                      file: relativeFile,
                      description: `Broken link: [${match[1]}](${linkPath})`
                    });
                  }
                }
              }
            }
          });
        };
        checkLinks(repoPath);
      });

      console.log(`\nTotal Broken Links: ${totalBrokenLinks}`);
      expect(totalBrokenLinks).toBeLessThan(1000); // Allow some broken links
    });
  });

  describe('Image Validation', () => {
    test('count missing images', () => {
      let totalMissingImages = 0;
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const checkImages = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              checkImages(filePath);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              const relativeFile = path.relative(repoPath, filePath);
              
              let match;
              while ((match = imageRegex.exec(content)) !== null) {
                const imagePath = match[2];
                
                if (imagePath.startsWith('http') || imagePath.includes('://')) {
                  continue;
                }
                
                const resolvedPath = path.resolve(path.dirname(filePath), imagePath);
                if (!fs.existsSync(resolvedPath)) {
                  totalMissingImages++;
                  if (issues.length < 1000) {
                    issues.push({
                      type: 'missing-image',
                      repository: repo,
                      file: relativeFile,
                      description: `Missing image: ![${match[1]}](${imagePath})`
                    });
                  }
                }
              }
            }
          });
        };
        checkImages(repoPath);
      });

      console.log(`\nTotal Missing Images: ${totalMissingImages}`);
      expect(totalMissingImages).toBeLessThan(100); // Allow some missing
    });
  });

  describe('Syntax Validation', () => {
    test('count syntax errors', () => {
      let totalSyntaxErrors = 0;
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const checkSyntax = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              checkSyntax(filePath);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              const relativeFile = path.relative(repoPath, filePath);
              
              // Check for unclosed code blocks
              const codeBlockCount = (content.match(/^```/gm) || []).length;
              if (codeBlockCount % 2 !== 0) {
                totalSyntaxErrors++;
                if (issues.length < 1000) {
                  issues.push({
                    type: 'syntax-error',
                    repository: repo,
                    file: relativeFile,
                    description: 'Unclosed code block'
                  });
                }
              }
              
              // Check for malformed links (simplified check)
              const lines = content.split('\n');
              lines.forEach((line, index) => {
                if (line.includes('[') && line.includes(']') && 
                    !line.match(/\[[^\]]*\]\([^)]*\)/) && 
                    !line.match(/\[[^\]]*\]\[[^\]]*\]/) &&
                    !line.match(/^\s*\[/)) { // Skip reference-style links
                  totalSyntaxErrors++;
                  if (issues.length < 1000) {
                    issues.push({
                      type: 'syntax-error',
                      repository: repo,
                      file: relativeFile,
                      line: index + 1,
                      description: 'Possible malformed link'
                    });
                  }
                }
              });
            }
          });
        };
        checkSyntax(repoPath);
      });

      console.log(`\nTotal Syntax Errors: ${totalSyntaxErrors}`);
      expect(totalSyntaxErrors).toBeLessThan(10000); // Allow many syntax variations
    });
  });

  describe('User Experience Validation', () => {
    test('validate document rendering requirements', () => {
      let renderableDocCount = 0;
      let totalDocCount = 0;
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const validateDocs = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              validateDocs(filePath);
            } else if (file.endsWith('.md')) {
              totalDocCount++;
              const content = fs.readFileSync(filePath, 'utf-8');
              
              // Check if document is renderable
              try {
                // Basic checks for EnhancedMarkdownViewer compatibility
                const hasHeadings = /^#+\s+.+$/m.test(content);
                const hasContent = content.trim().length > 50;
                const isValidUtf8 = !content.includes('\ufffd');
                
                if (hasContent && isValidUtf8) {
                  renderableDocCount++;
                }
              } catch (error) {
                // Document not renderable
              }
            }
          });
        };
        validateDocs(repoPath);
      });

      const renderablePercentage = (renderableDocCount / totalDocCount) * 100;
      console.log(`\nDocument Rendering Stats:`);
      console.log(`  Total Documents: ${totalDocCount}`);
      console.log(`  Renderable: ${renderableDocCount} (${renderablePercentage.toFixed(1)}%)`);
      
      expect(renderablePercentage).toBeGreaterThan(95);
    });
  });
});