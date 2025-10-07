import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import '../styles/api-explorer-contrast-fix.css';
import { 
  ArrowLeft,
  FileCode,
  Globe,
  Database,
  Search,
  Filter,
  ChevronRight,
  AlertCircle
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
  FullPageLoading,
  Input
} from './styled';

interface APISpec {
  name: string;
  path: string;
  type: 'OpenAPI' | 'GraphQL' | 'gRPC' | 'REST';
  version?: string;
  description?: string;
  endpoints?: number;
}

const PageHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  padding: ${props => props.theme.spacing[12]} 0;
  margin-bottom: ${props => props.theme.spacing[8]};
  
  /* Force white text for all child elements */
  * {
    color: #FFFFFF !important;
  }
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

const SearchBar = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const SearchInput = styled(Input)`
  padding-left: ${props => props.theme.spacing[10]};
  background: #FFFFFF !important;  /* WHITE background */
  color: #000000 !important;  /* BLACK text */
  border: 2px solid #E2E8F0 !important;
  
  &::placeholder {
    color: #999999 !important;  /* GRAY placeholder */
  }
  
  &:focus {
    border-color: ${props => props.theme.colors.primary.yellow};
    outline: none;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: #666666 !important;  /* MEDIUM GRAY for search icon */
`;

const FilterBar = styled(Flex)`
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)<{ active?: boolean }>`
  background: ${props => props.active ? '#0066CC' : '#FFFFFF'} !important;  /* BLUE active, WHITE inactive */
  color: ${props => props.active ? '#FFFFFF' : '#000000'} !important;  /* WHITE on blue, BLACK on white */
  border: 1px solid ${props => props.active ? '#0066CC' : '#E2E8F0'} !important;  /* Matching borders */
  
  &:hover {
    background: #0066CC !important;
    color: #FFFFFF !important;
    border-color: #0066CC !important;
  }
`;

const APICard = styled(Card)<{ dataType?: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  background: #FFFFFF !important;  /* FORCE WHITE background */
  border: 1px solid #E2E8F0 !important;
  border-left: 4px solid ${props => {
    switch (props.dataType) {
      case 'OpenAPI': return '#FF6B6B';
      case 'GraphQL': return '#E90C59';
      case 'gRPC': return '#00A67E';
      default: return theme.colors.primary.yellow;
    }
  }};
  
  /* FORCE BLACK TEXT on WHITE background for maximum contrast */
  && {
    color: #000000 !important;  /* BLACK text */
    background: #FFFFFF !important;  /* WHITE background */
    
    * {
      color: #000000 !important;  /* BLACK text for all children */
      background: transparent !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #000000 !important;  /* BLACK headings */
      font-weight: 600;
    }
    
    p {
      color: #333333 !important;  /* DARK GRAY for descriptions */
    }
    
    span, div {
      color: #000000 !important;  /* BLACK for all other text */
    }
    
    /* Version text and small text */
    small,
    [size="small"] {
      color: #666666 !important;  /* MEDIUM GRAY for version numbers */
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
    background: #F8F9FA !important;  /* LIGHT GRAY hover background */
  }
`;

const APITypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'OpenAPI':
      return <FileCode size={24} color="#FF6B6B" />;
    case 'GraphQL':
      return <Database size={24} color="#E90C59" />;
    case 'gRPC':
      return <Globe size={24} color="#00A67E" />;
    default:
      return <FileCode size={24} color={theme.colors.primary.yellow} />;
  }
};

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[16]} 0;
  color: #333333 !important;  /* DARK GRAY for empty state text */
  background: transparent !important;
  
  * {
    color: #333333 !important;
    background: transparent !important;
  }
`;

/* Main wrapper with white background and black text */
const APIExplorerWrapper = styled.div`
  background: #FFFFFF !important;  /* FORCE WHITE background for entire component */
  min-height: 100vh;
  color: #000000 !important;  /* BLACK text as default */
  
  /* FORCE all text elements to be BLACK on WHITE */
  h1, h2, h3, h4, h5, h6 {
    color: #000000 !important;
  }
  
  p {
    color: #333333 !important;  /* DARK GRAY for paragraph text */
  }
  
  span, div, td, th, li {
    color: #000000 !important;
  }
  
  /* Ensure all card content has proper contrast */
  div[class*="Card"],
  div[class*="card"] {
    background: #FFFFFF !important;
    color: #000000 !important;
    
    * {
      color: #000000 !important;
      background: transparent !important;
    }
    
    h3 {
      color: #000000 !important;
      font-weight: 600;
    }
    
    p {
      color: #333333 !important;
    }
    
    /* Version numbers and small text */
    small,
    [size="small"] {
      color: #666666 !important;
    }
  }
  
  /* Professional link colors */
  a {
    color: #0066CC !important;
    
    &:hover {
      color: #0052A3 !important;
    }
  }
  
  /* Search input styling */
  input {
    background: #FFFFFF !important;
    color: #000000 !important;
    border: 1px solid #E2E8F0 !important;
    
    &::placeholder {
      color: #999999 !important;
    }
  }
  
  /* Button text visibility */
  button {
    color: inherit !important;
  }
