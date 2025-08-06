import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import {
  Container,
  Section,
  H1,
  H2,
  Text,
  Button,
  Card,
  CardContent,
  Flex,
  FullPageLoading
} from './styled';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.colors.background.primary};
`;

const Header = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const PlaygroundContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
`;

const EditorArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[4]};
  height: 100%;
`;

const EditorPanel = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const Editor = styled.textarea`
  flex: 1;
  padding: ${props => props.theme.spacing[3]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  resize: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const ResultArea = styled.pre`
  flex: 1;
  padding: ${props => props.theme.spacing[3]};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: auto;
  margin: 0;
`;

const GraphQLPlaygroundSimple: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams] = useSearchParams();
  const schemaPath = searchParams.get('schema');
  
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(`# Welcome to GraphQL Playground
# 
# Enter your GraphQL query here
# Example:

query {
  # Your query fields here
}`);
  const [variables, setVariables] = useState('{}');
  const [result, setResult] = useState('');

  const executeQuery = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResponse = {
        data: {
          message: "This is a simulated GraphQL response",
          info: {
            repository: repoName,
            schema: schemaPath,
            timestamp: new Date().toISOString()
          }
        }
      };
      
      setResult(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      setResult(JSON.stringify({
        errors: [{
          message: error instanceof Error ? error.message : 'Unknown error'
        }]
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Flex align="center" justify="between">
          <Flex align="center" gap={4}>
            <Button
              as={Link}
              to={`/api-explorer/${repoName}`}
              variant="outline"
              size="sm"
            >
              <ArrowLeft size={20} />
              Back to Explorer
            </Button>
            
            <div>
              <H2 style={{ margin: 0 }}>GraphQL Playground</H2>
              <Text color="secondary" size="small">{repoName}</Text>
            </div>
          </Flex>
          
          <Button onClick={executeQuery} disabled={loading}>
            {loading ? 'Executing...' : 'Execute Query'}
          </Button>
        </Flex>
      </Header>

      <PlaygroundContainer>
        <EditorArea>
          <EditorPanel>
            <CardContent>
              <Flex align="center" justify="between" style={{ marginBottom: '1rem' }}>
                <Text weight="semibold">Query</Text>
              </Flex>
              <Editor
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your GraphQL query..."
              />
              
              <Flex align="center" justify="between" style={{ margin: '1rem 0' }}>
                <Text weight="semibold">Variables</Text>
              </Flex>
              <Editor
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder="{}"
                style={{ minHeight: '150px', maxHeight: '150px' }}
              />
            </CardContent>
          </EditorPanel>

          <EditorPanel>
            <CardContent>
              <Flex align="center" justify="between" style={{ marginBottom: '1rem' }}>
                <Text weight="semibold">Result</Text>
              </Flex>
              <ResultArea>
                {result || 'Execute a query to see results'}
              </ResultArea>
            </CardContent>
          </EditorPanel>
        </EditorArea>
      </PlaygroundContainer>
    </PageContainer>
  );
};

export default GraphQLPlaygroundSimple;