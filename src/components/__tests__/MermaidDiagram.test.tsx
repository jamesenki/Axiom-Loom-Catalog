/**
 * Mermaid Diagram Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MermaidDiagram } from '../MermaidDiagram';

// Mock mermaid library
const mockMermaidAPI = {
  parse: jest.fn(),
  render: jest.fn()
};

// Mock window.mermaid
(global as any).window = {
  ...global.window,
  mermaid: {
    initialize: jest.fn(),
    mermaidAPI: mockMermaidAPI
  }
};

// Mock document methods for script loading
const mockScript = {
  onload: null as any,
  onerror: null as any,
  src: '',
  async: false
};

const originalCreateElement = document.createElement.bind(document);
document.createElement = jest.fn((tag) => {
  if (tag === 'script') {
    return mockScript as any;
  }
  return originalCreateElement(tag);
});

document.body.appendChild = jest.fn((element) => {
  if (element === mockScript && mockScript.onload) {
    // Simulate successful script load
    setTimeout(() => mockScript.onload(), 0);
  }
  return element;
});

describe('MermaidDiagram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMermaidAPI.parse.mockResolvedValue(true);
    mockMermaidAPI.render.mockResolvedValue({
      svg: '<svg><text>Test Diagram</text></svg>'
    });
  });

  it('renders loading state initially', () => {
    render(<MermaidDiagram content="graph TD; A-->B;" />);
    expect(screen.getByText('Loading Mermaid...')).toBeInTheDocument();
  });

  it('renders diagram successfully', async () => {
    render(<MermaidDiagram content="graph TD; A-->B;" />);
    
    await waitFor(() => {
      const diagramContainer = document.querySelector('.mermaid-diagram-content');
      expect(diagramContainer).toBeInTheDocument();
      expect(diagramContainer?.innerHTML).toContain('<svg><text>Test Diagram</text></svg>');
    });
  });

  it('displays error for invalid syntax', async () => {
    mockMermaidAPI.parse.mockResolvedValue(false);
    
    render(<MermaidDiagram content="invalid mermaid syntax" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to render Mermaid diagram')).toBeInTheDocument();
      expect(screen.getByText('Invalid Mermaid syntax')).toBeInTheDocument();
    });
  });

  it('shows diagram source in error details', async () => {
    mockMermaidAPI.parse.mockRejectedValue(new Error('Parse error'));
    
    render(<MermaidDiagram content="graph TD; A-->B;" />);
    
    await waitFor(() => {
      expect(screen.getByText('View diagram source')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('View diagram source'));
    expect(screen.getByText('graph TD; A-->B;')).toBeInTheDocument();
  });

  it('renders with title', async () => {
    render(
      <MermaidDiagram 
        content="graph TD; A-->B;" 
        title="Test Flow Chart"
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Flow Chart')).toBeInTheDocument();
    });
  });

  it('handles download functionality', async () => {
    // Mock URL and blob creation
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn()
    };
    
    const createElementSpy = jest.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tag) => {
      if (tag === 'a') {
        return mockLink as any;
      }
      if (tag === 'script') {
        return mockScript as any;
      }
      return originalCreateElement(tag);
    });
    
    render(
      <MermaidDiagram 
        content="graph TD; A-->B;" 
        title="Download Test"
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTitle('Download diagram')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTitle('Download diagram'));
    
    expect(mockLink.download).toBe('Download Test.svg');
    expect(mockLink.click).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('applies custom theme', async () => {
    const initializeSpy = (window as any).mermaid.initialize;
    
    render(
      <MermaidDiagram 
        content="graph TD; A-->B;" 
        theme="dark"
      />
    );
    
    await waitFor(() => {
      expect(initializeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ theme: 'dark' })
      );
    });
  });

  it('calls onError callback when error occurs', async () => {
    const onError = jest.fn();
    const mockError = new Error('Render failed');
    
    mockMermaidAPI.render.mockRejectedValue(mockError);
    
    render(
      <MermaidDiagram 
        content="graph TD; A-->B;"
        onError={onError}
      />
    );
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('handles empty content gracefully', async () => {
    mockMermaidAPI.parse.mockResolvedValue(false);
    
    render(<MermaidDiagram content="" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to render Mermaid diagram')).toBeInTheDocument();
    });
  });

  it('re-renders when content changes', async () => {
    const { rerender } = render(<MermaidDiagram content="graph TD; A-->B;" />);
    
    await waitFor(() => {
      expect(mockMermaidAPI.render).toHaveBeenCalledWith(
        expect.any(String),
        'graph TD; A-->B;'
      );
    });
    
    mockMermaidAPI.render.mockClear();
    
    rerender(<MermaidDiagram content="graph LR; C-->D;" />);
    
    await waitFor(() => {
      expect(mockMermaidAPI.render).toHaveBeenCalledWith(
        expect.any(String),
        'graph LR; C-->D;'
      );
    });
  });

  it('handles script loading error', async () => {
    const onError = jest.fn();
    
    // Override appendChild to trigger onerror
    document.body.appendChild = jest.fn((element) => {
      if (element === mockScript && mockScript.onerror) {
        setTimeout(() => mockScript.onerror(new Error('Script load failed')), 0);
      }
      return element;
    });
    
    render(
      <MermaidDiagram 
        content="graph TD; A-->B;"
        onError={onError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load Mermaid library')).toBeInTheDocument();
    });
  });
});