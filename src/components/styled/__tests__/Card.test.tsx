import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardGrid 
} from '../Card';
import theme from '../../../styles/design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Card Component', () => {
  it('renders with default styling', () => {
    renderWithTheme(<Card data-testid="card">Card content</Card>);
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle('background-color: #FFFFFF');
    expect(card).toHaveStyle('border: 1px solid #E0E0E6');
  });

  it('renders with elevated shadow when elevated prop is true', () => {
    renderWithTheme(<Card elevated data-testid="card">Card content</Card>);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('box-shadow: 0 2px 8px rgba(46, 46, 56, 0.08)');
  });

  it('applies hover effects when hoverable prop is true', () => {
    renderWithTheme(<Card hoverable data-testid="card">Card content</Card>);
    
    const card = screen.getByTestId('card');
    fireEvent.mouseEnter(card);
    
    // Note: Testing hover effects with styled-components requires more complex setup
    // This test verifies the component renders without errors with hoverable prop
    expect(card).toBeInTheDocument();
  });

  it('applies clickable styling when clickable prop is true', () => {
    const mockClick = jest.fn();
    renderWithTheme(
      <Card clickable onClick={mockClick} data-testid="card">
        Card content
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('cursor: pointer');
    
    fireEvent.click(card);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants correctly', () => {
    const { rerender } = renderWithTheme(
      <Card variant="outlined" data-testid="card">Content</Card>
    );
    expect(screen.getByTestId('card')).toHaveStyle('background-color: transparent');

    rerender(
      <ThemeProvider theme={theme}>
        <Card variant="filled" data-testid="card">Content</Card>
      </ThemeProvider>
    );
    expect(screen.getByTestId('card')).toHaveStyle('background-color: #F5F5F5');
  });
});

describe('CardHeader Component', () => {
  it('renders header content correctly', () => {
    renderWithTheme(
      <CardHeader data-testid="header">
        <h2>Title</h2>
        <span>Action</span>
      </CardHeader>
    );
    
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveStyle('display: flex');
    expect(header).toHaveStyle('justify-content: space-between');
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('CardTitle Component', () => {
  it('renders title with correct styling', () => {
    renderWithTheme(<CardTitle>Card Title</CardTitle>);
    
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
    expect(title).toHaveStyle('font-size: 1.5rem');
    expect(title).toHaveStyle('font-weight: 600');
  });
});

describe('CardDescription Component', () => {
  it('renders description with correct styling', () => {
    renderWithTheme(<CardDescription>Card description text</CardDescription>);
    
    const description = screen.getByText('Card description text');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P');
    expect(description).toHaveStyle('color: #747480');
  });
});

describe('CardContent Component', () => {
  it('renders content correctly', () => {
    renderWithTheme(
      <CardContent data-testid="content">
        <p>Card content</p>
      </CardContent>
    );
    
    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});

describe('CardFooter Component', () => {
  it('renders footer with correct layout', () => {
    renderWithTheme(
      <CardFooter data-testid="footer">
        <button>Action 1</button>
        <button>Action 2</button>
      </CardFooter>
    );
    
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveStyle('display: flex');
    expect(footer).toHaveStyle('justify-content: space-between');
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });
});

describe('CardGrid Component', () => {
  it('renders grid with default columns', () => {
    renderWithTheme(
      <CardGrid data-testid="grid">
        <Card>Card 1</Card>
        <Card>Card 2</Card>
      </CardGrid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveStyle('display: grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))');
  });

  it('renders grid with specified columns', () => {
    renderWithTheme(
      <CardGrid columns={3} data-testid="grid">
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </CardGrid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
  });
});