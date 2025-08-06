import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { 
  H1, 
  H2, 
  H3, 
  H4, 
  H5, 
  H6, 
  Text, 
  Caption, 
  Overline, 
  Lead, 
  Highlight, 
  Code, 
  BlockQuote 
} from '../Typography';
import theme from '../../../styles/design-system/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Heading Components', () => {
  it('renders H1 with correct styling', () => {
    renderWithTheme(<H1>Heading 1</H1>);
    
    const heading = screen.getByText('Heading 1');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveStyle('font-size: 3rem');
    expect(heading).toHaveStyle('font-weight: 700');
  });

  it('renders H2 with correct styling', () => {
    renderWithTheme(<H2>Heading 2</H2>);
    
    const heading = screen.getByText('Heading 2');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveStyle('font-size: 2.25rem');
  });

  it('renders H3 with correct styling', () => {
    renderWithTheme(<H3>Heading 3</H3>);
    
    const heading = screen.getByText('Heading 3');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
    expect(heading).toHaveStyle('font-size: 1.875rem');
  });

  it('renders H4 with correct styling', () => {
    renderWithTheme(<H4>Heading 4</H4>);
    
    const heading = screen.getByText('Heading 4');
    expect(heading.tagName).toBe('H4');
    expect(heading).toHaveStyle('font-size: 1.5rem');
  });

  it('renders H5 with correct styling', () => {
    renderWithTheme(<H5>Heading 5</H5>);
    
    const heading = screen.getByText('Heading 5');
    expect(heading.tagName).toBe('H5');
    expect(heading).toHaveStyle('font-size: 1.25rem');
  });

  it('renders H6 with correct styling', () => {
    renderWithTheme(<H6>Heading 6</H6>);
    
    const heading = screen.getByText('Heading 6');
    expect(heading.tagName).toBe('H6');
    expect(heading).toHaveStyle('font-size: 1.125rem');
  });

  it('renders headings with custom color', () => {
    renderWithTheme(<H1 color="secondary">Secondary Heading</H1>);
    
    const heading = screen.getByText('Secondary Heading');
    // Check that color is applied (specific color value may vary based on implementation)
    expect(heading).toHaveAttribute('color', 'secondary');
  });

  it('renders headings with custom alignment', () => {
    renderWithTheme(<H1 align="center">Centered Heading</H1>);
    
    const heading = screen.getByText('Centered Heading');
    expect(heading).toHaveStyle('text-align: center');
  });
});

describe('Text Component', () => {
  it('renders with default styling', () => {
    renderWithTheme(<Text>Default text</Text>);
    
    const text = screen.getByText('Default text');
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('P');
    expect(text).toHaveStyle('font-size: 1rem');
    expect(text).toHaveStyle('font-weight: 400');
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<Text size="small">Small text</Text>);
    expect(screen.getByText('Small text')).toHaveStyle('font-size: 0.875rem');

    rerender(
      <ThemeProvider theme={theme}>
        <Text size="large">Large text</Text>
      </ThemeProvider>
    );
    expect(screen.getByText('Large text')).toHaveStyle('font-size: 1.125rem');
  });

  it('renders with custom color', () => {
    renderWithTheme(<Text color="secondary">Secondary text</Text>);
    
    const text = screen.getByText('Secondary text');
    expect(text).toHaveAttribute('color', 'secondary');
  });

  it('renders with custom alignment', () => {
    renderWithTheme(<Text align="center">Centered text</Text>);
    
    const text = screen.getByText('Centered text');
    expect(text).toHaveStyle('text-align: center');
  });

  it('renders with custom font weight', () => {
    renderWithTheme(<Text weight="bold">Bold text</Text>);
    
    const text = screen.getByText('Bold text');
    expect(text).toHaveStyle('font-weight: 700');
  });
});

describe('Caption Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(<Caption>Caption text</Caption>);
    
    const caption = screen.getByText('Caption text');
    expect(caption).toBeInTheDocument();
    expect(caption.tagName).toBe('SPAN');
    expect(caption).toHaveStyle('font-size: 0.75rem');
    expect(caption).toHaveStyle('font-weight: 400');
  });

  it('renders with custom color', () => {
    renderWithTheme(<Caption color="secondary">Secondary caption</Caption>);
    
    const caption = screen.getByText('Secondary caption');
    expect(caption).toHaveAttribute('color', 'secondary');
  });
});

describe('Overline Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(<Overline>Overline text</Overline>);
    
    const overline = screen.getByText('Overline text');
    expect(overline).toBeInTheDocument();
    expect(overline.tagName).toBe('SPAN');
    expect(overline).toHaveStyle('font-size: 0.75rem');
    expect(overline).toHaveStyle('font-weight: 600');
    expect(overline).toHaveStyle('text-transform: uppercase');
  });
});

describe('Lead Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(<Lead>Lead paragraph text</Lead>);
    
    const lead = screen.getByText('Lead paragraph text');
    expect(lead).toBeInTheDocument();
    expect(lead.tagName).toBe('P');
    expect(lead).toHaveStyle('font-size: 1.25rem');
    expect(lead).toHaveStyle('font-weight: 300');
  });

  it('renders with custom color and alignment', () => {
    renderWithTheme(<Lead color="secondary" align="center">Centered lead</Lead>);
    
    const lead = screen.getByText('Centered lead');
    expect(lead).toHaveAttribute('color', 'secondary');
    expect(lead).toHaveStyle('text-align: center');
  });
});

describe('Highlight Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(<Highlight>Highlighted text</Highlight>);
    
    const highlight = screen.getByText('Highlighted text');
    expect(highlight).toBeInTheDocument();
    expect(highlight.tagName).toBe('MARK');
    expect(highlight).toHaveStyle('background-color: #FFE600'); // EY Yellow
    expect(highlight).toHaveStyle('color: #2E2E38'); // EY Black
  });
});

describe('Code Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(<Code>const code = true;</Code>);
    
    const code = screen.getByText('const code = true;');
    expect(code).toBeInTheDocument();
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveStyle('font-size: 0.875rem');
    expect(code).toHaveStyle('background-color: #F5F5F5');
  });
});

describe('BlockQuote Component', () => {
  it('renders with correct styling', () => {
    renderWithTheme(
      <BlockQuote>
        <p>This is a quote</p>
      </BlockQuote>
    );
    
    const paragraph = screen.getByText('This is a quote');
    expect(paragraph).toBeInTheDocument();
    
    // The blockquote is the parent of the paragraph
    const blockquote = paragraph.parentElement;
    expect(blockquote).toHaveStyle('border-left: 4px solid #FFE600'); // EY Yellow
    expect(blockquote).toHaveStyle('font-style: italic');
  });
});