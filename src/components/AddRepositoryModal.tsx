/**
 * Enhanced Add Repository Modal Component
 * 
 * Features:
 * - Automatic authorization checking
 * - Secure token management with account-specific naming
 * - Support for organization-wide tokens
 * - Token validation and scope checking
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TokenService from '../services/tokenService';
import { getApiUrl } from '../utils/apiConfig';

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (repoName: string) => void;
}

interface ParsedRepository {
  owner: string;
  name: string;
}

interface ValidationResult {
  exists: boolean;
  needsAuth?: boolean;
  error?: string;
  isPrivate?: boolean;
  visibility?: string;
  name?: string;
}

export const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [repoInput, setRepoInput] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [tokenAccountName, setTokenAccountName] = useState('');
  const [saveTokenForOrg, setSaveTokenForOrg] = useState(false);
  const [showTokenField, setShowTokenField] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [tokenValidationStatus, setTokenValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [parsedRepo, setParsedRepo] = useState<ParsedRepository | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [existingTokenInfo, setExistingTokenInfo] = useState<any>(null);
  const [tokenUsername, setTokenUsername] = useState<string>('');

  const DEFAULT_GITHUB_ACCOUNT = '2030011612_EYGS';

  const resetForm = () => {
    setRepoInput('');
    setGithubToken('');
    setTokenAccountName('');
    setSaveTokenForOrg(false);
    setShowTokenField(false);
    setError(null);
    setValidationStatus('idle');
    setTokenValidationStatus('idle');
    setParsedRepo(null);
    setRequiresAuth(false);
    setExistingTokenInfo(null);
    setTokenUsername('');
  };

  const parseGitHubUrl = (input: string): ParsedRepository | null => {
    const trimmedInput = input.trim();
    
    // If it looks like a URL, try to parse it
    if (trimmedInput.includes('github.com') || trimmedInput.startsWith('http')) {
      try {
        // Handle various GitHub URL formats
        let url = trimmedInput;
        
        // Add https:// if missing
        if (!url.startsWith('http')) {
          url = 'https://' + url;
        }
        
        // Remove .git suffix if present
        url = url.replace(/\.git$/, '');
        
        const urlObj = new URL(url);
        
        // Check if it's a GitHub URL
        if (urlObj.hostname !== 'github.com') {
          return null;
        }
        
        // Extract owner and repo from pathname
        const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
        
        if (pathParts.length >= 2) {
          return {
            owner: pathParts[0],
            name: pathParts[1]
          };
        }
      } catch (error) {
        return null;
      }
    } else {
      // If it doesn't look like a URL, treat it as just a repository name
      if (trimmedInput && !trimmedInput.includes('/')) {
        return {
          owner: DEFAULT_GITHUB_ACCOUNT,
          name: trimmedInput
        };
      }
      
      // Handle owner/repo format
      if (trimmedInput.includes('/')) {
        const parts = trimmedInput.split('/');
        if (parts.length === 2 && parts[0] && parts[1]) {
          return {
            owner: parts[0],
            name: parts[1]
          };
        }
      }
    }
    
    return null;
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

  const verifyRepositoryExists = async (
    owner: string, 
    name: string, 
    token?: string
  ): Promise<ValidationResult> => {
    try {
      // Try POST endpoint with optional token
      const response = await fetch(getApiUrl(`/api/verify-repository/${owner}/${name}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token || undefined })
      });
      
      if (response.ok) {
        return { exists: true };
      } else if (response.status === 401) {
        const data = await response.json();
        return { exists: false, needsAuth: true, error: data.error };
      } else if (response.status === 404) {
        const data = await response.json();
        return { exists: false, error: data.error };
      } else {
        return { exists: false, error: 'Unexpected error occurred' };
      }
    } catch (error) {
      console.error('Error verifying repository:', error);
      return { exists: false, error: 'Network error occurred' };
    }
  };

  const validateGitHubToken = async () => {
    if (!githubToken) {
      setTokenValidationStatus('invalid');
      setError('Please enter a GitHub token');
      return;
    }

    setIsValidatingToken(true);
    setError(null);

    try {
      const result = await TokenService.validateToken(githubToken);
      
      if (result.valid) {
        setTokenValidationStatus('valid');
        setTokenUsername(result.username || '');
        
        // Auto-fill account name if empty
        if (!tokenAccountName && result.username) {
          setTokenAccountName(`${result.username}'s GitHub Account`);
        }
        
        // If we have a parsed repo, retry validation with the token
        if (parsedRepo && requiresAuth) {
          await handleValidate();
        }
      } else {
        setTokenValidationStatus('invalid');
        setError(result.error || 'Invalid token');
      }
    } catch (error) {
      setTokenValidationStatus('invalid');
      setError('Failed to validate token');
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleValidate = async () => {
    setError(null);
    setValidationStatus('idle');
    setParsedRepo(null);

    if (!repoInput.trim()) {
      setError('Repository name or URL is required');
      setValidationStatus('invalid');
      return;
    }

    const parsed = parseGitHubUrl(repoInput);
    if (!parsed) {
      setError('Invalid repository name or GitHub URL format');
      setValidationStatus('invalid');
      return;
    }

    if (!validateRepositoryName(parsed.name)) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setParsedRepo(parsed);

    try {
      // Check if we have a stored token for this repository
      let tokenToUse = githubToken;
      
      if (!tokenToUse) {
        tokenToUse = TokenService.getToken(parsed.owner, parsed.name) || '';
        if (tokenToUse) {
          const info = TokenService.getTokenInfo(parsed.owner, parsed.name);
          setExistingTokenInfo(info);
        }
      }

      // First try without token - the server will check if gh CLI has auth
      const result = await verifyRepositoryExists(parsed.owner, parsed.name, tokenToUse);
      
      if (result.exists) {
        setValidationStatus('valid');
        setError(null);
        setRequiresAuth(false);
        setShowTokenField(false);
        
        // Note if it's a private repo that we accessed via gh auth
        if (result.isPrivate && !tokenToUse) {
          setError(null); // Clear any error
        }
      } else if (result.needsAuth && !tokenToUse) {
        setValidationStatus('invalid');
        
        // More helpful error message
        if (result.error && result.error.includes('private repository')) {
          setError(`This appears to be a private repository. The GitHub CLI may not have access to this account. You can either:
1. Run: gh auth login --hostname github.com
2. Or provide a personal access token below`);
        } else {
          setError(result.error || `This repository requires authentication. Please provide a GitHub personal access token.`);
        }
        
        setRequiresAuth(true);
        setShowTokenField(true);
        
        // Suggest a default account name
        setTokenAccountName(`${parsed.owner} Account`);
      } else {
        setValidationStatus('invalid');
        
        // Provide clearer error messages
        if (result.error) {
          setError(result.error);
        } else {
          setError(`Repository "${parsed.owner}/${parsed.name}" not found. Please check the repository name and try again.`);
        }
        
        // Don't automatically show token field if repo doesn't exist
        if (result.needsAuth || (result.error && result.error.includes('private'))) {
          setShowTokenField(true);
          setRequiresAuth(true);
        }
      }
    } catch (error) {
      setValidationStatus('invalid');
      setError('Failed to verify repository. Please check your internet connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAdd = async () => {
    if (validationStatus !== 'valid' || !parsedRepo) {
      await handleValidate();
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Save token if provided and not already saved
      if (githubToken && tokenAccountName && !existingTokenInfo) {
        const repoToSave = saveTokenForOrg ? null : parsedRepo.name;
        await TokenService.storeToken(
          parsedRepo.owner,
          repoToSave,
          githubToken,
          tokenAccountName
        );
      }

      // Add repository to local configuration
      const configResponse = await fetch(getApiUrl('/api/repositories/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: parsedRepo.name,
          account: parsedRepo.owner,
          token: githubToken || TokenService.getToken(parsedRepo.owner, parsedRepo.name) || undefined
        })
      });

      if (!configResponse.ok) {
        const errorData = await configResponse.json();
        throw new Error(errorData.error || 'Failed to add repository to configuration');
      }

      // Sync the newly added repository
      const syncResponse = await fetch(getApiUrl(`/api/sync-repository/${parsedRepo.name}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: githubToken || TokenService.getToken(parsedRepo.owner, parsedRepo.name) || undefined
        })
      });

      if (!syncResponse.ok) {
        throw new Error('Failed to sync repository');
      }

      // Success!
      if (onSuccess) {
        onSuccess(parsedRepo.name);
      }
      
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add repository');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-check for existing token when repo is parsed
  useEffect(() => {
    if (parsedRepo) {
      const info = TokenService.getTokenInfo(parsedRepo.owner, parsedRepo.name);
      if (info) {
        setExistingTokenInfo(info);
      } else {
        setExistingTokenInfo(null);
      }
    }
  }, [parsedRepo]);

  if (!isOpen) return null;

  // Create portal to render modal at document body level
  return ReactDOM.createPortal(
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        overflow: 'auto'
      }}
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>Add Repository</h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            Add a repository by name or GitHub URL
          </p>
        </div>

        <div style={{
          padding: '24px 32px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div className="space-y-4">
            {/* Repository Input */}
            <div>
              <label htmlFor="repo-input" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Repository Name or URL
              </label>
              <div className="relative">
                <input
                  id="repo-input"
                  type="text"
                  value={repoInput}
                  onChange={(e) => {
                    setRepoInput(e.target.value);
                    setValidationStatus('idle');
                    setError(null);
                    setParsedRepo(null);
                  }}
                  onBlur={handleValidate}
                  placeholder="e.g., my-project or https://github.com/user/repo"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: `2px solid ${
                      validationStatus === 'valid' ? '#10b981' :
                      validationStatus === 'invalid' ? '#ef4444' :
                      '#e5e7eb'
                    }`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: isValidating || isSyncing ? '#f9fafb' : 'white',
                    cursor: isValidating || isSyncing ? 'not-allowed' : 'text'
                  }}
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
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginTop: '4px'
              }}>
                Enter a repository name, owner/repo format, or full GitHub URL
              </p>
            </div>

            {/* Existing Token Info */}
            {existingTokenInfo && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#1e40af',
                    margin: 0
                  }}>
                    Using saved token from: <span style={{ fontWeight: '600' }}>{existingTokenInfo.accountName}</span>
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#1e3a8a',
                    marginTop: '4px'
                  }}>
                    Last used: {existingTokenInfo.lastUsed ? new Date(existingTokenInfo.lastUsed).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            )}

            {/* Token Input Section */}
            {(showTokenField || requiresAuth) && !existingTokenInfo && (
              <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px'
                }}>Authentication Required</h3>
                
                {/* GitHub Token Input */}
                <div>
                  <label htmlFor="github-token" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Personal Access Token
                  </label>
                  <div className="relative">
                    <input
                      id="github-token"
                      type="password"
                      value={githubToken}
                      onChange={(e) => {
                        setGithubToken(e.target.value);
                        setTokenValidationStatus('idle');
                        if (requiresAuth) {
                          setValidationStatus('idle');
                          setError(null);
                        }
                      }}
                      onBlur={() => {
                        if (githubToken) {
                          validateGitHubToken();
                        }
                      }}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className={`
                        w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                        ${tokenValidationStatus === 'valid' ? 'border-green-500 focus:ring-green-500' :
                          tokenValidationStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' :
                          'border-gray-300 focus:ring-blue-500'}
                      `}
                      disabled={isSyncing || isValidatingToken}
                    />
                    {isValidatingToken && (
                      <div className="absolute right-2 top-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {tokenValidationStatus === 'valid' && (
                      <div className="absolute right-2 top-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <a 
                      href="https://github.com/settings/tokens/new?scopes=repo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Generate a new token
                    </a>
                    {' '}with 'repo' scope
                  </p>
                </div>

                {/* Account Name Input */}
                <div>
                  <label htmlFor="token-account-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name (for your reference)
                  </label>
                  <input
                    id="token-account-name"
                    type="text"
                    value={tokenAccountName}
                    onChange={(e) => setTokenAccountName(e.target.value)}
                    placeholder={`e.g., "${parsedRepo?.owner || 'Work'} GitHub Account"`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSyncing}
                  />
                  {tokenUsername && (
                    <p className="text-xs text-green-600 mt-1">
                      Token validated for user: @{tokenUsername}
                    </p>
                  )}
                </div>

                {/* Save Token Option */}
                {parsedRepo && (
                  <div className="flex items-start">
                    <input
                      id="save-token-org"
                      type="checkbox"
                      checked={saveTokenForOrg}
                      onChange={(e) => setSaveTokenForOrg(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSyncing}
                    />
                    <label htmlFor="save-token-org" className="ml-2 text-sm text-gray-700">
                      Save token for all repositories in <span className="font-medium">{parsedRepo.owner}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        This will allow you to add other repositories from this organization without re-entering the token
                      </p>
                    </label>
                  </div>
                )}

                {/* Retry Button */}
                {requiresAuth && githubToken && tokenValidationStatus === 'valid' && (
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verify Repository Access
                  </button>
                )}
              </div>
            )}

            {/* Add Authentication Button */}
            {!showTokenField && !requiresAuth && !existingTokenInfo && (
              <button
                type="button"
                onClick={() => setShowTokenField(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#2563eb',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '8px 0',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#2563eb';
                }}
              >
                <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Add authentication for private repository
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  margin: 0,
                  lineHeight: '1.5'
                }}>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {validationStatus === 'valid' && parsedRepo && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#059669',
                    margin: 0
                  }}>
                    Repository found: <span style={{ fontWeight: '600' }}>{parsedRepo.owner}/{parsedRepo.name}</span>
                  </p>
                  {existingTokenInfo && (
                    <p style={{
                      fontSize: '12px',
                      color: '#047857',
                      marginTop: '4px'
                    }}>
                      Authentication: {existingTokenInfo.accountName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Saved Tokens List */}
            {TokenService.listAccounts().length > 0 && !showTokenField && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Accounts</h3>
                <div className="space-y-1">
                  {TokenService.listAccounts().map((account) => (
                    <div key={account.key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {account.accountName} ({account.owner}/{account.repo || '*'})
                      </span>
                      <button
                        onClick={() => TokenService.removeToken(account.owner, account.repo)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          backgroundColor: 'white',
          position: 'sticky',
          bottom: 0
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              opacity: isSyncing ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isSyncing) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            disabled={isSyncing}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              backgroundColor: validationStatus === 'valid' && !isSyncing ? '#2563eb' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              cursor: validationStatus === 'valid' && !isSyncing ? 'pointer' : 'not-allowed',
              opacity: validationStatus === 'valid' && !isSyncing ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (validationStatus === 'valid' && !isSyncing) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseOut={(e) => {
              if (validationStatus === 'valid' && !isSyncing) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
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
    </div>,
    document.body
  );
};

export default AddRepositoryModal;