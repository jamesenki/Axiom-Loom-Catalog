#!/usr/bin/env ts-node

/**
 * Repository Content Analysis Script
 * 
 * Systematically analyzes all cloned repositories to discover:
 * - API specifications (OpenAPI/Swagger, GraphQL schemas)
 * - Documentation structure and quality
 * - Project types and technologies
 * - Integration requirements
 * - Postman collections
 */

const fs = require('fs');
const path = require('path');

interface RepositoryAnalysis {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  apis: {
    openapi: string[];
    graphql: string[];
    postman: string[];
  };
  documentation: {
    readme: boolean;
    docsFolder: boolean;
    markdownFiles: string[];
  };
  technologies: {
    languages: string[];
    frameworks: string[];
    packageManagers: string[];
  };
  structure: {
    directories: string[];
    keyFiles: string[];
  };
}

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

// File patterns for different API types
const API_PATTERNS = {
  openapi: [
    '**/*.yaml', '**/*.yml', '**/*.json',
    '**/openapi.*', '**/swagger.*', '**/api-spec.*'
  ],
  graphql: [
    '**/*.graphql', '**/*.gql',
    '**/schema.*', '**/queries.*', '**/mutations.*'
  ],
  postman: [
    '**/*.postman_collection.json',
    '**/postman/**/*.json'
  ]
};

// Technology detection patterns
const TECH_PATTERNS = {
  languages: {
    'TypeScript': ['**/*.ts', '**/tsconfig.json'],
    'JavaScript': ['**/*.js', '**/package.json'],
    'Python': ['**/*.py', '**/requirements.txt', '**/setup.py'],
    'Java': ['**/*.java', '**/pom.xml', '**/build.gradle'],
    'Go': ['**/*.go', '**/go.mod'],
    'Rust': ['**/*.rs', '**/Cargo.toml'],
    'C#': ['**/*.cs', '**/*.csproj'],
    'PHP': ['**/*.php', '**/composer.json']
  },
  frameworks: {
    'React': ['**/package.json'], // Check content for react
    'Next.js': ['**/next.config.*'],
    'Express': ['**/package.json'], // Check content for express
    'Spring Boot': ['**/pom.xml', '**/build.gradle'],
    'Django': ['**/manage.py', '**/settings.py'],
    'FastAPI': ['**/main.py'], // Check content for fastapi
    'GraphQL': ['**/*.graphql', '**/apollo.config.*']
  },
  packageManagers: {
    'npm': ['**/package.json'],
    'yarn': ['**/yarn.lock'],
    'pip': ['**/requirements.txt'],
    'maven': ['**/pom.xml'],
    'gradle': ['**/build.gradle'],
    'go mod': ['**/go.mod'],
    'cargo': ['**/Cargo.toml'],
    'composer': ['**/composer.json']
  }
};

/**
 * Recursively find files matching patterns
 */
