/**
 * PlantUML Diagram Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantUmlDiagram } from '../PlantUmlDiagram';

// Mock fetch
global.fetch = jest.fn();

describe('PlantUmlDiagram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    // Cleanup any object URLs
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<PlantUmlDiagram content="@startuml\nA -> B\n@enduml" />);
    
    expect(screen.getByText('Rendering diagram...')).toBeInTheDocument();
  });

  it('renders diagram successfully', async () => {
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    render(<PlantUmlDiagram content="@startuml\nA -> B\n@enduml" />);
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('displays error when PlantUML content is invalid', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid PlantUML syntax' })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<PlantUmlDiagram content="invalid content" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to render diagram')).toBeInTheDocument();
      expect(screen.getByText('Invalid PlantUML syntax')).toBeInTheDocument();
    });
  });

  it('shows error when no content provided', () => {
    render(<PlantUmlDiagram content="" />);
    
    expect(screen.getByText('No PlantUML content provided')).toBeInTheDocument();
  });

  it('adds @startuml/@enduml if missing', async () => {
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    render(<PlantUmlDiagram content="A -> B" />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/plantuml/render',
        expect.objectContaining({
          body: JSON.stringify({
            content: '@startuml\nA -> B\n@enduml',
            format: 'svg'
          })
        })
      );
    });
  });

  it('handles retry on error', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Network error' })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<PlantUmlDiagram content="@startuml\nA -> B\n@enduml" />);
    
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
    
    // Mock successful response for retry
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const successResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(successResponse);
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    fireEvent.click(screen.getByText('Retry'));
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  it('renders with title', async () => {
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    render(
      <PlantUmlDiagram 
        content="@startuml\nA -> B\n@enduml" 
        title="Test Diagram"
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Diagram')).toBeInTheDocument();
    });
  });

  it('supports PNG format', async () => {
    const mockBlob = new Blob(['binary'], { type: 'image/png' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    render(
      <PlantUmlDiagram 
        content="@startuml\nA -> B\n@enduml" 
        format="png"
      />
    );
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/plantuml/render',
        expect.objectContaining({
          body: JSON.stringify({
            content: '@startuml\nA -> B\n@enduml',
            format: 'png'
          })
        })
      );
    });
  });

  it('handles download functionality', async () => {
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    
    // Mock document methods
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn()
    };
    document.createElement = jest.fn(() => mockLink as any);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    render(
      <PlantUmlDiagram 
        content="@startuml\nA -> B\n@enduml" 
        title="Test Diagram"
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTitle('Download diagram')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTitle('Download diagram'));
    
    expect(mockLink.download).toBe('Test Diagram.svg');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('calls onError callback when error occurs', async () => {
    const onError = jest.fn();
    const mockError = new Error('Render failed');
    
    (global.fetch as jest.Mock).mockRejectedValue(mockError);
    
    render(
      <PlantUmlDiagram 
        content="@startuml\nA -> B\n@enduml"
        onError={onError}
      />
    );
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('cleans up object URLs on unmount', async () => {
    const mockBlob = new Blob(['<svg>test</svg>'], { type: 'image/svg+xml' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const mockUrl = 'blob:mock-url';
    global.URL.createObjectURL = jest.fn(() => mockUrl);
    global.URL.revokeObjectURL = jest.fn();
    
    const { unmount } = render(
      <PlantUmlDiagram content="@startuml\nA -> B\n@enduml" />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
    
    unmount();
    
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  });
});