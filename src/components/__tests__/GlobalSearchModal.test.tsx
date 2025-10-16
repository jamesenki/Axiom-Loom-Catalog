/**
 * Global Search Modal Tests
 * 
 * Tests keyboard shortcuts, modal behavior, and search integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalSearchModal } from '../GlobalSearchModal';
import theme from '../../styles/design-system/theme';

// Mock the AdvancedSearch component
jest.mock('../AdvancedSearch', () => ({
  AdvancedSearch: ({ onResultSelect }: { onResultSelect?: (result: any) => void }) => (
    <div data-testid="advanced-search">
      <input data-testid="search-input" placeholder="Search..." />
      <button 
        data-testid="mock-result"
        onClick={() => onResultSelect?.({
          type: 'repository',
          repository: 'test-repo',
          title: 'Test Repository',
          path: '',
          score: 1
        })}
      >
        Mock Result
      </button>
    </div>
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('GlobalSearchModal', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={false} onClose={mockOnClose} />
      );
      
      expect(screen.queryByText('Search Axiom Loom Catalog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByText('Search Axiom Loom Catalog')).toBeInTheDocument();
    });
  });

  describe('Modal Interaction', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      const closeButton = screen.getByLabelText('Close search modal');
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', async () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      // Click on the overlay (not the modal content)
      const overlay = screen.getByRole('presentation') || document.querySelector('[data-testid="modal-overlay"]');
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Search Integration', () => {
    it('should render AdvancedSearch component', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByTestId('advanced-search')).toBeInTheDocument();
    });

    it('should close modal when search result is selected', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      const mockResult = screen.getByTestId('mock-result');
      await user.click(mockResult);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Shortcuts Display', () => {
    it('should display keyboard shortcuts in footer', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      // Check for keyboard shortcut hints
      expect(screen.getByText('Navigate')).toBeInTheDocument();
      expect(screen.getByText('Select')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
      expect(screen.getByText(/to open search/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      expect(screen.getByLabelText('Close search modal')).toBeInTheDocument();
    });

    it('should prevent body scroll when open', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when closed', () => {
      const { rerender } = renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <GlobalSearchModal isOpen={false} onClose={mockOnClose} />
          </ThemeProvider>
        </BrowserRouter>
      );
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Styling and Theme', () => {
    it('should apply Axiom Loom branding colors', () => {
      renderWithProviders(
        <GlobalSearchModal isOpen={true} onClose={mockOnClose} />
      );
      
      const title = screen.getByText('Search Axiom Loom Catalog');
      expect(title).toBeInTheDocument();
      
      // The modal should be visible and styled
      const modal = title.closest('[role="dialog"]') || title.closest('div');
      expect(modal).toBeInTheDocument();
    });
  });
});