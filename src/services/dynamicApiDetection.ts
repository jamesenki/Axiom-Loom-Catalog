/**
 * Dynamic API Detection Service (Client-side types)
 * 
 * Type definitions for API detection used by client components
 */

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