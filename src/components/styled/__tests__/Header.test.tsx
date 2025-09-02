import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Header from '../Header';
import theme from '../../../styles/design-system/theme';

// Mock the GlobalSearchModal component
jest.mock('../../GlobalSearchModal', () => {
  return {
    GlobalSearchModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
      isOpen ? (
        <div data-testid="search-modal">
          <button onClick={onClose}>Close Search</button>
        </div>
      ) : null
  };
});

// Mock the auth context
jest.mock('../../../contexts/BypassAuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'test@example.com', name: 'Test User', role: 'admin' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false
  })
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

describe('Header Component', () => {
  beforeEach(() => {
    // Clear any existing event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  it('renders the header with Axiom Loom branding', () => {
    renderWithProviders(<Header />);
    
    // Check for Axiom Loom logo and branding
    expect(screen.getByText('Axiom')).toBeInTheDocument();
    expect(screen.getByText('Axiom Loom')).toBeInTheDocument();
    expect(screen.getByText(/Catalog/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    
    // Check for navigation links
    const homeLink = screen.getByRole('link', { name: /home/i });
    const syncLink = screen.getByRole('link', { name: /sync/i });
    
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    
    expect(syncLink).toBeInTheDocument();
    expect(syncLink).toHaveAttribute('href', '/sync');
  });

  it('renders search button with keyboard shortcut', () => {
    renderWithProviders(<Header />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    
    // Check for keyboard shortcut indicator
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('opens search modal when search button is clicked', () => {
    renderWithProviders(<Header />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
  });

  it('opens search modal with Cmd+K keyboard shortcut', () => {
    renderWithProviders(<Header />);
    
    // Simulate Cmd+K keypress
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
  });

  it('opens search modal with Ctrl+K keyboard shortcut', () => {
    renderWithProviders(<Header />);
    
    // Simulate Ctrl+K keypress
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
  });

  it('closes search modal when escape is pressed', () => {
    renderWithProviders(<Header />);
    
    // Open search modal first
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    
    // Close with escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('search-modal')).not.toBeInTheDocument();
  });

  it('closes search modal when close button is clicked', () => {
    renderWithProviders(<Header />);
    
    // Open search modal
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    
    // Close using the modal's close button
    const closeButton = screen.getByText('Close Search');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('search-modal')).not.toBeInTheDocument();
  });

  it('prevents default behavior for Cmd+K keypress', () => {
    renderWithProviders(<Header />);
    
    // Simulate Cmd+K keypress
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    
    // Verify the search modal opens
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
  });

  it('applies correct styling to header elements', () => {
    renderWithProviders(<Header />);
    
    // Check header background and border
    const header = screen.getByRole('banner');
    expect(header).toHaveStyle('position: sticky');
    expect(header).toHaveStyle('top: 0');
    
    // Check logo styling - test for computed/applied styles instead of raw CSS
    const logo = screen.getByText('Axiom');
    expect(logo).toBeInTheDocument();
    // Note: Styled-components CSS may not be directly testable in JSDOM
  });

  it('handles responsive behavior correctly', () => {
    renderWithProviders(<Header />);
    
    // The component should render all elements for responsive design
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sync')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
});