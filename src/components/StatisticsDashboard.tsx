import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Code, GitBranch, Package, Zap } from 'lucide-react';
import { theme } from '../styles/design-system';
import { Container, Flex, H2, Text } from './styled';
import CountUp from 'react-countup';
import { getApiUrl } from '../utils/apiConfig';

interface Statistics {
  totalRepositories: number;
  totalAPIs: number;
  linesOfCode: number;
  activeDevelopers: number;
  totalDocuments: number;
  lastSyncTime: string;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
  padding: ${props => props.theme.spacing[12]} 0;
  margin-bottom: ${props => props.theme.spacing[16]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary.yellow}10 0%, transparent 70%);
    animation: ${pulse} 15s ease-in-out infinite;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  position: relative;
  z-index: 1;
`;

const StatCard = styled.div<{ delay?: number }>`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.delay || 0}s;
  opacity: 0;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary.yellow};

    .icon-wrapper {
      transform: rotate(360deg);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary.yellow}, ${props => props.theme.colors.accent.blue});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${props => props.theme.spacing[4]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.yellow}20, ${props => props.theme.colors.accent.blue}20);
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${props => props.theme.animations.duration.slow} ${props => props.theme.animations.easing.easeOut};

  svg {
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const StatLabel = styled(Text)`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SectionTitle = styled(H2)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
  position: relative;
  z-index: 1;

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

const ActivityIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing[4]};
  right: ${props => props.theme.spacing[4]};
  width: 12px;
  height: 12px;
  background: ${props => props.theme.colors.semantic.success};
  border-radius: ${props => props.theme.borderRadius.full};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const StatisticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics>({
    totalRepositories: 0,
    totalAPIs: 0,
    linesOfCode: 0,
    activeDevelopers: 0,
    totalDocuments: 0,
    lastSyncTime: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch repositories for statistics
        const repoResponse = await fetch(getApiUrl('/api/repositories'));
        if (repoResponse.ok) {
          const repositories = await repoResponse.json();
          
          // Calculate statistics
          let totalAPIs = 0;
          let totalDocs = 0;
          
          repositories.forEach((repo: any) => {
            totalAPIs += repo.metrics?.apiCount || 0;
            totalDocs += repo.metrics?.documentCount || 5; // Estimate if not available
          });

          setStats({
            totalRepositories: repositories.length,
            totalAPIs,
            linesOfCode: repositories.length * 15000, // Estimate
            activeDevelopers: Math.floor(repositories.length * 2.5), // Estimate
            totalDocuments: totalDocs,
            lastSyncTime: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statCards = [
    {
      icon: <GitBranch size={28} />,
      value: stats.totalRepositories,
      label: 'Active Repositories',
      delay: 0.1
    },
    {
      icon: <Zap size={28} />,
      value: stats.totalAPIs,
      label: 'Available APIs',
      delay: 0.2
    },
    {
      icon: <Code size={28} />,
      value: stats.linesOfCode,
      label: 'Lines of Code',
      delay: 0.3,
      format: true
    },
    {
      icon: <Package size={28} />,
      value: stats.totalDocuments,
      label: 'Documentation Pages',
      delay: 0.4
    }
  ];

  if (loading) {
    return null;
  }

  return (
    <DashboardContainer data-testid="statistics-dashboard">
      <Container maxWidth="xl">
        <SectionTitle>Innovation at Scale</SectionTitle>
        <StatsGrid>
          {statCards.map((stat, index) => (
            <StatCard key={index} delay={stat.delay}>
              <ActivityIndicator />
              <IconWrapper className="icon-wrapper">
                {stat.icon}
              </IconWrapper>
              <StatValue>
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  decimals={0}
                  delay={stat.delay}
                  useEasing
                  useGrouping
                  formattingFn={stat.format ? (value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(1)}K`;
                    }
                    return value.toString();
                  } : undefined}
                />
              </StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Container>
    </DashboardContainer>
  );
};

export default StatisticsDashboard;