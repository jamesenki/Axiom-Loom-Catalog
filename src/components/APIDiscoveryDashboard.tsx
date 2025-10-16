import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { 
  Zap, 
  Code, 
  Package, 
  Settings, 
  Globe, 
  Database, 
  Shield, 
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { theme } from '../styles/design-system';
import { Container, H2, H3, Text, Button, Flex } from './styled';
import { Link } from 'react-router-dom';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
  padding: ${props => props.theme.spacing[12]} 0;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(H2)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -${props => props.theme.spacing[3]};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.primary.yellow};
    border-radius: ${props => props.theme.borderRadius.full};
  }
`;

const APIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[12]};
`;

const APICard = styled.div<{ apiType: string }>`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  animation: ${css`${float}`} 6s ease-in-out infinite;
  animation-delay: ${props => {
    const delays: Record<string, string> = {
      'openapi': '0s',
      'graphql': '1s',
      'grpc': '2s',
      'postman': '0.5s',
    };
    return delays[props.apiType] || '0s';
  }};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary.yellow};

    .api-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .discover-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      const colors: Record<string, string> = {
        'openapi': theme.colors.primary.yellow,
        'graphql': theme.colors.accent.blue,
        'grpc': theme.colors.semantic.success,
        'postman': theme.colors.semantic.warning,
      };
      return colors[props.apiType] || theme.colors.primary.yellow;
    }};
  }
`;

const APIIcon = styled.div<{ apiType: string }>`
  width: 64px;
  height: 64px;
  margin: 0 auto ${props => props.theme.spacing[4]};
  background: ${props => {
    const colors: Record<string, string> = {
      'openapi': `linear-gradient(135deg, ${props => props.theme.colors.primary.yellow}20, ${props => props.theme.colors.primary.yellow}40)`,
      'graphql': `linear-gradient(135deg, ${props => props.theme.colors.accent.blue}20, ${props => props.theme.colors.accent.blue}40)`,
      'grpc': `linear-gradient(135deg, ${props => props.theme.colors.semantic.success}20, ${props => props.theme.colors.semantic.success}40)`,
      'postman': `linear-gradient(135deg, ${props => props.theme.colors.semantic.warning}20, ${props => props.theme.colors.semantic.warning}40)`,
    };
    return colors[props.apiType] || `linear-gradient(135deg, ${props => props.theme.colors.primary.yellow}20, ${props => props.theme.colors.primary.yellow}40)`;
  }};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};

  svg {
    color: ${props => {
      const colors: Record<string, string> = {
        'openapi': theme.colors.primary.yellow,
        'graphql': theme.colors.accent.blue,
        'grpc': theme.colors.semantic.success,
        'postman': theme.colors.semantic.warning,
      };
      return colors[props.apiType] || theme.colors.primary.yellow;
    }};
  }
`;

const APITitle = styled(H3)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[3]};
`;

const APIDescription = styled(Text)`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing[4]};
  line-height: 1.5;
`;

const APIStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[3]} 0;
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DiscoverButton = styled(Button)`
  width: 100%;
  opacity: 0;
  transform: translateY(10px);
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const NetworkVisualization = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  position: relative;
  overflow: hidden;
`;

const NetworkNode = styled.div<{ x: number; y: number; size: number; color: string }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.full};
  border: 2px solid ${props => props.theme.colors.background.primary};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};

  &:hover {
    transform: scale(1.2);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  svg {
    color: ${props => props.theme.colors.primary.white};
  }
`;

const NetworkConnection = styled.div<{ 
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number; 
}>`
  position: absolute;
  background: linear-gradient(
    to right,
    ${props => props.theme.colors.primary.yellow}40,
    transparent 50%,
    ${props => props.theme.colors.primary.yellow}40
  );
  background-size: 200% 100%;
  animation: ${css`${shimmer}`} 3s linear infinite;
  height: 2px;
  transform-origin: left center;
  
  left: ${props => props.x1}%;
  top: ${props => props.y1}%;
  width: ${props => Math.sqrt(Math.pow(props.x2 - props.x1, 2) + Math.pow(props.y2 - props.y1, 2))}%;
  transform: rotate(${props => Math.atan2(props.y2 - props.y1, props.x2 - props.x1) * 180 / Math.PI}deg);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[8]};
`;

const MetricCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: visible;
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-bottom: ${props => props.theme.spacing[3]};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

interface APIData {
  type: string;
  title: string;
  description: string;
  count: number;
  endpoints: number;
  status: 'active' | 'maintenance' | 'deprecated';
  repositories: string[];
}

