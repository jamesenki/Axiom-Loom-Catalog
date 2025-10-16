import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft, 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Cpu,
  Cloud,
  Database,
  Zap,
  Package,
  GitBranch,
  BookOpen,
  FileText,
  Settings,
  Code,
  BarChart3,
  Layers,
  ExternalLink
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
  category: string;
  status: string;
  demoUrl?: string | null;
  tags?: string[];
  url?: string;
  urls?: {
    demo?: string;
    documentation?: string;
    website?: string;
    github?: string;
  };
  businessValue?: {
    targetMarket?: string;
    roi?: string;
    keyBenefits?: string[];
    useCases?: string[];
  };
  techStack?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    integrations?: string[];
  };
  categories?: string[];
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
  pricing?: {
    suggestedRetailPrice: number;
    tier: string;
    valueScore: number;
    displayPrice: string;
    lastAssessed: string;
    currency: string;
    licensingModel: string;
    supportIncluded: string;
    customizationAvailable: boolean;
  };
  content?: {
    keyFeatures?: string[];
    benefits?: string[];
    useCases?: string[];
    developmentAdvantages?: {
      cycleTimeReduction?: string;
      costSavings?: string;
      aiAgentsUsed?: string[];
      traditionalRolesReplaced?: string[];
      traditionalTeamSize?: string;
      aiTeamSize?: string;
    };
  };
  business?: {
    targetMarket?: string[];
    competitiveAdvantage?: string[];
    valueScore?: number;
  };
}

const PageHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.black} 0%, ${props => props.theme.colors.secondary.darkGray} 100%);
  padding: ${props => props.theme.spacing[16]} 0;
  margin-bottom: ${props => props.theme.spacing[10]};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary.yellow}15 0%, transparent 70%);
    pointer-events: none;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.yellow};
  position: relative;
  z-index: 1;
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const BusinessCard = styled(Card)`
  border-top: 4px solid ${props => props.theme.colors.primary.yellow};
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const CategoryBadge = styled(Badge)`
  background: ${props => props.theme.colors.background.tertiary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const IconWrapper = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color || theme.colors.primary.yellow}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  svg {
    color: ${props => props.color || theme.colors.primary.yellow};
  }
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing[3]};
`;

const TechItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: ${props => props.theme.spacing[3]} 0;
    padding-left: ${props => props.theme.spacing[8]};
    position: relative;
    border-bottom: 1px solid ${props => props.theme.colors.border.light};
    
    &:last-child {
      border-bottom: none;
    }
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: ${props => props.theme.spacing[3]};
      width: 24px;
      height: 24px;
      background: ${props => props.theme.colors.primary.yellow};
      color: ${props => props.theme.colors.primary.black};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};
`;

// Business category mappings
const businessCategories: Record<string, string[]> = {
  'future-mobility-consumer-platform': ['IoT', 'AI/ML', 'Consumer Tech', 'Electric Vehicles', 'Mobile Apps'],
  'future-mobility-fleet-platform': ['Fleet Management', 'IoT', 'AI Analytics', 'Route Optimization', 'Electric Vehicles'],
  'future-mobility-oems-platform': ['Manufacturing', 'AI/ML', 'Supply Chain', 'Quality Control', 'Industry 4.0'],
  'future-mobility-regulatory-platform': ['Compliance', 'Reporting', 'Government Tech', 'Data Analytics', 'Sustainability'],
  'future-mobility-tech-platform': ['MaaS', 'API Platform', 'Cloud Infrastructure', 'Developer Tools', 'Integration'],
  'future-mobility-utilities-platform': ['Smart Grid', 'Energy Management', 'IoT', 'AI/ML', 'Infrastructure'],
  'demo-labsdashboards': ['IoT', 'Industrial Equipment', 'AI/ML', 'Predictive Maintenance', 'Analytics'],
  'rentalFleets': ['Fleet Management', 'Rental Operations', 'Customer Experience', 'Booking Systems', 'Analytics'],
  'smartpath': ['Navigation', 'AI/ML', 'Route Optimization', 'Real-time Processing', 'Mobile'],
  'mobility-architecture-package-orchestrator': ['Architecture', 'Automation', 'DevOps', 'API Management', 'Integration'],
  'sovd-diagnostic-ecosystem-platform-architecture': ['Automotive Diagnostics', 'Testing', 'Quality Assurance', 'Standards Compliance', 'API Testing']
};

