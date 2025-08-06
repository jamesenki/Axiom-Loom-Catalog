import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
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
  background: ${props => props.theme.colors.background.secondary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
`;

const FilterBar = styled(Flex)`
  margin-bottom: ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)<{ active?: boolean }>`
  background: ${props => props.active ? theme.colors.primary.yellow : theme.colors.background.secondary};
  color: ${props => props.active ? theme.colors.primary.black : theme.colors.text.primary};
  border: 1px solid ${props => props.active ? theme.colors.primary.yellow : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const APICard = styled(Card)<{ dataType?: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${props => {
    switch (props.dataType) {
      case 'OpenAPI': return '#FF6B6B';
      case 'GraphQL': return '#E90C59';
      case 'gRPC': return '#00A67E';
      default: return theme.colors.primary.yellow;
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
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
      const response = await fetch(getApiUrl(`/api/detect-apis/${repoName}`));
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
    <>
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
            <Text weight="semibold" style={{ marginRight: theme.spacing[3] }}>
              <Filter size={16} style={{ marginRight: theme.spacing[1] }} />
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
                    // Navigate to specific API viewer based on type
                    const viewerPath = api.type === 'GraphQL' 
                      ? `/graphql/${repoName}?file=${encodeURIComponent(api.path)}`
                      : api.type === 'gRPC'
                      ? `/grpc-playground/${repoName}?file=${encodeURIComponent(api.path)}`
                      : `/api-viewer/${repoName}?file=${encodeURIComponent(api.path)}`;
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
                    <CardTitle>{api.name}</CardTitle>
                    <Text color="secondary" style={{ marginBottom: theme.spacing[2], fontSize: theme.typography.fontSize.sm }}>
                      {api.path}
                    </Text>
                    {api.description && (
                      <CardDescription>{api.description}</CardDescription>
                    )}
                    {api.version && (
                      <Text size="small" color="secondary" style={{ marginTop: theme.spacing[2] }}>
                        Version: {api.version}
                      </Text>
                    )}
                    {api.endpoints && (
                      <Text size="small" color="secondary">
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
    </>
  );
};

export default APIExplorerView;