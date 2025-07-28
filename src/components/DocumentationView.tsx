import React from 'react';
import { useParams } from 'react-router-dom';

const DocumentationView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>📚 Documentation: {repoName}</h1>
      <p>Documentation view with PlantUML rendering coming soon...</p>
    </div>
  );
};

export default DocumentationView;
