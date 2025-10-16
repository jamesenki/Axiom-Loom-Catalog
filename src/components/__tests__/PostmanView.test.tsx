/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import PostmanView from '../PostmanView';
import theme from '../../styles/design-system/theme';

// Mock fetch
global.fetch = jest.fn();

describe('PostmanView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ collections: [] })
    });
  });

  const renderWithRouter = (repoName: string = 'test-repo') => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[`/postman/${repoName}`]}>
          <Routes>
            <Route path="/postman/:repoName" element={<PostmanView />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  it('renders no collections message when empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    renderWithRouter('api-collection-repo');
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading Postman collections...')).not.toBeInTheDocument();
    });
    
    expect(await screen.findByText('📮 No Postman Collections Found')).toBeInTheDocument();
  });

  it('shows appropriate message for no collections', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    renderWithRouter();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading Postman collections...')).not.toBeInTheDocument();
    });
    
    expect(await screen.findByText('This repository does not have any Postman collections.')).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    renderWithRouter();
    expect(screen.getByText('Loading Postman collections...')).toBeInTheDocument();
  });

  it('renders with collections when available', async () => {
    const mockCollections = [{
      name: 'Test Collection',
      path: '/collections/test.json',
      info: {
        name: 'Test API Collection',
        description: 'Test collection description',
        schema: '2.1.0'
      }
    }];
    
    const mockCollectionData = {
      info: {
        name: 'Test API Collection',
        description: 'Test collection description',
        schema: '2.1.0'
      },
      item: []
    };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollections
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCollectionData
      });
    
    renderWithRouter('api-repo');
    
    // Wait for the collections to load
    expect(await screen.findByText('Test API Collection')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    renderWithRouter();
    
    expect(await screen.findByText('📮 No Postman Collections Found')).toBeInTheDocument();
  });
});