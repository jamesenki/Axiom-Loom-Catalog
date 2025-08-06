import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  Play,
  Database,
  FileCode,
  Download,
  Eye,
  Code,
  Settings
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  Text,
  Button,
  FullPageLoading
} from './styled';

interface GraphQLSchema {
  name: string;
  path: string;
}

const PageLayout = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 320px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.primary};
`;

const PlaygroundHeader = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaygroundContent = styled.div`
  flex: 1;
  display: flex;
`;

const QueryPanel = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[4]};
  border-right: 1px solid ${props => props.theme.colors.border.light};
`;

const ResultPanel = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.secondary};
`;

const BackButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing[6]};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.yellow};
  
  &:hover {
    background: ${props => props.theme.colors.primary.yellow};
    color: ${props => props.theme.colors.primary.black};
  }
`;

const SidebarTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const SchemaItem = styled.div<{ active?: boolean }>`
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? theme.colors.primary.yellow : theme.colors.background.primary};
  color: ${props => props.active ? theme.colors.primary.black : theme.colors.text.primary};
  border: 1px solid ${props => props.active ? theme.colors.primary.yellow : theme.colors.border.light};
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? theme.colors.primary.yellow : 'rgba(255, 230, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary.yellow};
    transform: translateX(2px);
  }
`;

const SchemaIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const SchemaName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SchemaPath = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QueryEditor = styled.textarea`
  width: 100%;
  height: 400px;
  padding: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const ResultViewer = styled.pre`
  width: 100%;
  height: 400px;
  padding: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  overflow: auto;
  white-space: pre-wrap;
`;

const SchemaViewer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[4]};
`;

const SchemaContent = styled.pre`
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  white-space: pre-wrap;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  margin: ${props => props.theme.spacing[4]} 0;
`;

const PlayButton = styled(Button)`
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  
  &:hover {
    background: ${props => props.theme.colors.primary.black};
    color: ${props => props.theme.colors.primary.yellow};
  }
`;

const getSchemaDisplayName = (schemaName: string): string => {
  // Remove file extension
  const nameWithoutExt = schemaName.replace(/\.(graphql|gql)$/i, '');
  
  // Convert common patterns to readable names
  const cleaned = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/api/gi, 'API')
    .replace(/graphql/gi, 'GraphQL')
    .replace(/schema/gi, 'Schema')
    .replace(/\b(\w)/g, (match) => match.toUpperCase()); // Capitalize first letters
    
  // If still too long, truncate
  return cleaned.length > 30 ? cleaned.substring(0, 27) + '...' : cleaned;
};

