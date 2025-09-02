/**
 * Backend API Endpoint for Dynamic API Detection
 * 
 * Provides REST endpoints for detecting API types in repositories
 * and serving appropriate UI button configurations.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const router = express.Router();
const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

/**
 * Detect APIs in a specific repository
 * GET /api/detect-apis/:repoName
 */
router.get('/detect-apis/:repoName', async (req, res) => {
  try {
    const { repoName } = req.params;
    const repoPath = path.join(CLONED_REPOS_PATH, repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: `Repository not found: ${repoName}` });
    }
    
    // Special handling for nslabsdashboards - ensure james-update branch
    if (repoName === 'nslabsdashboards') {
      await ensureCorrectBranch(repoPath, 'james-update');
    }
    
    const result = await detectRepositoryApis(repoPath, repoName);
    res.json(result);
    
  } catch (error) {
    console.error('API detection error:', error);
    res.status(500).json({ error: 'Failed to detect APIs', details: error.message });
  }
});

/**
 * Detect APIs in a repository (alternate route)
 * GET /api/repository/:repoName/detect-apis
 */
router.get('/repository/:repoName/detect-apis', async (req, res) => {
  try {
    const { repoName } = req.params;
    const repoPath = path.join(CLONED_REPOS_PATH, repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: `Repository not found: ${repoName}` });
    }
    
    const result = await detectRepositoryApis(repoPath, repoName);
    res.json(result);
    
  } catch (error) {
    console.error('API detection error:', error);
    res.status(500).json({ error: 'Failed to detect APIs', details: error.message });
  }
});

/**
 * Get API button configuration for a repository
 * GET /api/api-buttons/:repoName
 */
/**
 * Get comprehensive API information for documentation hub
 * GET /api/repository/:repoName/apis
 */
router.get('/repository/:repoName/apis', async (req, res) => {
  try {
    const { repoName } = req.params;
    const repoPath = path.join(CLONED_REPOS_PATH, repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: `Repository not found: ${repoName}` });
    }
    
    const result = await detectRepositoryApis(repoPath, repoName);
    
    // Add Postman collections detection
    const postmanCollections = await detectPostmanCollections(repoPath);
    result.postmanCollections = postmanCollections;
    
    res.json(result);
  } catch (error) {
    console.error('API hub detection error:', error);
    res.status(500).json({ error: 'Failed to detect APIs', details: error.message });
  }
});

router.get('/api-buttons/:repoName', async (req, res) => {
  try {
    const { repoName } = req.params;
    const repoPath = path.join(CLONED_REPOS_PATH, repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: `Repository not found: ${repoName}` });
    }
    
    const apiDetection = await detectRepositoryApis(repoPath, repoName);
    const buttonConfig = generateButtonConfig(apiDetection);
    
    res.json(buttonConfig);
    
  } catch (error) {
    console.error('Button config error:', error);
    res.status(500).json({ error: 'Failed to generate button config', details: error.message });
  }
});

/**
 * Detect APIs for all repositories
 * GET /api/detect-apis/all
 */
router.get('/detect-apis/all', async (req, res) => {
  try {
    const repositories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => entry.name);
    
    const results = [];
    
    for (const repoName of repositories) {
      try {
        const repoPath = path.join(CLONED_REPOS_PATH, repoName);
        const restApis = await detectRestApis(repoPath);
        const graphqlApis = await detectGraphqlApis(repoPath);
        const grpcApis = await detectGrpcApis(repoPath);
        const postmanCollections = await detectPostmanCollections(repoPath);
        
        const hasAnyApis = restApis.length > 0 || graphqlApis.length > 0 || grpcApis.length > 0;
        const recommendedButtons = determineRecommendedButtons(restApis, graphqlApis, grpcApis);
        
        results.push({
          repository: repoName,
          apis: {
            rest: restApis,
            graphql: graphqlApis,
            grpc: grpcApis
          },
          postman: postmanCollections,
          hasAnyApis,
          recommendedButtons
        });
      } catch (error) {
        console.error(`Error detecting APIs in ${repoName}:`, error);
      }
    }
    
    res.json({
      repositories: results,
      summary: generateSummary(results)
    });
  } catch (error) {
    console.error('Error detecting APIs:', error);
    res.status(500).json({ error: 'Failed to detect APIs' });
  }
});

/**
 * Get all APIs across all repositories with optional type filter
 * GET /api-explorer/all
 */
