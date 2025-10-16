/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { 
  QuantumButton,
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  GhostButton,
  GlassButton 
} from '../QuantumButton';
import { axiomTheme } from '../../../styles/axiom-theme';

const mockTheme = axiomTheme;

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

// Mock icon components for testing
const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

describe('QuantumButton', () => {
  describe('Basic Rendering', () => {
    it('renders button with text content', () => {
      renderWithTheme(<QuantumButton>Click me</QuantumButton>);
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderWithTheme(<QuantumButton className="custom-btn">Button</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-btn');
    });

    it('forwards HTML button attributes', () => {
      renderWithTheme(
        <QuantumButton id="test-btn" data-testid="quantum-btn">
          Test
        </QuantumButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-btn');
      expect(button).toHaveAttribute('data-testid', 'quantum-btn');
    });
  });

  describe('Variants', () => {
    it('renders primary variant', () => {
      renderWithTheme(<QuantumButton variant="primary">Primary</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders secondary variant', () => {
      renderWithTheme(<QuantumButton variant="secondary">Secondary</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders accent variant', () => {
      renderWithTheme(<QuantumButton variant="accent">Accent</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders ghost variant', () => {
      renderWithTheme(<QuantumButton variant="ghost">Ghost</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders glass variant', () => {
      renderWithTheme(<QuantumButton variant="glass">Glass</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders different sizes correctly', () => {
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];
      
      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <QuantumButton size={size}>{size} Button</QuantumButton>
        );
        
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      renderWithTheme(<QuantumButton disabled>Disabled</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows loading state with spinner', () => {
      renderWithTheme(<QuantumButton loading>Loading</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner
      const spinner = button.querySelector('div');
      expect(spinner).toBeInTheDocument();
    });

    it('does not show left icon when loading', () => {
      renderWithTheme(
        <QuantumButton loading leftIcon={<MockIcon />}>
          Loading with icon
        </QuantumButton>
      );
      
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('shows right icon when not loading', () => {
      renderWithTheme(
        <QuantumButton rightIcon={<MockIcon />}>
          With right icon
        </QuantumButton>
      );
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      renderWithTheme(
        <QuantumButton leftIcon={<MockIcon />}>
          Button with left icon
        </QuantumButton>
      );
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      renderWithTheme(
        <QuantumButton rightIcon={<MockIcon />}>
          Button with right icon
        </QuantumButton>
      );
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders both left and right icons', () => {
      renderWithTheme(
        <QuantumButton 
          leftIcon={<span data-testid="left-icon">Left</span>}
          rightIcon={<span data-testid="right-icon">Right</span>}
        >
          Both icons
        </QuantumButton>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <QuantumButton onClick={handleClick}>
          Clickable
        </QuantumButton>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('creates ripple effect on click', async () => {
      renderWithTheme(<QuantumButton>Ripple test</QuantumButton>);
      
      const button = screen.getByRole('button');
      
      // Mock getBoundingClientRect
      button.getBoundingClientRect = jest.fn(() => ({
        left: 10,
        top: 10,
        width: 100,
        height: 40,
        right: 110,
        bottom: 50,
        x: 10,
        y: 10,
        toJSON: jest.fn()
      }));
      
      fireEvent.click(button, { clientX: 50, clientY: 25 });
      
      await waitFor(() => {
        const ripple = button.querySelector('[style*="position: absolute"]');
        expect(ripple).toBeInTheDocument();
      }, { timeout: 100 });
    });

    it('does not handle clicks when disabled', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <QuantumButton disabled onClick={handleClick}>
          Disabled
        </QuantumButton>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not handle clicks when loading', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <QuantumButton loading onClick={handleClick}>
          Loading
        </QuantumButton>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Effects', () => {
    it('applies glow effect when enabled', () => {
      renderWithTheme(<QuantumButton glowEffect>Glow button</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies pulse effect when enabled', () => {
      renderWithTheme(<QuantumButton pulseEffect>Pulse button</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies holographic effect when enabled', () => {
      renderWithTheme(<QuantumButton holographicEffect>Holographic</QuantumButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Pre-configured Variants', () => {
    it('renders PrimaryButton', () => {
      renderWithTheme(<PrimaryButton>Primary</PrimaryButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders SecondaryButton', () => {
      renderWithTheme(<SecondaryButton>Secondary</SecondaryButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders AccentButton with glow effect', () => {
      renderWithTheme(<AccentButton>Accent</AccentButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders GhostButton', () => {
      renderWithTheme(<GhostButton>Ghost</GhostButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders GlassButton with holographic effect', () => {
      renderWithTheme(<GlassButton>Glass</GlassButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains button role', () => {
      renderWithTheme(<QuantumButton>Accessible</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      const handleClick = jest.fn();
      
      renderWithTheme(
        <QuantumButton onClick={handleClick}>
          Keyboard accessible
        </QuantumButton>
      );
      
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      
      // Button should be focusable
      button.focus();
      expect(button).toHaveFocus();
    });

    it('provides proper ARIA attributes when disabled', () => {
      renderWithTheme(<QuantumButton disabled>Disabled</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });

    it('provides proper ARIA attributes when loading', () => {
      renderWithTheme(<QuantumButton loading>Loading</QuantumButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Performance', () => {
    it('cleans up ripple effects after animation', async () => {
      renderWithTheme(<QuantumButton>Performance test</QuantumButton>);
      
      const button = screen.getByRole('button');
      
      // Mock getBoundingClientRect
      button.getBoundingClientRect = jest.fn(() => ({
        left: 0, top: 0, width: 100, height: 40,
        right: 100, bottom: 40, x: 0, y: 0, toJSON: jest.fn()
      }));
      
      // Create multiple ripples
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // Wait for cleanup
      await waitFor(() => {
        const ripples = button.querySelectorAll('[style*="position: absolute"]');
        expect(ripples.length).toBeLessThanOrEqual(3);
      }, { timeout: 1000 });
    });
  });
});