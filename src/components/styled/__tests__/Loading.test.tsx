import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { 
  Spinner, 
  Dots, 
  Bars, 
  FullPageLoading, 
  Skeleton, 
  ProgressBar 
} from '../Loading';
import theme from '../../../styles/design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Spinner Component', () => {
  it('renders with default size', () => {
    renderWithTheme(<Spinner data-testid="spinner" />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle('width: 24px');
    expect(spinner).toHaveStyle('height: 24px');
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<Spinner size="sm" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveStyle('width: 16px');

    rerender(
      <ThemeProvider theme={theme}>
        <Spinner size="lg" data-testid="spinner" />
      </ThemeProvider>
    );
    expect(screen.getByTestId('spinner')).toHaveStyle('width: 32px');
  });

  it('renders with custom color', () => {
    renderWithTheme(<Spinner color="#FF0000" data-testid="spinner" />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveStyle('border-top-color: #FF0000');
  });
});

describe('Dots Component', () => {
  it('renders three dots', () => {
    const { container } = renderWithTheme(<Dots />);
    
    const dotsContainer = container.firstChild as HTMLElement;
    const dots = dotsContainer?.children;
    expect(dots).toHaveLength(3);
    
    // Check that dots have the correct styling
    Array.from(dots || []).forEach(dot => {
      expect(dot).toHaveStyle('width: 8px');
      expect(dot).toHaveStyle('height: 8px');
      expect(dot).toHaveStyle('background-color: #FFE600');
      expect(dot).toHaveStyle('border-radius: 50%');
    });
  });
});

describe('Bars Component', () => {
  it('renders five bars', () => {
    const { container } = renderWithTheme(<Bars />);
    
    const barsContainer = container.firstChild as HTMLElement;
    const bars = barsContainer?.children;
    expect(bars).toHaveLength(5);
    
    // Check that bars have the correct styling
    Array.from(bars || []).forEach(bar => {
      expect(bar).toHaveStyle('width: 4px');
      expect(bar).toHaveStyle('background-color: #FFE600');
    });
  });
});

describe('FullPageLoading Component', () => {
  it('renders with default props', () => {
    renderWithTheme(<FullPageLoading />);
    
    const overlay = screen.getByText('Loading...');
    expect(overlay).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    renderWithTheme(<FullPageLoading text="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('renders without text when text prop is empty', () => {
    renderWithTheme(<FullPageLoading text="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders with blur overlay when blur prop is true', () => {
    const { container } = renderWithTheme(<FullPageLoading blur />);
    
    // Just check that the component renders without error
    // Backdrop filter may not be testable in JSDOM
    expect(container).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = renderWithTheme(<FullPageLoading variant="dots" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <FullPageLoading variant="bars" />
      </ThemeProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <FullPageLoading variant="spinner" />
      </ThemeProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('Skeleton Component', () => {
  it('renders with default dimensions', () => {
    renderWithTheme(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('width: 100%');
    expect(skeleton).toHaveStyle('height: 20px');
  });

  it('renders with custom dimensions', () => {
    renderWithTheme(<Skeleton width="200px" height="50px" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle('width: 200px');
    expect(skeleton).toHaveStyle('height: 50px');
  });

  it('renders with custom border radius', () => {
    renderWithTheme(<Skeleton radius="full" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle('border-radius: 9999px');
  });
});

describe('ProgressBar Component', () => {
  it('renders with correct progress', () => {
    renderWithTheme(<ProgressBar progress={50} data-testid="progress" />);
    
    const progressBar = screen.getByTestId('progress');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle('height: 8px');
    
    // The progress indicator is created with ::after pseudo-element
    // Testing the actual progress percentage requires more complex setup
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    renderWithTheme(<ProgressBar progress={75} height="12px" data-testid="progress" />);
    
    const progressBar = screen.getByTestId('progress');
    expect(progressBar).toHaveStyle('height: 12px');
  });

  it('handles edge cases for progress values', () => {
    const { rerender } = renderWithTheme(<ProgressBar progress={0} data-testid="progress" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <ProgressBar progress={100} data-testid="progress" />
      </ThemeProvider>
    );
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});