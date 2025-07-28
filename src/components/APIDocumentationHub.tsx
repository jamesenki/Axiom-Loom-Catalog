import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiDetectionResult } from '../services/dynamicApiDetection';

interface ApiEndpoint {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters?: any[];
  responses?: any;
}

interface ApiSpec {
  type: 'rest' | 'graphql' | 'grpc';
  file: string;
  title: string;
  version?: string;
  description?: string;
  endpoints?: ApiEndpoint[];
  schema?: string;
  services?: any[];
}

const APIDocumentationHub: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiSpecs, setApiSpecs] = useState<ApiSpec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<ApiSpec | null>(null);
  const [apiDetection, setApiDetection] = useState<ApiDetectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'explorer' | 'postman' | 'graphql'>('overview');

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        
        // Fetch API detection results
        const detectionResponse = await fetch(`/api/repository/${repoName}/apis`);
        if (!detectionResponse.ok) {
          throw new Error('Failed to detect APIs');
        }
        const detection = await detectionResponse.json();
        setApiDetection(detection);

        // Convert detection results to specs
        const specs: ApiSpec[] = [];
        
        // Process REST APIs
        if (detection.restApis) {
          detection.restApis.forEach((api: any) => {
            specs.push({
              type: 'rest',
              file: api.file,
              title: api.title || 'REST API',
              version: api.version,
              description: api.description
            });
          });
        }

        // Process GraphQL APIs
        if (detection.graphqlApis) {
          detection.graphqlApis.forEach((api: any) => {
            specs.push({
              type: 'graphql',
              file: api.file,
              title: 'GraphQL API',
              schema: api.schema
            });
          });
        }

        // Process gRPC APIs
        if (detection.grpcApis) {
          detection.grpcApis.forEach((api: any) => {
            specs.push({
              type: 'grpc',
              file: api.file,
              title: api.serviceName || 'gRPC Service',
              services: api.services
            });
          });
        }

        setApiSpecs(specs);
        if (specs.length > 0) {
          setSelectedSpec(specs[0]);
        }
      } catch (err) {
        console.error('Error fetching API data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [repoName]);

  const getApiTypeIcon = (type: string) => {
    switch (type) {
      case 'rest': return '🔌';
      case 'graphql': return '🔍';
      case 'grpc': return '⚡';
      default: return '📡';
    }
  };

  const getApiTypeColor = (type: string) => {
    switch (type) {
      case 'rest': return 'text-blue-400';
      case 'graphql': return 'text-pink-400';
      case 'grpc': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">REST APIs</h3>
            <span className="text-3xl">🔌</span>
          </div>
          <p className="text-3xl font-bold text-blue-400">
            {apiDetection?.restApis?.length || 0}
          </p>
          <p className="text-gray-400 mt-2">OpenAPI/Swagger</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">GraphQL APIs</h3>
            <span className="text-3xl">🔍</span>
          </div>
          <p className="text-3xl font-bold text-pink-400">
            {apiDetection?.graphqlApis?.length || 0}
          </p>
          <p className="text-gray-400 mt-2">Schema definitions</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">gRPC Services</h3>
            <span className="text-3xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {apiDetection?.grpcApis?.length || 0}
          </p>
          <p className="text-gray-400 mt-2">Protocol buffers</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Available API Specifications</h3>
        <div className="space-y-3">
          {apiSpecs.map((spec, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedSpec === spec
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedSpec(spec)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${getApiTypeColor(spec.type)}`}>
                    {getApiTypeIcon(spec.type)}
                  </span>
                  <div>
                    <h4 className="text-white font-medium">{spec.title}</h4>
                    <p className="text-gray-400 text-sm">{spec.file}</p>
                  </div>
                </div>
                {spec.version && (
                  <span className="text-gray-400 text-sm">v{spec.version}</span>
                )}
              </div>
              {spec.description && (
                <p className="text-gray-400 text-sm mt-2">{spec.description}</p>
              )}
            </div>
          ))}
        </div>

        {apiSpecs.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No API specifications found in this repository
          </p>
        )}
      </div>
    </div>
  );

  const renderApiExplorer = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">API Explorer</h3>
      {selectedSpec ? (
        <div>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">{selectedSpec.title}</h4>
            <p className="text-gray-400">{selectedSpec.file}</p>
          </div>

          {selectedSpec.type === 'rest' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 mb-2">
                  This REST API specification can be explored using the integrated Swagger UI.
                </p>
                <Link
                  to={`/api-explorer/${repoName}?spec=${encodeURIComponent(selectedSpec.file)}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Open in API Explorer →
                </Link>
              </div>
            </div>
          )}

          {selectedSpec.type === 'graphql' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 mb-2">
                  Explore this GraphQL schema with the integrated GraphiQL interface.
                </p>
                <Link
                  to={`/graphql/${repoName}?schema=${encodeURIComponent(selectedSpec.file)}`}
                  className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white transition-colors"
                >
                  Open in GraphiQL →
                </Link>
              </div>
            </div>
          )}

          {selectedSpec.type === 'grpc' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">gRPC Services:</h5>
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  {JSON.stringify(selectedSpec.services, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          Select an API specification to explore
        </p>
      )}
    </div>
  );

  const renderPostmanCollections = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Postman Collections</h3>
      <div className="space-y-4">
        {apiDetection?.postmanCollections?.length > 0 ? (
          apiDetection.postmanCollections.map((collection: any, index: number) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{collection.name}</h4>
                  <p className="text-gray-400 text-sm">{collection.file}</p>
                </div>
                <Link
                  to={`/postman/${repoName}?collection=${encodeURIComponent(collection.file)}`}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            No Postman collections found in this repository
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading API documentation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error loading API documentation</h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="api-documentation-hub p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link to={`/repository/${repoName}`} className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to {repoName}
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4">📚 API Documentation Hub</h1>
        <p className="text-gray-300">
          Comprehensive API documentation and exploration for {repoName}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'explorer'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          API Explorer
        </button>
        <button
          onClick={() => setActiveTab('postman')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'postman'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Postman
        </button>
        <button
          onClick={() => setActiveTab('graphql')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'graphql'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          GraphQL
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'explorer' && renderApiExplorer()}
        {activeTab === 'postman' && renderPostmanCollections()}
        {activeTab === 'graphql' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">GraphQL APIs</h3>
            <div className="space-y-4">
              {apiDetection?.graphqlApis?.length > 0 ? (
                apiDetection.graphqlApis.map((api: any, index: number) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">GraphQL Schema</h4>
                        <p className="text-gray-400 text-sm">{api.file}</p>
                      </div>
                      <Link
                        to={`/graphql/${repoName}?schema=${encodeURIComponent(api.file)}`}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white transition-colors"
                      >
                        Open GraphiQL
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No GraphQL schemas found in this repository
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-3">ℹ️ API Documentation Features</h3>
        <ul className="text-blue-300 space-y-2 text-sm">
          <li>• Automatic detection of REST (OpenAPI/Swagger), GraphQL, and gRPC APIs</li>
          <li>• Interactive API Explorer for testing endpoints</li>
          <li>• Postman collection viewer for API testing workflows</li>
          <li>• GraphiQL interface for GraphQL schema exploration</li>
          <li>• Support for multiple API specifications per repository</li>
        </ul>
      </div>
    </div>
  );
};

export default APIDocumentationHub;