const businessValueData: Record<string, any> = {
  'future-mobility-consumer-platform': {
    targetMarket: '2+ Billion Global Consumers',
    roi: '40% increase in customer engagement',
    keyBenefits: [
      'Personalized mobility experiences powered by AI',
      'Seamless integration with smart city infrastructure',
      'Real-time route optimization and energy management',
      'Multi-modal transportation planning'
    ],
    useCases: [
      'Smart EV charging recommendations',
      'Personalized route planning',
      'Mobility-as-a-Service integration',
      'Carbon footprint tracking'
    ]
  },
  'future-mobility-fleet-platform': {
    targetMarket: 'Fleet Operators & Logistics Companies',
    roi: '35% reduction in operational costs',
    keyBenefits: [
      'AI-driven fleet optimization',
      'Predictive maintenance algorithms',
      'Real-time energy management',
      'Dynamic route optimization'
    ],
    useCases: [
      'Last-mile delivery optimization',
      'Fleet electrification planning',
      'Driver behavior analytics',
      'Maintenance scheduling'
    ]
  },
  'demo-labsdashboards': {
    targetMarket: 'Industrial Equipment Manufacturers',
    roi: '50% reduction in unplanned downtime',
    keyBenefits: [
      'Real-time equipment monitoring',
      'ML-powered predictive maintenance',
      'Advanced analytics dashboards',
      'IoT sensor integration'
    ],
    useCases: [
      'Industrial lubricant monitoring',
      'Water heater optimization',
      'Robot device management',
      'Equipment lifecycle tracking'
    ]
  }
};

