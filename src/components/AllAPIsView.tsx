import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft,
  Globe,
  Database,
  Server,
  Search,
  Filter,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
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

interface APIItem {
  repository: string;
  type: 'OpenAPI' | 'GraphQL' | 'gRPC';
  name: string;
  path: string;
  version?: string;
  description?: string;
  services?: string[];
  package?: string;
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
  background: ${props => props.active ? props.theme.colors.primary.yellow : props.theme.colors.background.secondary};
  color: ${props => props.active ? props.theme.colors.primary.black : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary.yellow : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const APICard = styled(Card)`
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'OpenAPI':
      return <Globe size={20} />;
    case 'GraphQL':
      return <Database size={20} />;
    case 'gRPC':
      return <Server size={20} />;
    default:
      return <Globe size={20} />;
  }
};

const TypeBadge = styled(Badge)<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'OpenAPI':
        return props.theme.colors.status.warning;
      case 'GraphQL':
        return props.theme.colors.status.info;
      case 'gRPC':
        return props.theme.colors.status.success;
      default:
        return props.theme.colors.secondary.darkGray;
    }
  }};
  color: ${props => props.theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.status.error}20;
  border: 1px solid ${props => props.theme.colors.status.error};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.status.error};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const AllAPIsView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeFilter = searchParams.get('type');
  
  const [apis, setApis] = useState<APIItem[]>([]);
  const [filteredApis, setFilteredApis] = useState<APIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAPIs();
    // When URL has a type filter, don't apply local filtering
    if (typeFilter) {
      setSelectedType(null);
    }
  }, [typeFilter]);

  useEffect(() => {
    filterAPIs();
  }, [apis, searchQuery, selectedType]);

  const fetchAllAPIs = async () => {
    try {
      setLoading(true);
      const url = typeFilter 
        ? `/api/api-explorer/all?type=${typeFilter}`
        : '/api/api-explorer/all';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch APIs');
      }
      const data = await response.json();
      setApis(data.apis || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filterAPIs = () => {
    let filtered = apis;
    
    if (searchQuery) {
      filtered = filtered.filter(api => 
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Don't filter by type if we already got filtered results from the API
    if (selectedType && !typeFilter) {
      filtered = filtered.filter(api => api.type === selectedType);
    }
    
    setFilteredApis(filtered);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
    if (type) {
      navigate(`/api-explorer/all?type=${type.toLowerCase()}`);
    } else {
      navigate('/api-explorer/all');
    }
  };

  const navigateToAPI = (api: APIItem) => {
    navigate(`/api-explorer/${api.repository}#${api.path}`);
  };

  if (loading) return <FullPageLoading />;

  return (
    <div>
      <PageHeader>
        <Container>
          <BackButton as={Link} to="/" size="sm">
            <ArrowLeft size={16} />
            Back to Dashboard
          </BackButton>
          <H1>API Explorer</H1>
          <Lead>Discover and explore all available APIs across repositories</Lead>
        </Container>
      </PageHeader>

      <Container>
        <Section>
          {error && (
            <ErrorMessage>
              <AlertCircle size={20} />
              <span>Error Loading APIs: {error}</span>
            </ErrorMessage>
          )}

          <SearchBar>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search APIs by name, repository, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <FilterBar>
            <FilterButton
              size="sm"
              active={!selectedType}
              onClick={() => handleTypeFilter(null)}
            >
              <Filter size={16} />
              All Types
            </FilterButton>
            <FilterButton
              size="sm"
              active={selectedType === 'OpenAPI'}
              onClick={() => handleTypeFilter('OpenAPI')}
            >
              <Globe size={16} />
              OpenAPI
            </FilterButton>
            <FilterButton
              size="sm"
              active={selectedType === 'GraphQL'}
              onClick={() => handleTypeFilter('GraphQL')}
            >
              <Database size={16} />
              GraphQL
            </FilterButton>
            <FilterButton
              size="sm"
              active={selectedType === 'gRPC'}
              onClick={() => handleTypeFilter('gRPC')}
            >
              <Server size={16} />
              gRPC
            </FilterButton>
          </FilterBar>

          <H2>
            {filteredApis.length} {selectedType || typeFilter?.toUpperCase() || 'Total'} APIs Found
          </H2>

          <Grid columns={1} gap="medium">
            {filteredApis.map((api, index) => (
              <APICard key={`${api.repository}-${api.path}-${index}`} onClick={() => navigateToAPI(api)}>
                <CardHeader>
                  <Flex justify="between" align="start">
                    <div>
                      <CardTitle>{api.name}</CardTitle>
                      <Text size="small" style={{ color: 'var(--text-muted)' }}>{api.repository}</Text>
                    </div>
                    <TypeBadge type={api.type}>
                      <TypeIcon type={api.type} />
                      {api.type}
                    </TypeBadge>
                  </Flex>
                </CardHeader>
                <CardContent>
                  {api.description && (
                    <CardDescription>{api.description}</CardDescription>
                  )}
                  <Flex justify="between" align="center" style={{ marginTop: '1rem' }}>
                    <Text size="small" style={{ color: 'var(--text-muted)' }}>{api.path}</Text>
                    {api.version && <Badge variant="secondary">v{api.version}</Badge>}
                  </Flex>
                  {api.services && api.services.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <Text size="small" style={{ color: 'var(--text-muted)' }}>
                        Services: {api.services.join(', ')}
                      </Text>
                    </div>
                  )}
                </CardContent>
              </APICard>
            ))}
          </Grid>

          {filteredApis.length === 0 && !loading && (
            <Card>
              <CardContent>
                <Flex direction="column" align="center" justify="center" style={{ padding: '2rem' }}>
                  <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <H3>No APIs Found</H3>
                  <Text style={{ color: 'var(--text-muted)' }}>
                    {searchQuery || selectedType
                      ? 'Try adjusting your filters or search terms'
                      : 'No APIs detected in the repositories'}
                  </Text>
                </Flex>
              </CardContent>
            </Card>
          )}
        </Section>
      </Container>
    </div>
  );
};

export default AllAPIsView;