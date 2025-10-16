import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DocumentationView from '../DocumentationView';

describe('DocumentationView', () => {
  const renderWithRouter = (repoName: string = 'test-repo') => {
    return render(
      <MemoryRouter initialEntries={[`/docs/${repoName}`]}>
        <Routes>
          <Route path="/docs/:repoName" element={<DocumentationView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders Documentation title with repository name', () => {
    renderWithRouter();
    expect(screen.getByText('📚 Documentation: test-repo')).toBeInTheDocument();
  });

  it('displays the repository name from URL params', () => {
    renderWithRouter('my-docs-repo');
    expect(screen.getByText('📚 Documentation: my-docs-repo')).toBeInTheDocument();
  });

  it('shows coming soon message', () => {
    renderWithRouter();
    expect(screen.getByText('Documentation view with PlantUML rendering coming soon...')).toBeInTheDocument();
  });

  it('has correct text color styling', () => {
    const { container } = renderWithRouter();
    const mainDiv = document.querySelector('div[style]');
    expect(mainDiv).toHaveStyle({ color: 'white', padding: '20px' });
  });

  it('renders with different repository names', () => {
    renderWithRouter('another-docs-repo');
    expect(screen.getByText('📚 Documentation: another-docs-repo')).toBeInTheDocument();
  });

  it('renders correct heading levels', () => {
    renderWithRouter();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('📚 Documentation: test-repo');
  });
});