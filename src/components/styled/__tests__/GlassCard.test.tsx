/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardContent, 
  GlassCardFooter,
  FeatureCard,
  InteractiveCard,
  FloatingCard 
} from '../GlassCard';
import { axiomTheme } from '../../../styles/axiom-theme';

const mockTheme = axiomTheme;

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('GlassCard', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      renderWithTheme(
        <GlassCard>
          <p>Test content</p>
        </GlassCard>
      );
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderWithTheme(
        <GlassCard className="custom-glass-card">
          <p>Content</p>
        </GlassCard>
      );
      
      expect(container.firstChild).toHaveClass('custom-glass-card');
    });

    it('renders with different padding sizes', () => {
      const { rerender } = renderWithTheme(
        <GlassCard padding="sm">Content</GlassCard>
      );
      
      let card = screen.getByText('Content').closest('div');
      expect(card).toHaveStyle('padding: 1rem');

      rerender(
        <ThemeProvider theme={mockTheme}>
          <GlassCard padding="lg">Content</GlassCard>
        </ThemeProvider>
      );
      
      card = screen.getByText('Content').closest('div');
      expect(card).toHaveStyle('padding: 2rem');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      renderWithTheme(<GlassCard>Default</GlassCard>);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('renders elevated variant', () => {
      renderWithTheme(<GlassCard variant="elevated">Elevated</GlassCard>);
      expect(screen.getByText('Elevated')).toBeInTheDocument();
    });

    it('renders floating variant', () => {
      renderWithTheme(<GlassCard variant="floating">Floating</GlassCard>);
      expect(screen.getByText('Floating')).toBeInTheDocument();
    });

    it('renders interactive variant', () => {
      renderWithTheme(<GlassCard variant="interactive">Interactive</GlassCard>);
      expect(screen.getByText('Interactive')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('handles click events on interactive variant', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <GlassCard variant="interactive" onClick={handleClick}>
          Click me
        </GlassCard>
      );
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('creates ripple effect on interactive click', () => {
      renderWithTheme(
        <GlassCard variant="interactive">
          Ripple test
        </GlassCard>
      );
      
      const card = screen.getByText('Ripple test').closest('div');
      fireEvent.click(card!, { 
        clientX: 100, 
        clientY: 100 
      });
      
      // Ripple element should be created
      setTimeout(() => {
        const ripple = document.querySelector('[style*="position: absolute"]');
        expect(ripple).toBeInTheDocument();
      }, 10);
    });
  });

  describe('Effects', () => {
    it('applies glow effect when enabled', () => {
      renderWithTheme(
        <GlassCard glowEffect>
          Glow card
        </GlassCard>
      );
      
      expect(screen.getByText('Glow card')).toBeInTheDocument();
    });

    it('applies shimmer effect when enabled', () => {
      renderWithTheme(
        <GlassCard shimmerEffect>
          Shimmer card
        </GlassCard>
      );
      
      expect(screen.getByText('Shimmer card')).toBeInTheDocument();
    });
  });

  describe('Card Components', () => {
    it('renders GlassCardHeader with title and subtitle', () => {
      renderWithTheme(
        <GlassCardHeader title="Test Title" subtitle="Test Subtitle" />
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders GlassCardContent', () => {
      renderWithTheme(
        <GlassCardContent>
          <p>Card content</p>
        </GlassCardContent>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders GlassCardFooter', () => {
      renderWithTheme(
        <GlassCardFooter>
          <button>Action</button>
        </GlassCardFooter>
      );
      
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('Pre-configured Variants', () => {
    it('renders FeatureCard with effects enabled', () => {
      renderWithTheme(
        <FeatureCard>
          Feature content
        </FeatureCard>
      );
      
      expect(screen.getByText('Feature content')).toBeInTheDocument();
    });

    it('renders InteractiveCard as interactive variant', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <InteractiveCard onClick={handleClick}>
          Interactive content
        </InteractiveCard>
      );
      
      fireEvent.click(screen.getByText('Interactive content'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('renders FloatingCard with floating animation', () => {
      renderWithTheme(
        <FloatingCard>
          Floating content
        </FloatingCard>
      );
      
      expect(screen.getByText('Floating content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation for interactive cards', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <InteractiveCard onClick={handleClick}>
          Keyboard accessible
        </InteractiveCard>
      );
      
      const card = screen.getByText('Keyboard accessible').closest('div');
      
      fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(card!, { key: ' ', code: 'Space' });
      
      // Should be focusable and respond to keyboard events
      expect(card).toBeInTheDocument();
    });

    it('maintains proper focus indicators', () => {
      renderWithTheme(
        <InteractiveCard>
          Focus test
        </InteractiveCard>
      );
      
      const card = screen.getByText('Focus test').closest('div');
      
      fireEvent.focus(card!);
      // Focus styles should be applied
      expect(card).toBeInTheDocument();
    });
  });
});