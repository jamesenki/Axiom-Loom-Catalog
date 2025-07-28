import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddRepositoryModal } from '../AddRepositoryModal';

// Mock fetch
global.fetch = jest.fn();

describe('AddRepositoryModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders modal when open', () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('heading', { name: 'Add Repository' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., my-awesome-project')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <AddRepositoryModal 
        isOpen={false} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Add Repository')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Click on the backdrop (the outer div)
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('validates empty input', async () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByText('Add Repository'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a repository name')).toBeInTheDocument();
    });
  });

  it('validates invalid repository format', async () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'invalid-format' } });
    fireEvent.click(screen.getByText('Add Repository'));

    await waitFor(() => {
      expect(screen.getByText('Invalid format. Use: owner/repository')).toBeInTheDocument();
    });
  });

  it('submits valid repository successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Repository added successfully' })
    });

    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });
    fireEvent.click(screen.getByText('Add Repository'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoName: 'owner/repo' })
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles server error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to add repository' })
    });

    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });
    fireEvent.click(screen.getByText('Add Repository'));

    await waitFor(() => {
      expect(screen.getByText('Failed to add repository')).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });
    fireEvent.click(screen.getByText('Add Repository'));

    await waitFor(() => {
      expect(screen.getByText('Failed to add repository. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ message: 'Success' })
      }), 100))
    );

    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });
    
    const submitButton = screen.getByText('Add Repository');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  it('clears error when input changes', async () => {
    render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Trigger error
    fireEvent.click(screen.getByText('Add Repository'));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a repository name')).toBeInTheDocument();
    });

    // Change input
    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });

    // Error should be cleared
    expect(screen.queryByText('Please enter a repository name')).not.toBeInTheDocument();
  });

  it('resets form when closed and reopened', async () => {
    const { rerender } = render(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Enter some text
    const input = screen.getByPlaceholderText('owner/repository');
    fireEvent.change(input, { target: { value: 'owner/repo' } });

    // Close modal
    rerender(
      <AddRepositoryModal 
        isOpen={false} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Reopen modal
    rerender(
      <AddRepositoryModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Input should be empty
    const newInput = screen.getByPlaceholderText('owner/repository');
    expect(newInput).toHaveValue('');
  });
});