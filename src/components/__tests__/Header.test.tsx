import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  it('renders the header title', () => {
    renderWithRouter();
    expect(screen.getByText('🏢 EYNS AI Experience Center')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = renderWithRouter();
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveStyle({
      background: 'rgba(0,0,0,0.1)',
      padding: '10px 20px'
    });
  });

  it('renders navigation links', () => {
    renderWithRouter();
    expect(screen.getByText('🏠 Home')).toBeInTheDocument();
    expect(screen.getByText('🔄 Sync')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    renderWithRouter();
    const homeLink = screen.getByText('🏠 Home').closest('a');
    const syncLink = screen.getByText('🔄 Sync').closest('a');
    const titleLink = screen.getByText('🏢 EYNS AI Experience Center').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(syncLink).toHaveAttribute('href', '/sync');
    expect(titleLink).toHaveAttribute('href', '/');
  });
});