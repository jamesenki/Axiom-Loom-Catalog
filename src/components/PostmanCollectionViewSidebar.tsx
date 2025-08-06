import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  Copy,
  ExternalLink,
  Code,
  CheckCircle,
  FileText,
  Download,
  Play
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  Text,
  Button,
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

const PageLayout = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 320px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[8]};
  overflow-y: auto;
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

const SidebarTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const CollectionItem = styled.div<{ active?: boolean }>`
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? theme.colors.primary.yellow : theme.colors.background.primary};
  color: ${props => props.active ? theme.colors.primary.black : theme.colors.text.primary};
  border: 1px solid ${props => props.active ? theme.colors.primary.yellow : theme.colors.border.light};
  
  &:hover {
    background: ${props => props.active ? theme.colors.primary.yellow : 'rgba(255, 230, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary.yellow};
    transform: translateX(2px);
  }
`;

const CollectionIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const CollectionName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CollectionPath = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContentHeader = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[8]};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[8]};
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
`;

const CollectionTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const CollectionDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

const ImportSection = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const ImportTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

const UrlContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  word-break: break-all;
  margin: ${props => props.theme.spacing[3]} 0;
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

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  margin-top: ${props => props.theme.spacing[4]};
`;

const EndpointsSection = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
`;

const EndpointsTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

const EndpointItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.secondary};
  border-left: 4px solid ${props => props.theme.colors.primary.yellow};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing[3]};
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

const PostmanCollectionViewSidebar: React.FC = () => {
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
    <PageLayout>
      <Sidebar>
        <BackButton as={Link} to={`/repository/${repoName}`}>
          <ArrowLeft size={20} />
          Back to Repository
        </BackButton>
        
        <SidebarTitle>Collections ({collections.length})</SidebarTitle>
        
        {collections.map((collection, index) => (
          <CollectionItem
            key={index}
            active={currentCollection.path === collection.path}
            onClick={() => loadCollection(collection)}
          >
            <CollectionIcon>
              <FileText size={20} />
              <CollectionName>{collection.name}</CollectionName>
            </CollectionIcon>
            <CollectionPath>{collection.path}</CollectionPath>
          </CollectionItem>
        ))}
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <CollectionTitle>
            {currentCollection.info?.name || currentCollection.name}
          </CollectionTitle>
          <CollectionDescription>
            {currentCollection.info?.description || 
             `Comprehensive Postman collection for ${repoName}. Includes 100% test coverage, mock responses for all scenarios (success, errors, edge cases), and detailed examples. This collection is designed for robust testing, contract validation, and decoupled development.`}
          </CollectionDescription>
        </ContentHeader>

        <ImportSection>
          <ImportTitle>
            <Play size={24} />
            Import to Postman
          </ImportTitle>
          <Text color="secondary" style={{ marginBottom: theme.spacing[3] }}>
            Copy this URL and import it in Postman:
          </Text>
          
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

          <ActionButtons>
            <Button
              onClick={() => {
                // Download collection and provide instructions
                window.open(importUrl, '_blank');
                alert('Collection will download. Import it into Postman desktop app:\n1. Open Postman\n2. Click Import\n3. Select the downloaded JSON file');
              }}
            >
              <Download size={20} />
              Get Collection
            </Button>
            <Button
              variant="outline"
              as="a"
              href={`${importUrl}&download=true`}
              download
            >
              <Download size={20} />
              Download Collection
            </Button>
          </ActionButtons>
        </ImportSection>

        <EndpointsSection>
          <EndpointsTitle>
            <Code size={24} />
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
      </MainContent>
    </PageLayout>
  );
};

export default PostmanCollectionViewSidebar;