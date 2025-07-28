import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncProvider, useSyncContext } from '../SyncContext';
import { SyncResult } from '../../services/repositorySync';

// Test component to access context
const TestComponent = () => {
  const { lastSyncResult, syncVersion, updateSyncResult } = useSyncContext();
  return (
    <div>
      <div data-testid="last-sync-result">{JSON.stringify(lastSyncResult)}</div>
      <div data-testid="sync-version">{syncVersion}</div>
      <button 
        data-testid="update-sync" 
        onClick={() => updateSyncResult({
          success: true,
          syncedRepositories: ['repo1'],
          failedRepositories: [],
          message: 'Test sync'
        } as SyncResult)}
      >
        Update Sync
      </button>
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

    const lastSyncResult = screen.getByTestId('last-sync-result');
    expect(lastSyncResult).toHaveTextContent('null');

    const syncVersion = screen.getByTestId('sync-version');
    expect(syncVersion).toHaveTextContent('0');
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

  it('updates sync result and increments version', () => {
    render(
      <SyncProvider>
        <TestComponent />
      </SyncProvider>
    );

    const updateButton = screen.getByTestId('update-sync');
    
    act(() => {
      updateButton.click();
    });

    const lastSyncResult = screen.getByTestId('last-sync-result');
    const expectedResult = {
      success: true,
      syncedRepositories: ['repo1'],
      failedRepositories: [],
      message: 'Test sync'
    };
    expect(lastSyncResult).toHaveTextContent(JSON.stringify(expectedResult));

    const syncVersion = screen.getByTestId('sync-version');
    expect(syncVersion).toHaveTextContent('1');
  });

  it('increments version on each sync update', () => {
    render(
      <SyncProvider>
        <TestComponent />
      </SyncProvider>
    );

    const updateButton = screen.getByTestId('update-sync');
    const syncVersion = screen.getByTestId('sync-version');
    
    expect(syncVersion).toHaveTextContent('0');
    
    act(() => {
      updateButton.click();
    });
    expect(syncVersion).toHaveTextContent('1');
    
    act(() => {
      updateButton.click();
    });
    expect(syncVersion).toHaveTextContent('2');
  });

  it('provides context value to multiple children', () => {
    const TestChild1 = () => {
      const { syncVersion } = useSyncContext();
      return <div data-testid="child1-version">{syncVersion}</div>;
    };
    
    const TestChild2 = () => {
      const { syncVersion } = useSyncContext();
      return <div data-testid="child2-version">{syncVersion}</div>;
    };

    render(
      <SyncProvider>
        <TestChild1 />
        <TestChild2 />
        <TestComponent />
      </SyncProvider>
    );

    const child1Version = screen.getByTestId('child1-version');
    const child2Version = screen.getByTestId('child2-version');
    
    expect(child1Version).toHaveTextContent('0');
    expect(child2Version).toHaveTextContent('0');
    
    // Update sync from TestComponent
    const updateButton = screen.getByTestId('update-sync');
    act(() => {
      updateButton.click();
    });
    
    // Both children should see the update
    expect(child1Version).toHaveTextContent('1');
    expect(child2Version).toHaveTextContent('1');
  });

  it('hook returns correct context value', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SyncProvider>{children}</SyncProvider>
    );

    const { result } = renderHook(() => useSyncContext(), { wrapper });

    expect(result.current.lastSyncResult).toBeNull();
    expect(result.current.syncVersion).toBe(0);
    expect(typeof result.current.updateSyncResult).toBe('function');
  });

  it('hook updates work correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SyncProvider>{children}</SyncProvider>
    );

    const { result } = renderHook(() => useSyncContext(), { wrapper });

    const testResult: SyncResult = {
      success: true,
      syncedRepositories: ['test-repo'],
      failedRepositories: [],
      message: 'Hook test'
    };

    act(() => {
      result.current.updateSyncResult(testResult);
    });

    expect(result.current.lastSyncResult).toEqual(testResult);
    expect(result.current.syncVersion).toBe(1);
  });
});