`;

const APIExplorerView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [apis, setApis] = useState<APISpec[]>([]);
  const [filteredApis, setFilteredApis] = useState<APISpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [apiTypes, setApiTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchAPIs();
  }, [repoName]);

  useEffect(() => {
    filterAPIs();
  }, [apis, searchQuery, selectedType]);

  const fetchAPIs = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/detect-apis/${repoName}`), {
        headers: {
          'x-dev-mode': 'true'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch APIs');
      }
      const data = await response.json();
      
      // Convert API data to flat array
      const allApis: APISpec[] = [];
      
      // Add REST APIs
      if (data.apis?.rest) {
        data.apis.rest.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.(yaml|yml)$/i, ''),
            path: api.file,
            type: 'OpenAPI',
            version: api.version,
            description: api.description
          });
        });
      }
      
      // Add GraphQL APIs
      if (data.apis?.graphql) {
        data.apis.graphql.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.(graphql|gql)$/i, ''),
            path: api.file,
            type: 'GraphQL',
            description: api.description
          });
        });
      }
      
      // Add gRPC APIs
      if (data.apis?.grpc) {
        data.apis.grpc.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.proto$/i, ''),
            path: api.file,
            type: 'gRPC',
            description: api.description
          });
        });
      }
      
      setApis(allApis);
      
      // Extract unique API types
      const types = [...new Set(allApis.map((api: APISpec) => api.type))];
      setApiTypes(types);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filterAPIs = () => {
    let filtered = apis;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(api => 
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (api.description && api.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(api => api.type === selectedType);
    }
    
    setFilteredApis(filtered);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(selectedType === type ? null : type);
  };

  if (loading) {
    return <FullPageLoading text="Discovering APIs..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">⚠️ Error Loading APIs</H1>
          <Text color="secondary">{error}</Text>
          <Button as={Link} to="/">
            Return to Home
          </Button>
        </Section>
      </Container>
    );
  }

  return (
    <APIExplorerWrapper className="api-explorer-container">
      <PageHeader>
        <Container maxWidth="lg">
          <BackButton as={Link} to={`/repository/${repoName}`}>
            <ArrowLeft size={20} />
            Back to Repository
          </BackButton>
          
          <H1 style={{ color: theme.colors.primary.white, marginBottom: theme.spacing[4] }}>
            🛠️ API Explorer: {repoName}
          </H1>
          
          <Lead style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {apis.length} API{apis.length !== 1 ? 's' : ''} discovered
          </Lead>
        </Container>
      </PageHeader>

      <Container maxWidth="lg">
        <Section spacing="large">
          {/* Search and Filters */}
          <SearchBar>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search APIs by name, path, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          
          <FilterBar>
            <Text weight="semibold" style={{ marginRight: theme.spacing[3], color: '#000000' }}>
              <Filter size={16} style={{ marginRight: theme.spacing[1], color: '#000000' }} />
              Filter by type:
            </Text>
            <FilterButton
              size="sm"
              active={!selectedType}
              onClick={() => handleTypeFilter(null)}
            >
              All ({apis.length})
            </FilterButton>
            {apiTypes.map(type => (
              <FilterButton
                key={type}
                size="sm"
                active={selectedType === type}
                onClick={() => handleTypeFilter(type)}
              >
                {type} ({apis.filter(api => api.type === type).length})
              </FilterButton>
            ))}
          </FilterBar>

          {/* APIs Grid */}
          {filteredApis.length > 0 ? (
            <Grid columns={3} gap="large">
              {filteredApis.map((api, index) => (
                <APICard
                  key={index}
                  dataType={api.type}
                  onClick={() => {
                    // Navigate to specific API viewer based on type using correct routes
                    let viewerPath: string;
                    
                    if (api.type === 'GraphQL') {
                      viewerPath = `/graphql-playground/${repoName}?file=${encodeURIComponent(api.path)}`;
                    } else if (api.type === 'gRPC') {
                      // For gRPC, fall back to generic API viewer or show info
                      viewerPath = `/api-explorer/${repoName}?type=grpc&file=${encodeURIComponent(api.path)}`;
                    } else if (api.type === 'OpenAPI') {
                      // Use the correct Swagger route
                      viewerPath = `/api/${repoName}/swagger?file=${encodeURIComponent(api.path)}`;
                    } else {
                      // Default fallback to API explorer with file parameter
                      viewerPath = `/api-explorer/${repoName}?file=${encodeURIComponent(api.path)}`;
                    }
                    
                    // Use React Router navigation instead of window.location.href
                    window.location.href = viewerPath;
                  }}
                >
                  <CardHeader>
                    <Flex align="center" justify="between">
                      <APITypeIcon type={api.type} />
                      <Badge>{api.type}</Badge>
                    </Flex>
                  </CardHeader>
                  <CardContent>
                    <CardTitle style={{ color: '#000000', fontWeight: 600 }}>{api.name}</CardTitle>
                    <Text style={{ marginBottom: theme.spacing[2], fontSize: theme.typography.fontSize.sm, color: '#666666' }}>
                      {api.path}
                    </Text>
                    {api.description && (
                      <CardDescription style={{ color: '#333333' }}>{api.description}</CardDescription>
                    )}
                    {api.version && (
                      <Text size="small" style={{ marginTop: theme.spacing[2], color: '#666666' }}>
                        Version: {api.version}
                      </Text>
                    )}
                    {api.endpoints && (
                      <Text size="small" style={{ color: '#666666' }}>
                        {api.endpoints} endpoint{api.endpoints !== 1 ? 's' : ''}
                      </Text>
                    )}
                  </CardContent>
                  <Flex justify="end" style={{ padding: theme.spacing[3] }}>
                    <ChevronRight size={20} color={theme.colors.primary.yellow} />
                  </Flex>
                </APICard>
              ))}
            </Grid>
          ) : (
            <EmptyState>
              <AlertCircle size={48} color={theme.colors.text.secondary} />
              <H2 color="secondary" style={{ marginTop: theme.spacing[4] }}>
                No APIs Found
              </H2>
              <Text color="secondary">
                {searchQuery || selectedType 
                  ? 'Try adjusting your filters or search query.'
                  : 'This repository does not contain any API specifications.'}
              </Text>
            </EmptyState>
          )}
        </Section>
      </Container>
    </APIExplorerWrapper>
  );
};

export default APIExplorerView;