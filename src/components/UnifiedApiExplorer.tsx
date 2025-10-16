import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  FileCode,
  Globe,
  Database,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Play,
  Save,
  History,
  Code2,
  Key,
  Settings,
  Copy,
  CheckCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  H3,
  Text,
  Lead,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Flex,
  Grid,
  Badge,
  FullPageLoading,
  Input
} from './styled';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface APISpec {
  name: string;
  path: string;
  type: 'OpenAPI' | 'GraphQL' | 'gRPC' | 'Postman';
  version?: string;
  description?: string;
  endpoints?: number;
  content?: any;
}

interface RequestHistory {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  response?: any;
  apiType: string;
  duration?: number;
}

interface Environment {
  name: string;
  variables: Record<string, string>;
}

const PageLayout = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 320px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ExplorerHeader = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ExplorerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing[6]};
`;

const TabBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.active ? theme.colors.primary.yellow : 'transparent'};
  color: ${props => props.active ? theme.colors.primary.black : theme.colors.text.secondary};
  border: 1px solid ${props => props.active ? theme.colors.primary.yellow : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? theme.colors.primary.yellow : 'rgba(255, 230, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const SearchBar = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing[4]};
`;

const SearchInput = styled(Input)`
  padding-left: ${props => props.theme.spacing[10]};
  background: ${props => props.theme.colors.background.primary};
  border: 2px solid transparent;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing[7]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
`;

const APIList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing[4]};
`;

const APIItem = styled.div<{ active?: boolean; dataType?: string }>`
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[2]};
  background: ${props => props.active ? theme.colors.primary.yellow : theme.colors.background.primary};
  color: ${props => props.active ? theme.colors.primary.black : theme.colors.text.primary};
  border: 1px solid ${props => props.active ? theme.colors.primary.yellow : theme.colors.border.light};
  border-left: 4px solid ${props => {
    switch (props.dataType) {
      case 'OpenAPI': return '#FF6B6B';
      case 'GraphQL': return '#E90C59';
      case 'gRPC': return '#00A67E';
      case 'Postman': return '#FF6500';
      default: return theme.colors.primary.yellow;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? theme.colors.primary.yellow : 'rgba(255, 230, 0, 0.1)'};
    transform: translateX(2px);
  }
`;

const RequestBuilder = styled(Card)`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const MethodSelect = styled.select`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.primary.yellow};
  color: ${props => props.theme.colors.primary.black};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
`;

const UrlInput = styled(Input)`
  flex: 1;
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const HeadersEditor = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
`;

const HeaderRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const BodyEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.yellow};
  }
`;

const ResponseViewer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResponseBody = styled.pre`
  padding: ${props => props.theme.spacing[4]};
  margin: 0;
  overflow: auto;
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${props => props.theme.colors.text.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const StatusBadge = styled(Badge)<{ status?: number }>`
  background: ${props => {
    if (!props.status) return theme.colors.secondary.mediumGray;
    if (props.status >= 200 && props.status < 300) return '#10B981';
    if (props.status >= 400) return '#EF4444';
    return '#F59E0B';
  }};
  color: white;
`;

const HistoryPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 60px;
  width: 400px;
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.background.secondary};
  border-left: 1px solid ${props => props.theme.colors.border.light};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  z-index: 100;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: ${props => props.theme.spacing[3]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.background.primary};
  }
`;

const EnvSelector = styled.div`
  padding: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  margin-top: auto;
