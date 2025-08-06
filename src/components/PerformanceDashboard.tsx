/**
 * Performance Dashboard Component
 * 
 * Real-time performance monitoring dashboard showing Core Web Vitals and custom metrics
 * Provides actionable insights for performance optimization
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { theme } from '../styles/design-system';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';
import { Card } from './styled';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: ${props => props.theme.spacing[4]} 0;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const DashboardTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin: 0;
`;

const OverallScore = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`;

const ScoreCircle = styled.div<{ score: number }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.primary.white};
  background: ${props => {
    if (props.score >= 90) return theme.colors.semantic.success;
    if (props.score >= 75) return theme.colors.semantic.warning;
    return theme.colors.semantic.error;
  }};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const MetricCard = styled(Card)<{ rating: 'good' | 'needs-improvement' | 'poor' }>`
  border-left: 4px solid ${props => {
    switch (props.rating) {
      case 'good': return theme.colors.semantic.success;
      case 'needs-improvement': return theme.colors.semantic.warning;
      case 'poor': return theme.colors.semantic.error;
      default: return theme.colors.border.light;
    }
  }};
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[3]};
`;

const MetricName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const MetricIcon = styled.div<{ rating: 'good' | 'needs-improvement' | 'poor' }>`
  color: ${props => {
    switch (props.rating) {
      case 'good': return theme.colors.semantic.success;
      case 'needs-improvement': return theme.colors.semantic.warning;
      case 'poor': return theme.colors.semantic.error;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const MetricValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[1]};
`;

const MetricUnit = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  color: ${props => props.theme.colors.text.secondary};
  margin-left: ${props => props.theme.spacing[1]};
`;

const MetricRating = styled.div<{ rating: 'good' | 'needs-improvement' | 'poor' }>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => {
    switch (props.rating) {
      case 'good': return theme.colors.semantic.success;
      case 'needs-improvement': return theme.colors.semantic.warning;
      case 'poor': return theme.colors.semantic.error;
      default: return theme.colors.text.secondary;
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InsightsSection = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
`;

const InsightsTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 3px solid ${props => props.theme.colors.primary.yellow};
`;

const ToggleButton = styled.button`
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  border: none;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${props => props.theme.colors.primary.black};
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

const MetricDefinition = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing[2]} 0 0 0;
  line-height: 1.4;
`;

interface PerformanceDashboardProps {
  className?: string;
  showInsights?: boolean;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className = '',
  showInsights = true
}) => {
  const {
    summary,
    getInsights,
    isPerformanceGood,
    overallScore
  } = usePerformanceMonitoring();

  const [showDefinitions, setShowDefinitions] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const insights = getInsights();
  const performanceGood = isPerformanceGood();

  const renderMetricIcon = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return <CheckCircle size={20} />;
      case 'needs-improvement':
        return <Clock size={20} />;
      case 'poor':
        return <AlertCircle size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getMetricDefinition = (metric: string) => {
    const definitions = {
      LCP: 'Largest Contentful Paint measures loading performance. Good scores are 2.5s or less.',
      FID: 'First Input Delay measures interactivity. Good scores are 100ms or less.',
      CLS: 'Cumulative Layout Shift measures visual stability. Good scores are 0.1 or less.',
      FCP: 'First Contentful Paint measures when first content appears. Good scores are 1.8s or less.',
      TTFB: 'Time to First Byte measures server responsiveness. Good scores are 800ms or less.'
    };
    return definitions[metric as keyof typeof definitions] || '';
  };

  if (isMinimized) {
    return (
      <DashboardContainer className={className}>
        <DashboardHeader>
          <DashboardTitle>
            <Activity size={24} />
            Performance Score: {overallScore}
          </DashboardTitle>
          <ToggleButton onClick={() => setIsMinimized(false)}>
            Show Details
          </ToggleButton>
        </DashboardHeader>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer className={className}>
      <DashboardHeader>
        <DashboardTitle>
          <Activity size={24} />
          Performance Dashboard
        </DashboardTitle>
        <OverallScore>
          <ScoreCircle score={overallScore}>
            {overallScore}
          </ScoreCircle>
          <div>
            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              Overall Score
            </div>
            <div style={{ 
              fontSize: theme.typography.fontSize.xs, 
              color: performanceGood ? theme.colors.semantic.success : theme.colors.semantic.warning,
              fontWeight: theme.typography.fontWeight.medium
            }}>
              {performanceGood ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
          <ToggleButton onClick={() => setIsMinimized(true)}>
            Minimize
          </ToggleButton>
        </OverallScore>
      </DashboardHeader>

      <MetricsGrid>
        {/* Core Web Vitals */}
        {Object.entries(summary.coreWebVitals).map(([key, metric]) => {
          if (!metric) return null;
          
          return (
            <MetricCard key={key} rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
              <MetricHeader>
                <MetricName>{key}</MetricName>
                <MetricIcon rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
                  {renderMetricIcon(metric.rating as 'good' | 'needs-improvement' | 'poor')}
                </MetricIcon>
              </MetricHeader>
              
              <MetricValue>
                {metric.value}
                <MetricUnit>
                  {key === 'CLS' ? '' : 'ms'}
                </MetricUnit>
              </MetricValue>
              
              <MetricRating rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
                {metric.rating.replace('-', ' ')}
              </MetricRating>
              
              {showDefinitions && (
                <MetricDefinition>
                  {getMetricDefinition(key)}
                </MetricDefinition>
              )}
            </MetricCard>
          );
        })}

        {/* Custom Metrics */}
        {Object.entries(summary.customMetrics).map(([key, metric]) => (
          <MetricCard key={key} rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
            <MetricHeader>
              <MetricName>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </MetricName>
              <MetricIcon rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
                {renderMetricIcon(metric.rating as 'good' | 'needs-improvement' | 'poor')}
              </MetricIcon>
            </MetricHeader>
            
            <MetricValue>
              {metric.value}
              <MetricUnit>ms</MetricUnit>
            </MetricValue>
            
            <MetricRating rating={metric.rating as 'good' | 'needs-improvement' | 'poor'}>
              {metric.rating.replace('-', ' ')}
            </MetricRating>
          </MetricCard>
        ))}
      </MetricsGrid>

      <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[4] }}>
        <ToggleButton onClick={() => setShowDefinitions(!showDefinitions)}>
          {showDefinitions ? 'Hide' : 'Show'} Definitions
        </ToggleButton>
      </div>

      {showInsights && insights.length > 0 && (
        <InsightsSection>
          <InsightsTitle>Performance Insights</InsightsTitle>
          <InsightsList>
            {insights.map((insight, index) => (
              <InsightItem key={index}>
                <AlertCircle size={16} color={theme.colors.primary.yellow} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: theme.typography.fontSize.sm, lineHeight: 1.5 }}>
                  {insight}
                </span>
              </InsightItem>
            ))}
          </InsightsList>
        </InsightsSection>
      )}
    </DashboardContainer>
  );
};

export default PerformanceDashboard;