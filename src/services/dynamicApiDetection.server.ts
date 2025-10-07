/**
 * Dynamic API Detection Service
 * 
 * Detects API types in repositories based on file patterns and content analysis.
 * Supports REST/OpenAPI, GraphQL, and gRPC service detection for dynamic UI button display.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ApiDetectionResult {
  repository: string;
  apis: {
    rest: RestApiInfo[];
    graphql: GraphqlApiInfo[];
    grpc: GrpcApiInfo[];
  };
  hasAnyApis: boolean;
  recommendedButtons: ApiButtonType[];
}

export interface RestApiInfo {
  file: string;
  title?: string;
  version?: string;
  description?: string;
  servers?: string[];
}

export interface GraphqlApiInfo {
  file: string;
  type: 'schema' | 'query' | 'mutation' | 'subscription' | 'example';
  description?: string;
}

export interface GrpcApiInfo {
  file: string;
  services: string[];
  package?: string;
  description?: string;
}

export type ApiButtonType = 'swagger' | 'graphql' | 'grpc' | 'postman';

const CLONED_REPOS_PATH = path.join(__dirname, '../../cloned-repositories');

/**
 * Detect REST/OpenAPI specifications
 */
async function detectRestApis(repoPath: string): Promise<RestApiInfo[]> {
  const restApis: RestApiInfo[] = [];
  
  try {
    // Find YAML/JSON files that might be OpenAPI specs
    const apiFiles = await findFiles(repoPath, [
      '**/*.yaml', '**/*.yml', '**/*.json'
    ]);
    
    for (const file of apiFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if it's an OpenAPI/Swagger specification
        if (isOpenApiSpec(content)) {
          const apiInfo = parseOpenApiInfo(content, file);
          restApis.push(apiInfo);
        }
      } catch (error) {
        console.warn(`Warning: Could not read file ${file}:`, error);
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
async function detectGraphqlApis(repoPath: string): Promise<GraphqlApiInfo[]> {
  const graphqlApis: GraphqlApiInfo[] = [];
  
  try {
    // Find GraphQL files
    const graphqlFiles = await findFiles(repoPath, [
      '**/*.graphql', '**/*.gql'
    ]);
    
    for (const file of graphqlFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const apiInfo: GraphqlApiInfo = {
          file,
          type: determineGraphqlType(file, content),
          description: extractGraphqlDescription(content)
        };
        
        graphqlApis.push(apiInfo);
      } catch (error) {
        console.warn(`Warning: Could not read GraphQL file ${file}:`, error);
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
async function detectGrpcApis(repoPath: string): Promise<GrpcApiInfo[]> {
  const grpcApis: GrpcApiInfo[] = [];
  
  try {
    // Find .proto files
    const protoFiles = await findFiles(repoPath, ['**/*.proto']);
    
    for (const file of protoFiles) {
      try {
        const filePath = path.join(repoPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const apiInfo: GrpcApiInfo = {
          file,
          services: extractGrpcServices(content),
          package: extractGrpcPackage(content),
          description: extractGrpcDescription(content)
        };
        
        grpcApis.push(apiInfo);
      } catch (error) {
        console.warn(`Warning: Could not read proto file ${file}:`, error);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not detect gRPC APIs in ${repoPath}:`, error);
  }
  
  return grpcApis;
}

/**
 * Main API detection function
 */
export async function detectRepositoryApis(repositoryName: string): Promise<ApiDetectionResult> {
  const repoPath = path.join(CLONED_REPOS_PATH, repositoryName);
  
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository not found: ${repositoryName}`);
  }
  
  // Special handling for demo-labsdashboards - check james-update branch
  if (repositoryName === 'demo-labsdashboards') {
    await ensureCorrectBranch(repoPath, 'james-update');
  }
  
  const [restApis, graphqlApis, grpcApis] = await Promise.all([
    detectRestApis(repoPath),
    detectGraphqlApis(repoPath),
    detectGrpcApis(repoPath)
  ]);
  
  const hasAnyApis = restApis.length > 0 || graphqlApis.length > 0 || grpcApis.length > 0;
  const recommendedButtons = determineRecommendedButtons(restApis, graphqlApis, grpcApis);
  
  return {
    repository: repositoryName,
    apis: {
      rest: restApis,
      graphql: graphqlApis,
      grpc: grpcApis
    },
    hasAnyApis,
    recommendedButtons
  };
}

/**
 * Determine which API buttons to show based on detected APIs
 */
function determineRecommendedButtons(
  restApis: RestApiInfo[],
  graphqlApis: GraphqlApiInfo[],
  grpcApis: GrpcApiInfo[]
): ApiButtonType[] {
  const buttons: ApiButtonType[] = [];
  
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

/**
 * Utility functions
 */

async function findFiles(dir: string, patterns: string[]): Promise<string[]> {
  const files: string[] = [];
  
  function searchDir(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          searchDir(fullPath);
        } else if (entry.isFile()) {
          // Simple pattern matching
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

function isOpenApiSpec(content: string): boolean {
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

function parseOpenApiInfo(content: string, file: string): RestApiInfo {
  const apiInfo: RestApiInfo = { file };
  
  try {
    // Try to extract basic info from YAML/JSON content
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
    
    const descMatch = content.match(/description:\s*["']?([^"'\n]+)["']?/i) ||
                     content.match(/"description":\s*"([^"]+)"/i);
    if (descMatch) {
      apiInfo.description = descMatch[1].trim();
    }
  } catch (error) {
    console.warn(`Warning: Could not parse OpenAPI info from ${file}:`, error);
  }
  
  return apiInfo;
}

function determineGraphqlType(file: string, content: string): GraphqlApiInfo['type'] {
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
  
  return 'schema'; // Default
}

function extractGraphqlDescription(content: string): string | undefined {
  // Look for comments at the top of the file
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

function extractGrpcServices(content: string): string[] {
  const services: string[] = [];
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

function extractGrpcPackage(content: string): string | undefined {
  const packageMatch = content.match(/package\s+([^;]+);/);
  return packageMatch ? packageMatch[1].trim() : undefined;
}

function extractGrpcDescription(content: string): string | undefined {
  // Look for comments at the top of the file
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

async function ensureCorrectBranch(repoPath: string, branchName: string): Promise<void> {
  try {
    const { execSync } = require('child_process');
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

/**
 * Batch detect APIs for multiple repositories
 */
export async function detectAllRepositoryApis(repositoryNames: string[]): Promise<ApiDetectionResult[]> {
  const results: ApiDetectionResult[] = [];
  
  for (const repoName of repositoryNames) {
    try {
      const result = await detectRepositoryApis(repoName);
      results.push(result);
      console.log(`✅ ${repoName}: ${result.apis.rest.length} REST, ${result.apis.graphql.length} GraphQL, ${result.apis.grpc.length} gRPC`);
    } catch (error) {
      console.error(`❌ Error detecting APIs in ${repoName}:`, error);
    }
  }
  
  return results;
}