function findFiles(dir: string, patterns: string[]): string[] {
  const files: string[] = [];
  
  function searchDir(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          searchDir(fullPath);
        } else if (entry.isFile()) {
          // Simple pattern matching (could be enhanced with glob)
          for (const pattern of patterns) {
            const cleanPattern = pattern.replace('**/', '').replace('*', '');
            if (entry.name.includes(cleanPattern) || entry.name.endsWith(cleanPattern)) {
              files.push(path.relative(dir, fullPath));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${currentDir}:`, error);
    }
  }
  
  searchDir(dir);
  return files;
}

/**
 * Analyze a single repository
 */
function analyzeRepository(repoName: string): RepositoryAnalysis {
  const repoPath = path.join(CLONED_REPOS_PATH, repoName);
  
  console.log(`\n🔍 Analyzing ${repoName}...`);
  
  // Get basic info
  const stats = fs.statSync(repoPath);
  
  // Find API files
  const openApiFiles = findFiles(repoPath, API_PATTERNS.openapi)
    .filter(file => {
      const content = fs.readFileSync(path.join(repoPath, file), 'utf8').toLowerCase();
      return content.includes('openapi') || content.includes('swagger') || 
             content.includes('paths:') || content.includes('"paths"');
    });
  
  const graphqlFiles = findFiles(repoPath, API_PATTERNS.graphql);
  const postmanFiles = findFiles(repoPath, API_PATTERNS.postman);
  
  // Find documentation
  const readmeExists = fs.existsSync(path.join(repoPath, 'README.md'));
  const docsFolderExists = fs.existsSync(path.join(repoPath, 'docs'));
  const markdownFiles = findFiles(repoPath, ['**/*.md']);
  
  // Detect technologies
  const languages: string[] = [];
  const frameworks: string[] = [];
  const packageManagers: string[] = [];
  
  // Language detection
  for (const [lang, patterns] of Object.entries(TECH_PATTERNS.languages)) {
    const found = findFiles(repoPath, patterns);
    if (found.length > 0) {
      languages.push(lang);
    }
  }
  
  // Framework detection (enhanced with content checking)
  for (const [framework, patterns] of Object.entries(TECH_PATTERNS.frameworks)) {
    const found = findFiles(repoPath, patterns);
    if (found.length > 0) {
      // Additional content-based detection for package.json frameworks
      if (framework === 'React' || framework === 'Express') {
        const packageJsonPath = path.join(repoPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
          if (packageContent.toLowerCase().includes(framework.toLowerCase())) {
            frameworks.push(framework);
          }
        }
      } else {
        frameworks.push(framework);
      }
    }
  }
  
  // Package manager detection
  for (const [pm, patterns] of Object.entries(TECH_PATTERNS.packageManagers)) {
    const found = findFiles(repoPath, patterns);
    if (found.length > 0) {
      packageManagers.push(pm);
    }
  }
  
  // Get directory structure
  const directories: string[] = [];
  const keyFiles: string[] = [];
  
  try {
    const entries = fs.readdirSync(repoPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        directories.push(entry.name);
      } else if (entry.isFile() && (
        entry.name.toLowerCase().includes('readme') ||
        entry.name.toLowerCase().includes('package') ||
        entry.name.toLowerCase().includes('docker') ||
        entry.name.toLowerCase().includes('config')
      )) {
        keyFiles.push(entry.name);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read repository structure for ${repoName}:`, error);
  }
  
  return {
    name: repoName,
    path: repoPath,
    size: 0, // Could calculate if needed
    lastModified: stats.mtime,
    apis: {
      openapi: openApiFiles,
      graphql: graphqlFiles,
      postman: postmanFiles
    },
    documentation: {
      readme: readmeExists,
      docsFolder: docsFolderExists,
      markdownFiles
    },
    technologies: {
      languages,
      frameworks,
      packageManagers
    },
    structure: {
      directories,
      keyFiles
    }
  };
}

/**
 * Generate analysis report
 */
function generateReport(analyses: RepositoryAnalysis[]): string {
  let report = `# Repository Content Analysis Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Repositories Analyzed**: ${analyses.length}\n\n`;
  
  // Summary statistics
  const totalApis = analyses.reduce((sum, repo) => 
    sum + repo.apis.openapi.length + repo.apis.graphql.length + repo.apis.postman.length, 0);
  const reposWithApis = analyses.filter(repo => 
    repo.apis.openapi.length > 0 || repo.apis.graphql.length > 0 || repo.apis.postman.length > 0).length;
  const reposWithDocs = analyses.filter(repo => repo.documentation.readme).length;
  
  report += `## 📊 Summary Statistics\n\n`;
  report += `- **Total API Specifications**: ${totalApis}\n`;
  report += `- **Repositories with APIs**: ${reposWithApis}/${analyses.length}\n`;
  report += `- **Repositories with README**: ${reposWithDocs}/${analyses.length}\n`;
  report += `- **Documentation Coverage**: ${Math.round((reposWithDocs/analyses.length)*100)}%\n\n`;
  
  // Technology breakdown
  const allLanguages = [...new Set(analyses.flatMap(repo => repo.technologies.languages))];
  const allFrameworks = [...new Set(analyses.flatMap(repo => repo.technologies.frameworks))];
  
  report += `## 🛠️ Technology Stack Overview\n\n`;
  report += `**Languages**: ${allLanguages.join(', ')}\n`;
  report += `**Frameworks**: ${allFrameworks.join(', ')}\n\n`;
  
  // Detailed analysis per repository
  report += `## 📋 Detailed Repository Analysis\n\n`;
  
  for (const repo of analyses) {
    report += `### ${repo.name}\n\n`;
    
    // API Information
    const totalRepoApis = repo.apis.openapi.length + repo.apis.graphql.length + repo.apis.postman.length;
    report += `**APIs**: ${totalRepoApis} total\n`;
    if (repo.apis.openapi.length > 0) {
      report += `- OpenAPI/Swagger: ${repo.apis.openapi.length} files\n`;
      repo.apis.openapi.forEach(file => report += `  - ${file}\n`);
    }
    if (repo.apis.graphql.length > 0) {
      report += `- GraphQL: ${repo.apis.graphql.length} files\n`;
      repo.apis.graphql.forEach(file => report += `  - ${file}\n`);
    }
    if (repo.apis.postman.length > 0) {
      report += `- Postman: ${repo.apis.postman.length} files\n`;
      repo.apis.postman.forEach(file => report += `  - ${file}\n`);
    }
    
    // Documentation
    report += `\n**Documentation**:\n`;
    report += `- README: ${repo.documentation.readme ? '✅' : '❌'}\n`;
    report += `- Docs folder: ${repo.documentation.docsFolder ? '✅' : '❌'}\n`;
    report += `- Markdown files: ${repo.documentation.markdownFiles.length}\n`;
    
    // Technologies
    report += `\n**Technologies**:\n`;
    report += `- Languages: ${repo.technologies.languages.join(', ') || 'None detected'}\n`;
    report += `- Frameworks: ${repo.technologies.frameworks.join(', ') || 'None detected'}\n`;
    report += `- Package Managers: ${repo.technologies.packageManagers.join(', ') || 'None detected'}\n`;
    
    // Structure
    report += `\n**Structure**:\n`;
    report += `- Directories: ${repo.structure.directories.slice(0, 10).join(', ')}${repo.structure.directories.length > 10 ? '...' : ''}\n`;
    report += `- Key Files: ${repo.structure.keyFiles.join(', ')}\n`;
    
    report += `\n---\n\n`;
  }
  
  return report;
}

/**
 * Main analysis function
 */
async function main() {
  console.log('🚀 Starting Repository Content Analysis...\n');
  
  // Get list of repositories
  const repositories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name);
  
  console.log(`Found ${repositories.length} repositories to analyze:`);
  repositories.forEach(repo => console.log(`  - ${repo}`));
  
  // Analyze each repository
  const analyses: RepositoryAnalysis[] = [];
  for (const repo of repositories) {
    try {
      const analysis = analyzeRepository(repo);
      analyses.push(analysis);
      
      // Progress indicator
      console.log(`✅ ${repo}: ${analysis.apis.openapi.length + analysis.apis.graphql.length + analysis.apis.postman.length} APIs, ${analysis.documentation.markdownFiles.length} docs`);
    } catch (error) {
      console.error(`❌ Error analyzing ${repo}:`, error);
    }
  }
  
  // Generate and save report
  const report = generateReport(analyses);
  const reportPath = path.join(__dirname, '../../REPOSITORY_CONTENT_ANALYSIS.md');
  fs.writeFileSync(reportPath, report);
  
  console.log(`\n✅ Analysis complete! Report saved to: ${reportPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`  - Repositories analyzed: ${analyses.length}`);
  console.log(`  - Total APIs found: ${analyses.reduce((sum, repo) => sum + repo.apis.openapi.length + repo.apis.graphql.length + repo.apis.postman.length, 0)}`);
  console.log(`  - Documentation coverage: ${Math.round((analyses.filter(repo => repo.documentation.readme).length/analyses.length)*100)}%`);
}

// Run the analysis
if (require.main === module) {
  main().catch(console.error);
}

export { analyzeRepository, generateReport };
export type { RepositoryAnalysis };
