import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostmanView from '../PostmanView';

describe('PostmanView', () => {
  const renderWithRouter = (repoName: string = 'test-repo') => {
    return render(
      <MemoryRouter initialEntries={[`/postman/${repoName}`]}>
        <Routes>
          <Route path="/postman/:repoName" element={<PostmanView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders Postman Collection title with emoji and repo name', () => {
    renderWithRouter('api-collection-repo');
    expect(screen.getByText('📮 Postman Collections: api-collection-repo')).toBeInTheDocument();
  });

  it('shows coming soon message', () => {
    renderWithRouter();
    expect(screen.getByText('Postman collections view coming soon...')).toBeInTheDocument();
  });

  it('has correct text color styling', () => {
    const { container } = renderWithRouter();
    const mainDiv = container.querySelector('div[style]');
    expect(mainDiv).toHaveStyle({ color: 'white', padding: '20px' });
  });

  it('renders with different repository name', () => {
    renderWithRouter('another-api-repo');
    expect(screen.getByText('📮 Postman Collections: another-api-repo')).toBeInTheDocument();
  });

  it('renders correct heading levels', () => {
    renderWithRouter('test-repo');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('📮 Postman Collections: test-repo');
  });
});