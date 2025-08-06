import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock App component
jest.mock('../App', () => ({
  __esModule: true,
  default: () => <div>App Component</div>
}));

// Mock index.css
jest.mock('../index.css', () => ({}));

describe('index.tsx', () => {
  let rootElement: HTMLElement;
  let mockRoot: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset modules to avoid re-import issues
    jest.resetModules();

    // Create a root element
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Setup mock root
    mockRoot = {
      render: jest.fn()
    };
    (ReactDOM.createRoot as jest.Mock).mockReturnValue(mockRoot);
  });

  afterEach(() => {
    // Clean up
    if (document.body.contains(rootElement)) {
      document.body.removeChild(rootElement);
    }
  });

  it('creates root on the correct DOM element', () => {
    // Import index.tsx (this will execute the code)
    jest.isolateModules(() => {
      require('../index');
    });

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('renders App component in StrictMode', () => {
    // Import index.tsx
    jest.isolateModules(() => {
      require('../index');
    });

    expect(mockRoot.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });

  it('calls render exactly once', () => {
    // Import index.tsx
    jest.isolateModules(() => {
      require('../index');
    });

    expect(mockRoot.render).toHaveBeenCalledTimes(1);
  });

  it('handles missing root element gracefully', () => {
    // Remove root element
    document.body.removeChild(rootElement);

    // This should throw or handle the error
    expect(() => {
      jest.isolateModules(() => {
        require('../index');
      });
    }).toThrow('Failed to find the root element');
  });
});