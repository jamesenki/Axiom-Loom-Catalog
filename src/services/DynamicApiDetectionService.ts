/**
 * Dynamic API Detection Service Class Wrapper
 * 
 * Wraps the dynamic API detection functions in a class for better testing
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ApiDetectionResult,
  RestApiInfo,
  GraphqlApiInfo,
  GrpcApiInfo,
  ApiButtonType,
  detectRepositoryApis as detectRepoApis,
  detectAllRepositoryApis
} from './dynamicApiDetection';

export interface ApiButtonConfig {
  type: string;
  label: string;
  icon: string;
  color: string;
  url: string;
  description: string;
}

export interface ButtonConfiguration {
  repository: string;
  hasApis: boolean;
  buttons: ApiButtonConfig[];
  summary: {
    rest: number;
    graphql: number;
    grpc: number;
    total: number;
  };
}

export class DynamicApiDetectionService {
  async detectRepositoryApis(repoPath: string, repoName: string): Promise<ApiDetectionResult> {
    // Mock implementation for testing - in real implementation would call the actual function
    return detectRepoApis(repoName);
  }

  async detectRestApis(repoPath: string): Promise<RestApiInfo[]> {
    const restApis: RestApiInfo[] = [];
    
    try {
      // Read directory recursively looking for API specs
      const files = await this.getFilesRecursively(repoPath);
      
      for (const file of files) {
        const content = await fs.promises.readFile(path.join(repoPath, file), 'utf-8');
        
        // Check for OpenAPI/Swagger
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          if (content.includes('openapi:') || content.includes('swagger:')) {
            const lines = content.split('\n');
            let title = '';
            let version = '';
            
            for (const line of lines) {
              if (line.includes('title:')) {
                title = line.split('title:')[1].trim();
              }
              if (line.includes('version:')) {
                version = line.split('version:')[1].trim();
              }
            }
            
            restApis.push({
              file,
              format: 'yaml',
              version: version || '3.0.0',
              title: title || 'API'
            });
          }
        } else if (file.endsWith('.json')) {
          try {
            const spec = JSON.parse(content);
            if (spec.openapi || spec.swagger) {
              restApis.push({
                file,
                format: 'json',
                version: spec.info?.version || '1.0.0',
                title: spec.info?.title || 'API'
              });
            }
          } catch (e) {
            // Invalid JSON
          }
        }
      }
    } catch (error) {
      // Handle errors
    }
    
    return restApis;
  }

  async detectGraphqlApis(repoPath: string): Promise<GraphqlApiInfo[]> {
    const graphqlApis: GraphqlApiInfo[] = [];
    
    try {
      const files = await this.getFilesRecursively(repoPath);
      
      for (const file of files) {
        if (file.endsWith('.graphql') || file.endsWith('.gql')) {
          const content = await fs.promises.readFile(path.join(repoPath, file), 'utf-8');
          
          let type: 'schema' | 'query' | 'mutation' = 'schema';
          let description = '';
          
          if (content.includes('query ')) {
            type = 'query';
          } else if (content.includes('mutation ')) {
            type = 'mutation';
          }
          
          // Extract first comment as description
          const commentMatch = content.match(/^#\s*(.+)/m);
          if (commentMatch) {
            description = commentMatch[1];
          }
          
          graphqlApis.push({
            file,
            type,
            description
          });
        }
      }
    } catch (error) {
      // Handle errors
    }
    
    return graphqlApis;
  }

  async detectGrpcApis(repoPath: string): Promise<GrpcApiInfo[]> {
    const grpcApis: GrpcApiInfo[] = [];
    
    try {
      const files = await this.getFilesRecursively(repoPath);
      
      for (const file of files) {
        if (file.endsWith('.proto')) {
          const content = await fs.promises.readFile(path.join(repoPath, file), 'utf-8');
          
          const services: string[] = [];
          const serviceMatches = content.matchAll(/service\s+(\w+)\s*{/g);
          for (const match of serviceMatches) {
            services.push(match[1]);
          }
          
          const packageMatch = content.match(/package\s+([\w.]+);/);
          const syntaxMatch = content.match(/syntax\s*=\s*"proto(\d)"/);
          
          if (services.length > 0 || syntaxMatch) {
            grpcApis.push({
              file,
              services,
              package: packageMatch ? packageMatch[1] : undefined,
              syntax: syntaxMatch ? `proto${syntaxMatch[1]}` : 'proto3'
            });
          }
        }
      }
    } catch (error) {
      // Handle errors
    }
    
    return grpcApis;
  }

  determineRecommendedButtons(apis: ApiDetectionResult): ApiButtonType[] {
    const buttons: ApiButtonType[] = [];
    
    if (apis.apis.rest.length > 0) {
      buttons.push('swagger');
    }
    if (apis.apis.graphql.length > 0) {
      buttons.push('graphql');
    }
    if (apis.apis.grpc.length > 0) {
      buttons.push('grpc');
    }
    if (apis.hasAnyApis) {
      buttons.push('postman');
    }
    
    return buttons;
  }

  getApiButtonConfiguration(
    detection: ApiDetectionResult,
    repoName: string
  ): ButtonConfiguration {
    const buttons: ApiButtonConfig[] = [];
    const recommendedButtons = this.determineRecommendedButtons(detection);
    
    const buttonConfigs: Record<ApiButtonType, ApiButtonConfig> = {
      swagger: {
        type: 'swagger',
        label: `Swagger UI (${detection.apis.rest.length} APIs)`,
        icon: '📘',
        color: 'bg-green-600',
        url: `/swagger/${repoName}`,
        description: 'Explore REST/OpenAPI specifications'
      },
      graphql: {
        type: 'graphql',
        label: `GraphQL Playground (${detection.apis.graphql.length} schemas)`,
        icon: '🔮',
        color: 'bg-pink-600',
        url: `/graphql/${repoName}`,
        description: 'Interactive GraphQL IDE'
      },
      grpc: {
        type: 'grpc',
        label: `gRPC UI (${detection.apis.grpc.length} services)`,
        icon: '🔌',
        color: 'bg-purple-600',
        url: `/grpc/${repoName}`,
        description: 'gRPC service explorer'
      },
      postman: {
        type: 'postman',
        label: `Postman Collection (${detection.apis.rest.length + detection.apis.graphql.length + detection.apis.grpc.length} APIs)`,
        icon: '📮',
        color: 'bg-orange-600',
        url: `/postman/${repoName}`,
        description: 'Download Postman collection'
      }
    };
    
    for (const buttonType of recommendedButtons) {
      if (buttonConfigs[buttonType]) {
        buttons.push(buttonConfigs[buttonType]);
      }
    }
    
    return {
      repository: repoName,
      hasApis: detection.hasAnyApis,
      buttons,
      summary: {
        rest: detection.apis.rest.length,
        graphql: detection.apis.graphql.length,
        grpc: detection.apis.grpc.length,
        total: detection.apis.rest.length + detection.apis.graphql.length + detection.apis.grpc.length
      }
    };
  }

  private async getFilesRecursively(dir: string, basePath: string = ''): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await this.getFilesRecursively(fullPath, relativePath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          files.push(relativePath);
        }
      }
    } catch (error) {
      // Handle errors
    }
    
    return files;
  }
}