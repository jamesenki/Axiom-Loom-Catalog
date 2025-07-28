import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSyncContext } from '../contexts/SyncContext';
import AddRepositoryModal from './AddRepositoryModal';

interface Repository {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  status: string;
  metrics: {
    apiCount: number;
    lastUpdated: string;
  };
}

const RepositoryList: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { syncVersion } = useSyncContext();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/repositories');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [syncVersion]); // Refresh when sync completes

  const handleRepositoryAdded = (repoName: string) => {
    // Refresh the repository list
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/repositories');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        console.error('Error refreshing repositories:', err);
      }
    };
    
    fetchRepositories();
  };

  if (loading) return <div className="loading">Loading repositories...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="repository-list">
      <div className="header">
        <h1>🚀 EYNS AI Experience Center</h1>
        <p>Developer Portal - Repositories, APIs, Documentation & More</p>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddModal(true)}
            className="add-button"
          >
            ➕ Add Repository
          </button>
          <Link to="/sync" className="sync-button">🔄 Repository Sync</Link>
        </div>
      </div>
      
      <div className="repositories-grid">
        {repositories.map((repo) => (
          <div key={repo.id} className="repository-card">
            <div className="card-header">
              <h3>{repo.displayName}</h3>
              <span className={`status ${repo.status}`}>{repo.status}</span>
            </div>
            
            <p className="description">{repo.description}</p>
            
            <div className="metrics">
              <span>📊 APIs: {repo.metrics.apiCount}</span>
              <span>🕒 Updated: {new Date(repo.metrics.lastUpdated).toLocaleDateString()}</span>
            </div>
            
            <div className="actions">
              <Link to={`/repository/${repo.name}`} className="btn primary">
                📁 Repository
              </Link>
              <Link to={`/docs/${repo.name}`} className="btn secondary">
                📚 Documentation
              </Link>
              <Link to={`/postman/${repo.name}`} className="btn secondary">
                📮 Postman
              </Link>
              <Link to={`/graphql/${repo.name}`} className="btn secondary">
                🔍 GraphQL
              </Link>
              <Link to={`/api-explorer/${repo.name}`} className="btn secondary">
                🛠️ API Explorer
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <AddRepositoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRepositoryAdded}
      />
    </div>
  );
};

export default RepositoryList;
