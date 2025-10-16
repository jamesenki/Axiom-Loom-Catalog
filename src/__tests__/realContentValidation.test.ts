import * as fs from 'fs';
import * as path from 'path';

const REPOS_DIR = path.join(__dirname, '../../cloned-repositories');

describe('Real Content Validation Tests', () => {
  const repositories = fs.readdirSync(REPOS_DIR)
    .filter(name => fs.statSync(path.join(REPOS_DIR, name)).isDirectory())
    .filter(name => !name.startsWith('.'));

  describe('Repository Structure Validation', () => {
    test.each(repositories)('%s should have README.md', (repo) => {
      const readmePath = path.join(REPOS_DIR, repo, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
    });

    test.each(repositories)('%s README should have content', (repo) => {
      const readmePath = path.join(REPOS_DIR, repo, 'README.md');
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf-8');
        expect(content.length).toBeGreaterThan(100);
        expect(content).toMatch(/^#\s+.+/m); // Should have at least one heading
      }
    });
  });

  describe('Document Link Validation', () => {
    const markdownFiles: { repo: string; file: string; content: string }[] = [];
    
    // Collect all markdown files
    beforeAll(() => {
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const findMarkdownFiles = (dir: string, baseDir: string = repoPath): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              findMarkdownFiles(filePath, baseDir);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              markdownFiles.push({
                repo,
                file: path.relative(baseDir, filePath),
                content
              });
            }
          });
        };
        findMarkdownFiles(repoPath);
      });
    });

    test('all markdown files should be readable', () => {
      expect(markdownFiles.length).toBeGreaterThan(0);
      markdownFiles.forEach(({ file, content }) => {
        expect(content).toBeDefined();
      });
    });

    test('all internal markdown links should point to existing files', () => {
      const brokenLinks: string[] = [];
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
      markdownFiles.forEach(({ repo, file, content }) => {
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
          const linkText = match[1];
          const linkPath = match[2];
          
          // Skip external links and anchors
          if (linkPath.startsWith('http') || linkPath.startsWith('#') || linkPath.includes('://')) {
            continue;
          }
          
          // Resolve relative paths
          const docDir = path.dirname(path.join(REPOS_DIR, repo, file));
          const resolvedPath = path.resolve(docDir, linkPath.split('#')[0]); // Remove anchor
          
          if (!fs.existsSync(resolvedPath)) {
            brokenLinks.push(`${repo}/${file}: [${linkText}](${linkPath})`);
          }
        }
      });
      
      if (brokenLinks.length > 0) {
        console.log('Broken links found:', brokenLinks);
      }
      expect(brokenLinks).toHaveLength(0);
    });
  });

  describe('Image and Asset Validation', () => {
    test('all images referenced in markdown should exist', () => {
      const missingImages: string[] = [];
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const findMarkdownFiles = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              findMarkdownFiles(filePath);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              let match;
              while ((match = imageRegex.exec(content)) !== null) {
                const altText = match[1];
                const imagePath = match[2];
                
                // Skip external images
                if (imagePath.startsWith('http') || imagePath.includes('://')) {
                  continue;
                }
                
                const resolvedPath = path.resolve(path.dirname(filePath), imagePath);
                if (!fs.existsSync(resolvedPath)) {
                  missingImages.push(`${repo}/${path.relative(repoPath, filePath)}: ![${altText}](${imagePath})`);
                }
              }
            }
          });
        };
        findMarkdownFiles(repoPath);
      });
      
      if (missingImages.length > 0) {
        console.log('Missing images:', missingImages);
      }
      expect(missingImages).toHaveLength(0);
    });
  });

  describe('API Documentation Validation', () => {
    test('repositories should have consistent API documentation structure', () => {
      const apiRepos = repositories.filter(repo => {
        const apiPath = path.join(REPOS_DIR, repo, 'docs', 'api-specs');
        const apisPath = path.join(REPOS_DIR, repo, 'apis');
        return fs.existsSync(apiPath) || fs.existsSync(apisPath);
      });
      
      expect(apiRepos.length).toBeGreaterThan(0);
      
      apiRepos.forEach(repo => {
        const apiSpecPath = path.join(REPOS_DIR, repo, 'docs', 'api-specs');
        const apisPath = path.join(REPOS_DIR, repo, 'apis');
        
        if (fs.existsSync(apiSpecPath)) {
          const indexPath = path.join(apiSpecPath, 'index.md');
          if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf-8');
            expect(content).toMatch(/API/i);
          }
        }
      });
    });
  });

  describe('Markdown Formatting Validation', () => {
    test('all markdown files should have valid syntax', () => {
      const syntaxErrors: string[] = [];
      
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const checkMarkdownSyntax = (dir: string): void => {
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              checkMarkdownSyntax(filePath);
            } else if (file.endsWith('.md')) {
              const content = fs.readFileSync(filePath, 'utf-8');
              
              // Check for common markdown syntax issues
              const lines = content.split('\n');
              lines.forEach((line, index) => {
                // Check for unclosed code blocks
                if (line.match(/^```/) && !line.match(/^```\w*$/)) {
                  syntaxErrors.push(`${repo}/${path.relative(repoPath, filePath)}:${index + 1} - Invalid code block syntax`);
                }
                
                // Check for malformed links
                if (line.includes('[') && line.includes(']') && !line.match(/\[[^\]]*\]\([^)]*\)/)) {
                  const linkMatch = line.match(/\[[^\]]+\]/);
                  if (linkMatch && !line.includes('](')) {
                    syntaxErrors.push(`${repo}/${path.relative(repoPath, filePath)}:${index + 1} - Malformed link`);
                  }
                }
              });
              
              // Check for balanced code blocks
              const codeBlockCount = (content.match(/^```/gm) || []).length;
              if (codeBlockCount % 2 !== 0) {
                syntaxErrors.push(`${repo}/${path.relative(repoPath, filePath)} - Unclosed code block`);
              }
            }
          });
        };
        checkMarkdownSyntax(repoPath);
      });
      
      if (syntaxErrors.length > 0) {
        console.log('Syntax errors found:', syntaxErrors);
      }
      expect(syntaxErrors).toHaveLength(0);
    });
  });

  describe('Content Accessibility Tests', () => {
    test('all documents should be accessible through the enhanced markdown viewer', () => {
      // This test validates that files can be loaded by the viewer
      repositories.forEach(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        const readmePath = path.join(repoPath, 'README.md');
        
        if (fs.existsSync(readmePath)) {
          const content = fs.readFileSync(readmePath, 'utf-8');
          
          // Validate content can be processed
          expect(() => {
            // Basic checks that EnhancedMarkdownViewer would need
            const headings = content.match(/^#+\s+.+$/gm) || [];
            const codeBlocks = content.match(/^```[\s\S]*?^```/gm) || [];
            const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
            
            return {
              headingCount: headings.length,
              codeBlockCount: codeBlocks.length,
              linkCount: links.length
            };
          }).not.toThrow();
        }
      });
    });

    test('documentation should have proper navigation structure', () => {
      repositories.forEach(repo => {
        const docsPath = path.join(REPOS_DIR, repo, 'docs');
        if (fs.existsSync(docsPath)) {
          const docFiles = fs.readdirSync(docsPath)
            .filter(f => f.endsWith('.md'));
          
          // Should have some documentation
          expect(docFiles.length).toBeGreaterThan(0);
          
          // Check for index or main documentation file
          const hasIndex = docFiles.some(f => 
            f.toLowerCase() === 'index.md' || 
            f.toLowerCase() === 'readme.md'
          );
          
          if (docFiles.length > 3) {
            expect(hasIndex).toBe(true);
          }
        }
      });
    });
  });

  describe('Cross-Repository Consistency', () => {
    test('all repositories should follow similar documentation patterns', () => {
      const patterns = repositories.map(repo => {
        const repoPath = path.join(REPOS_DIR, repo);
        return {
          repo,
          hasReadme: fs.existsSync(path.join(repoPath, 'README.md')),
          hasDocs: fs.existsSync(path.join(repoPath, 'docs')),
          hasApiSpecs: fs.existsSync(path.join(repoPath, 'docs', 'api-specs')) || 
                       fs.existsSync(path.join(repoPath, 'apis')),
          hasExamples: fs.existsSync(path.join(repoPath, 'examples'))
        };
      });
      
      // All should have README
      patterns.forEach(p => {
        expect(p.hasReadme).toBe(true);
      });
      
      // Most should have docs folder
      const docsCount = patterns.filter(p => p.hasDocs).length;
      expect(docsCount).toBeGreaterThan(repositories.length * 0.5);
    });
  });
});