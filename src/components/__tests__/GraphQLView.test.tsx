import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GraphQLView from '../GraphQLView';

describe('GraphQLView', () => {
  const renderWithRouter = (repoName: string = 'test-repo') => {
    return render(
      <MemoryRouter initialEntries={[`/graphql/${repoName}`]}>
        <Routes>
          <Route path="/graphql/:repoName" element={<GraphQLView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders GraphQL Playground title with emoji and repo name', () => {
    renderWithRouter('graphql-api-repo');
    expect(screen.getByText('🔍 GraphQL Playground: graphql-api-repo')).toBeInTheDocument();
  });

  it('shows coming soon message with schema count', () => {
    renderWithRouter();
    expect(screen.getByText('GraphQL Playground with 19 schemas coming soon...')).toBeInTheDocument();
  });

  it('has correct text color styling', () => {
    const { container } = renderWithRouter();
    const mainDiv = document.querySelector('div[style]');
    expect(mainDiv).toHaveStyle({ color: 'white', padding: '20px' });
  });

  it('renders with demo-labsdashboards repository', () => {
    renderWithRouter('demo-labsdashboards');
    expect(screen.getByText('🔍 GraphQL Playground: demo-labsdashboards')).toBeInTheDocument();
  });

  it('renders correct heading levels', () => {
    renderWithRouter('test-repo');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('🔍 GraphQL Playground: test-repo');
  });
});