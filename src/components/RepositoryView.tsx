import React from 'react';
import { useParams } from 'react-router-dom';

const RepositoryView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>📁 Repository: {repoName}</h1>
      <p>Repository view coming soon...</p>
    </div>
  );
};

export default RepositoryView;
