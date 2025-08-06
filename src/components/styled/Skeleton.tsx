import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/design-system';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div<{ 
  width?: string; 
  height?: string; 
  borderRadius?: string;
  marginBottom?: string;
}>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.borderRadius || theme.borderRadius.md};
  margin-bottom: ${props => props.marginBottom || '0'};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    ${props => props.theme.colors.background.tertiary} 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const SkeletonCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const SkeletonCardContent = styled.div`
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const SkeletonCardFooter = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  flex-wrap: wrap;
`;

// Skeleton components
export const SkeletonText: React.FC<{ 
  lines?: number; 
  width?: string;
  lastLineWidth?: string;
}> = ({ lines = 1, width = '100%', lastLineWidth = '80%' }) => {
  return (
    <>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBase
          key={index}
          width={index === lines - 1 ? lastLineWidth : width}
          height="16px"
          marginBottom={theme.spacing[2]}
        />
      ))}
    </>
  );
};

export const SkeletonTitle: React.FC<{ width?: string }> = ({ width = '60%' }) => (
  <SkeletonBase width={width} height="28px" marginBottom={theme.spacing[2]} />
);

export const SkeletonButton: React.FC<{ width?: string }> = ({ width = '100px' }) => (
  <SkeletonBase width={width} height="36px" borderRadius={theme.borderRadius.md} />
);

export const SkeletonBadge: React.FC = () => (
  <SkeletonBase width="80px" height="24px" borderRadius={theme.borderRadius.full} />
);

export const SkeletonAvatar: React.FC<{ size?: string }> = ({ size = '40px' }) => (
  <SkeletonBase width={size} height={size} borderRadius={theme.borderRadius.full} />
);

export const SkeletonImage: React.FC<{ height?: string }> = ({ height = '200px' }) => (
  <SkeletonBase width="100%" height={height} borderRadius={theme.borderRadius.lg} />
);

// Repository Card Skeleton
export const RepositoryCardSkeleton: React.FC = () => (
  <SkeletonCard>
    <SkeletonCardHeader>
      <SkeletonTitle width="70%" />
      <SkeletonBadge />
    </SkeletonCardHeader>
    
    <SkeletonCardContent>
      <SkeletonText lines={3} lastLineWidth="90%" />
      <div style={{ 
        display: 'flex', 
        gap: theme.spacing[6], 
        marginTop: theme.spacing[4],
      }}>
        <SkeletonBase width="80px" height="16px" />
        <SkeletonBase width="100px" height="16px" />
        <SkeletonBase width="120px" height="16px" />
      </div>
    </SkeletonCardContent>
    
    <SkeletonCardFooter>
      <SkeletonButton width="90px" />
      <SkeletonButton width="80px" />
      <SkeletonButton width="85px" />
    </SkeletonCardFooter>
  </SkeletonCard>
);

// Statistics Card Skeleton
export const StatisticCardSkeleton: React.FC = () => (
  <SkeletonCard style={{ textAlign: 'center', padding: theme.spacing[6] }}>
    <div style={{ 
      margin: '0 auto', 
      marginBottom: theme.spacing[4],
      width: '60px',
      height: '60px'
    }}>
      <SkeletonAvatar size="60px" />
    </div>
    <SkeletonBase width="80%" height="36px" marginBottom={theme.spacing[2]} style={{ margin: '0 auto' }} />
    <SkeletonBase width="60%" height="16px" style={{ margin: '0 auto' }} />
  </SkeletonCard>
);

// Document Viewer Skeleton
export const DocumentViewerSkeleton: React.FC = () => (
  <div>
    <SkeletonTitle width="40%" />
    <div style={{ marginTop: theme.spacing[6] }}>
      <SkeletonText lines={1} width="100%" />
      <div style={{ marginTop: theme.spacing[4] }}>
        <SkeletonText lines={8} lastLineWidth="70%" />
      </div>
      <div style={{ marginTop: theme.spacing[6] }}>
        <SkeletonTitle width="30%" />
        <SkeletonText lines={5} lastLineWidth="85%" />
      </div>
    </div>
  </div>
);

// API Explorer Skeleton
export const APIExplorerSkeleton: React.FC = () => (
  <div>
    <div style={{ display: 'flex', gap: theme.spacing[4], marginBottom: theme.spacing[6] }}>
      <SkeletonButton width="120px" />
      <SkeletonButton width="120px" />
      <SkeletonButton width="120px" />
    </div>
    <SkeletonCard>
      <SkeletonTitle width="50%" />
      <div style={{ marginTop: theme.spacing[4] }}>
        <SkeletonText lines={4} />
      </div>
      <div style={{ marginTop: theme.spacing[4], display: 'flex', gap: theme.spacing[2] }}>
        <SkeletonButton width="100px" />
        <SkeletonButton width="100px" />
      </div>
    </SkeletonCard>
  </div>
);

// Grid Skeleton
export const GridSkeleton: React.FC<{ 
  count?: number; 
  columns?: number;
  component: React.ReactNode;
}> = ({ count = 6, columns = 3, component }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 2 ? '450px' : '350px'}, 1fr))`,
      gap: theme.spacing[6],
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{component}</div>
      ))}
    </div>
  );
};

export default SkeletonBase;