import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { Button, IconButton } from '../Button';
import theme from '../../../styles/design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('renders with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle('background-color: #FFE600'); // EY Yellow
  });

  it('renders different variants correctly', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveStyle('background-color: #FFE600');

    rerender(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Button variant="secondary">Secondary</Button>
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveStyle('background-color: #2E2E38'); // EY Black

    rerender(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Button variant="outline">Outline</Button>
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveStyle('background-color: transparent');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = renderWithTheme(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveStyle('height: 32px');

    rerender(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Button size="md">Medium</Button>
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveStyle('height: 40px');

    rerender(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Button size="lg">Large</Button>
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveStyle('height: 48px');
  });

  it('renders as full width when fullWidth prop is true', () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);
    
    expect(screen.getByRole('button')).toHaveStyle('width: 100%');
  });

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle('opacity: 0.6');
  });

  it('handles click events', () => {
    const mockClick = jest.fn();
    renderWithTheme(<Button onClick={mockClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockClick = jest.fn();
    renderWithTheme(<Button disabled onClick={mockClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).not.toHaveBeenCalled();
  });
});

describe('IconButton Component', () => {
  it('renders with correct dimensions', () => {
    renderWithTheme(
      <IconButton aria-label="icon button">
        <span>Icon</span>
      </IconButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('width: 40px');
    expect(button).toHaveStyle('height: 40px');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = renderWithTheme(
      <IconButton size="sm" aria-label="small icon">
        <span>Icon</span>
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveStyle('width: 32px');

    rerender(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <IconButton size="lg" aria-label="large icon">
            <span>Icon</span>
          </IconButton>
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveStyle('width: 48px');
  });
});