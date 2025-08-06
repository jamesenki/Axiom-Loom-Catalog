/**
 * API Key Management Component
 * Allows developers to create and manage their API keys
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/BypassAuthContext';
import { UserRole } from '../../services/auth/clientAuthService';
import { getApiUrl } from '../../utils/apiConfig';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 28px;
    color: #2e3440;
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 16px;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 20px;
    color: #2e3440;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'secondary':
        return `
          background: #f0f0f0;
          color: #333;
          &:hover { background: #e0e0e0; }
        `;
      default:
        return `
          background: #0066cc;
          color: white;
          &:hover { background: #0052a3; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const ApiKeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ApiKeyItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 16px;
`;

const ApiKeyInfo = styled.div`
  flex: 1;
  
  .name {
    font-weight: 600;
    color: #2e3440;
    margin-bottom: 4px;
  }
  
  .details {
    font-size: 13px;
    color: #6c757d;
  }
  
  .key {
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 13px;
    background: #e7f3ff;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 8px 0;
    word-break: break-all;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 16px;
  color: #155724;
  margin-bottom: 20px;
  
  .warning {
    font-weight: 600;
    margin-top: 8px;
    display: block;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px 16px;
  color: #c00;
  margin-bottom: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: #6c757d;
  
  p {
    margin: 0 0 16px 0;
  }
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
`;

const PermissionCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
  
  span {
    font-size: 14px;
    color: #2e3440;
  }
`;

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  lastUsed?: Date;
  createdAt: Date;
  permissions: string[];
}

const ApiKeyManagement: React.FC = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const hasRole = authContext?.hasRole || (() => false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availablePermissions = [
    'read:apis',
    'read:documentation',
    'test:apis',
    'download:collections'
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(getApiUrl('/api/auth/api-keys'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ey_auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys);
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/auth/api-keys'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ey_auth_token')}`
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: selectedPermissions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNewKey(data.apiKey);
        setNewKeyName('');
        setSelectedPermissions([]);
        
        // Add to list without the actual key
        setApiKeys([...apiKeys, {
          id: Date.now().toString(),
          name: data.name,
          createdAt: new Date(data.createdAt),
          permissions: selectedPermissions
        }]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create API key');
      }
    } catch (err) {
      setError('An error occurred while creating the API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/auth/api-keys/${keyId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ey_auth_token')}`
        }
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
      }
    } catch (err) {
      console.error('Failed to delete API key:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!user || (!hasRole(UserRole.DEVELOPER) && !hasRole(UserRole.ADMIN))) {
    return (
      <Container>
        <ErrorMessage>
          You don't have permission to manage API keys. This feature is available for developers and administrators only.
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h2>API Key Management</h2>
        <p>Create and manage API keys for programmatic access to the EY AI Experience Center</p>
      </Header>

      <Card>
        <CardHeader>
          <h3>Create New API Key</h3>
        </CardHeader>

        {newKey && (
          <SuccessMessage>
            <strong>API Key Created Successfully!</strong>
            <div className="key" style={{ margin: '12px 0' }}>
              {newKey}
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyToClipboard(newKey)}
                style={{ marginLeft: '12px', padding: '4px 8px' }}
              >
                Copy
              </Button>
            </div>
            <span className="warning">
              ⚠️ Save this API key securely. You won't be able to see it again!
            </span>
          </SuccessMessage>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleCreateApiKey}>
          <Input
            type="text"
            placeholder="API Key Name (e.g., Production App)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Key'}
          </Button>
        </Form>

        <div>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
            Select permissions for this API key:
          </p>
          <PermissionsGrid>
            {availablePermissions.map(permission => (
              <PermissionCheckbox key={permission}>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPermissions([...selectedPermissions, permission]);
                    } else {
                      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                    }
                  }}
                />
                <span>{permission.replace(':', ': ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </PermissionCheckbox>
            ))}
          </PermissionsGrid>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <h3>Your API Keys</h3>
        </CardHeader>

        {apiKeys.length === 0 ? (
          <EmptyState>
            <p>You haven't created any API keys yet.</p>
            <p>Create your first API key to get started with the API.</p>
          </EmptyState>
        ) : (
          <ApiKeyList>
            {apiKeys.map(apiKey => (
              <ApiKeyItem key={apiKey.id}>
                <ApiKeyInfo>
                  <div className="name">{apiKey.name}</div>
                  <div className="details">
                    Created: {new Date(apiKey.createdAt).toLocaleDateString()} • 
                    {apiKey.lastUsed ? ` Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}` : ' Never used'}
                  </div>
                  {apiKey.permissions.length > 0 && (
                    <div className="details">
                      Permissions: {apiKey.permissions.join(', ')}
                    </div>
                  )}
                </ApiKeyInfo>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteApiKey(apiKey.id)}
                >
                  Delete
                </Button>
              </ApiKeyItem>
            ))}
          </ApiKeyList>
        )}
      </Card>

      <Card>
        <CardHeader>
          <h3>Using API Keys</h3>
        </CardHeader>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          <p>Include your API key in requests using one of these methods:</p>
          <ul>
            <li>Header: <code>X-API-Key: your-api-key</code></li>
            <li>Query parameter: <code>?apiKey=your-api-key</code></li>
          </ul>
          <p>Example curl command:</p>
          <pre style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', overflow: 'auto' }}>
            {`curl -H "X-API-Key: your-api-key" \\
     https://ai-experience.ey.com/api/repositories`}
          </pre>
        </div>
      </Card>
    </Container>
  );
};

export default ApiKeyManagement;