import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncProvider, useSyncContext } from '../SyncContext';

// Test component to access context
const TestComponent = () => {
  const context = useSyncContext();
  return (
    <div>
      <div data-testid="sync-status">{JSON.stringify(context.syncStatus)}</div>
      <div data-testid="last-sync">{JSON.stringify(context.lastSync)}</div>
    </div>
  );
};

describe('SyncContext', () => {
  it('provides default sync context values', () => {
    render(
      <SyncProvider>
        <TestComponent />
      </SyncProvider>
    );

    const syncStatus = screen.getByTestId('sync-status');
    expect(syncStatus).toHaveTextContent(JSON.stringify({
      isInProgress: false,
      totalRepositories: 0,
      completedRepositories: 0,
      errors: []
    }));

    const lastSync = screen.getByTestId('last-sync');
    expect(lastSync).toHaveTextContent(JSON.stringify({
      timestamp: undefined,
      repositories: []
    }));
  });

  it('renders children correctly', () => {
    render(
      <SyncProvider>
        <div data-testid="child">Test Child</div>
      </SyncProvider>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
  });

  it('throws error when useSyncContext is used outside provider', () => {
    // Mock console.error to prevent error output in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSyncContext must be used within a SyncProvider');

    consoleError.mockRestore();
  });
});