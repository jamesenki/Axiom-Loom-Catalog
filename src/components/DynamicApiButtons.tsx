/**
 * Dynamic API Buttons Component
 * 
 * Displays API exploration buttons based on detected API types in repositories.
 * Shows only relevant buttons: Swagger UI, GraphQL Playground, gRPC UI, Postman Collections.
 */

import React, { useState, useEffect } from 'react';
import { detectRepositoryApis, ApiDetectionResult, ApiButtonType } from '../services/dynamicApiDetection';

interface DynamicApiButtonsProps {
  repositoryName: string;
  className?: string;
}

interface ApiButtonConfig {
  type: ApiButtonType;
  label: string;
  icon: string;
  color: string;
  description: string;
  onClick: () => void;
}

export const DynamicApiButtons: React.FC<DynamicApiButtonsProps> = ({
  repositoryName,
  className = ''
}) => {
  const [apiDetection, setApiDetection] = useState<ApiDetectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectApis();
  }, [repositoryName]);

  const detectApis = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await detectRepositoryApis(repositoryName);
      setApiDetection(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect APIs');
      console.error('API detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwaggerClick = () => {
    // Navigate to Swagger UI for this repository
    window.open(`/swagger/${repositoryName}`, '_blank');
  };

  const handleGraphqlClick = () => {
    // Navigate to GraphQL Playground for this repository
    window.open(`/graphql/${repositoryName}`, '_blank');
  };

  const handleGrpcClick = () => {
    // Navigate to gRPC UI for this repository
    window.open(`/grpc/${repositoryName}`, '_blank');
  };

  const handlePostmanClick = () => {
    // Download or view Postman collection for this repository
    window.open(`/api/postman/${repositoryName}`, '_blank');
  };

  const getButtonConfigs = (): ApiButtonConfig[] => {
    if (!apiDetection) return [];

    const configs: ApiButtonConfig[] = [];

    apiDetection.recommendedButtons.forEach(buttonType => {
      switch (buttonType) {
        case 'swagger':
          configs.push({
            type: 'swagger',
            label: `Swagger UI (${apiDetection.apis.rest.length} APIs)`,
            icon: '📋',
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Explore REST/OpenAPI specifications',
            onClick: handleSwaggerClick
          });
          break;

        case 'graphql':
          configs.push({
            type: 'graphql',
            label: `GraphQL Playground (${apiDetection.apis.graphql.length} schemas)`,
            icon: '🔮',
            color: 'bg-pink-500 hover:bg-pink-600',
            description: 'Explore GraphQL schemas and run queries',
            onClick: handleGraphqlClick
          });
          break;

        case 'grpc':
          configs.push({
            type: 'grpc',
            label: `gRPC UI (${apiDetection.apis.grpc.length} services)`,
            icon: '⚡',
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Explore gRPC service definitions',
            onClick: handleGrpcClick
          });
          break;

        case 'postman':
          const totalApis = apiDetection.apis.rest.length + 
                           apiDetection.apis.graphql.length + 
                           apiDetection.apis.grpc.length;
          configs.push({
            type: 'postman',
            label: `Postman Collection (${totalApis} APIs)`,
            icon: '📮',
            color: 'bg-orange-500 hover:bg-orange-600',
            description: 'Download Postman collection for API testing',
            onClick: handlePostmanClick
          });
          break;
      }
    });

    return configs;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Detecting APIs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠️</span>
          <span className="text-red-700">Error detecting APIs: {error}</span>
        </div>
        <button
          onClick={detectApis}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!apiDetection || !apiDetection.hasAnyApis) {
    return (
      <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📚</span>
          <span>Documentation-focused repository (no API specifications detected)</span>
        </div>
      </div>
    );
  }

  const buttonConfigs = getButtonConfigs();

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center mb-3">
        <span className="text-sm font-medium text-gray-700 mr-2">API Tools:</span>
        <span className="text-xs text-gray-500">
          {apiDetection.apis.rest.length} REST • {apiDetection.apis.graphql.length} GraphQL • {apiDetection.apis.grpc.length} gRPC
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {buttonConfigs.map((config) => (
          <button
            key={config.type}
            onClick={config.onClick}
            className={`
              flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium
              transition-colors duration-200 shadow-sm hover:shadow-md
              ${config.color}
            `}
            title={config.description}
            data-testid={`${config.type}-button`}
          >
            <span className="mr-2 text-lg">{config.icon}</span>
            <span className="text-sm">{config.label}</span>
          </button>
        ))}
      </div>

      {/* API Summary */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">API Summary</h4>
        <div className="space-y-1 text-xs text-blue-700">
          {apiDetection.apis.rest.length > 0 && (
            <div>
              <strong>REST APIs ({apiDetection.apis.rest.length}):</strong>{' '}
              {apiDetection.apis.rest.slice(0, 3).map(api => api.title || path.basename(api.file)).join(', ')}
              {apiDetection.apis.rest.length > 3 && ` and ${apiDetection.apis.rest.length - 3} more`}
            </div>
          )}
          {apiDetection.apis.graphql.length > 0 && (
            <div>
              <strong>GraphQL Schemas ({apiDetection.apis.graphql.length}):</strong>{' '}
              {apiDetection.apis.graphql.slice(0, 3).map(api => path.basename(api.file)).join(', ')}
              {apiDetection.apis.graphql.length > 3 && ` and ${apiDetection.apis.graphql.length - 3} more`}
            </div>
          )}
          {apiDetection.apis.grpc.length > 0 && (
            <div>
              <strong>gRPC Services ({apiDetection.apis.grpc.length}):</strong>{' '}
              {apiDetection.apis.grpc.slice(0, 3).map(api => api.services.join(', ')).join(', ')}
              {apiDetection.apis.grpc.length > 3 && ` and ${apiDetection.apis.grpc.length - 3} more`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicApiButtons;
