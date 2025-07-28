import React from 'react';
import { useParams } from 'react-router-dom';

const APIExplorerView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>🛠️ API Explorer: {repoName}</h1>
      <p>API Explorer with dynamic detection coming soon...</p>
    </div>
  );
};

export default APIExplorerView;
