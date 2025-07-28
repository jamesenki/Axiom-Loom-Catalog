import React from 'react';
import { useParams } from 'react-router-dom';

const GraphQLView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>🔍 GraphQL Playground: {repoName}</h1>
      <p>GraphQL Playground with 19 schemas coming soon...</p>
    </div>
  );
};

export default GraphQLView;