const APIDiscoveryDashboard: React.FC = () => {
  const [apiData, setApiData] = useState<APIData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API data - replace with actual API calls
    const mockData: APIData[] = [
      {
        type: 'openapi',
        title: 'REST APIs',
        description: 'RESTful services with OpenAPI specifications for seamless integration and documentation',
        count: 24,
        endpoints: 156,
        status: 'active',
        repositories: ['user-service', 'payment-api', 'notification-service']
      },
      {
        type: 'graphql',
        title: 'GraphQL APIs',
        description: 'Flexible query language APIs enabling efficient data fetching and real-time subscriptions',
        count: 8,
        endpoints: 42,
        status: 'active',
        repositories: ['analytics-gql', 'content-api']
      },
      {
        type: 'grpc',
        title: 'gRPC Services',
        description: 'High-performance RPC framework for microservices communication and streaming',
        count: 12,
        endpoints: 78,
        status: 'active',
        repositories: ['auth-service', 'data-processor']
      },
      {
        type: 'postman',
        title: 'Postman Collections',
        description: 'Ready-to-use API collections for testing, documentation, and team collaboration',
        count: 18,
        endpoints: 94,
        status: 'active',
        repositories: ['api-tests', 'integration-suite']
      }
    ];

    setTimeout(() => {
      setApiData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getAPIIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'openapi': <Zap size={32} />,
      'graphql': <Code size={32} />,
      'grpc': <Settings size={32} />,
      'postman': <Package size={32} />
    };
    return icons[type] || <Globe size={32} />;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'active': <CheckCircle size={16} color={theme.colors.semantic.success} />,
      'maintenance': <Clock size={16} color={theme.colors.semantic.warning} />,
      'deprecated': <AlertTriangle size={16} color={theme.colors.semantic.error} />
    };
    return icons[status] || <CheckCircle size={16} />;
  };

  if (loading) {
    return null;
  }

  return (
    <DashboardContainer>
      <Container maxWidth="xl">
        <SectionTitle>API Discovery Center</SectionTitle>
        
        <APIGrid>
          {apiData.map((api) => (
            <APICard key={api.type} apiType={api.type}>
              <APIIcon className="api-icon" apiType={api.type}>
                {getAPIIcon(api.type)}
              </APIIcon>
              
              <APITitle>{api.title}</APITitle>
              <APIDescription>{api.description}</APIDescription>
              
              <APIStats>
                <StatItem>
                  <StatValue>{api.count}</StatValue>
                  <StatLabel>APIs</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{api.endpoints}</StatValue>
                  <StatLabel>Endpoints</StatLabel>
                </StatItem>
                <StatItem>
                  <Flex align="center" justify="center" gap={1}>
                    {getStatusIcon(api.status)}
                    <span style={{ fontSize: theme.typography.fontSize.xs, textTransform: 'capitalize' }}>
                      {api.status}
                    </span>
                  </Flex>
                </StatItem>
              </APIStats>
              
              <DiscoverButton 
                className="discover-btn"
                variant="primary"
                size="sm"
                as={Link}
                to={`/api-explorer/all?type=${api.type}`}
              >
                Explore {api.title}
              </DiscoverButton>
            </APICard>
          ))}
        </APIGrid>

        <NetworkVisualization>
          <H3 style={{ textAlign: 'center', marginBottom: theme.spacing[6] }}>
            API Network Topology
          </H3>
          
          {/* Network nodes */}
          <NetworkNode x={20} y={30} size={60} color={theme.colors.primary.yellow}>
            <Globe size={24} />
          </NetworkNode>
          
          <NetworkNode x={80} y={25} size={50} color={theme.colors.accent.blue}>
            <Database size={20} />
          </NetworkNode>
          
          <NetworkNode x={50} y={60} size={55} color={theme.colors.semantic.success}>
            <Shield size={22} />
          </NetworkNode>
          
          <NetworkNode x={25} y={75} size={45} color={theme.colors.semantic.warning}>
            <Users size={18} />
          </NetworkNode>
          
          <NetworkNode x={75} y={70} size={50} color={theme.colors.semantic.info}>
            <TrendingUp size={20} />
          </NetworkNode>

          {/* Network connections */}
          <NetworkConnection x1={20} y1={30} x2={80} y2={25} />
          <NetworkConnection x1={20} y1={30} x2={50} y2={60} />
          <NetworkConnection x1={80} y1={25} x2={75} y2={70} />
          <NetworkConnection x1={50} y1={60} x2={25} y2={75} />
          <NetworkConnection x1={50} y1={60} x2={75} y2={70} />
          
          <MetricsGrid>
            <MetricCard>
              <H3>Total Requests</H3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.colors.primary.yellow }}>
                2.4M
              </div>
              <Text color="secondary">This month</Text>
            </MetricCard>
            
            <MetricCard>
              <H3>Response Time</H3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.colors.semantic.success }}>
                127ms
              </div>
              <Text color="secondary">Average</Text>
            </MetricCard>
            
            <MetricCard>
              <H3>Success Rate</H3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.colors.semantic.info }}>
                99.7%
              </div>
              <Text color="secondary">Uptime</Text>
            </MetricCard>
            
            <MetricCard>
              <H3>Active Consumers</H3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.colors.accent.blue }}>
                156
              </div>
              <Text color="secondary">Applications</Text>
            </MetricCard>
          </MetricsGrid>
        </NetworkVisualization>
      </Container>
    </DashboardContainer>
  );
};

export default APIDiscoveryDashboard;