import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock all components
jest.mock('../Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('../RepositoryList', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-list">Repository List</div>,
}));

jest.mock('../RepositoryView', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-view">Repository View</div>,
}));

jest.mock('../DocumentationView', () => ({
  __esModule: true,
  default: () => <div data-testid="documentation-view">Documentation View</div>,
}));

jest.mock('../APIExplorerView', () => ({
  __esModule: true,
  default: () => <div data-testid="api-explorer-view">API Explorer View</div>,
}));

jest.mock('../GraphQLView', () => ({
  __esModule: true,
  default: () => <div data-testid="graphql-view">GraphQL View</div>,
}));

jest.mock('../PostmanView', () => ({
  __esModule: true,
  default: () => <div data-testid="postman-view">Postman View</div>,
}));

jest.mock('../RepositorySync', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-sync">Repository Sync</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders Header component', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('has correct container classes', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeInTheDocument();
    expect(container.querySelector('.main-content')).toBeInTheDocument();
  });

  it('renders repository list by default', () => {
    render(<App />);
    expect(screen.getByTestId('repository-list')).toBeInTheDocument();
  });
});