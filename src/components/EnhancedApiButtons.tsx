/**
 * Enhanced API Buttons Component
 * 
 * Displays API exploration buttons with links to the new unified API Explorer
 * and enhanced API testing capabilities.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  Globe, 
  FileCode, 
  Database, 
  Zap, 
  Mail, 
  BookOpen,
  Play,
  TestTube,
  Rocket
} from 'lucide-react';
import { ApiDetectionResult } from '../services/dynamicApiDetection';
import { theme } from '../styles/design-system';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Flex,
  Grid,
  Text
} from './styled';

interface EnhancedApiButtonsProps {
  repositoryName: string;
  className?: string;
}

const ApiButtonCard = styled(Card)<{ color?: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${props => props.color || theme.colors.primary.yellow};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const IconWrapper = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.color ? `${props.color}20` : 'rgba(255, 230, 0, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[3]};
  
  svg {
    color: ${props => props.color || theme.colors.primary.yellow};
  }
`;

const ApiCount = styled(Badge)`
  margin-left: ${props => props.theme.spacing[2]};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[8]};
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid ${props => props.theme.colors.border.light};
    border-top-color: ${props => props.theme.colors.primary.yellow};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  margin: ${props => props.theme.spacing[4]} 0;
`;

const NoApisContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px dashed ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[8]};
  text-align: center;
  margin: ${props => props.theme.spacing[4]} 0;
`;

const SummarySection = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};
`;

export const EnhancedApiButtons: React.FC<EnhancedApiButtonsProps> = ({
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
      const response = await fetch(getApiUrl(`/api/detect-apis/${repositoryName}`));
      if (!response.ok) {
        throw new Error('Failed to detect APIs');
      }
      const result = await response.json();
      setApiDetection(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect APIs');
      console.error('API detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer className={className}>
        <div className="spinner" />
        <Text color="secondary" style={{ marginLeft: theme.spacing[3] }}>
          Detecting available APIs...
        </Text>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer className={className}>
        <Flex align="center" gap={2}>
          <span>⚠️</span>
          <Text color="secondary">Error detecting APIs: {error}</Text>
        </Flex>
        <Button
          size="sm"
          variant="outline"
          onClick={detectApis}
          style={{ marginTop: theme.spacing[3] }}
        >
          Retry
        </Button>
      </ErrorContainer>
    );
  }

  if (!apiDetection || !apiDetection.hasAnyApis) {
    return (
      <NoApisContainer className={className}>
        <BookOpen size={48} color={theme.colors.text.secondary} />
        <Text size="large" color="secondary" style={{ marginTop: theme.spacing[3] }}>
          Documentation-focused repository
        </Text>
        <Text size="small" color="secondary" style={{ marginTop: theme.spacing[1] }}>
          No API specifications detected
        </Text>
      </NoApisContainer>
    );
  }

  const { apis } = apiDetection;
  const totalApis = apis.rest.length + apis.graphql.length + apis.grpc.length;

  return (
    <div className={className}>
      <Flex align="center" justify="between" style={{ marginBottom: theme.spacing[6] }}>
        <div>
          <Text size="large" weight="semibold">API Tools & Documentation</Text>
          <Text color="secondary" size="small">
            {totalApis} API{totalApis !== 1 ? 's' : ''} detected across REST, GraphQL, and gRPC
          </Text>
        </div>
        <Button
          as={Link}
          to={`/api-explorer-v2/${repositoryName}`}
          variant="primary"
        >
          <Rocket size={20} />
          Open Unified Explorer
        </Button>
      </Flex>

      <Grid columns={3} gap="large">
        {/* Unified API Explorer */}
        <ApiButtonCard
          as={Link}
          to={`/api-explorer-v2/${repositoryName}`}
          color={theme.colors.primary.yellow}
        >
          <CardContent>
            <IconWrapper color={theme.colors.primary.yellow}>
              <Rocket size={24} />
            </IconWrapper>
            <CardTitle>
              Unified API Explorer
              <ApiCount size="sm" variant="warning">{totalApis}</ApiCount>
            </CardTitle>
            <CardDescription>
              Explore all APIs in one place with interactive testing
            </CardDescription>
          </CardContent>
        </ApiButtonCard>

        {/* OpenAPI/Swagger */}
        {apis.rest.length > 0 && (
          <ApiButtonCard
            as={Link}
            to={`/api-viewer/${repositoryName}?file=${encodeURIComponent(apis.rest[0].file)}`}
            color="#FF6B6B"
          >
            <CardContent>
              <IconWrapper color="#FF6B6B">
                <FileCode size={24} />
              </IconWrapper>
              <CardTitle>
                Swagger UI
                <ApiCount size="sm" variant="danger">{apis.rest.length}</ApiCount>
              </CardTitle>
              <CardDescription>
                Interactive REST API documentation with Try it out
              </CardDescription>
            </CardContent>
          </ApiButtonCard>
        )}

        {/* GraphQL Playground */}
        {apis.graphql.length > 0 && (
          <ApiButtonCard
            as={Link}
            to={`/graphql-enhanced/${repositoryName}?schema=${encodeURIComponent(apis.graphql[0].file)}`}
            color="#E90C59"
          >
            <CardContent>
              <IconWrapper color="#E90C59">
                <Database size={24} />
              </IconWrapper>
              <CardTitle>
                GraphQL Playground
                <ApiCount size="sm" style={{ background: '#E90C59' }}>{apis.graphql.length}</ApiCount>
              </CardTitle>
              <CardDescription>
                Interactive GraphQL IDE with query execution
              </CardDescription>
            </CardContent>
          </ApiButtonCard>
        )}

        {/* gRPC Explorer */}
        {apis.grpc.length > 0 && (
          <ApiButtonCard
            as={Link}
            to={`/grpc-explorer/${repositoryName}?proto=${encodeURIComponent(apis.grpc[0].file)}`}
            color="#00A67E"
          >
            <CardContent>
              <IconWrapper color="#00A67E">
                <Zap size={24} />
              </IconWrapper>
              <CardTitle>
                gRPC Explorer
                <ApiCount size="sm" style={{ background: '#00A67E' }}>{apis.grpc.length}</ApiCount>
              </CardTitle>
              <CardDescription>
                Test gRPC services with method discovery
              </CardDescription>
            </CardContent>
          </ApiButtonCard>
        )}

        {/* Postman Collection Runner */}
        <ApiButtonCard
          as={Link}
          to={`/postman-runner/${repositoryName}`}
          color="#FF6500"
        >
          <CardContent>
            <IconWrapper color="#FF6500">
              <Play size={24} />
            </IconWrapper>
            <CardTitle>
              Postman Runner
              <Badge size="sm" style={{ background: '#FF6500', marginLeft: theme.spacing[2] }}>
                New
              </Badge>
            </CardTitle>
            <CardDescription>
              Run collections with automated testing
            </CardDescription>
          </CardContent>
        </ApiButtonCard>

        {/* API Documentation Hub */}
        <ApiButtonCard
          as={Link}
          to={`/api-hub/${repositoryName}`}
          color={theme.colors.accent.purple}
        >
          <CardContent>
            <IconWrapper color={theme.colors.accent.purple}>
              <BookOpen size={24} />
            </IconWrapper>
            <CardTitle>
              API Documentation Hub
            </CardTitle>
            <CardDescription>
              Comprehensive API reference and guides
            </CardDescription>
          </CardContent>
        </ApiButtonCard>
      </Grid>

      {/* API Summary */}
      <SummarySection>
        <Text weight="semibold" style={{ marginBottom: theme.spacing[3] }}>
          API Summary
        </Text>
        <Grid columns={3} gap="medium">
          {apis.rest.length > 0 && (
            <div>
              <Text size="small" weight="medium" color="secondary">REST APIs ({apis.rest.length})</Text>
              {apis.rest.slice(0, 3).map((api, index) => (
                <Text key={index} size="small" style={{ marginTop: theme.spacing[1] }}>
                  • {api.title || api.file.split('/').pop()?.replace(/\.(yaml|yml|json)$/i, '')}
                </Text>
              ))}
              {apis.rest.length > 3 && (
                <Text size="small" color="secondary" style={{ marginTop: theme.spacing[1] }}>
                  and {apis.rest.length - 3} more...
                </Text>
              )}
            </div>
          )}
          
          {apis.graphql.length > 0 && (
            <div>
              <Text size="small" weight="medium" color="secondary">GraphQL Schemas ({apis.graphql.length})</Text>
              {apis.graphql.slice(0, 3).map((api, index) => (
                <Text key={index} size="small" style={{ marginTop: theme.spacing[1] }}>
                  • {api.file.split('/').pop()?.replace(/\.(graphql|gql)$/i, '')}
                </Text>
              ))}
              {apis.graphql.length > 3 && (
                <Text size="small" color="secondary" style={{ marginTop: theme.spacing[1] }}>
                  and {apis.graphql.length - 3} more...
                </Text>
              )}
            </div>
          )}
          
          {apis.grpc.length > 0 && (
            <div>
              <Text size="small" weight="medium" color="secondary">gRPC Services ({apis.grpc.length})</Text>
              {apis.grpc.slice(0, 3).map((api, index) => (
                <Text key={index} size="small" style={{ marginTop: theme.spacing[1] }}>
                  • {api.services.join(', ') || api.file.split('/').pop()?.replace(/\.proto$/i, '')}
                </Text>
              ))}
              {apis.grpc.length > 3 && (
                <Text size="small" color="secondary" style={{ marginTop: theme.spacing[1] }}>
                  and {apis.grpc.length - 3} more...
                </Text>
              )}
            </div>
          )}
        </Grid>
      </SummarySection>
    </div>
  );
};

export default EnhancedApiButtons;