import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Code, 
  GitBranch,
  Package,
  Calendar,
  Settings
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  H3,
  Text,
  Lead,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Flex,
  Grid,
  Badge,
  FullPageLoading
} from './styled';

interface RepositoryDetails {
  id: string;
  name: string;
  displayName: string;
  description: string;
  marketingDescription?: string;
  readme?: string;
  category: string;
  status: string;
  url?: string;
  demoUrl?: string | null;
  tags?: string[];
  metrics: {
    apiCount: number;
    postmanCollections?: number;
    lastUpdated: string;
  };
  apiTypes?: {
    hasOpenAPI: boolean;
    hasGraphQL: boolean;
    hasGrpc: boolean;
    hasPostman: boolean;
  };
  apis?: Array<{
    name: string;
    type: string;
    path: string;
  }>;
  postmanCollections?: Array<{
    name: string;
    path: string;
  }>;
}

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

const MetricCard = styled(Card)`
  text-align: center;
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
`;

const MetricValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary.black};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const MetricLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ApiList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

const ApiItem = styled(Card)`
  padding: ${props => props.theme.spacing[4]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid ${props => props.theme.colors.primary.yellow};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ReadmeContent = styled.div`
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: ${props => props.theme.spacing[6]};
    margin-bottom: ${props => props.theme.spacing[4]};
  }
  
  code {
    background: ${props => props.theme.colors.background.tertiary};
    padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Consolas', 'Monaco', monospace;
  }
  
  pre {
    background: ${props => props.theme.colors.background.tertiary};
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
  }
`;

const RepositoryDetail: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [repository, setRepository] = useState<RepositoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/repository/${repoName}/details`));
        if (!response.ok) {
          throw new Error('Failed to fetch repository details');
        }
        const data = await response.json();
        setRepository(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositoryDetails();
  }, [repoName]);

  if (loading) {
    return <FullPageLoading text="Loading repository details..." />;
  }

  if (error || !repository) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">⚠️ Error Loading Repository</H1>
          <Text color="secondary">{error || 'Repository not found'}</Text>
          <Button as={Link} to="/">
            Return to Home
          </Button>
        </Section>
      </Container>
    );
  }

  return (
    <>
      <PageHeader>
        <Container maxWidth="lg">
          <BackButton as={Link} to="/">
            <ArrowLeft size={20} />
            Back to Repositories
          </BackButton>
          
          <H1 style={{ color: theme.colors.primary.white, marginBottom: theme.spacing[4] }}>
            {repository.displayName}
          </H1>
          
          <Lead style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: theme.spacing[6] }}>
            {repository.marketingDescription || repository.description}
          </Lead>
          
          <Flex gap={3}>
            <Badge variant="success">{repository.status}</Badge>
            <Badge variant="secondary">{repository.category}</Badge>
            {repository.apiTypes?.hasOpenAPI && <Badge>OpenAPI</Badge>}
            {repository.apiTypes?.hasGraphQL && <Badge>GraphQL</Badge>}
            {repository.apiTypes?.hasGrpc && <Badge>gRPC</Badge>}
          </Flex>
        </Container>
      </PageHeader>

      <Container maxWidth="lg">
        <Section spacing="large">
          {/* Metrics Overview */}
          <Grid columns={4} gap="medium">
            <MetricCard>
              <CardContent>
                <MetricValue>{repository.metrics.apiCount}</MetricValue>
                <MetricLabel>Total APIs</MetricLabel>
              </CardContent>
            </MetricCard>
            
            {repository.metrics.postmanCollections && (
              <MetricCard>
                <CardContent>
                  <MetricValue>{repository.metrics.postmanCollections}</MetricValue>
                  <MetricLabel>Postman Collections</MetricLabel>
                </CardContent>
              </MetricCard>
            )}
            
            <MetricCard>
              <CardContent>
                <MetricValue>
                  <Calendar size={32} />
                </MetricValue>
                <MetricLabel>
                  Updated {new Date(repository.metrics.lastUpdated).toLocaleDateString()}
                </MetricLabel>
              </CardContent>
            </MetricCard>
          </Grid>

          {/* Quick Actions */}
          <Card style={{ marginTop: theme.spacing[8] }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex gap={3} wrap>
                <Button
                  as={Link}
                  to={`/docs/${repository.name}`}
                  variant="primary"
                >
                  <BookOpen size={20} />
                  View Documentation
                </Button>
                
                <Button
                  as={Link}
                  to={`/api-explorer/${repository.name}`}
                  variant="secondary"
                >
                  <Settings size={20} />
                  Explore APIs
                </Button>
                
                {repository.apiTypes?.hasPostman && (
                  <Button
                    as={Link}
                    to={`/postman/${repository.name}`}
                    variant="outline"
                  >
                    <FileText size={20} />
                    Postman Collections
                  </Button>
                )}
                
                {repository.apiTypes?.hasGrpc && (
                  <Button
                    as={Link}
                    to={`/grpc-playground/${repository.name}`}
                    variant="outline"
                  >
                    <Code size={20} />
                    gRPC Playground
                  </Button>
                )}
                
                <Button
                  as="a"
                  href={repository.url || `https://github.com/jamesenki/${repository.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  <GitBranch size={20} />
                  View on GitHub
                </Button>
                
                {repository.demoUrl && (
                  <Button
                    as="a"
                    href={repository.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    <ExternalLink size={20} />
                    View Demo
                  </Button>
                )}
              </Flex>
            </CardContent>
          </Card>

          {/* API List */}
          {repository.apis && repository.apis.length > 0 && (
            <Card style={{ marginTop: theme.spacing[8] }}>
              <CardHeader>
                <CardTitle>Available APIs</CardTitle>
                <CardDescription>
                  {repository.apis.length} API{repository.apis.length !== 1 ? 's' : ''} available in this repository
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiList>
                  {repository.apis.map((api, index) => (
                    <ApiItem key={index}>
                      <Flex align="center" gap={3}>
                        <Package size={24} color={theme.colors.primary.yellow} />
                        <div>
                          <Text weight="semibold">{api.name}</Text>
                          <Text color="secondary" style={{ fontSize: theme.typography.fontSize.sm }}>{api.path}</Text>
                        </div>
                      </Flex>
                      <Badge>{api.type}</Badge>
                    </ApiItem>
                  ))}
                </ApiList>
              </CardContent>
            </Card>
          )}

          {/* README Content */}
          {repository.readme && (
            <Card style={{ marginTop: theme.spacing[8] }}>
              <CardHeader>
                <CardTitle>README</CardTitle>
              </CardHeader>
              <CardContent>
                <ReadmeContent dangerouslySetInnerHTML={{ __html: repository.readme }} />
              </CardContent>
            </Card>
          )}
        </Section>
      </Container>
    </>
  );
};

export default RepositoryDetail;