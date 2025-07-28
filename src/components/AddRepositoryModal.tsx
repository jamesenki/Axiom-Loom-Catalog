/**
 * Add Repository Modal Component
 * 
 * Allows users to manually add new repositories to the system
 * Validates repository name and verifies it exists on GitHub
 */

import React, { useState } from 'react';
import { repositorySyncService } from '../services/repositorySync';

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (repoName: string) => void;
}

export const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [repoName, setRepoName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const GITHUB_ACCOUNT = '20230011612_EYGS';

  const resetForm = () => {
    setRepoName('');
    setError(null);
    setValidationStatus('idle');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateRepositoryName = (name: string): boolean => {
    // GitHub repository name validation rules
    const validNameRegex = /^[a-zA-Z0-9._-]+$/;
    
    if (!name) {
      setError('Repository name is required');
      return false;
    }
    
    if (name.length > 100) {
      setError('Repository name must be 100 characters or less');
      return false;
    }
    
    if (!validNameRegex.test(name)) {
      setError('Repository name can only contain letters, numbers, dots, hyphens, and underscores');
      return false;
    }
    
    if (name.startsWith('.') || name.endsWith('.')) {
      setError('Repository name cannot start or end with a dot');
      return false;
    }
    
    if (name === '.' || name === '..') {
      setError('Invalid repository name');
      return false;
    }
    
    return true;
  };

  const verifyRepositoryExists = async (name: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/verify-repository/${GITHUB_ACCOUNT}/${name}`);
      return response.ok;
    } catch (error) {
      console.error('Error verifying repository:', error);
      return false;
    }
  };

  const handleValidate = async () => {
    setError(null);
    setValidationStatus('idle');

    if (!validateRepositoryName(repoName)) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    try {
      const exists = await verifyRepositoryExists(repoName);
      if (exists) {
        setValidationStatus('valid');
        setError(null);
      } else {
        setValidationStatus('invalid');
        setError(`Repository "${repoName}" not found in ${GITHUB_ACCOUNT} account`);
      }
    } catch (error) {
      setValidationStatus('invalid');
      setError('Failed to verify repository. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAdd = async () => {
    if (validationStatus !== 'valid') {
      await handleValidate();
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Add repository to local configuration
      const configResponse = await fetch('/api/repositories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          account: GITHUB_ACCOUNT
        })
      });

      if (!configResponse.ok) {
        throw new Error('Failed to add repository to configuration');
      }

      // Sync the newly added repository
      const syncResponse = await fetch(`/api/sync-repository/${repoName}`, {
        method: 'POST'
      });

      if (!syncResponse.ok) {
        throw new Error('Failed to sync repository');
      }

      // Success!
      if (onSuccess) {
        onSuccess(repoName);
      }
      
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add repository');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Repository</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add a repository from the {GITHUB_ACCOUNT} account
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
                Repository Name
              </label>
              <div className="relative">
                <input
                  id="repo-name"
                  type="text"
                  value={repoName}
                  onChange={(e) => {
                    setRepoName(e.target.value);
                    setValidationStatus('idle');
                    setError(null);
                  }}
                  onBlur={handleValidate}
                  placeholder="e.g., my-awesome-project"
                  className={`
                    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                    ${validationStatus === 'valid' ? 'border-green-500 focus:ring-green-500' :
                      validationStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' :
                      'border-gray-300 focus:ring-blue-500'}
                  `}
                  disabled={isValidating || isSyncing}
                />
                {isValidating && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {validationStatus === 'valid' && (
                  <div className="absolute right-2 top-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the repository name exactly as it appears on GitHub
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {validationStatus === 'valid' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  ✓ Repository found and ready to add
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSyncing}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
              ${validationStatus === 'valid' && !isSyncing
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-300 cursor-not-allowed'}
            `}
            disabled={validationStatus !== 'valid' || isSyncing}
          >
            {isSyncing ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </span>
            ) : (
              'Add Repository'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRepositoryModal;