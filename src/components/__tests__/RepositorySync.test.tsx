import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepositorySync from '../RepositorySync';

describe('RepositorySync', () => {
  it('renders sync title with emoji', () => {
    render(<RepositorySync />);
    expect(screen.getByText('🔄 Repository Sync')).toBeInTheDocument();
  });

  it('renders sync status message', () => {
    render(<RepositorySync />);
    expect(screen.getByText('Repository synchronization and cache management coming soon...')).toBeInTheDocument();
  });

  it('has correct text color styling', () => {
    const { container } = render(<RepositorySync />);
    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({ color: 'white', padding: '20px' });
  });

  it('renders correct heading level', () => {
    render(<RepositorySync />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('🔄 Repository Sync');
  });
});