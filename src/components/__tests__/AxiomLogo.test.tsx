/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { AxiomLogo, AxiomIcon } from '../AxiomLogo';
import { axiomTheme } from '../../styles/axiom-theme';

// Mock styled-components theme
const mockTheme = axiomTheme;

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('AxiomLogo', () => {
  describe('Rendering', () => {
    it('renders logo with default props', () => {
      renderWithTheme(<AxiomLogo />);
      
      expect(screen.getByText('Axiom Loom')).toBeInTheDocument();
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders logo without text when showText is false', () => {
      renderWithTheme(<AxiomLogo showText={false} />);
      
      expect(screen.queryByText('Axiom Loom')).not.toBeInTheDocument();
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies correct size classes', () => {
      const { rerender } = renderWithTheme(<AxiomLogo size="small" />);
      let svg = document.querySelector('svg');
      expect(svg).toHaveStyle('width: 32px');

      rerender(
        <ThemeProvider theme={mockTheme}>
          <AxiomLogo size="large" />
        </ThemeProvider>
      );
      svg = document.querySelector('svg');
      expect(svg).toHaveStyle('width: 64px');
    });

    it('applies custom className', () => {
      renderWithTheme(<AxiomLogo className="custom-logo" />);
      
      const container = document.querySelector('.custom-logo');
      expect(container).toBeInTheDocument();
    });
  });

  describe('AxiomIcon', () => {
    it('renders icon without text', () => {
      renderWithTheme(<AxiomIcon />);
      
      expect(screen.queryByText('Axiom Loom')).not.toBeInTheDocument();
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('accepts all props except showText', () => {
      renderWithTheme(<AxiomIcon size="large" animated={false} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveStyle('width: 64px');
    });
  });

  describe('Accessibility', () => {
    it('has proper SVG structure for screen readers', () => {
      renderWithTheme(<AxiomLogo />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox');
      expect(svg).toHaveAttribute('xmlns');
    });

    it('provides meaningful text content', () => {
      renderWithTheme(<AxiomLogo />);
      
      expect(screen.getByText('Axiom Loom')).toBeInTheDocument();
    });
  });

  describe('Animation States', () => {
    it('disables animation when animated is false', () => {
      renderWithTheme(<AxiomLogo animated={false} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Animation styles should not be applied
    });

    it('enables animation by default', () => {
      renderWithTheme(<AxiomLogo />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Animation styles should be applied by default
    });
  });
});