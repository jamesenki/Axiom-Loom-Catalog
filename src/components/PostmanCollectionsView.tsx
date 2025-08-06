import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  ExternalLink,
  Play,
  Code,
  Copy,
  Check
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
  Badge,
  FullPageLoading
} from './styled';

interface PostmanCollection {
  name: string;
  path: string;
  info?: {
    name: string;
    description?: string;
    schema: string;
  };
  item?: Array<{
    name: string;
    request?: {
      method: string;
      url: {
        raw: string;
        host?: string[];
        path?: string[];
      };
      description?: string;
    };
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

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const CollectionCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const EndpointList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`;

const EndpointItem = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 3px solid ${props => props.theme.colors.primary.yellow};
`;

const MethodBadge = styled(Badge)<{ method: string }>`
  background: ${props => {
    switch (props.method) {
      case 'GET': return '#4CAF50';
      case 'POST': return '#2196F3';
      case 'PUT': return '#FF9800';
      case 'DELETE': return '#F44336';
      case 'PATCH': return '#9C27B0';
      default: return theme.colors.secondary.darkGray;
    }
  }};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-right: ${props => props.theme.spacing[3]};
`;

const ImportButton = styled(Button)`
  background: #FF6C37;
  color: white;
  
  &:hover {
    background: #E55A2B;
  }
`;

const CodeBlock = styled.pre`
  background: ${props => props.theme.colors.background.tertiary};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: ${props => props.theme.typography.fontSize.sm};
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing[2]};
  right: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  border: none;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.xs};
  
  &:hover {
    opacity: 0.9;
  }
`;

const PostmanCollectionsView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [collections, setCollections] = useState<PostmanCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<PostmanCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, [repoName]);

  const fetchCollections = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/postman-collections`));
      if (!response.ok) {
        throw new Error('Failed to fetch Postman collections');
      }
      const data = await response.json();
      setCollections(data);
      
      // Load first collection by default
      if (data.length > 0) {
        loadCollection(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = async (collection: { name: string; path: string }) => {
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(collection.path)}`));
      if (!response.ok) {
        throw new Error('Failed to load collection');
      }
      const content = await response.json();
      setSelectedCollection({ ...collection, ...content });
    } catch (err) {
      console.error('Error loading collection:', err);
    }
  };

  const copyToClipboard = (text: string, url?: string) => {
    navigator.clipboard.writeText(text);
    if (url) {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const getPostmanImportUrl = (collection: PostmanCollection) => {
    // Generate a public URL for the collection
    return `https://raw.githubusercontent.com/EYGS/${repoName}/main/${collection.path}`;
  };

  if (loading) {
    return <FullPageLoading text="Loading Postman collections..." />;
  }

  if (error || collections.length === 0) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">📮 No Postman Collections Found</H1>
          <Text color="secondary">
            {error || 'This repository does not have any Postman collections.'}
          </Text>
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
          <BackButton as={Link} to={`/repository/${repoName}`}>
            <ArrowLeft size={20} />
            Back to Repository
          </BackButton>
          
          <H1 style={{ color: theme.colors.primary.white, marginBottom: theme.spacing[4] }}>
            📮 Postman Collections: {repoName}
          </H1>
          
          <Lead style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {collections.length} collection{collections.length !== 1 ? 's' : ''} available
          </Lead>
        </Container>
      </PageHeader>

      <Container maxWidth="lg">
        <Section spacing="large">
          {/* Collections Grid */}
          <CollectionGrid>
            {collections.map((collection, index) => (
              <CollectionCard 
                key={index}
                onClick={() => loadCollection(collection)}
                elevated={selectedCollection?.path === collection.path}
              >
                <CardHeader>
                  <CardTitle>
                    <FileText size={20} style={{ marginRight: theme.spacing[2] }} />
                    {collection.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{collection.path}</CardDescription>
                  <Flex gap={2} style={{ marginTop: theme.spacing[3] }}>
                    <ImportButton
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://app.getpostman.com/run-collection/${getPostmanImportUrl(collection)}`, '_blank');
                      }}
                    >
                      <Play size={16} />
                      Run in Postman
                    </ImportButton>
                    <Button
                      size="sm"
                      variant="outline"
                      as="a"
                      href={`/api/repository/${repoName}/file?path=${encodeURIComponent(collection.path)}&download=true`}
                      download
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </Flex>
                </CardContent>
              </CollectionCard>
            ))}
          </CollectionGrid>

          {/* Selected Collection Details */}
          {selectedCollection && selectedCollection.info && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedCollection.info.name}</CardTitle>
                {selectedCollection.info.description && (
                  <CardDescription>{selectedCollection.info.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Import Instructions */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <H3>Import to Postman</H3>
                  <Text color="secondary" style={{ marginBottom: theme.spacing[3] }}>
                    Copy this URL and import it in Postman:
                  </Text>
                  <CodeBlock>
                    {getPostmanImportUrl(selectedCollection)}
                    <CopyButton
                      onClick={() => copyToClipboard(getPostmanImportUrl(selectedCollection), selectedCollection.path)}
                    >
                      {copiedUrl === selectedCollection.path ? (
                        <>
                          <Check size={14} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </CopyButton>
                  </CodeBlock>
                </div>

                {/* Endpoints List */}
                {selectedCollection.item && selectedCollection.item.length > 0 && (
                  <div>
                    <H3>Endpoints ({selectedCollection.item.length})</H3>
                    <EndpointList>
                      {selectedCollection.item.map((endpoint, index) => (
                        <EndpointItem key={index}>
                          <Flex align="center" justify="between">
                            <div>
                              <Flex align="center">
                                {endpoint.request && (
                                  <MethodBadge method={endpoint.request.method}>
                                    {endpoint.request.method}
                                  </MethodBadge>
                                )}
                                <Text weight="semibold">{endpoint.name}</Text>
                              </Flex>
                              {endpoint.request?.url && (
                                <Text color="secondary" style={{ marginTop: theme.spacing[1], fontSize: theme.typography.fontSize.sm }}>
                                  {endpoint.request.url.raw}
                                </Text>
                              )}
                              {endpoint.request?.description && (
                                <Text style={{ marginTop: theme.spacing[2], fontSize: theme.typography.fontSize.sm }}>
                                  {endpoint.request.description}
                                </Text>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Open in API explorer
                                window.location.href = `/api-explorer/${repoName}?endpoint=${encodeURIComponent(endpoint.name)}`;
                              }}
                            >
                              <Code size={16} />
                              Explore
                            </Button>
                          </Flex>
                        </EndpointItem>
                      ))}
                    </EndpointList>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </Section>
      </Container>
    </>
  );
};

export default PostmanCollectionsView;