router.get('/api-explorer/all', async (req, res) => {
  try {
    const { type } = req.query;
    const repositories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => entry.name);
    
    const allApis = [];
    
    for (const repoName of repositories) {
      try {
        const repoPath = path.join(CLONED_REPOS_PATH, repoName);
        const result = await detectRepositoryApis(repoPath, repoName);
        
        // Add REST APIs
        if (result.apis?.rest && (!type || type === 'rest' || type === 'openapi')) {
          result.apis.rest.forEach(api => {
            allApis.push({
              repository: repoName,
              type: 'OpenAPI',
              name: api.title || api.file,
              path: api.file,
              version: api.version,
              description: api.description
            });
          });
        }
        
        // Add GraphQL APIs
        if (result.apis?.graphql && (!type || type === 'graphql')) {
          result.apis.graphql.forEach(api => {
            allApis.push({
              repository: repoName,
              type: 'GraphQL',
              name: api.file,
              path: api.file,
              description: api.description
            });
          });
        }
        
        // Add gRPC APIs
        if (result.apis?.grpc && (!type || type === 'grpc')) {
          result.apis.grpc.forEach(api => {
            allApis.push({
              repository: repoName,
              type: 'gRPC',
              name: api.file,
              path: api.file,
              services: api.services,
              package: api.package,
              description: api.description
            });
          });
        }
        
        // Add Postman Collections
        if (result.postman && (!type || type === 'postman')) {
          result.postman.forEach(collection => {
            allApis.push({
              repository: repoName,
              type: 'Postman',
              name: collection.name,
              path: collection.path,
              description: `Postman collection: ${collection.name}`
            });
          });
        }
      } catch (error) {
        console.error(`Error detecting APIs in ${repoName}:`, error);
      }
    }
    
    res.json({
      apis: allApis,
      total: allApis.length,
      filter: type || 'all'
    });
  } catch (error) {
    console.error('Error fetching all APIs:', error);
    res.status(500).json({ error: 'Failed to fetch APIs' });
  }
});

/**
 * Batch detect APIs for all repositories
 * GET /api/detect-apis
 */
router.get('/detect-apis', async (req, res) => {
  try {
    const repositories = fs.readdirSync(CLONED_REPOS_PATH, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => entry.name);
    
    const results = [];
    
    for (const repoName of repositories) {
      try {
        const repoPath = path.join(CLONED_REPOS_PATH, repoName);
        const result = await detectRepositoryApis(repoPath, repoName);
        results.push(result);
      } catch (error) {
        console.error(`Error detecting APIs in ${repoName}:`, error);
        results.push({
          repository: repoName,
          error: error.message,
          apis: { rest: [], graphql: [], grpc: [] },
          hasAnyApis: false,
          recommendedButtons: []
        });
      }
    }
    
    res.json({
      repositories: results,
      summary: generateSummary(results)
    });
    
  } catch (error) {
    console.error('Batch detection error:', error);
    res.status(500).json({ error: 'Failed to detect APIs', details: error.message });
  }
});

/**
 * Core API detection logic
 */
async function detectRepositoryApis(repoPath, repoName) {
  const [restApis, graphqlApis, grpcApis, postmanCollections] = await Promise.all([
    detectRestApis(repoPath),
    detectGraphqlApis(repoPath),
    detectGrpcApis(repoPath),
    detectPostmanCollections(repoPath)
  ]);
  
  const hasAnyApis = restApis.length > 0 || graphqlApis.length > 0 || grpcApis.length > 0;
  const recommendedButtons = determineRecommendedButtons(restApis, graphqlApis, grpcApis);
  
  return {
    repository: repoName,
    apis: {
      rest: restApis,
      graphql: graphqlApis,
      grpc: grpcApis
    },
    postman: postmanCollections,
    hasAnyApis,
    recommendedButtons
  };
}

/**
 * Detect REST/OpenAPI specifications
 */
