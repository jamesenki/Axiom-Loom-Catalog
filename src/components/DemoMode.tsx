import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Play, Pause, SkipForward, SkipBack, X, Settings, Maximize } from 'lucide-react';
import { theme } from '../styles/design-system';
import { Button } from './styled';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${props => props.theme.colors.primary.yellow}40;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px ${props => props.theme.colors.primary.yellow}00;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${props => props.theme.colors.primary.yellow}00;
  }
`;

const DemoOverlay = styled.div<{ isActive: boolean; isFullscreen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isFullscreen ? theme.colors.primary.black : 'transparent'};
  z-index: ${props => props.theme.zIndex.modal};
  pointer-events: ${props => props.isActive ? 'all' : 'none'};
  opacity: ${props => props.isActive ? 1 : 0};
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const DemoControls = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: ${props => props.theme.spacing[6]};
  left: 50%;
  transform: translateX(-50%) ${props => props.isVisible ? 'translateY(0)' : 'translateY(120%)'};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[4]};
  box-shadow: ${props => props.theme.shadows.xl};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  z-index: ${props => props.theme.zIndex.modal + 1};
  animation: ${css`${slideUp}`} ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 6px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin: 0 ${props => props.theme.spacing[3]};
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary.yellow}, ${props => props.theme.colors.accent.blue});
  border-radius: ${props => props.theme.borderRadius.full};
  transition: width ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.easeOut};
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  min-width: 120px;
`;

const DemoTooltip = styled.div<{ x: number; y: number; isVisible: boolean }>`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  max-width: 300px;
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex.tooltip};
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'scale(1)' : 'scale(0.8)'};
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${props => props.theme.colors.primary.yellow};
  }
`;

const Spotlight = styled.div<{ x: number; y: number; size: number; isVisible: boolean }>`
  position: fixed;
  left: ${props => props.x - props.size / 2}px;
  top: ${props => props.y - props.size / 2}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid ${props => props.theme.colors.primary.yellow};
  border-radius: ${props => props.theme.borderRadius.full};
  pointer-events: none;
  z-index: ${props => props.theme.zIndex.modal};
  opacity: ${props => props.isVisible ? 1 : 0};
  animation: ${css`${pulse}`} 2s infinite;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.easeOut};
`;

interface DemoStep {
  id: string;
  route: string;
  title: string;
  description: string;
  element?: string;
  duration: number;
  action?: () => void;
}

const demoSteps: DemoStep[] = [
  {
    id: 'home',
    route: '/',
    title: 'Welcome to Axiom Loom Catalog',
    description: 'Your central hub for repositories, APIs, and documentation',
    duration: 3000,
  },
  {
    id: 'stats',
    route: '/',
    title: 'Innovation Dashboard',
    description: 'Real-time statistics showing our development ecosystem',
    element: '[data-testid="statistics-dashboard"]',
    duration: 4000,
  },
  {
    id: 'repositories',
    route: '/',
    title: 'Repository Overview',
    description: 'Browse through our collection of repositories with enhanced cards',
    element: '[data-testid="repository-card"]:first-child',
    duration: 3000,
  },
  {
    id: 'repository-detail',
    route: '/repository/sample-repo',
    title: 'Repository Details',
    description: 'Explore comprehensive repository information and APIs',
    duration: 4000,
  },
  {
    id: 'api-explorer',
    route: '/api-explorer/sample-repo',
    title: 'API Explorer',
    description: 'Interactive API testing and documentation',
    duration: 4000,
  },
  {
    id: 'documentation',
    route: '/docs/sample-repo',
    title: 'Documentation Viewer',
    description: 'Rich markdown documentation with interactive navigation',
    duration: 3000,
  },
];

interface DemoModeProps {
  isActive: boolean;
  onToggle: () => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ isActive, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0, size: 100 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentStep = demoSteps[currentStepIndex];

  const highlightElement = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setSpotlightPosition({
        x: centerX,
        y: centerY,
        size: Math.max(rect.width, rect.height) + 40
      });
      
      setTooltipPosition({
        x: centerX - 150,
        y: rect.top - 80
      });
      
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < demoSteps.length) {
      const step = demoSteps[stepIndex];
      setCurrentStepIndex(stepIndex);
      setProgress(0);
      
      // Navigate to the step's route
      if (step.route !== location.pathname) {
        navigate(step.route);
      }
      
      // Highlight element after navigation
      setTimeout(() => {
        if (step.element) {
          highlightElement(step.element);
        }
        if (step.action) {
          step.action();
        }
      }, 500);
    }
  }, [navigate, location.pathname, highlightElement]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < demoSteps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
      goToStep(0);
    }
  }, [currentStepIndex, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const exitDemo = () => {
    setIsPlaying(false);
    onToggle();
    navigate('/');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Auto-progress timer
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentStep.duration / 100));
        if (newProgress >= 100) {
          nextStep();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, currentStep.duration, nextStep]);

  // Initialize demo when activated
  useEffect(() => {
    if (isActive) {
      goToStep(0);
    }
  }, [isActive, goToStep]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'Escape':
          exitDemo();
          break;
        case 'KeyF':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isActive, nextStep, prevStep]);

  if (!isActive) return null;

  return (
    <>
      <DemoOverlay isActive={isActive} isFullscreen={isFullscreen} />
      
      <Spotlight
        x={spotlightPosition.x}
        y={spotlightPosition.y}
        size={spotlightPosition.size}
        isVisible={isActive && !!currentStep.element}
      />
      
      <DemoTooltip
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        isVisible={isActive}
      >
        <div style={{ fontWeight: theme.typography.fontWeight.bold, marginBottom: theme.spacing[2] }}>
          {currentStep.title}
        </div>
        <div>{currentStep.description}</div>
      </DemoTooltip>
      
      <DemoControls isVisible={isActive}>
        <Button size="sm" onClick={prevStep} disabled={currentStepIndex === 0}>
          <SkipBack size={16} />
        </Button>
        
        <Button size="sm" onClick={togglePlayPause}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button size="sm" onClick={nextStep} disabled={currentStepIndex === demoSteps.length - 1}>
          <SkipForward size={16} />
        </Button>
        
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <StepIndicator>
          Step {currentStepIndex + 1} of {demoSteps.length}
        </StepIndicator>
        
        <Button size="sm" variant="outline" onClick={toggleFullscreen}>
          <Maximize size={16} />
        </Button>
        
        <Button size="sm" variant="outline" onClick={exitDemo}>
          <X size={16} />
        </Button>
      </DemoControls>
    </>
  );
};

// Demo Mode Toggle Button Component
export const DemoModeToggle: React.FC<{ onToggle: () => void }> = ({ onToggle }) => (
  <Button
    onClick={onToggle}
    variant="primary"
    size="sm"
    style={{
      position: 'fixed',
      top: theme.spacing[4],
      right: theme.spacing[4],
      zIndex: theme.zIndex.fixed,
      background: `linear-gradient(45deg, ${props => props.theme.colors.primary.yellow}, ${props => props.theme.colors.accent.blue})`,
      border: 'none',
      boxShadow: theme.shadows.lg,
    }}
  >
    <Play size={16} />
    Demo Mode
  </Button>
);

export default DemoMode;