import React from 'react';
import { useParams } from 'react-router-dom';

const PostmanView: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>📮 Postman Collections: {repoName}</h1>
      <p>Postman collections view coming soon...</p>
    </div>
  );
};

export default PostmanView;
