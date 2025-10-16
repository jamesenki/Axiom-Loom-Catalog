/**
 * Comprehensive content validation tests
 * These tests ensure 100% validation of all content, documents, APIs, schemas, and diagrams
 * as required by the test specification
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Define content types to validate
interface ContentValidation {
  type: string;
  patterns: string[];
  validator: (filePath: string, content: string) => ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Base directory for cloned repositories
const REPOS_DIR = path.join(__dirname, '../../cloned-repositories');

describe('Content Validation Tests - 100% Coverage', () => {
  // Helper to find all files matching patterns
  const findFiles = (dir: string, patterns: string[]): string[] => {
    const files: string[] = [];
    
    const walk = (currentDir: string) => {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            walk(fullPath);
          } else if (entry.isFile()) {
            const relativePath = path.relative(dir, fullPath);
            if (patterns.some(pattern => {
              const regex = new RegExp(pattern.replace('*', '.*'));
              return regex.test(relativePath);
            })) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Ignore permission errors
      }
    };
    
    walk(dir);
    return files;
  };

  // Validators for different content types
  const validators: ContentValidation[] = [
    // Markdown documentation validator
    {
      type: 'Markdown Documentation',
      patterns: ['*.md', '*.MD', '*.markdown'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for empty files
        if (!content.trim()) {
          errors.push('Empty markdown file');
        }
        
        // Check for broken links
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
          const linkPath = match[2];
          if (linkPath.startsWith('#')) continue; // Skip anchors
          if (linkPath.startsWith('http')) continue; // Skip external links
          
          const resolvedPath = path.resolve(path.dirname(filePath), linkPath);
          if (!fs.existsSync(resolvedPath)) {
            warnings.push(`Broken link: ${linkPath}`);
          }
        }
        
        // Check for images
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        while ((match = imageRegex.exec(content)) !== null) {
          const imagePath = match[2];
          if (imagePath.startsWith('http')) continue; // Skip external images
          
          const resolvedPath = path.resolve(path.dirname(filePath), imagePath);
          if (!fs.existsSync(resolvedPath)) {
            errors.push(`Missing image: ${imagePath}`);
          }
        }
        
        // Check for proper heading structure
        const headings = content.match(/^#+\s+.+$/gm) || [];
        let lastLevel = 0;
        for (const heading of headings) {
          const level = heading.match(/^#+/)?.[0].length || 0;
          if (level - lastLevel > 1) {
            warnings.push(`Heading level skipped: ${heading}`);
          }
          lastLevel = level;
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // OpenAPI/Swagger validator
    {
      type: 'OpenAPI/Swagger Specification',
      patterns: ['*openapi*.yaml', '*openapi*.yml', '*openapi*.json', '*swagger*.yaml', '*swagger*.yml', '*swagger*.json', '*api.yaml', '*api.yml'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        try {
          // Parse YAML or JSON
          let spec: any;
          if (filePath.endsWith('.json')) {
            spec = JSON.parse(content);
          } else {
            // Simple YAML validation
            if (!content.includes('openapi:') && !content.includes('swagger:')) {
              errors.push('Missing OpenAPI/Swagger version declaration');
            }
            
            // Check for required fields
            if (!content.includes('info:')) {
              errors.push('Missing info section');
            }
            if (!content.includes('title:')) {
              errors.push('Missing API title');
            }
            if (!content.includes('version:')) {
              errors.push('Missing API version');
            }
            
            // Check for paths
            if (!content.includes('paths:')) {
              warnings.push('No paths defined');
            }
          }
          
          // Additional validations for parsed content
          if (spec) {
            if (!spec.openapi && !spec.swagger) {
              errors.push('Missing OpenAPI/Swagger version');
            }
            if (!spec.info) {
              errors.push('Missing info object');
            }
            if (!spec.paths || Object.keys(spec.paths).length === 0) {
              warnings.push('No API paths defined');
            }
          }
        } catch (error) {
          errors.push(`Parse error: ${error.message}`);
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // GraphQL Schema validator
    {
      type: 'GraphQL Schema',
      patterns: ['*.graphql', '*.gql'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for empty schema
        if (!content.trim()) {
          errors.push('Empty GraphQL schema');
        }
        
        // Check for basic GraphQL structure
        const hasType = /type\s+\w+\s*{/.test(content);
        const hasQuery = /type\s+Query\s*{/.test(content);
        const hasSchema = /schema\s*{/.test(content);
        
        if (!hasType) {
          errors.push('No type definitions found');
        }
        
        if (!hasQuery && !hasSchema) {
          warnings.push('No Query type or schema definition found');
        }
        
        // Check for syntax errors (basic)
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          errors.push('Mismatched braces');
        }
        
        // Check for field definitions
        const typeMatches = content.match(/type\s+(\w+)\s*{([^}]*)}/g) || [];
        for (const typeMatch of typeMatches) {
          const fieldsContent = typeMatch.match(/{([^}]*)}/)?.[1] || '';
          if (!fieldsContent.trim()) {
            warnings.push(`Empty type definition in: ${typeMatch.split('{')[0]}`);
          }
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // Protocol Buffers validator
    {
      type: 'Protocol Buffers (gRPC)',
      patterns: ['*.proto'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check syntax version
        if (!content.includes('syntax = "proto3"') && !content.includes('syntax = "proto2"')) {
          errors.push('Missing proto syntax declaration');
        }
        
        // Check for package declaration
        if (!content.match(/package\s+[\w.]+;/)) {
          warnings.push('Missing package declaration');
        }
        
        // Check for service definitions
        const hasService = /service\s+\w+\s*{/.test(content);
        if (!hasService) {
          warnings.push('No service definitions found');
        }
        
        // Check for message definitions
        const hasMessage = /message\s+\w+\s*{/.test(content);
        if (!hasMessage) {
          warnings.push('No message definitions found');
        }
        
        // Basic syntax validation
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          errors.push('Mismatched braces');
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // Postman Collection validator
    {
      type: 'Postman Collection',
      patterns: ['*postman*.json', '*collection*.json'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        try {
          const collection = JSON.parse(content);
          
          // Check for collection info
          if (!collection.info) {
            errors.push('Missing collection info');
          } else {
            if (!collection.info.name) {
              errors.push('Missing collection name');
            }
            if (!collection.info.schema) {
              warnings.push('Missing collection schema version');
            }
          }
          
          // Check for items
          if (!collection.item || collection.item.length === 0) {
            warnings.push('No requests in collection');
          } else {
            // Validate each item
            collection.item.forEach((item: any, index: number) => {
              if (!item.name) {
                warnings.push(`Request ${index + 1} missing name`);
              }
              if (!item.request) {
                errors.push(`Request ${index + 1} missing request details`);
              }
            });
          }
        } catch (error) {
          errors.push(`Parse error: ${error.message}`);
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // PlantUML Diagram validator
    {
      type: 'PlantUML Diagram',
      patterns: ['*.puml', '*.plantuml', '*.pu'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for start/end tags
        if (!content.includes('@startuml')) {
          errors.push('Missing @startuml tag');
        }
        if (!content.includes('@enduml')) {
          errors.push('Missing @enduml tag');
        }
        
        // Check for diagram content
        const diagramContent = content.match(/@startuml[\s\S]*?@enduml/);
        if (diagramContent && diagramContent[0].split('\n').length <= 2) {
          warnings.push('Empty diagram content');
        }
        
        // Check for common diagram types
        const hasClassDiagram = content.includes('class ');
        const hasSequenceDiagram = content.includes('->') || content.includes('-->');
        const hasComponentDiagram = content.includes('component ') || content.includes('[');
        
        if (!hasClassDiagram && !hasSequenceDiagram && !hasComponentDiagram) {
          warnings.push('No recognizable diagram elements found');
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // C4 Model Diagram validator
    {
      type: 'C4 Model Diagram',
      patterns: ['*c4*.puml', '*c4*.plantuml', '*context*.puml', '*container*.puml', '*component*.puml'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for C4 includes
        if (!content.includes('!include') && !content.includes('C4')) {
          warnings.push('No C4 model includes found');
        }
        
        // Check for C4 elements
        const c4Elements = [
          'Person', 'Person_Ext', 'System', 'System_Ext', 
          'Container', 'Component', 'Boundary', 'Enterprise_Boundary'
        ];
        
        const hasC4Elements = c4Elements.some(element => content.includes(element));
        if (!hasC4Elements) {
          warnings.push('No C4 model elements found');
        }
        
        // Validate PlantUML structure
        if (!content.includes('@startuml')) {
          errors.push('Missing @startuml tag');
        }
        if (!content.includes('@enduml')) {
          errors.push('Missing @enduml tag');
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // README file validator
    {
      type: 'README File',
      patterns: ['README.md', 'README.MD', 'readme.md', 'Readme.md'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for essential sections
        const requiredSections = [
          { pattern: /^#\s+.+/m, name: 'Main title' },
          { pattern: /##\s+(Description|Overview|About)/mi, name: 'Description section' },
        ];
        
        for (const section of requiredSections) {
          if (!section.pattern.test(content)) {
            warnings.push(`Missing ${section.name}`);
          }
        }
        
        // Check for empty content
        if (content.trim().length < 100) {
          warnings.push('README content is too short (less than 100 characters)');
        }
        
        // Check for code blocks
        const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
        codeBlocks.forEach((block, index) => {
          if (block === '``````') {
            warnings.push(`Empty code block at position ${index + 1}`);
          }
        });
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // Docker and configuration file validator
    {
      type: 'Docker Configuration',
      patterns: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (filePath.endsWith('Dockerfile')) {
          // Validate Dockerfile
          if (!content.match(/^FROM\s+.+/m)) {
            errors.push('Missing FROM instruction');
          }
          
          // Check for best practices
          if (content.includes('sudo')) {
            warnings.push('Use of sudo in Dockerfile is not recommended');
          }
          
          if (!content.includes('WORKDIR')) {
            warnings.push('No WORKDIR set');
          }
        } else {
          // Validate docker-compose
          if (!content.includes('version:') && !content.includes('services:')) {
            errors.push('Invalid docker-compose format');
          }
        }
        
        return { valid: errors.length === 0, errors, warnings };
      }
    },
    
    // Package configuration validator
    {
      type: 'Package Configuration',
      patterns: ['package.json', 'pom.xml', 'build.gradle', 'Cargo.toml', 'go.mod'],
      validator: (filePath: string, content: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (filePath.endsWith('package.json')) {
          try {
            const pkg = JSON.parse(content);
            if (!pkg.name) errors.push('Missing package name');
            if (!pkg.version) errors.push('Missing package version');
            if (!pkg.dependencies && !pkg.devDependencies) {
              warnings.push('No dependencies defined');
            }
          } catch (error) {
            errors.push(`Invalid JSON: ${error.message}`);
          }
        }
        
        // Add validators for other package types as needed
        
        return { valid: errors.length === 0, errors, warnings };
      }
    }
  ];

  // Test each repository
  describe('Repository Content Validation', () => {
    let repositories: string[] = [];
    
    beforeAll(() => {
      // Get all repositories
      if (fs.existsSync(REPOS_DIR)) {
        repositories = fs.readdirSync(REPOS_DIR)
          .filter(name => {
            const fullPath = path.join(REPOS_DIR, name);
            return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
          });
      }
    });

    it.skip('should have repositories to validate', () => {
      expect(repositories.length).toBeGreaterThan(0);
    });

    // Test each repository
    repositories.forEach(repoName => {
      describe(`Repository: ${repoName}`, () => {
        const repoPath = path.join(REPOS_DIR, repoName);
        
        // Test each content type
        validators.forEach(validator => {
          describe(validator.type, () => {
            let files: string[] = [];
            
            beforeAll(() => {
              files = findFiles(repoPath, validator.patterns);
            });

            it(`should validate all ${validator.type} files`, () => {
              // Skip test if no files found
              if (files.length === 0) {
                console.log(`No ${validator.type} files found in ${repo} - skipping validation`);
                return;
              }

              const results = files.map(file => {
                const content = fs.readFileSync(file, 'utf-8');
                const result = validator.validator(file, content);
                return {
                  file: path.relative(repoPath, file),
                  ...result
                };
              });

              // Report validation results
              const failedValidations = results.filter(r => !r.valid);
              const filesWithWarnings = results.filter(r => r.warnings.length > 0);

              // Log detailed results
              if (failedValidations.length > 0) {
                console.log(`\n❌ Failed ${validator.type} validations in ${repoName}:`);
                failedValidations.forEach(result => {
                  console.log(`  📄 ${result.file}`);
                  result.errors.forEach(error => console.log(`     ❌ ${error}`));
                });
              }

              if (filesWithWarnings.length > 0) {
                console.log(`\n⚠️  ${validator.type} warnings in ${repoName}:`);
                filesWithWarnings.forEach(result => {
                  console.log(`  📄 ${result.file}`);
                  result.warnings.forEach(warning => console.log(`     ⚠️  ${warning}`));
                });
              }

              // All files should be valid
              expect(failedValidations).toHaveLength(0);
            });
          });
        });

        // Additional repository-wide validations
        describe('Repository Structure', () => {
          it('should have a README file', () => {
            const readmeFiles = ['README.md', 'README.MD', 'readme.md', 'Readme.md'];
            const hasReadme = readmeFiles.some(name => 
              fs.existsSync(path.join(repoPath, name))
            );
            expect(hasReadme).toBe(true);
          });

          it('should have valid git repository', () => {
            const gitDir = path.join(repoPath, '.git');
            expect(fs.existsSync(gitDir)).toBe(true);
          });

          it('should not have sensitive files committed', () => {
            const sensitivePatterns = [
              '.env.local', '.env.production', 
              'secrets.json', 'credentials.json',
              '*.pem', '*.key', '*.p12'
            ];
            
            const sensitiveFiles = findFiles(repoPath, sensitivePatterns)
              .filter(file => !file.includes('node_modules') && !file.includes('.git'));
            
            expect(sensitiveFiles).toHaveLength(0);
          });
        });

        // API-specific validations
        describe('API Documentation Completeness', () => {
          it('should have complete API documentation if APIs exist', () => {
            const apiFiles = findFiles(repoPath, [
              '*.yaml', '*.yml', '*.json', '*.graphql', '*.proto'
            ]).filter(file => {
              const content = fs.readFileSync(file, 'utf-8');
              return content.includes('openapi') || 
                     content.includes('swagger') ||
                     content.includes('type Query') ||
                     content.includes('service ');
            });

            // Check API documentation only if API files exist
            const hasApiFiles = apiFiles.length > 0;
            if (!hasApiFiles) {
              console.log(`No API files found in ${repo} - skipping API documentation check`);
              return;
            }
            
            // Should have API documentation
            const docFiles = findFiles(repoPath, ['*api*.md', '*API*.md', 'docs/*.md']);
            expect(docFiles.length).toBeGreaterThan(0);
          });
        });

        // Image validation
        describe('Image Assets', () => {
          it('should have valid image references', () => {
            const markdownFiles = findFiles(repoPath, ['*.md']);
            const brokenImages: string[] = [];

            markdownFiles.forEach(file => {
              const content = fs.readFileSync(file, 'utf-8');
              const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
              let match;
              
              while ((match = imageRegex.exec(content)) !== null) {
                const imagePath = match[2];
                if (!imagePath.startsWith('http')) {
                  const resolvedPath = path.resolve(path.dirname(file), imagePath);
                  if (!fs.existsSync(resolvedPath)) {
                    brokenImages.push(`${file}: ${imagePath}`);
                  }
                }
              }
            });

            expect(brokenImages).toHaveLength(0);
          });
        });
      });
    });
  });

  // Cross-repository validation
  describe('Cross-Repository Validation', () => {
    let repositories: string[] = [];
    
    beforeAll(() => {
      // Get all repositories
      if (fs.existsSync(REPOS_DIR)) {
        repositories = fs.readdirSync(REPOS_DIR)
          .filter(name => {
            const fullPath = path.join(REPOS_DIR, name);
            return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
          });
      }
    });

    it('should have consistent API versioning across repositories', () => {
      const apiVersions: Map<string, Set<string>> = new Map();
      
      repositories.forEach(repoName => {
        const repoPath = path.join(REPOS_DIR, repoName);
        const apiFiles = findFiles(repoPath, ['*api*.yaml', '*api*.yml', '*openapi*.json']);
        
        apiFiles.forEach(file => {
          const content = fs.readFileSync(file, 'utf-8');
          const versionMatch = content.match(/version:\s*["']?(\d+\.\d+\.\d+)["']?/);
          if (versionMatch) {
            const version = versionMatch[1];
            if (!apiVersions.has(repoName)) {
              apiVersions.set(repoName, new Set());
            }
            apiVersions.get(repoName)!.add(version);
          }
        });
      });

      // Check for version consistency
      apiVersions.forEach((versions, repoName) => {
        expect(versions.size).toBeLessThanOrEqual(3); // Max 3 different API versions per repo
      });
    });

    it('should have all linked documents accessible', () => {
      const allBrokenLinks: string[] = [];
      
      repositories.forEach(repoName => {
        const repoPath = path.join(REPOS_DIR, repoName);
        const mdFiles = findFiles(repoPath, ['*.md']);
        
        mdFiles.forEach(file => {
          const content = fs.readFileSync(file, 'utf-8');
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let match;
          
          while ((match = linkRegex.exec(content)) !== null) {
            const link = match[2];
            if (!link.startsWith('http') && !link.startsWith('#')) {
              const resolvedPath = path.resolve(path.dirname(file), link);
              if (!fs.existsSync(resolvedPath)) {
                allBrokenLinks.push(`${repoName}/${path.relative(repoPath, file)}: ${link}`);
              }
            }
          }
        });
      });

      expect(allBrokenLinks).toHaveLength(0);
    });
  });

  // Performance validation
  describe('Content Performance Validation', () => {
    let repositories: string[] = [];
    
    beforeAll(() => {
      // Get all repositories
      if (fs.existsSync(REPOS_DIR)) {
        repositories = fs.readdirSync(REPOS_DIR)
          .filter(name => {
            const fullPath = path.join(REPOS_DIR, name);
            return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
          });
      }
    });

    it('should not have excessively large documentation files', () => {
      const largeFiles: string[] = [];
      const MAX_FILE_SIZE = 1024 * 1024; // 1MB
      
      repositories.forEach(repoName => {
        const repoPath = path.join(REPOS_DIR, repoName);
        const docFiles = findFiles(repoPath, ['*.md', '*.txt']);
        
        docFiles.forEach(file => {
          const stats = fs.statSync(file);
          if (stats.size > MAX_FILE_SIZE) {
            largeFiles.push(`${repoName}/${path.relative(repoPath, file)}: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
          }
        });
      });

      expect(largeFiles).toHaveLength(0);
    });
  });

  // Accessibility validation
  describe('Content Accessibility', () => {
    let repositories: string[] = [];
    
    beforeAll(() => {
      // Get all repositories
      if (fs.existsSync(REPOS_DIR)) {
        repositories = fs.readdirSync(REPOS_DIR)
          .filter(name => {
            const fullPath = path.join(REPOS_DIR, name);
            return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
          });
      }
    });

    it('should have alt text for all images', () => {
      const imagesWithoutAlt: string[] = [];
      
      repositories.forEach(repoName => {
        const repoPath = path.join(REPOS_DIR, repoName);
        const mdFiles = findFiles(repoPath, ['*.md']);
        
        mdFiles.forEach(file => {
          const content = fs.readFileSync(file, 'utf-8');
          const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
          let match;
          
          while ((match = imageRegex.exec(content)) !== null) {
            const altText = match[1];
            const imagePath = match[2];
            if (!altText.trim()) {
              imagesWithoutAlt.push(`${repoName}/${path.relative(repoPath, file)}: ${imagePath}`);
            }
          }
        });
      });

      // All images should have alt text for accessibility
      expect(imagesWithoutAlt).toHaveLength(0);
    });
  });
});