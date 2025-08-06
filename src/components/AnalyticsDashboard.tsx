/**
 * Analytics Dashboard Component
 * 
 * Displays comprehensive analytics and usage metrics for administrators
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Activity, TrendingUp, Users, Eye, Download, 
  Search, AlertTriangle, Clock, Zap, Server
} from 'lucide-react';
import { getAnalytics } from '../services/analytics/analyticsService';
import { enhancedPerformanceMonitoring } from '../services/monitoring/enhancedPerformanceMonitoring';
import { getErrorTracking } from '../services/monitoring/errorTrackingService';
import { CustomAnalyticsProvider } from '../services/analytics/providers/customAnalyticsProvider';

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.colors.background.primary};
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MetricTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.positive ? props.theme.colors.status.success : props.theme.colors.status.error};
`;

const ChartSection = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary.main};
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${props.theme.colors.primary.main};
    }
  `}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.border.light};
  background-color: ${props => props.active ? props.theme.colors.primary.main : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { path: string; views: number }[];
  topRepositories: { name: string; views: number }[];
  searchQueries: { query: string; count: number }[];
  apiUsage: { type: string; count: number }[];
  errors: { time: string; count: number }[];
  performance: { metric: string; value: number; rating: string }[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'performance' | 'errors'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      // Get analytics data from various sources
      const analytics = getAnalytics();
      const performanceData = enhancedPerformanceMonitoring.getPerformanceSummary();
      const errorStats = getErrorTracking().getErrorStats();

      // Simulate fetching data (in real app, this would come from backend)
      const mockData: AnalyticsData = {
        pageViews: 15234,
        uniqueVisitors: 3456,
        avgSessionDuration: 245, // seconds
        bounceRate: 32.5,
        topPages: [
          { path: '/repositories', views: 4523 },
          { path: '/api-explorer', views: 3234 },
          { path: '/documentation', views: 2345 },
          { path: '/search', views: 1823 },
          { path: '/', views: 1234 }
        ],
        topRepositories: [
          { name: 'future-mobility-platform', views: 2345 },
          { name: 'cloudtwin-simulation', views: 1823 },
          { name: 'nslabsdashboards', views: 1567 },
          { name: 'deploymaster-sdv', views: 1234 },
          { name: 'ai-transformations', views: 987 }
        ],
        searchQueries: [
          { query: 'api documentation', count: 234 },
          { query: 'graphql', count: 189 },
          { query: 'authentication', count: 156 },
          { query: 'deployment', count: 134 },
          { query: 'testing', count: 98 }
        ],
        apiUsage: [
          { type: 'REST', count: 5634 },
          { type: 'GraphQL', count: 3421 },
          { type: 'gRPC', count: 1234 },
          { type: 'WebSocket', count: 876 }
        ],
        errors: generateTimeSeriesData(24, 0, 50),
        performance: [
          { metric: 'LCP', value: performanceData.coreWebVitals.LCP?.value || 0, rating: performanceData.coreWebVitals.LCP?.rating || 'good' },
          { metric: 'FID', value: performanceData.coreWebVitals.FID?.value || 0, rating: performanceData.coreWebVitals.FID?.rating || 'good' },
          { metric: 'CLS', value: performanceData.coreWebVitals.CLS?.value || 0, rating: performanceData.coreWebVitals.CLS?.rating || 'good' },
          { metric: 'TTFB', value: performanceData.coreWebVitals.TTFB?.value || 0, rating: performanceData.coreWebVitals.TTFB?.rating || 'good' }
        ]
      };

      setAnalyticsData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setLoading(false);
    }
  };

  const generateTimeSeriesData = (points: number, min: number, max: number) => {
    return Array.from({ length: points }, (_, i) => ({
      time: `${i}:00`,
      count: Math.floor(Math.random() * (max - min + 1)) + min
    }));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading || !analyticsData) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <Title>Analytics Dashboard</Title>
          <Subtitle>Loading analytics data...</Subtitle>
        </DashboardHeader>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Analytics Dashboard</Title>
        <Subtitle>Monitor platform usage, performance, and health metrics</Subtitle>
      </DashboardHeader>

      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </Tab>
        <Tab active={activeTab === 'usage'} onClick={() => setActiveTab('usage')}>
          Usage
        </Tab>
        <Tab active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
          Performance
        </Tab>
        <Tab active={activeTab === 'errors'} onClick={() => setActiveTab('errors')}>
          Errors
        </Tab>
      </TabContainer>

      <FilterContainer>
        <FilterButton active={timeRange === '24h'} onClick={() => setTimeRange('24h')}>
          Last 24 Hours
        </FilterButton>
        <FilterButton active={timeRange === '7d'} onClick={() => setTimeRange('7d')}>
          Last 7 Days
        </FilterButton>
        <FilterButton active={timeRange === '30d'} onClick={() => setTimeRange('30d')}>
          Last 30 Days
        </FilterButton>
      </FilterContainer>

      {activeTab === 'overview' && (
        <>
          <MetricsGrid>
            <MetricCard>
              <MetricHeader>
                <MetricTitle>Page Views</MetricTitle>
                <MetricIcon color="#0088FE">
                  <Eye size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{analyticsData.pageViews.toLocaleString()}</MetricValue>
              <MetricChange positive={true}>
                <TrendingUp size={16} />
                +12.5% from last period
              </MetricChange>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <MetricTitle>Unique Visitors</MetricTitle>
                <MetricIcon color="#00C49F">
                  <Users size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{analyticsData.uniqueVisitors.toLocaleString()}</MetricValue>
              <MetricChange positive={true}>
                <TrendingUp size={16} />
                +8.3% from last period
              </MetricChange>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <MetricTitle>Avg. Session Duration</MetricTitle>
                <MetricIcon color="#FFBB28">
                  <Clock size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{formatDuration(analyticsData.avgSessionDuration)}</MetricValue>
              <MetricChange positive={false}>
                <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
                -2.1% from last period
              </MetricChange>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <MetricTitle>Bounce Rate</MetricTitle>
                <MetricIcon color="#FF8042">
                  <Activity size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{analyticsData.bounceRate}%</MetricValue>
              <MetricChange positive={true}>
                <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
                -5.2% from last period
              </MetricChange>
            </MetricCard>
          </MetricsGrid>

          <ChartSection>
            <ChartTitle>Page Views Over Time</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={generateTimeSeriesData(24, 100, 1000)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartSection>
        </>
      )}

      {activeTab === 'usage' && (
        <>
          <ChartSection>
            <ChartTitle>Top Pages</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.topPages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="path" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          <ChartSection>
            <ChartTitle>Top Repositories</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.topRepositories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          <ChartSection>
            <ChartTitle>API Usage by Type</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.apiUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.apiUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          <MetricsGrid>
            {analyticsData.performance.map((metric) => (
              <MetricCard key={metric.metric}>
                <MetricHeader>
                  <MetricTitle>{metric.metric}</MetricTitle>
                  <MetricIcon color={
                    metric.rating === 'good' ? '#00C49F' : 
                    metric.rating === 'needs-improvement' ? '#FFBB28' : '#FF8042'
                  }>
                    <Zap size={20} />
                  </MetricIcon>
                </MetricHeader>
                <MetricValue>{metric.value}ms</MetricValue>
                <MetricChange positive={metric.rating === 'good'}>
                  {metric.rating}
                </MetricChange>
              </MetricCard>
            ))}
          </MetricsGrid>

          <ChartSection>
            <ChartTitle>Performance Metrics Over Time</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateTimeSeriesData(24, 0, 5000)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0088FE" name="Response Time (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartSection>
        </>
      )}

      {activeTab === 'errors' && (
        <>
          <MetricsGrid>
            <MetricCard>
              <MetricHeader>
                <MetricTitle>Total Errors</MetricTitle>
                <MetricIcon color="#FF8042">
                  <AlertTriangle size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{getErrorTracking().getErrorStats().total}</MetricValue>
              <MetricChange positive={false}>
                Last 24 hours
              </MetricChange>
            </MetricCard>

            <MetricCard>
              <MetricHeader>
                <MetricTitle>Error Rate</MetricTitle>
                <MetricIcon color="#FF8042">
                  <Server size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>0.23%</MetricValue>
              <MetricChange positive={true}>
                <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
                -0.05% from yesterday
              </MetricChange>
            </MetricCard>
          </MetricsGrid>

          <ChartSection>
            <ChartTitle>Error Frequency</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.errors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </>
      )}
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;