`;

const UnifiedApiExplorer: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [apis, setApis] = useState<APISpec[]>([]);
  const [selectedApi, setSelectedApi] = useState<APISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explorer' | 'history' | 'snippets'>('explorer');
  
  // Request builder state
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json'
  });
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  
  // History and environment state
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>([
    { name: 'Development', variables: { BASE_URL: 'http://localhost:3000' } },
    { name: 'Production', variables: { BASE_URL: 'https://api.example.com' } }
  ]);
  const [currentEnv, setCurrentEnv] = useState<Environment>(environments[0]);

  useEffect(() => {
    fetchAPIs();
    loadHistory();
  }, [repoName]);

  useEffect(() => {
    const apiPath = searchParams.get('api');
    if (apiPath && apis.length > 0) {
      const api = apis.find(a => a.path === apiPath);
      if (api) selectAPI(api);
    }
  }, [apis, searchParams]);

  const fetchAPIs = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/detect-apis/${repoName}`));
      if (!response.ok) throw new Error('Failed to fetch APIs');
      
      const data = await response.json();
      const allApis: APISpec[] = [];
      
      // Add REST APIs
      if (data.apis?.rest) {
        data.apis.rest.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.(yaml|yml|json)$/i, ''),
            path: api.file,
            type: 'OpenAPI',
            version: api.version,
            description: api.description
          });
        });
      }
      
      // Add GraphQL APIs
      if (data.apis?.graphql) {
        data.apis.graphql.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.(graphql|gql)$/i, ''),
            path: api.file,
            type: 'GraphQL',
            description: api.description
          });
        });
      }
      
      // Add gRPC APIs
      if (data.apis?.grpc) {
        data.apis.grpc.forEach((api: any) => {
          allApis.push({
            name: api.title || api.file.split('/').pop().replace(/\.proto$/i, ''),
            path: api.file,
            type: 'gRPC',
            description: api.description
          });
        });
      }
      
      // Check for Postman collections
      const postmanResponse = await fetch(getApiUrl(`/api/repository/${repoName}/postman-collections`));
      if (postmanResponse.ok) {
        const postmanData = await postmanResponse.json();
        postmanData.forEach((collection: any) => {
          allApis.push({
            name: collection.name,
            path: collection.path,
            type: 'Postman',
            description: 'Postman Collection'
          });
        });
      }
      
      setApis(allApis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const selectAPI = async (api: APISpec) => {
    setSelectedApi(api);
    setSearchParams({ api: api.path });
    
    // Load API content
    try {
      const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(api.path)}`));
      if (!response.ok) throw new Error('Failed to load API content');
      
      const content = await response.text();
      api.content = content;
      
      // Parse and set initial request based on API type
      if (api.type === 'OpenAPI') {
        try {
          const spec = JSON.parse(content);
          const firstPath = Object.keys(spec.paths || {})[0];
          if (firstPath) {
            const firstMethod = Object.keys(spec.paths[firstPath])[0];
            setMethod(firstMethod.toUpperCase());
            setUrl(`${spec.servers?.[0]?.url || '{{BASE_URL}}'}${firstPath}`);
          }
        } catch (e) {
          // Handle YAML or parsing errors
        }
      } else if (api.type === 'GraphQL') {
        setMethod('POST');
        setUrl('{{BASE_URL}}/graphql');
        setBody(`query {
  # Your GraphQL query here
}`);
      }
    } catch (err) {
      console.error('Error loading API:', err);
    }
  };

  const executeRequest = async () => {
    setExecuting(true);
    const startTime = Date.now();
    
    try {
      // Replace environment variables
      let finalUrl = url;
      Object.entries(currentEnv.variables).forEach(([key, value]) => {
        finalUrl = finalUrl.replace(`{{${key}}}`, value);
      });
      
      const requestOptions: RequestInit = {
        method,
        headers: headers
      };
      
      if (method !== 'GET' && method !== 'HEAD' && body) {
        requestOptions.body = body;
      }
      
      // For demo purposes, simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-request-id': Math.random().toString(36).substr(2, 9)
        },
        data: {
          message: 'This is a simulated response',
          timestamp: new Date().toISOString(),
          endpoint: finalUrl,
          method: method
        }
      };
      
      setResponse(mockResponse);
      
      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        method,
        url: finalUrl,
        headers,
        body: body || undefined,
        response: mockResponse,
        apiType: selectedApi?.type || 'Unknown',
        duration: Date.now() - startTime
      };
      
      const newHistory = [historyItem, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem(`api-history-${repoName}`, JSON.stringify(newHistory));
      
    } catch (err) {
      setResponse({
        status: 0,
        error: err instanceof Error ? err.message : 'Request failed'
      });
    } finally {
      setExecuting(false);
    }
  };

  const loadHistory = () => {
    const saved = localStorage.getItem(`api-history-${repoName}`);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  };

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
    setHeaders(item.headers);
    setBody(item.body || '');
    setShowHistory(false);
  };

  const generateCodeSnippet = (language: string): string => {
    let finalUrl = url;
    Object.entries(currentEnv.variables).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(`{{${key}}}`, value);
    });
    
    switch (language) {
      case 'curl':
        return `curl -X ${method} "${finalUrl}" \\
${Object.entries(headers).map(([k, v]) => `  -H "${k}: ${v}"`).join(' \\\n')}${
  body ? ` \\\n  -d '${body}'` : ''
}`;
      
      case 'javascript':
        return `fetch("${finalUrl}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},${
  body ? `\n  body: ${JSON.stringify(body)}` : ''
}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
      
      case 'python':
        return `import requests

response = requests.${method.toLowerCase()}(
    "${finalUrl}",
    headers=${JSON.stringify(headers, null, 2).replace(/"/g, "'")},${
  body ? `\n    json=${body}` : ''
}
)

print(response.json())`;
      
      default:
        return '';
    }
  };

  const filteredApis = apis.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (api.description && api.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <FullPageLoading text="Loading API Explorer..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">Error Loading APIs</H1>
          <Text color="secondary">{error}</Text>
          <Button as={Link} to="/">Return to Home</Button>
        </Section>
      </Container>
    );
  }

  return (
    <>
      <PageLayout>
        <Sidebar>
          <SearchBar>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          
          <APIList>
            {filteredApis.map((api, index) => (
              <APIItem
                key={index}
                active={selectedApi?.path === api.path}
                dataType={api.type}
                onClick={() => selectAPI(api)}
              >
                <Flex align="center" justify="between" style={{ marginBottom: theme.spacing[2] }}>
                  <Text weight="semibold">{api.name}</Text>
                  <Badge>{api.type}</Badge>
                </Flex>
                <Text size="small" color="secondary">{api.path}</Text>
                {api.description && (
                  <Text size="small" style={{ marginTop: theme.spacing[1] }}>
                    {api.description}
                  </Text>
                )}
              </APIItem>
            ))}
          </APIList>
          
          <EnvSelector>
            <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
              Environment
            </Text>
            <select
              value={currentEnv.name}
              onChange={(e) => setCurrentEnv(environments.find(env => env.name === e.target.value) || environments[0])}
              style={{
                width: '100%',
                padding: theme.spacing[2],
                background: theme.colors.background.primary,
                color: theme.colors.text.primary,
                border: `1px solid ${props => props.theme.colors.border.light}`,
                borderRadius: theme.borderRadius.md
              }}
            >
              {environments.map(env => (
                <option key={env.name} value={env.name}>{env.name}</option>
              ))}
            </select>
          </EnvSelector>
        </Sidebar>

        <MainContent>
          <ExplorerHeader>
            <Flex align="center" justify="between">
              <div>
                <H2 style={{ margin: 0 }}>
                  {selectedApi ? selectedApi.name : 'Select an API'}
                </H2>
                {selectedApi && (
                  <Text color="secondary" style={{ marginTop: theme.spacing[1] }}>
                    {selectedApi.type} • {selectedApi.version || 'Latest'}
                  </Text>
                )}
              </div>
              
              <Flex gap={2}>
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History size={20} />
                  History
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('snippets')}
                >
                  <Code2 size={20} />
                  Code
                </Button>
              </Flex>
            </Flex>
          </ExplorerHeader>

          <TabBar>
            <Tab
              active={activeTab === 'explorer'}
              onClick={() => setActiveTab('explorer')}
            >
              API Explorer
            </Tab>
            <Tab
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            >
              Request History
            </Tab>
            <Tab
              active={activeTab === 'snippets'}
              onClick={() => setActiveTab('snippets')}
            >
              Code Snippets
            </Tab>
          </TabBar>

          <ExplorerContent>
            {activeTab === 'explorer' && selectedApi && (
              <>
                <RequestBuilder>
                  <CardHeader>
                    <CardTitle>Request</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Flex gap={2} style={{ marginBottom: theme.spacing[4] }}>
                      <MethodSelect
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                      </MethodSelect>
                      <UrlInput
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter request URL..."
                      />
                      <Button
                        onClick={executeRequest}
                        disabled={executing || !url}
                      >
                        {executing ? 'Sending...' : (
                          <>
                            <Play size={20} />
                            Send
                          </>
                        )}
                      </Button>
                    </Flex>

                    <HeadersEditor>
                      <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
                        Headers
                      </Text>
                      {Object.entries(headers).map(([key, value], index) => (
                        <HeaderRow key={index}>
                          <Input
                            type="text"
                            value={key}
                            placeholder="Header name"
                            onChange={(e) => {
                              const newHeaders = { ...headers };
                              delete newHeaders[key];
                              newHeaders[e.target.value] = value;
                              setHeaders(newHeaders);
                            }}
                          />
                          <Input
                            type="text"
                            value={value}
                            placeholder="Header value"
                            onChange={(e) => {
                              setHeaders({ ...headers, [key]: e.target.value });
                            }}
                          />
                        </HeaderRow>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setHeaders({ ...headers, '': '' })}
                      >
                        Add Header
                      </Button>
                    </HeadersEditor>

                    {method !== 'GET' && method !== 'HEAD' && (
                      <div style={{ marginTop: theme.spacing[4] }}>
                        <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
                          Body
                        </Text>
                        <BodyEditor
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          placeholder="Request body (JSON, XML, etc.)"
                        />
                      </div>
                    )}
                  </CardContent>
                </RequestBuilder>

                {response && (
                  <ResponseViewer>
                    <ResponseHeader>
                      <Flex align="center" gap={3}>
                        <Text weight="semibold">Response</Text>
                        <StatusBadge status={response.status}>
                          {response.status} {response.statusText}
                        </StatusBadge>
                        {response.duration && (
                          <Text size="small" color="secondary">
                            {response.duration}ms
                          </Text>
                        )}
                      </Flex>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'response.json';
                          a.click();
                        }}
                      >
                        <Download size={16} />
                        Download
                      </Button>
                    </ResponseHeader>
                    <ResponseBody>
                      {JSON.stringify(response.data || response.error, null, 2)}
                    </ResponseBody>
                  </ResponseViewer>
                )}

                {selectedApi.type === 'OpenAPI' && selectedApi.content && (
                  <div style={{ marginTop: theme.spacing[6] }}>
                    <SwaggerUI
                      spec={selectedApi.content}
                      docExpansion="list"
                      defaultModelsExpandDepth={1}
                      displayRequestDuration={true}
                      tryItOutEnabled={true}
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === 'snippets' && selectedApi && (
              <div>
                <H3>Code Snippets</H3>
                <Text color="secondary" style={{ marginBottom: theme.spacing[4] }}>
                  Copy code snippets for your favorite language
                </Text>
                
                {['curl', 'javascript', 'python'].map(lang => (
                  <Card key={lang} style={{ marginBottom: theme.spacing[4] }}>
                    <CardHeader>
                      <Flex align="center" justify="between">
                        <CardTitle>{lang.charAt(0).toUpperCase() + lang.slice(1)}</CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generateCodeSnippet(lang));
                          }}
                        >
                          <Copy size={16} />
                          Copy
                        </Button>
                      </Flex>
                    </CardHeader>
                    <CardContent>
                      <pre style={{
                        background: theme.colors.background.secondary,
                        padding: theme.spacing[3],
                        borderRadius: theme.borderRadius.md,
                        overflow: 'auto',
                        fontSize: theme.typography.fontSize.sm,
                        fontFamily: theme.typography.fontFamily.mono
                      }}>
                        {generateCodeSnippet(lang)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ExplorerContent>
        </MainContent>
      </PageLayout>

      <HistoryPanel isOpen={showHistory}>
        <div style={{ padding: theme.spacing[4] }}>
          <Flex align="center" justify="between" style={{ marginBottom: theme.spacing[4] }}>
            <H3>Request History</H3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHistory(false)}
            >
              ✕
            </Button>
          </Flex>
          
          {history.length === 0 ? (
            <Text color="secondary">No requests yet</Text>
          ) : (
            history.map(item => (
              <HistoryItem key={item.id} onClick={() => loadFromHistory(item)}>
                <Flex align="center" justify="between" style={{ marginBottom: theme.spacing[1] }}>
                  <Text weight="semibold">{item.method} {item.apiType}</Text>
                  <StatusBadge status={item.response?.status}>
                    {item.response?.status || 'Error'}
                  </StatusBadge>
                </Flex>
                <Text size="small" color="secondary">
                  {new URL(item.url).pathname}
                </Text>
                <Text size="small" color="secondary">
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </HistoryItem>
            ))
          )}
        </div>
      </HistoryPanel>
    </>
  );
};

export default UnifiedApiExplorer;