import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  Plus, 
  RefreshCw, 
  Package, 
  Book, 
  Send, 
  Search, 
  Activity,
  Clock,
  GitBranch,
  Zap
} from 'lucide-react';
import { useSyncContext } from '../contexts/SyncContext';
import AddRepositoryModal from './AddRepositoryModal';
import { getApiUrl } from '../utils/apiConfig';
import { InteractiveCard, GlassCardHeader, GlassCardContent } from './styled/GlassCard';
import { PrimaryButton, AccentButton, GlassButton } from './styled/QuantumButton';
import { quantumColors } from '../styles/axiom-theme';

interface Repository {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  status: string;
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

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 2rem 2rem;  /* Removed extra top padding since ContentWrapper handles it */
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #1A1A1A;  /* Dark text for readability */
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: #666666;  /* Medium gray for subtitle */
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  font-weight: 300;
  letter-spacing: 0.02em;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RepositoryCard = styled(InteractiveCard)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  border: 1px solid #E2E8F0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #CBD5E1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1A1A1A;  /* Dark text for readability */
  margin: 0;
`;

// No glow animations - professional design

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => props.status === 'active' 
    ? '#E8F5E8'
    : '#F5F5F5'};
  color: ${props => props.status === 'active' 
    ? '#00A86B'
    : '#666666'};
  border: 1px solid ${props => props.status === 'active' 
    ? '#00A86B'
    : '#E2E8F0'};
`;

const Description = styled.p`
  color: #666666;  /* Medium gray for readable text */
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const Metrics = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #F5F5F5;  /* Light gray background */
  border-radius: 8px;
  border: 1px solid #E2E8F0;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333333;  /* Dark text */
  font-size: 0.9rem;
  
  svg {
    color: #0066CC;  /* Professional blue */
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #F5F5F5;  /* Light gray background */
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #333333;  /* Dark text */
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #E2E8F0;  /* Slightly darker on hover */
    border-color: #CBD5E1;
    color: #0066CC;  /* Professional blue on hover */
    
    svg {
      color: #0066CC;
    }
  }
  
  svg {
    transition: color 0.2s ease;
    color: #666666;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666666;  /* Medium gray text */
  font-size: 1.2rem;
  
  &::before {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid #E2E8F0;
    border-top-color: #0066CC;  /* Professional blue */
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  background: #FDF2F2;  /* Light red background */
  border: 1px solid #F56565;
  border-radius: 8px;
  color: #DC3545;  /* Professional red */
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
`;

const RepositoryList: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { syncVersion } = useSyncContext();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        console.log('[RepositoryList] Fetching repositories...');
        const response = await fetch(getApiUrl('/api/repositories'));
        console.log('[RepositoryList] Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        console.log('[RepositoryList] Received data:', data?.length, 'repositories');
        setRepositories(data);
      } catch (err) {
        console.error('[RepositoryList] Error fetching:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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

  if (loading) return <LoadingContainer>Loading repositories...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;

  return (
    <Container>
      <HeroSection>
        <Title>Axiom Loom Catalog</Title>
        <Tagline>Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!</Tagline>
        <HeaderActions>
          <PrimaryButton 
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={20} />}
            glowEffect
          >
            Add Repository
          </PrimaryButton>
          <Link to="/sync" style={{ textDecoration: 'none' }}>
            <AccentButton 
              leftIcon={<RefreshCw size={20} />}
            >
              Repository Sync
            </AccentButton>
          </Link>
        </HeaderActions>
      </HeroSection>
      
      <GridContainer>
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} data-testid="repository-card">
            <CardHeader>
              <CardTitle>{repo.displayName}</CardTitle>
              <StatusBadge status={repo.status}>{repo.status}</StatusBadge>
            </CardHeader>
            
            <Description>{repo.description}</Description>
            
            <Metrics>
              <MetricItem>
                <Zap size={16} />
                <span>APIs: {repo.metrics.apiCount}</span>
              </MetricItem>
              <MetricItem>
                <Clock size={16} />
                <span>Updated: {new Date(repo.metrics.lastUpdated).toLocaleDateString()}</span>
              </MetricItem>
            </Metrics>
            
            <ActionButtons>
              <ActionLink to={`/repository/${repo.name}`}>
                <Package size={16} />
                Repository
              </ActionLink>
              <ActionLink to={`/docs/${repo.name}`}>
                <Book size={16} />
                Documentation
              </ActionLink>
              {repo.apiTypes?.hasPostman && (
                <ActionLink to={`/postman/${repo.name}`}>
                  <Send size={16} />
                  Postman
                </ActionLink>
              )}
              {repo.apiTypes?.hasGraphQL && (
                <ActionLink to={`/graphql/${repo.name}`}>
                  <Search size={16} />
                  GraphQL
                </ActionLink>
              )}
              {(repo.apiTypes?.hasOpenAPI || repo.apiTypes?.hasGraphQL || repo.apiTypes?.hasGrpc) && (
                <ActionLink to={`/api-explorer/${repo.name}`}>
                  <Activity size={16} />
                  API Explorer
                </ActionLink>
              )}
            </ActionButtons>
          </RepositoryCard>
        ))}
      </GridContainer>
      
      <AddRepositoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRepositoryAdded}
      />
    </Container>
  );
};

export default RepositoryList;