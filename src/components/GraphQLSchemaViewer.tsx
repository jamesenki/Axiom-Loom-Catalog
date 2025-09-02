import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, FileCode, AlertCircle, Download } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

const Container = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  color: #000000;
  padding: 2rem;
`;

const Header = styled.div`
  background: #F8F9FA;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #E5E7EB;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0066CC;
  text-decoration: none;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #000000;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const Description = styled.p`
  color: #666666;
  margin: 0;
`;

const SchemaList = styled.div`
  display: grid;
  gap: 1rem;
`;

const SchemaCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const SchemaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SchemaName = styled.h3`
  color: #000000;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SchemaPath = styled.code`
  color: #666666;
  font-size: 0.875rem;
  background: #F5F5F5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const SchemaContent = styled.pre`
  background: #F8F9FA;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  color: #000000;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666666;
`;

const ErrorState = styled.div`
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 8px;
  padding: 1.5rem;
  color: #991B1B;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: #F8F9FA;
  border-radius: 8px;
  color: #666666;
`;

const DownloadButton = styled.button`
  background: #0066CC;
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    background: #0052A3;
  }
`;

interface GraphQLSchema {
  name: string;
  path: string;
  content?: string;
}

const GraphQLSchemaViewer: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [schemas, setSchemas] = useState<GraphQLSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemas();
  }, [repoName]);

  const fetchSchemas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, detect APIs to see if there are GraphQL schemas
      const detectResponse = await fetch(getApiUrl(`/api/detect-apis/${repoName}`), {
        headers: {
          'x-dev-mode': 'true',
          'x-bypass-auth': 'true'
        }
      });
      if (!detectResponse.ok) {
        throw new Error('Failed to detect APIs');
      }
      
      const detection = await detectResponse.json();
      
      if (!detection.apis?.graphql || detection.apis.graphql.length === 0) {
        setSchemas([]);
        setLoading(false);
        return;
      }
      
      // Load the actual schema files
      const schemaPromises = detection.apis.graphql.map(async (schema: any) => {
        try {
          // Try to fetch the schema content
          const contentResponse = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(schema.file)}`), {
            headers: {
              'x-dev-mode': 'true',
              'x-bypass-auth': 'true'
            }
          });
          let content = '';
          
          if (contentResponse.ok) {
            // The backend returns plain text, not JSON
            content = await contentResponse.text();
          }
          
          return {
            name: schema.file.split('/').pop() || schema.file,
            path: schema.file,
            content: content
          };
        } catch (err) {
          console.error(`Failed to load schema ${schema.file}:`, err);
          return {
            name: schema.file.split('/').pop() || schema.file,
            path: schema.file,
            content: '# Failed to load schema content'
          };
        }
      });
      
      const loadedSchemas = await Promise.all(schemaPromises);
      setSchemas(loadedSchemas);
    } catch (err) {
      console.error('Error loading GraphQL schemas:', err);
      setError(err instanceof Error ? err.message : 'Failed to load GraphQL schemas');
    } finally {
      setLoading(false);
    }
  };

  const downloadSchema = (schema: GraphQLSchema) => {
    const blob = new Blob([schema.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = schema.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <BackButton to={`/repository/${repoName}`}>
        <ArrowLeft size={20} />
        Back to Repository
      </BackButton>
      
      <Header>
        <Title>GraphQL Schemas</Title>
        <Description>
          Repository: {repoName}
        </Description>
      </Header>
      
      {loading && (
        <LoadingState>
          Loading GraphQL schemas...
        </LoadingState>
      )}
      
      {error && (
        <ErrorState>
          <AlertCircle size={24} />
          <div>
            <strong>Error loading schemas:</strong> {error}
          </div>
        </ErrorState>
      )}
      
      {!loading && !error && schemas.length === 0 && (
        <EmptyState>
          <FileCode size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No GraphQL Schemas Found</h3>
          <p>This repository doesn't contain any .graphql or .gql files.</p>
        </EmptyState>
      )}
      
      {!loading && !error && schemas.length > 0 && (
        <SchemaList>
          {schemas.map((schema, index) => (
            <SchemaCard key={index}>
              <SchemaHeader>
                <SchemaName>
                  <FileCode size={20} />
                  {schema.name}
                </SchemaName>
                <DownloadButton onClick={() => downloadSchema(schema)}>
                  <Download size={16} />
                  Download
                </DownloadButton>
              </SchemaHeader>
              
              <SchemaPath>{schema.path}</SchemaPath>
              
              {schema.content && (
                <SchemaContent>
                  {schema.content}
                </SchemaContent>
              )}
            </SchemaCard>
          ))}
        </SchemaList>
      )}
    </Container>
  );
};

export default GraphQLSchemaViewer;