const GraphQLPlaygroundLocal: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [schemas, setSchemas] = useState<GraphQLSchema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<GraphQLSchema | null>(null);
  const [schemaContent, setSchemaContent] = useState<string>('');
  const [query, setQuery] = useState<string>('# Welcome to GraphQL Playground\n# Write your query here:\n\nquery {\n  # Your GraphQL query\n}');
  const [result, setResult] = useState<string>('# Query results will appear here');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemas();
  }, [repoName]);

  const fetchSchemas = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/graphql-schemas`));
      if (!response.ok) {
        throw new Error('Failed to fetch GraphQL schemas');
      }
      const data = await response.json();
      setSchemas(data);
      
      // Auto-select first schema
      if (data.length > 0) {
        selectSchema(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const selectSchema = async (schema: GraphQLSchema) => {
    setSelectedSchema(schema);
    
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(schema.path)}`));
      if (!response.ok) throw new Error('Failed to load schema');
      
      const content = await response.text();
      setSchemaContent(content);
      
      // Set a sample query based on the schema
      if (content.includes('type Query')) {
        const queryMatch = content.match(/type Query\s*{([^}]*)}/);
        if (queryMatch) {
          const fields = queryMatch[1]
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .slice(0, 3); // Take first 3 fields
          
          if (fields.length > 0) {
            const sampleQuery = `# Sample query for ${schema.name}\nquery {\n${fields.map(field => `  ${field.split(':')[0]?.trim()}`).join('\n')}\n}`;
            setQuery(sampleQuery);
          }
        }
      }
    } catch (err) {
      console.error('Error loading schema:', err);
      setSchemaContent('Error loading schema content');
    }
  };

  const executeQuery = () => {
    // Since we don't have a live GraphQL endpoint, simulate execution
    setResult(`# Query execution simulation
# In a real implementation, this would connect to your GraphQL endpoint

# Query:
${query}

# Simulated Response:
{
  "data": {
    "message": "This is a simulated response. In production, this would execute against your GraphQL endpoint.",
    "schema": "${selectedSchema?.name}",
    "status": "success"
  }
}

# Note: To run actual queries, connect this playground to your GraphQL endpoint
# at runtime by configuring the GraphQL server URL in your environment.`);
  };

  if (loading) {
    return <FullPageLoading text="Loading GraphQL schemas..." />;
  }

  if (error || schemas.length === 0) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">🎮 No GraphQL Schemas Found</H1>
          <Text color="secondary">
            {error || 'This repository does not have any GraphQL schemas.'}
          </Text>
          <Button as={Link} to="/">
            Return to Home
          </Button>
        </Section>
      </Container>
    );
  }

  return (
    <PageLayout>
      <Sidebar>
        <BackButton as={Link} to={`/repository/${repoName}`}>
          <ArrowLeft size={20} />
          Back to Repository
        </BackButton>
        
        <SidebarTitle>Schemas ({schemas.length})</SidebarTitle>
        
        {schemas.map((schema, index) => (
          <SchemaItem
            key={index}
            active={selectedSchema?.path === schema.path}
            onClick={() => selectSchema(schema)}
          >
            <SchemaIcon>
              <Database size={20} />
              <SchemaName title={schema.name}>{getSchemaDisplayName(schema.name)}</SchemaName>
            </SchemaIcon>
            <SchemaPath title={schema.path}>{schema.path}</SchemaPath>
          </SchemaItem>
        ))}
        
        {selectedSchema && schemaContent && (
          <SchemaViewer>
            <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
              Schema Preview:
            </Text>
            <SchemaContent>{schemaContent.substring(0, 500)}...</SchemaContent>
          </SchemaViewer>
        )}
      </Sidebar>

      <MainContent>
        <PlaygroundHeader>
          <div>
            <H2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <Code size={24} />
              GraphQL Playground
            </H2>
            {selectedSchema && (
              <Text color="secondary" style={{ marginTop: theme.spacing[1] }} title={selectedSchema.name}>
                {getSchemaDisplayName(selectedSchema.name)}
              </Text>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing[3] }}>
            <Button
              variant="outline"
              as="a"
              href={selectedSchema ? `/api/repository/${repoName}/file?path=${encodeURIComponent(selectedSchema.path)}&download=true` : '#'}
              download
            >
              <Download size={20} />
              Download Schema
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const formatted = JSON.stringify(JSON.parse(JSON.stringify(schemaContent)), null, 2);
                setResult(`# Formatted Schema:\n\n${formatted}`);
              }}
            >
              <Eye size={20} />
              View Full Schema
            </Button>
          </div>
        </PlaygroundHeader>

        <PlaygroundContent>
          <QueryPanel>
            <H2 style={{ marginBottom: theme.spacing[4] }}>Query Editor</H2>
            <QueryEditor
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your GraphQL query here..."
            />
            <ActionButtons>
              <PlayButton onClick={executeQuery}>
                <Play size={20} />
                Execute Query
              </PlayButton>
              <Button
                variant="outline"
                onClick={() => setQuery('# Clear query\nquery {\n  \n}')}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const formatted = query.split('\n').map(line => `  ${line}`).join('\n');
                  setQuery(`{\n${formatted}\n}`);
                }}
              >
                Format
              </Button>
            </ActionButtons>
          </QueryPanel>

          <ResultPanel>
            <H2 style={{ marginBottom: theme.spacing[4] }}>Results</H2>
            <ResultViewer>{result}</ResultViewer>
          </ResultPanel>
        </PlaygroundContent>
      </MainContent>
    </PageLayout>
  );
};

export default GraphQLPlaygroundLocal;