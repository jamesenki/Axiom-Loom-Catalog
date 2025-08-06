import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  Copy,
  ExternalLink,
  Code,
  CheckCircle
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  H3,
  Text,
  Button,
  Card,
  CardContent,
  Flex,
  FullPageLoading
} from './styled';

interface PostmanCollection {
  name: string;
  path: string;
  info?: {
    name: string;
    description: string;
    schema: string;
  };
  item?: Array<{
    name: string;
    request?: any;
    item?: any[];
  }>;
}

const PageContainer = styled.div`
  background: ${props => props.theme.colors.background.primary};
  min-height: 100vh;
`;

const CollectionHeader = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[8]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const CollectionTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
`;

const CollectionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

const ImportSection = styled(Card)`
  margin-top: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
`;

const ImportTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
`;

const ImportInstructions = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing[3]};
`;

const UrlContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[3]};
  padding-right: ${props => props.theme.spacing[12]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  word-break: break-all;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const CopyButton = styled(Button)`
  position: absolute;
  right: ${props => props.theme.spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    background: ${props => props.theme.colors.primary.black};
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

const EndpointsSection = styled.div`
  margin-top: ${props => props.theme.spacing[8]};
`;

const EndpointsTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`;

const EndpointItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[3]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateX(2px);
  }
`;

const EndpointName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ExploreButton = styled(Button)`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary.black};
  color: ${props => props.theme.colors.primary.black};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &:hover {
    background: ${props => props.theme.colors.primary.black};
    color: ${props => props.theme.colors.primary.white};
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.yellow};
  margin-bottom: ${props => props.theme.spacing[6]};
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const PostmanCollectionView: React.FC = () => {
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
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
      
      // Load the first collection by default
      if (data.length > 0) {
        loadCollection(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = async (collection: PostmanCollection) => {
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(collection.path)}`));
      if (!response.ok) throw new Error('Failed to load collection');
      
      const content = await response.json();
      setSelectedCollection({
        ...collection,
        ...content
      });
    } catch (err) {
      console.error('Error loading collection:', err);
      // Use basic info if can't load full content
      setSelectedCollection(collection);
    }
  };

  const getPostmanImportUrl = (collection: PostmanCollection) => {
    return `${window.location.origin}/api/repository/${repoName}/file?path=${encodeURIComponent(collection.path)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getEndpoints = (collection: PostmanCollection): string[] => {
    const endpoints: string[] = [];
    
    const extractEndpoints = (items: any[]) => {
      items?.forEach(item => {
        if (item.request) {
          endpoints.push(item.name);
        }
        if (item.item && Array.isArray(item.item)) {
          extractEndpoints(item.item);
        }
      });
    };
    
    if (collection.item) {
      extractEndpoints(collection.item);
    }
    
    return endpoints;
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

  const currentCollection = selectedCollection || collections[0];
  const importUrl = getPostmanImportUrl(currentCollection);
  const endpoints = getEndpoints(currentCollection);

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Section spacing="large">
          <BackButton as={Link} to={`/repository/${repoName}`}>
            <ArrowLeft size={20} />
            Back to Repository
          </BackButton>

          {collections.length > 1 && (
            <Flex gap={2} style={{ marginBottom: theme.spacing[6] }}>
              {collections.map((collection, index) => (
                <Button
                  key={index}
                  variant={currentCollection.path === collection.path ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => loadCollection(collection)}
                >
                  {collection.name}
                </Button>
              ))}
            </Flex>
          )}
        </Section>
      </Container>

      <CollectionHeader>
        <Container maxWidth="lg">
          <CollectionTitle>
            {currentCollection.info?.name || currentCollection.name}
          </CollectionTitle>
          <CollectionDescription>
            {currentCollection.info?.description || 
             `API collection for ${repoName} containing ${endpoints.length} endpoints with full test coverage and mock responses.`}
          </CollectionDescription>
        </Container>
      </CollectionHeader>

      <Container maxWidth="lg">
        <Section spacing="large">
          <ImportSection>
            <CardContent>
              <ImportTitle>Import to Postman</ImportTitle>
              <ImportInstructions>
                Copy this URL and import it in Postman:
              </ImportInstructions>
              <UrlContainer>
                {importUrl}
                <CopyButton
                  onClick={() => copyToClipboard(importUrl)}
                  size="sm"
                >
                  {copiedUrl === importUrl ? (
                    <>
                      <CheckCircle size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </CopyButton>
              </UrlContainer>
            </CardContent>
          </ImportSection>

          <EndpointsSection>
            <EndpointsTitle>
              Endpoints ({endpoints.length})
            </EndpointsTitle>
            
            {endpoints.length > 0 ? (
              endpoints.map((endpoint, index) => (
                <EndpointItem key={index}>
                  <EndpointName>{endpoint}</EndpointName>
                  <ExploreButton
                    onClick={() => window.open(
                      `https://app.getpostman.com/run-collection/${importUrl}`,
                      '_blank'
                    )}
                  >
                    <Code size={16} />
                    Explore
                  </ExploreButton>
                </EndpointItem>
              ))
            ) : (
              <Text color="secondary">
                No endpoints found in this collection. The collection might be using a different structure.
              </Text>
            )}
          </EndpointsSection>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default PostmanCollectionView;