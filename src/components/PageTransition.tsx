import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../styles/design-system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const TransitionWrapper = styled.div<{ 
  isTransitioning: boolean; 
  transitionType: string;
  direction?: 'forward' | 'backward';
}>`
  animation: ${props => {
    if (!props.isTransitioning) return 'none';
    
    switch (props.transitionType) {
      case 'slide':
        return css`${props.direction === 'backward' ? slideInFromLeft : slideInFromRight}`;
      case 'scale':
        return css`${scaleIn}`;
      case 'fade':
      default:
        return css`${fadeIn}`;
    }
  }} ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut} forwards;
  
  opacity: ${props => props.isTransitioning ? 0 : 1};
  will-change: transform, opacity;
`;

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  transitionType = 'fade',
  duration = 250 
}) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    // Determine direction based on path depth or custom logic
    const currentDepth = location.pathname.split('/').filter(Boolean).length;
    const previousDepth = previousPath.split('/').filter(Boolean).length;
    
    setDirection(currentDepth >= previousDepth ? 'forward' : 'backward');
    
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousPath(location.pathname);
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, duration, previousPath]);

  return (
    <TransitionWrapper 
      isTransitioning={isTransitioning} 
      transitionType={transitionType}
      direction={direction}
    >
      {children}
    </TransitionWrapper>
  );
};

// Route transition hook for programmatic navigation with transition
export const useRouteTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (callback: () => void, duration = 250) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure DOM update
    }, duration);
  };

  return { isTransitioning, transitionTo };
};

// Enhanced page transition with progressive enhancement
export const EnhancedPageTransition: React.FC<PageTransitionProps & {
  enablePrefetch?: boolean;
  preserveScroll?: boolean;
}> = ({ 
  children, 
  transitionType = 'fade',
  duration = 250,
  enablePrefetch = true,
  preserveScroll = false
}) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'out' | 'in'>('idle');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('out');
      
      const outTimer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('in');
        
        if (!preserveScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        const inTimer = setTimeout(() => {
          setTransitionStage('idle');
        }, duration);
        
        return () => clearTimeout(inTimer);
      }, duration);
      
      return () => clearTimeout(outTimer);
    }
  }, [children, displayChildren, duration, preserveScroll]);

  return (
    <TransitionWrapper 
      isTransitioning={transitionStage !== 'idle'} 
      transitionType={transitionType}
      direction="forward"
      style={{
        opacity: transitionStage === 'out' ? 0 : 1,
        transform: transitionStage === 'out' ? 'translateY(-20px)' : 'translateY(0)'
      }}
    >
      {displayChildren}
    </TransitionWrapper>
  );
};

export default PageTransition;