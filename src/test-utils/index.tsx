/**
 * Testing Utilities
 * 
 * Provides custom render functions and testing utilities for the application
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> => {
  const { route = '/', ...renderOptions } = options || {};
  
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockRepository = (overrides = {}) => ({
  name: 'test-repo',
  description: 'Test repository description',
  url: 'https://github.com/test/test-repo',
  lastUpdated: new Date().toISOString(),
  language: 'TypeScript',
  topics: ['testing', 'mock'],
  hasReadme: true,
  hasApiDocs: false,
  ...overrides
});

export const createMockApiDetectionResult = (overrides = {}) => ({
  repository: 'test-repo',
  apis: {
    rest: [],
    graphql: [],
    grpc: []
  },
  hasAnyApis: false,
  recommendedButtons: [],
  ...overrides
});

// Mock timers utilities
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Console mock utilities
export const mockConsole = () => {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });

  return {
    getLogCalls: () => (console.log as jest.Mock).mock.calls,
    getErrorCalls: () => (console.error as jest.Mock).mock.calls,
    getWarnCalls: () => (console.warn as jest.Mock).mock.calls
  };
};