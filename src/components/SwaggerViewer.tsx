import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
// @ts-ignore - swagger-ui-react doesn't have TypeScript definitions
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import styled from 'styled-components';
import { ArrowLeft, FileCode, Download, ExternalLink } from 'lucide-react';
import { theme } from '../styles/design-system';
import { getApiUrl } from '../utils/apiConfig';
import {
  Container,
  Section,
  H1,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Flex,
  Badge,
  FullPageLoading
} from './styled';

const PageHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  padding: ${props => props.theme.spacing[12]} 0;
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const BackButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.yellow};
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const SwaggerContainer = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
  
  .swagger-ui {
    .topbar {
      display: none;
    }
    
    .info {
      margin-bottom: ${props => props.theme.spacing[8]};
      
      .title {
        color: ${props => props.theme.colors.primary.black};
        font-family: ${props => props.theme.typography.fontFamily.primary};
      }
    }
    
    .scheme-container {
      background: ${props => props.theme.colors.background.secondary};
      padding: ${props => props.theme.spacing[4]};
      border-radius: ${props => props.theme.borderRadius.md};
    }
    
    .btn {
      background: ${props => props.theme.colors.primary.yellow};
      color: ${props => props.theme.colors.primary.black};
      border: none;
      font-weight: ${props => props.theme.typography.fontWeight.semibold};
      
      &:hover {
        background: ${props => props.theme.colors.primary.black};
        color: ${props => props.theme.colors.primary.yellow};
      }
    }
    
    .opblock {
      border-radius: ${props => props.theme.borderRadius.md};
      margin-bottom: ${props => props.theme.spacing[4]};
      
      &.opblock-get {
        border-color: #61affe;
        
        .opblock-summary-method {
          background: #61affe;
        }
      }
      
      &.opblock-post {
        border-color: #49cc90;
        
        .opblock-summary-method {
          background: #49cc90;
        }
      }
      
      &.opblock-put {
        border-color: #fca130;
        
        .opblock-summary-method {
          background: #fca130;
        }
      }
      
      &.opblock-delete {
        border-color: #f93e3e;
        
        .opblock-summary-method {
          background: #f93e3e;
        }
      }
    }
  }
`;

const ApiInfo = styled(Card)`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const SwaggerViewer: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams] = useSearchParams();
  const filePath = searchParams.get('file');
  const [specUrl, setSpecUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiInfo, setApiInfo] = useState<any>(null);

  useEffect(() => {
    if (filePath) {
      fetchApiSpec();
    }
  }, [filePath, repoName]);

  const fetchApiSpec = async () => {
    try {
      // First, get the raw file content
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(filePath!)}`));
      if (!response.ok) {
        throw new Error('Failed to fetch API specification');
      }
      
      const content = await response.text();
      
      // Parse to extract basic info
      try {
        const spec = JSON.parse(content);
        setApiInfo({
          title: spec.info?.title || 'API Documentation',
          version: spec.info?.version || '1.0.0',
          description: spec.info?.description || '',
          servers: spec.servers || [],
          paths: Object.keys(spec.paths || {}).length
        });
      } catch (e) {
        // If it's YAML, we'll just display it as-is
      }
      
      // Create a blob URL for SwaggerUI
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setSpecUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup blob URL
    return () => {
      if (specUrl) {
        URL.revokeObjectURL(specUrl);
      }
    };
  }, [specUrl]);

  if (loading) {
    return <FullPageLoading text="Loading API specification..." />;
  }

  if (error || !specUrl) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">⚠️ Error Loading API</H1>
          <Text color="secondary">{error || 'No API specification provided'}</Text>
          <Button as={Link} to={`/api-explorer/${repoName}`}>
            Back to API Explorer
          </Button>
        </Section>
      </Container>
    );
  }

  return (
    <>
      <PageHeader>
        <Container maxWidth="lg">
          <BackButton as={Link} to={`/api-explorer/${repoName}`}>
            <ArrowLeft size={20} />
            Back to API Explorer
          </BackButton>
          
          <H1 style={{ color: theme.colors.primary.white, marginBottom: theme.spacing[4] }}>
            <FileCode size={32} style={{ marginRight: theme.spacing[3], verticalAlign: 'middle' }} />
            {apiInfo?.title || 'API Documentation'}
          </H1>
          
          {apiInfo && (
            <Flex gap={3} wrap>
              <Badge variant="success" size="lg">Version {apiInfo.version}</Badge>
              {apiInfo.paths > 0 && (
                <Badge size="lg">{apiInfo.paths} Endpoints</Badge>
              )}
              <Badge size="lg">OpenAPI</Badge>
            </Flex>
          )}
        </Container>
      </PageHeader>

      <Container maxWidth="xl">
        <Section spacing="large">
          {apiInfo && apiInfo.description && (
            <ApiInfo>
              <CardHeader>
                <CardTitle>About this API</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>{apiInfo.description}</Text>
              </CardContent>
            </ApiInfo>
          )}

          <Flex justify="end" gap={3} style={{ marginBottom: theme.spacing[4] }}>
            <Button
              as="a"
              href={`/api/repository/${repoName}/file?path=${encodeURIComponent(filePath!)}&download=true`}
              download
              variant="outline"
            >
              <Download size={20} />
              Download Spec
            </Button>
            <Button
              as="a"
              href={`https://editor.swagger.io/?url=${encodeURIComponent(window.location.origin + specUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <ExternalLink size={20} />
              Open in Swagger Editor
            </Button>
          </Flex>

          <SwaggerContainer>
            <SwaggerUI 
              url={specUrl}
              docExpansion="list"
              defaultModelsExpandDepth={1}
              displayRequestDuration={true}
              tryItOutEnabled={true}
            />
          </SwaggerContainer>
        </Section>
      </Container>
    </>
  );
};

export default SwaggerViewer;