const RepositoryDetailRedesigned: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [repository, setRepository] = useState<RepositoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        console.log('[RepositoryDetail] Fetching repository details for:', repoName);
        let response = await fetch(getApiUrl(`/api/repository/${repoName}/public`));

        // If API fails, try static data fallback
        if (!response.ok) {
          console.log('[RepositoryDetail] API not available, trying static data...');
          response = await fetch('/data/repository-metadata.json');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch repository details');
        }

        let data = await response.json();

        // If we got the full metadata object, extract the specific repository
        if (!Array.isArray(data) && typeof data === 'object' && !data.name) {
          console.log('[RepositoryDetail] Converting object format to specific repository');
          // Find the repository by name
          const repoData = Object.values(data).find((repo: any) => repo.name === repoName);
          if (!repoData) {
            throw new Error(`Repository "${repoName}" not found in static data`);
          }
          data = repoData;
        }

        // Enhance with business data - prioritize API data over hardcoded defaults
        const enhanced = {
          ...data,
          categories: businessCategories[repoName || ''] || ['General'],
          // Use API businessValue if available, otherwise fall back to hardcoded data
          businessValue: data.businessValue || businessValueData[repoName || ''] || {
            targetMarket: 'Enterprise & Developers',
            roi: 'Accelerated development cycles',
            keyBenefits: ['Modern architecture patterns', 'Scalable solutions', 'Best practices implementation'],
            useCases: ['API development', 'System integration', 'Cloud deployment']
          }
        };

        console.log('[RepositoryDetail] Loaded repository data:', enhanced.displayName);
        setRepository(enhanced);
      } catch (err) {
        console.error('[RepositoryDetail] Error fetching:', err);
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
          
          <H1 style={{ color: theme.colors.primary.white, marginBottom: theme.spacing[4], position: 'relative', zIndex: 1 }}>
            {repository.displayName}
          </H1>
          
          <Lead style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: theme.spacing[6], position: 'relative', zIndex: 1 }}>
            {repository.marketingDescription || repository.description}
          </Lead>
          
          <Flex gap={3} wrap style={{ position: 'relative', zIndex: 1 }}>
            <Badge variant="success" size="lg">{repository.status.toUpperCase()}</Badge>
            {repository.categories?.map((cat, idx) => (
              <CategoryBadge key={idx} size="lg">{cat}</CategoryBadge>
            ))}
          </Flex>
        </Container>
      </PageHeader>

      <Container maxWidth="lg">
        <Section spacing="large">
          {/* Business Value Section */}
          <Grid columns={repository.pricing ? 3 : 2} gap="large">
            {/* Pricing Card - Display first if available */}
            {repository.pricing && (
              <BusinessCard>
                <CardHeader>
                  <IconWrapper>
                    <DollarSign size={24} />
                  </IconWrapper>
                  <CardTitle>Architecture Package Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <Flex direction="column" gap={4}>
                    <div style={{ textAlign: 'center', padding: theme.spacing[4] }}>
                      <H2 style={{ color: theme.colors.primary.yellow, marginBottom: theme.spacing[2] }}>
                        {repository.pricing.displayPrice}
                      </H2>
                      <Badge variant="success" style={{ marginBottom: theme.spacing[3] }}>
                        {repository.pricing.tier}
                      </Badge>
                    </div>
                    
                    <div>
                      <Text weight="semibold" style={{ marginBottom: theme.spacing[1] }}>
                        <Shield size={16} style={{ marginRight: theme.spacing[2], verticalAlign: 'middle' }} />
                        Licensing
                      </Text>
                      <Text size="small">{repository.pricing.licensingModel}</Text>
                    </div>
                    
                    <div>
                      <Text weight="semibold" style={{ marginBottom: theme.spacing[1] }}>
                        <Settings size={16} style={{ marginRight: theme.spacing[2], verticalAlign: 'middle' }} />
                        Support Included
                      </Text>
                      <Text size="small">{repository.pricing.supportIncluded}</Text>
                    </div>
                    
                    {repository.pricing.customizationAvailable && (
                      <div>
                        <Badge variant="info">Customization Available</Badge>
                      </div>
                    )}
                    
                    <div style={{ marginTop: theme.spacing[2] }}>
                      <Text size="small" color="secondary">
                        Value Score: {repository.pricing.valueScore}/100
                      </Text>
                    </div>
                  </Flex>
                </CardContent>
              </BusinessCard>
            )}
            <BusinessCard>
              <CardHeader>
                <IconWrapper>
                  <Target size={24} />
                </IconWrapper>
                <CardTitle>Business Value</CardTitle>
              </CardHeader>
              <CardContent>
                <Flex direction="column" gap={4}>
                  <div>
                    <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
                      <Users size={16} style={{ marginRight: theme.spacing[2], verticalAlign: 'middle' }} />
                      Target Market
                    </Text>
                    <Text>{repository.business?.targetMarket?.join(', ') || repository.businessValue?.targetMarket}</Text>
                  </div>
                  
                  <div>
                    <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
                      <TrendingUp size={16} style={{ marginRight: theme.spacing[2], verticalAlign: 'middle' }} />
                      Expected ROI
                    </Text>
                    <Text>{repository.businessValue?.roi}</Text>
                  </div>
                </Flex>
              </CardContent>
            </BusinessCard>

            <BusinessCard>
              <CardHeader>
                <IconWrapper color={theme.colors.accent.green}>
                  <Shield size={24} />
                </IconWrapper>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <BenefitList>
                  {repository.content?.benefits?.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                  {repository.businessValue?.keyBenefits?.map((benefit, idx) => (
                    <li key={`fallback-${idx}`}>{benefit}</li>
                  ))}
                </BenefitList>
              </CardContent>
            </BusinessCard>
          </Grid>

          {/* AI Agent Attribution Section */}
          {repository.content?.developmentAdvantages && (
            <Card style={{ marginTop: theme.spacing[8] }}>
              <CardHeader>
                <IconWrapper color={theme.colors.accent.purple}>
                  <Package size={24} />
                </IconWrapper>
                <CardTitle>🤖 Built by AI Agents</CardTitle>
                <CardDescription>
                  This architecture package was collaboratively designed by specialized AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Development Efficiency Metrics */}
                <div style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.accent.blue}15, ${theme.colors.accent.green}15)`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing[6],
                  marginBottom: theme.spacing[8]
                }}>
                  <H3 style={{ marginBottom: theme.spacing[4], color: theme.colors.accent.blue, textAlign: 'center' }}>
                    🚀 Development Efficiency Gains
                  </H3>
                  <Grid columns={2} gap="large">
                    {repository.content.developmentAdvantages.cycleTimeReduction && (
                      <div style={{ 
                        background: theme.colors.background.primary,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[4],
                        textAlign: 'center',
                        boxShadow: theme.shadows.sm
                      }}>
                        <TrendingUp size={32} color={theme.colors.accent.green} style={{ marginBottom: theme.spacing[2] }} />
                        <H3 style={{ color: theme.colors.accent.green, marginBottom: theme.spacing[2] }}>
                          6-12 months
                        </H3>
                        <Text color="secondary">Faster Development</Text>
                      </div>
                    )}
                    {repository.content.developmentAdvantages.costSavings && (
                      <div style={{ 
                        background: theme.colors.background.primary,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[4],
                        textAlign: 'center',
                        boxShadow: theme.shadows.sm
                      }}>
                        <DollarSign size={32} color={theme.colors.accent.green} style={{ marginBottom: theme.spacing[2] }} />
                        <H3 style={{ color: theme.colors.accent.green, marginBottom: theme.spacing[2] }}>
                          $200K-500K
                        </H3>
                        <Text color="secondary">Cost Savings</Text>
                      </div>
                    )}
                  </Grid>
                </div>

                {/* AI vs Traditional Comparison */}
                <div style={{
                  background: `linear-gradient(135deg, ${theme.colors.accent.purple}15, ${theme.colors.accent.red}15)`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing[6],
                  marginBottom: theme.spacing[8]
                }}>
                  <H3 style={{ marginBottom: theme.spacing[6], color: theme.colors.text.primary, textAlign: 'center' }}>
                    ⚖️ AI vs Traditional Development
                  </H3>
                  <Grid columns={2} gap="large">
                    <div style={{ 
                      background: theme.colors.background.primary,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing[6],
                      textAlign: 'center',
                      boxShadow: theme.shadows.sm,
                      border: `2px solid ${theme.colors.accent.purple}`
                    }}>
                      <div style={{ 
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: theme.colors.accent.purple,
                        marginBottom: theme.spacing[2]
                      }}>
                        6
                      </div>
                      <H3 style={{ color: theme.colors.accent.purple, marginBottom: theme.spacing[1] }}>
                        AI Agents
                      </H3>
                      <Text color="secondary">Specialized & Efficient</Text>
                    </div>
                    <div style={{ 
                      background: theme.colors.background.primary,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing[6],
                      textAlign: 'center',
                      boxShadow: theme.shadows.sm,
                      border: `2px solid ${theme.colors.accent.red}`
                    }}>
                      <div style={{ 
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: theme.colors.accent.red,
                        marginBottom: theme.spacing[2]
                      }}>
                        12-16
                      </div>
                      <H3 style={{ color: theme.colors.accent.red, marginBottom: theme.spacing[1] }}>
                        Human Roles
                      </H3>
                      <Text color="secondary">Traditional Approach</Text>
                    </div>
                  </Grid>
                </div>

                {/* AI Development Team */}
                {repository.content.developmentAdvantages.aiAgentsUsed && (
                  <div style={{ marginBottom: theme.spacing[8] }}>
                    <H3 style={{ marginBottom: theme.spacing[6], color: theme.colors.accent.blue, textAlign: 'center' }}>
                      🤖 AI Development Team
                    </H3>
                    <Grid columns={3} gap="medium">
                      {repository.content.developmentAdvantages.aiAgentsUsed.map((agent, idx) => (
                        <div key={idx} style={{
                          background: `linear-gradient(135deg, ${theme.colors.accent.blue}10, ${theme.colors.accent.purple}10)`,
                          borderRadius: theme.borderRadius.md,
                          padding: theme.spacing[4],
                          textAlign: 'center',
                          border: `1px solid ${theme.colors.accent.blue}30`,
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}>
                          <Code size={24} color={theme.colors.accent.blue} style={{ marginBottom: theme.spacing[2] }} />
                          <Text weight="semibold" style={{ color: theme.colors.accent.blue }}>
                            {agent}
                          </Text>
                        </div>
                      ))}
                    </Grid>
                  </div>
                )}

                {/* Traditional Roles Replaced */}
                {repository.content.developmentAdvantages.traditionalRolesReplaced && (
                  <div>
                    <H3 style={{ marginBottom: theme.spacing[6], color: theme.colors.accent.red, textAlign: 'center' }}>
                      👥 Traditional Roles Replaced
                    </H3>
                    <Grid columns={4} gap="small">
                      {repository.content.developmentAdvantages.traditionalRolesReplaced.map((role, idx) => (
                        <div key={idx} style={{
                          background: `linear-gradient(135deg, ${theme.colors.accent.red}10, ${theme.colors.accent.orange || theme.colors.accent.red}10)`,
                          borderRadius: theme.borderRadius.sm,
                          padding: theme.spacing[3],
                          textAlign: 'center',
                          border: `1px solid ${theme.colors.accent.red}30`
                        }}>
                          <Users size={16} color={theme.colors.accent.red} style={{ marginBottom: theme.spacing[1] }} />
                          <Text size="small" style={{ color: theme.colors.accent.red, fontWeight: '500' }}>
                            {role}
                          </Text>
                        </div>
                      ))}
                    </Grid>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Use Cases Section */}
          <Card style={{ marginTop: theme.spacing[8] }}>
            <CardHeader>
              <IconWrapper color={theme.colors.accent.blue}>
                <Layers size={24} />
              </IconWrapper>
              <CardTitle>Use Cases & Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid columns={2} gap="medium">
                {(repository.content?.useCases || repository.businessValue?.useCases || []).map((useCase, idx) => (
                  <Flex key={idx} align="center" gap={3}>
                    <Zap size={20} color={theme.colors.primary.yellow} />
                    <Text>{useCase}</Text>
                  </Flex>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Technical Overview */}
          <Card style={{ marginTop: theme.spacing[8] }}>
            <CardHeader>
              <IconWrapper color={theme.colors.accent.red}>
                <Cpu size={24} />
              </IconWrapper>
              <CardTitle>Technical Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid columns={4} gap="medium">
                <div style={{ textAlign: 'center' }}>
                  <H3 style={{ color: theme.colors.primary.yellow }}>{repository.metrics.apiCount}</H3>
                  <Text color="secondary">Total APIs</Text>
                </div>
                {repository.metrics.postmanCollections && repository.metrics.postmanCollections > 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <H3 style={{ color: theme.colors.primary.yellow }}>{repository.metrics.postmanCollections}</H3>
                    <Text color="secondary">Postman Collections</Text>
                  </div>
                )}
                {repository.apiTypes?.hasGraphQL && (
                  <div style={{ textAlign: 'center' }}>
                    <Database size={32} color={theme.colors.accent.blue} />
                    <Text color="secondary" style={{ marginTop: theme.spacing[2] }}>GraphQL</Text>
                  </div>
                )}
                {repository.apiTypes?.hasGrpc && (
                  <div style={{ textAlign: 'center' }}>
                    <Cloud size={32} color={theme.colors.accent.green} />
                    <Text color="secondary" style={{ marginTop: theme.spacing[2] }}>gRPC</Text>
                  </div>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card style={{ marginTop: theme.spacing[8] }}>
            <CardHeader>
              <CardTitle>🚀 Get Started</CardTitle>
              <CardDescription>
                Explore the repository resources and start building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActionGrid>
                {/* Removed Architecture Demo, Implementation Guide, and Product Details buttons per user feedback */}
                
                <Button
                  as={Link}
                  to={`/docs/${repository.name}`}
                  variant="outline"
                  fullWidth
                >
                  <BookOpen size={20} />
                  Documentation
                </Button>
                
                {repository.metrics.apiCount > 0 && (
                  <Button
                    as={Link}
                    to={`/api-explorer/${repository.name}`}
                    variant="secondary"
                    fullWidth
                  >
                    <Settings size={20} />
                    API Explorer
                  </Button>
                )}
                
                {repository.apiTypes?.hasPostman && (
                  <Button
                    as={Link}
                    to={`/postman/${repository.name}`}
                    variant="outline"
                    fullWidth
                  >
                    <FileText size={20} />
                    Postman Collections
                  </Button>
                )}
                
                {repository.apiTypes?.hasGraphQL && (
                  <Button
                    as={Link}
                    to={`/graphql/${repository.name}`}
                    variant="outline"
                    fullWidth
                  >
                    <Database size={20} />
                    GraphQL Playground
                  </Button>
                )}
                
                {repository.apiTypes?.hasGrpc && (
                  <Button
                    as={Link}
                    to={`/grpc-playground/${repository.name}`}
                    variant="outline"
                    fullWidth
                  >
                    <Code size={20} />
                    gRPC Playground
                  </Button>
                )}
                
                {repository.demoUrl && (
                  <Button
                    as={Link}
                    to={repository.demoUrl}
                    variant="primary"
                    fullWidth
                  >
                    <Zap size={20} />
                    View Demo
                  </Button>
                )}
                
                <Button
                  as="a"
                  href={repository.url || `https://github.com/jamesenki/${repository.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  fullWidth
                >
                  <GitBranch size={20} />
                  View on GitHub
                </Button>
              </ActionGrid>
            </CardContent>
          </Card>
        </Section>
      </Container>
    </>
  );
};

export default RepositoryDetailRedesigned;