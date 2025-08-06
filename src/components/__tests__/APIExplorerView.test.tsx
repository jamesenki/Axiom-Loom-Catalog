import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import APIExplorerView from '../APIExplorerView';

describe('APIExplorerView', () => {
  const renderWithRouter = (repoName: string = 'test-repo') => {
    return render(
      <MemoryRouter initialEntries={[`/swagger/${repoName}`]}>
        <Routes>
          <Route path="/swagger/:repoName" element={<APIExplorerView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders API Explorer title with emoji and repo name', () => {
    renderWithRouter('my-awesome-repo');
    expect(screen.getByText('🛠️ API Explorer: my-awesome-repo')).toBeInTheDocument();
  });

  it('shows coming soon message', () => {
    renderWithRouter();
    expect(screen.getByText('API Explorer with dynamic detection coming soon...')).toBeInTheDocument();
  });

  it('has correct text color styling', () => {
    const { container } = renderWithRouter();
    const mainDiv = document.querySelector('div[style]');
    expect(mainDiv).toHaveStyle({ color: 'white', padding: '20px' });
  });

  it('renders with different repository name', () => {
    renderWithRouter('another-repo');
    expect(screen.getByText('🛠️ API Explorer: another-repo')).toBeInTheDocument();
  });

  it('renders correct heading levels', () => {
    renderWithRouter('test-repo');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('🛠️ API Explorer: test-repo');
  });
});