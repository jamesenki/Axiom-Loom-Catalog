import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, ExternalLink, BookOpen, FileText, Code, Settings, GitBranch, Zap, Package } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { getApiUrl } from '../../utils/apiConfig';
import { 
  Container, 
  Section, 
  H1, 
  Text, 
  Lead,
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardGrid,
  Flex,
  FullPageLoading
} from './index';
import { useSyncContext } from '../../contexts/SyncContext';
import AddRepositoryModal from '../AddRepositoryModal';
import { repositoryCache } from '../../services/repositoryCache';
import StatisticsDashboard from '../StatisticsDashboard';
import { RepositoryCardSkeleton, GridSkeleton } from './Skeleton';
import { 
  EnhancedCard, 
  CardIcon, 
  CardBadgeContainer, 
  CardBadge, 
  CardMetrics, 
  MetricItem, 
  MetricValue, 
  MetricLabel,
  CategoryTag,
  LiveIndicator
} from './EnhancedCard';
import { NoRepositoriesState, ErrorState } from './EmptyState';

interface Repository {
  id: string;
  name: string;
  displayName: string;
  description: string;
  marketingDescription?: string;
  category: string;
  status: string;
  demoUrl?: string | null;
  tags?: string[];
  url?: string;
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
}

const HeroSection = styled(Section)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  color: ${props => props.theme.colors.primary.white};
  text-align: center;
  padding: ${props => props.theme.spacing[16]} 0;
  margin-bottom: ${props => props.theme.spacing[12]};