async function detectRestApis(repoPath) {
  const restApis = [];
  
  try {
    const apiFiles = await findFiles(repoPath, ['**/*.yaml', '**/*.yml', '**/*.json']);
    
    for (const file of apiFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (isOpenApiSpec(content)) {
          const apiInfo = parseOpenApiInfo(content, file);
          restApis.push(apiInfo);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not detect REST APIs in ${repoPath}:`, error);
  }
  
  return restApis;
}

/**
 * Detect GraphQL schemas and queries
 */
async function detectGraphqlApis(repoPath) {
  const graphqlApis = [];
  
  try {
    const graphqlFiles = await findFiles(repoPath, ['**/*.graphql', '**/*.gql']);
    
    for (const file of graphqlFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const apiInfo = {
          file,
          type: determineGraphqlType(file, content),
          description: extractGraphqlDescription(content)
        };
        
        graphqlApis.push(apiInfo);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not detect GraphQL APIs in ${repoPath}:`, error);
  }
  
  return graphqlApis;
}

/**
 * Detect gRPC service definitions
 */
async function detectGrpcApis(repoPath) {
  const grpcApis = [];
  
  try {
    const protoFiles = await findFiles(repoPath, ['**/*.proto']);
    
    for (const file of protoFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const apiInfo = {
          file,
          services: extractGrpcServices(content),
          package: extractGrpcPackage(content),
          description: extractGrpcDescription(content)
        };
        
        grpcApis.push(apiInfo);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not detect gRPC APIs in ${repoPath}:`, error);
  }
  
  return grpcApis;
}

/**
 * Utility functions
 */

async function findFiles(dir, patterns) {
  const files = [];
  
  function searchDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          searchDir(fullPath);
        } else if (entry.isFile()) {
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
      // Skip directories that can't be read
    }
  }
  
  searchDir(dir);
  return files;
}

function isOpenApiSpec(content) {
  const lowerContent = content.toLowerCase();
  return (
    lowerContent.includes('openapi:') ||
    lowerContent.includes('swagger:') ||
    lowerContent.includes('"openapi"') ||
    lowerContent.includes('"swagger"') ||
    (lowerContent.includes('paths:') && lowerContent.includes('info:')) ||
    (lowerContent.includes('"paths"') && lowerContent.includes('"info"'))
  );
}

function parseOpenApiInfo(content, file) {
  const apiInfo = { file };
  
  try {
    const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/i) || 
                      content.match(/"title":\s*"([^"]+)"/i);
    if (titleMatch) {
      apiInfo.title = titleMatch[1].trim();
    }
    
    const versionMatch = content.match(/version:\s*["']?([^"'\n]+)["']?/i) ||
                        content.match(/"version":\s*"([^"]+)"/i);
    if (versionMatch) {
      apiInfo.version = versionMatch[1].trim();
    }
  } catch (error) {
    // Skip parsing errors
  }
  
  return apiInfo;
}

function determineGraphqlType(file, content) {
  const fileName = file.toLowerCase();
  const contentLower = content.toLowerCase();
  
  if (fileName.includes('schema') || contentLower.includes('type query') || contentLower.includes('type mutation')) {
    return 'schema';
  } else if (fileName.includes('query') || contentLower.includes('query {')) {
    return 'query';
  } else if (fileName.includes('mutation') || contentLower.includes('mutation {')) {
    return 'mutation';
  } else if (fileName.includes('subscription') || contentLower.includes('subscription {')) {
    return 'subscription';
  } else if (fileName.includes('example') || fileName.includes('sample')) {
    return 'example';
  }
  
  return 'schema';
}

function extractGraphqlDescription(content) {
  const lines = content.split('\n');
  const commentLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('"""')) {
      commentLines.push(trimmed.replace(/^#+\s*|^"""\s*|"""\s*$/g, ''));
    } else if (trimmed && !trimmed.startsWith('#')) {
      break;
    }
  }
  
  return commentLines.length > 0 ? commentLines.join(' ').trim() : undefined;
}

function extractGrpcServices(content) {
  const services = [];
  const serviceMatches = content.match(/service\s+(\w+)\s*{/g);
  
  if (serviceMatches) {
    for (const match of serviceMatches) {
      const serviceName = match.match(/service\s+(\w+)/)?.[1];
      if (serviceName) {
        services.push(serviceName);
      }
    }
  }
  
  return services;
}

function extractGrpcPackage(content) {
  const packageMatch = content.match(/package\s+([^;]+);/);
  return packageMatch ? packageMatch[1].trim() : undefined;
}

function extractGrpcDescription(content) {
  const lines = content.split('\n');
  const commentLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      commentLines.push(trimmed.replace(/^\/\/\s*|^\/\*\s*|\*\/\s*$/g, ''));
    } else if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      break;
    }
  }
  
  return commentLines.length > 0 ? commentLines.join(' ').trim() : undefined;
}

function determineRecommendedButtons(restApis, graphqlApis, grpcApis) {
  const buttons = [];
  
  if (restApis.length > 0) {
    buttons.push('swagger');
  }
  
  if (graphqlApis.length > 0) {
    buttons.push('graphql');
  }
  
  if (grpcApis.length > 0) {
    buttons.push('grpc');
  }
  
  // Show Postman button if any APIs are detected
  if (restApis.length > 0 || graphqlApis.length > 0 || grpcApis.length > 0) {
    buttons.push('postman');
  }
  
  return buttons;
}

function generateButtonConfig(apiDetection) {
  const buttons = [];
  
  apiDetection.recommendedButtons.forEach(buttonType => {
    switch (buttonType) {
      case 'swagger':
        buttons.push({
          type: 'swagger',
          label: `Swagger UI (${apiDetection.apis.rest.length} APIs)`,
          icon: '📋',
          color: 'green',
          url: `/swagger/${apiDetection.repository}`,
          description: 'Explore REST/OpenAPI specifications'
        });
        break;
        
      case 'graphql':
        buttons.push({
          type: 'graphql',
          label: `GraphQL Playground (${apiDetection.apis.graphql.length} schemas)`,
          icon: '🔮',
          color: 'pink',
          url: `/graphql/${apiDetection.repository}`,
          description: 'Explore GraphQL schemas and run queries'
        });
        break;
        
      case 'grpc':
        buttons.push({
          type: 'grpc',
          label: `gRPC UI (${apiDetection.apis.grpc.length} services)`,
          icon: '⚡',
          color: 'blue',
          url: `/grpc/${apiDetection.repository}`,
          description: 'Explore gRPC service definitions'
        });
        break;
        
      case 'postman':
        const totalApis = apiDetection.apis.rest.length + 
                         apiDetection.apis.graphql.length + 
                         apiDetection.apis.grpc.length;
        buttons.push({
          type: 'postman',
          label: `Postman Collection (${totalApis} APIs)`,
          icon: '📮',
          color: 'orange',
          url: `/api/postman/${apiDetection.repository}`,
          description: 'Download Postman collection for API testing'
        });
        break;
    }
  });
  
  return {
    repository: apiDetection.repository,
    hasApis: apiDetection.hasAnyApis,
    buttons,
    summary: {
      rest: apiDetection.apis.rest.length,
      graphql: apiDetection.apis.graphql.length,
      grpc: apiDetection.apis.grpc.length,
      total: apiDetection.apis.rest.length + apiDetection.apis.graphql.length + apiDetection.apis.grpc.length
    }
  };
}

function generateSummary(results) {
  const totalRest = results.reduce((sum, r) => sum + (r.apis?.rest?.length || 0), 0);
  const totalGraphql = results.reduce((sum, r) => sum + (r.apis?.graphql?.length || 0), 0);
  const totalGrpc = results.reduce((sum, r) => sum + (r.apis?.grpc?.length || 0), 0);
  const reposWithApis = results.filter(r => r.hasAnyApis).length;
  
  return {
    totalRepositories: results.length,
    totalRestApis: totalRest,
    totalGraphqlSchemas: totalGraphql,
    totalGrpcServices: totalGrpc,
    repositoriesWithApis: reposWithApis,
    apiCoverage: Math.round((reposWithApis / results.length) * 100)
  };
}

/**
 * Detect Postman collections in a repository
 */
async function detectPostmanCollections(repoPath) {
  const collections = [];
  
  async function searchDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await searchDirectory(path.join(dir, entry.name));
        } else if (entry.isFile()) {
          const fileName = entry.name.toLowerCase();
          if (fileName.includes('postman') && fileName.endsWith('.json')) {
            const filePath = path.join(dir, entry.name);
            const relativePath = path.relative(repoPath, filePath);
            
            try {
              const content = fs.readFileSync(filePath, 'utf8');
              const collection = JSON.parse(content);
              
              if (collection.info && collection.item) {
                collections.push({
                  file: relativePath,
                  name: collection.info.name || 'Postman Collection',
                  description: collection.info.description,
                  version: collection.info.version
                });
              }
            } catch (e) {
              // Not a valid Postman collection
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error searching directory ${dir}:`, error);
    }
  }
  
  await searchDirectory(repoPath);
  return collections;
}

async function ensureCorrectBranch(repoPath, branchName) {
  try {
    const currentBranch = execSync('git branch --show-current', { 
      cwd: repoPath, 
      encoding: 'utf8' 
    }).trim();
    
    if (currentBranch !== branchName) {
      console.log(`Switching ${path.basename(repoPath)} to ${branchName} branch...`);
      execSync(`git checkout ${branchName}`, { cwd: repoPath });
    }
  } catch (error) {
    console.warn(`Warning: Could not switch to ${branchName} branch in ${repoPath}:`, error);
  }
}

module.exports = router;
