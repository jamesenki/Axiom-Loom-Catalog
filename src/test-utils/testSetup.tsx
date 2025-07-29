/**
 * Test Setup Configuration
 * 
 * Provides global test configuration and setup
 */

import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test timeout
jest.setTimeout(10000);

// Mock modules that are problematic in tests
jest.mock('highlight.js', () => ({
  highlightElement: jest.fn(),
  highlightAll: jest.fn(),
  highlight: jest.fn(() => ({ value: 'mocked' })),
  listLanguages: jest.fn(() => ['javascript', 'typescript', 'json']),
  getLanguage: jest.fn(() => ({ name: 'JavaScript' })),
  registerLanguage: jest.fn()
}));

// Mock markdown-related modules
jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: string }) => <div>{children}</div>
  };
});

// Mock file system access
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(() => []),
  statSync: jest.fn(() => ({ isDirectory: () => true, mtime: new Date() }))
}));

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn(() => ''),
  exec: jest.fn((cmd, callback) => callback(null, '', '')),
  spawn: jest.fn()
}));

// Global test helpers
global.testHelpers = {
  // Wait for next tick
  nextTick: () => new Promise(resolve => setImmediate(resolve)),
  
  // Wait for promises to resolve
  flushPromises: () => new Promise(resolve => setImmediate(resolve)),
  
  // Mock fetch
  mockFetch: (response: any) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response))
      } as Response)
    );
  }
};

// Suppress specific console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Suppress specific warnings
    if (
      args[0]?.includes('ReactDOM.render') ||
      args[0]?.includes('deprecated') ||
      args[0]?.includes('Warning:')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    // Suppress specific errors
    if (
      args[0]?.includes('Warning:') ||
      args[0]?.includes('act()')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Export type definitions for global test helpers
declare global {
  namespace NodeJS {
    interface Global {
      testHelpers: {
        nextTick: () => Promise<void>;
        flushPromises: () => Promise<void>;
        mockFetch: (response: any) => void;
      };
    }
  }
}

export {};