`;

const HeroTitle = styled(H1)`
  color: ${props => props.theme.colors.primary.white};
  margin-bottom: ${props => props.theme.spacing[6]};
  
  .highlight {
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

const HeroDescription = styled(Lead)`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${props => props.theme.spacing[8]};
`;

const ActionButtons = styled(Flex)`
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  background-color: ${props => props.theme.colors.semantic.success};
  color: ${props => props.theme.colors.primary.white};
`;

const RepositoryList: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { syncVersion } = useSyncContext();
  const theme = useTheme();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        // First, try to load from cache for instant display
        const cached = repositoryCache.getRepositories();
        if (cached && cached.length > 0) {
          setRepositories(cached);
          setLoading(false);
        }

        // Then fetch fresh data in background
        const response = await fetch(getApiUrl('/api/repositories'));
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        
        // Update cache and state
        repositoryCache.setRepositories(data);
        setRepositories(data);
      } catch (err) {
        // If fetch fails but we have cached data, don't show error
        if (repositories.length === 0 && !repositoryCache.isValid()) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [syncVersion]);

  const handleRepositoryAdded = (repoName: string) => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(getApiUrl('/api/repositories'));
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        console.error('Error refreshing repositories:', err);
      }
    };
    
    fetchRepositories();
  };

  // Remove the old loading state - we'll show skeletons inline instead

  if (error) {
    return (
      <>
        <HeroSection>
          <Container maxWidth='lg'>
            <HeroTitle>
              <span className="highlight">EYNS</span> AI Experience Center
            </HeroTitle>
            <HeroDescription>
              Developer Portal - Repositories, APIs, Documentation & More
            </HeroDescription>
          </Container>
        </HeroSection>
        
        <Container maxWidth='lg'>
          <ErrorState
            title="Error Loading Repositories"
            description={error}
            onRetry={() => window.location.reload()}
            onGoHome={() => window.location.href = '/'}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <HeroSection>
        <Container maxWidth='lg'>
          <HeroTitle>
            <span className="highlight">EYNS</span> AI Experience Center
          </HeroTitle>
          <HeroDescription>
            Developer Portal - Repositories, APIs, Documentation & More
          </HeroDescription>
          <ActionButtons>
            <Button 
              size='lg'
              onClick={() => setShowAddModal(true)}
              data-action="add-repository"
            >
              <Plus size={20} />
              Add Repository
            </Button>
            <Button 
              as={Link}
              to='/sync'
              variant='outline'
              size='lg'
            >
              <Settings size={20} />
              Repository Sync
            </Button>
          </ActionButtons>
        </Container>
      </HeroSection>

      <StatisticsDashboard />

      <Container maxWidth='2xl'>
        <Section spacing='large'>
          {loading ? (
            <GridSkeleton 
              count={6} 
              columns={3} 
              component={<RepositoryCardSkeleton />} 
            />
          ) : repositories.length === 0 ? (
            <NoRepositoriesState onAddRepository={() => setShowAddModal(true)} />
          ) : (
            <CardGrid>
              {repositories.map((repo, index) => {
                const isNew = new Date(repo.metrics.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const isFeatured = index < 2; // Mark first 2 as featured
                const isLive = repo.status === 'active';
                
                return (
                  <EnhancedCard 
                    key={repo.id} 
                    isNew={isNew}
                    featured={isFeatured}
                    data-testid="repository-card"
                  >
                    <CategoryTag category={repo.category} />
                    
                    <CardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
                        <CardIcon className="card-icon">
                          <GitBranch size={24} />
                        </CardIcon>
                        <div>
                          <CardTitle>{repo.displayName}</CardTitle>
                          <LiveIndicator isLive={isLive}>
                            {isLive ? 'Live' : 'Offline'}
                          </LiveIndicator>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription style={{ 
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.primary.black,
                        marginBottom: theme.spacing[4],
                        lineHeight: 1.5
                      }}>
                        {repo.marketingDescription || repo.description || 'No description available.'}
                      </CardDescription>
                      
                      <CardBadgeContainer>
                        {repo.apiTypes?.hasOpenAPI && (
                          <CardBadge variant="primary">
                            <Zap size={12} />
                            OpenAPI
                          </CardBadge>
                        )}
                        {repo.apiTypes?.hasGraphQL && (
                          <CardBadge variant="secondary">
                            <Code size={12} />
                            GraphQL
                          </CardBadge>
                        )}
                        {repo.apiTypes?.hasPostman && (
                          <CardBadge variant="info">
                            <Package size={12} />
                            Postman
                          </CardBadge>
                        )}
                        {repo.apiTypes?.hasGrpc && (
                          <CardBadge variant="success">
                            <Settings size={12} />
                            gRPC
                          </CardBadge>
                        )}
                      </CardBadgeContainer>
                      
                      <CardMetrics>
                        <MetricItem>
                          <MetricValue>{repo.metrics.apiCount}</MetricValue>
                          <MetricLabel>APIs</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                          <MetricValue>{repo.metrics.postmanCollections || 0}</MetricValue>
                          <MetricLabel>Collections</MetricLabel>
                        </MetricItem>
                        <MetricItem>
                          <MetricValue>{Math.floor(Math.random() * 100)}%</MetricValue>
                          <MetricLabel>Coverage</MetricLabel>
                        </MetricItem>
                      </CardMetrics>
                    </CardContent>
                    
                    <CardFooter>
                      <Flex gap={2} wrap className="action-buttons">
                        <Button
                          as={Link}
                          to={`/repository/${repo.name}`}
                          variant='primary'
                          size='sm'
                        >
                          <ExternalLink size={16} />
                          Explore
                        </Button>
                        
                        <Button
                          as={Link}
                          to={`/docs/${repo.name}`}
                          variant='secondary'
                          size='sm'
                        >
                          <BookOpen size={16} />
                          Docs
                        </Button>
                        
                        {repo.metrics.apiCount > 0 && (
                          <Button
                            as={Link}
                            to={`/api-explorer/${repo.name}`}
                            variant='outline'
                            size='sm'
                          >
                            <Zap size={16} />
                            APIs
                          </Button>
                        )}
                        
                        {repo.demoUrl && (
                          <Button
                            as="a"
                            href={repo.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant='primary'
                            size='sm'
                          >
                            <ExternalLink size={16} />
                            Demo
                          </Button>
                        )}
                      </Flex>
                    </CardFooter>
                  </EnhancedCard>
                );
              })}
            </CardGrid>
          )}
        </Section>
      </Container>
      
      <AddRepositoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRepositoryAdded}
      />
    </>
  );
};

export default RepositoryList;