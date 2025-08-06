import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  Play,
  Pause,
  StopCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Settings,
  ChevronRight,
  ChevronDown,
  Copy,
  FileText,
  BarChart3,
  Clock
} from 'lucide-react';
import { theme } from '../styles/design-system';
import {
  Container,
  Section,
  H1,
  H2,
  H3,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Flex,
  Badge,
  FullPageLoading,
  Input
} from './styled';

interface PostmanRequest {
  name: string;
  method: string;
  url: string;
  headers: Array<{ key: string; value: string }>;
  body?: any;
  auth?: any;
}

interface PostmanFolder {
  name: string;
  items: Array<PostmanRequest | PostmanFolder>;
}

interface PostmanCollection {
  info: {
    name: string;
    description?: string;
  };
  items: Array<PostmanRequest | PostmanFolder>;
  variables?: Array<{ key: string; value: string }>;
}

interface TestResult {
  requestName: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  statusCode?: number;
  duration?: number;
  error?: string;
  response?: any;
  assertions?: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
}

interface RunnerConfig {
  iterations: number;
  delay: number;
  dataFile?: File;
  environment: Record<string, string>;
  stopOnError: boolean;
}

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 400px;
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

const Header = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing[6]};
`;

const CollectionTree = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing[4]};
`;

const TreeItem = styled.div<{ level?: number; selected?: boolean }>`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  margin-left: ${props => (props.level || 0) * 24}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  background: ${props => props.selected ? 'rgba(255, 230, 0, 0.1)' : 'transparent'};
  border-left: ${props => props.selected ? `3px solid ${props => props.theme.colors.primary.yellow}` : '3px solid transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 230, 0, 0.05);
  }
`;

const MethodBadge = styled(Badge)<{ method: string }>`
  background: ${props => {
    switch (props.method?.toUpperCase()) {
      case 'GET': return '#61AFFE';
      case 'POST': return '#49CC90';
      case 'PUT': return '#FCA130';
      case 'DELETE': return '#F93E3E';
      case 'PATCH': return '#50E3C2';
      default: return theme.colors.secondary.mediumGray;
    }
  }};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const ResultsList = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
`;

const ResultItem = styled.div<{ status?: string }>`
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'passed': return '#10B981';
      case 'failed': return '#EF4444';
      case 'running': return theme.colors.primary.yellow;
      case 'skipped': return theme.colors.secondary.mediumGray;
      default: return theme.colors.border.light;
    }
  }};
`;

const RunnerControls = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.primary};
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const ConfigPanel = styled(Card)`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const StatsCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[4]};
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin: ${props => props.theme.spacing[4]} 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => props.theme.colors.primary.yellow};
    transition: width 0.3s ease;
  }
`;

const ResponseViewer = styled.pre`
  background: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  overflow: auto;
  max-height: 300px;
  margin-top: ${props => props.theme.spacing[3]};
`;

const isFolder = (item: any): item is PostmanFolder => {
  return Array.isArray(item.items);
};

const PostmanCollectionRunner: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams] = useSearchParams();
  const collectionPath = searchParams.get('collection');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<PostmanCollection | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  // Runner state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentRequest, setCurrentRequest] = useState<string | null>(null);
  const [runnerConfig, setRunnerConfig] = useState<RunnerConfig>({
    iterations: 1,
    delay: 0,
    environment: {},
    stopOnError: false
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0
  });

  useEffect(() => {
    loadCollection();
  }, [repoName, collectionPath]);

  const loadCollection = async () => {
    try {
      if (collectionPath) {
        const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(collectionPath)}`));
        if (!response.ok) throw new Error('Failed to load collection');
        
        const content = await response.json();
        setCollection(content);
        
        // Auto-select all requests
        const allRequests = new Set<string>();
        const extractRequests = (items: any[], prefix = '') => {
          items.forEach((item, index) => {
            const itemId = `${prefix}${index}`;
            if (isFolder(item)) {
              extractRequests(item.items, `${itemId}-`);
            } else {
              allRequests.add(itemId);
            }
          });
        };
        extractRequests(content.items);
        setSelectedRequests(allRequests);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  const runCollection = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setResults([]);
    const startTime = Date.now();
    
    const requestsToRun: Array<{ id: string; request: PostmanRequest }> = [];
    
    // Collect selected requests
    const collectRequests = (items: any[], prefix = '') => {
      items.forEach((item, index) => {
        const itemId = `${prefix}${index}`;
        if (isFolder(item)) {
          collectRequests(item.items, `${itemId}-`);
        } else if (selectedRequests.has(itemId)) {
          requestsToRun.push({ id: itemId, request: item });
        }
      });
    };
    
    if (collection) {
      collectRequests(collection.items);
    }
    
    // Initialize results
    const initialResults: TestResult[] = requestsToRun.map(({ request }) => ({
      requestName: request.name,
      status: 'pending'
    }));
    setResults(initialResults);
    
    // Run requests
    for (let iteration = 0; iteration < runnerConfig.iterations; iteration++) {
      for (let i = 0; i < requestsToRun.length; i++) {
        if (!isRunning || isPaused) break;
        
        const { request } = requestsToRun[i];
        const resultIndex = i + (iteration * requestsToRun.length);
        
        setCurrentRequest(request.name);
        setResults(prev => {
          const updated = [...prev];
          updated[resultIndex] = { ...updated[resultIndex], status: 'running' };
          return updated;
        });
        
        // Simulate request execution
        const result = await executeRequest(request);
        
        setResults(prev => {
          const updated = [...prev];
          updated[resultIndex] = result;
          return updated;
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          passed: prev.passed + (result.status === 'passed' ? 1 : 0),
          failed: prev.failed + (result.status === 'failed' ? 1 : 0),
          duration: Date.now() - startTime
        }));
        
        if (result.status === 'failed' && runnerConfig.stopOnError) {
          break;
        }
        
        // Delay between requests
        if (runnerConfig.delay > 0 && i < requestsToRun.length - 1) {
          await new Promise(resolve => setTimeout(resolve, runnerConfig.delay));
        }
      }
    }
    
    setIsRunning(false);
    setCurrentRequest(null);
  };

  const executeRequest = async (request: PostmanRequest): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Simulate request execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Randomly succeed or fail for demo
      const success = Math.random() > 0.2;
      
      return {
        requestName: request.name,
        status: success ? 'passed' : 'failed',
        statusCode: success ? 200 : 400,
        duration: Date.now() - startTime,
        response: {
          data: { message: `Response for ${request.name}` }
        },
        assertions: [
          {
            name: 'Status code is 200',
            passed: success,
            message: success ? 'Passed' : 'Expected 200 but got 400'
          },
          {
            name: 'Response time is less than 1000ms',
            passed: true,
            message: 'Passed'
          }
        ]
      };
    } catch (error) {
      return {
        requestName: request.name,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Request failed'
      };
    }
  };

  const exportResults = () => {
    const report = {
      collection: collection?.info.name,
      timestamp: new Date().toISOString(),
      config: runnerConfig,
      stats,
      results
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postman-runner-results-${Date.now()}.json`;
    a.click();
  };

  const renderTreeItems = (items: any[], prefix = '', level = 0) => {
    return items.map((item, index) => {
      const itemId = `${prefix}${index}`;
      
      if (isFolder(item)) {
        const isExpanded = expandedFolders.has(itemId);
        return (
          <div key={itemId}>
            <TreeItem
              level={level}
              onClick={() => toggleFolder(itemId)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <FileText size={16} />
              <Text weight="medium">{item.name}</Text>
              <Text size="small" color="secondary">
                ({item.items.length})
              </Text>
            </TreeItem>
            {isExpanded && renderTreeItems(item.items, `${itemId}-`, level + 1)}
          </div>
        );
      } else {
        const isSelected = selectedRequests.has(itemId);
        return (
          <TreeItem
            key={itemId}
            level={level}
            selected={isSelected}
            onClick={() => toggleRequest(itemId)}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              style={{ marginRight: theme.spacing[2] }}
            />
            <MethodBadge method={item.method}>{item.method}</MethodBadge>
            <Text>{item.name}</Text>
          </TreeItem>
        );
      }
    });
  };

  if (loading) {
    return <FullPageLoading text="Loading Postman collection..." />;
  }

  if (error || !collection) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">Error Loading Collection</H1>
          <Text color="secondary">{error || 'Collection not found'}</Text>
          <Button as={Link} to={`/api-explorer/${repoName}`}>
            Back to API Explorer
          </Button>
        </Section>
      </Container>
    );
  }

  const progress = stats.total > 0 ? ((stats.passed + stats.failed + stats.skipped) / stats.total) * 100 : 0;

  return (
    <PageContainer>
      <Sidebar>
        <div style={{ padding: theme.spacing[4] }}>
          <Button
            as={Link}
            to={`/api-explorer/${repoName}`}
            variant="outline"
            size="sm"
            style={{ marginBottom: theme.spacing[4] }}
          >
            <ArrowLeft size={20} />
            Back to Explorer
          </Button>
          
          <H2 style={{ marginBottom: theme.spacing[2] }}>{collection.info.name}</H2>
          {collection.info.description && (
            <Text size="small" color="secondary" style={{ marginBottom: theme.spacing[4] }}>
              {collection.info.description}
            </Text>
          )}
        </div>
        
        <CollectionTree>
          {renderTreeItems(collection.items)}
        </CollectionTree>
        
        <RunnerControls>
          <Flex gap={2} style={{ marginBottom: theme.spacing[3] }}>
            <Button
              onClick={runCollection}
              disabled={isRunning && !isPaused}
              style={{ flex: 1 }}
            >
              <Play size={20} />
              {isRunning && !isPaused ? 'Running...' : 'Run Collection'}
            </Button>
            {isRunning && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRunning(false);
                    setCurrentRequest(null);
                  }}
                >
                  <StopCircle size={20} />
                </Button>
              </>
            )}
          </Flex>
          
          <Text size="small" color="secondary">
            {selectedRequests.size} of {collection.items.length} requests selected
          </Text>
        </RunnerControls>
      </Sidebar>

      <MainContent>
        <Header>
          <Flex align="center" justify="between">
            <div>
              <H2 style={{ margin: 0 }}>Collection Runner</H2>
              {currentRequest && (
                <Text color="secondary" style={{ marginTop: theme.spacing[1] }}>
                  Running: {currentRequest}
                </Text>
              )}
            </div>
            
            <Flex gap={2}>
              <Button
                variant="outline"
                onClick={exportResults}
                disabled={results.length === 0}
              >
                <Download size={20} />
                Export Results
              </Button>
              <Button variant="outline">
                <Settings size={20} />
                Configure
              </Button>
            </Flex>
          </Flex>
        </Header>

        <Content>
          <ConfigPanel>
            <CardHeader>
              <CardTitle>Runner Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: theme.spacing[4] 
              }}>
                <div>
                  <Text weight="semibold" size="small" style={{ marginBottom: theme.spacing[1] }}>
                    Iterations
                  </Text>
                  <Input
                    type="number"
                    min="1"
                    value={runnerConfig.iterations}
                    onChange={(e) => setRunnerConfig({
                      ...runnerConfig,
                      iterations: parseInt(e.target.value) || 1
                    })}
                  />
                </div>
                <div>
                  <Text weight="semibold" size="small" style={{ marginBottom: theme.spacing[1] }}>
                    Delay (ms)
                  </Text>
                  <Input
                    type="number"
                    min="0"
                    value={runnerConfig.delay}
                    onChange={(e) => setRunnerConfig({
                      ...runnerConfig,
                      delay: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Text weight="semibold" size="small" style={{ marginBottom: theme.spacing[1] }}>
                    Data File
                  </Text>
                  <Button size="sm" variant="outline">
                    <Upload size={16} />
                    Choose File
                  </Button>
                </div>
                <div>
                  <Text weight="semibold" size="small" style={{ marginBottom: theme.spacing[1] }}>
                    Stop on Error
                  </Text>
                  <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                    <input
                      type="checkbox"
                      checked={runnerConfig.stopOnError}
                      onChange={(e) => setRunnerConfig({
                        ...runnerConfig,
                        stopOnError: e.target.checked
                      })}
                    />
                    <Text size="small">Enabled</Text>
                  </label>
                </div>
              </div>
            </CardContent>
          </ConfigPanel>

          {(isRunning || results.length > 0) && (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: theme.spacing[4],
                marginBottom: theme.spacing[6] 
              }}>
                <StatsCard>
                  <H3 style={{ margin: 0 }}>{stats.total}</H3>
                  <Text size="small" color="secondary">Total Requests</Text>
                </StatsCard>
                <StatsCard>
                  <H3 style={{ margin: 0, color: '#10B981' }}>{stats.passed}</H3>
                  <Text size="small" color="secondary">Passed</Text>
                </StatsCard>
                <StatsCard>
                  <H3 style={{ margin: 0, color: '#EF4444' }}>{stats.failed}</H3>
                  <Text size="small" color="secondary">Failed</Text>
                </StatsCard>
                <StatsCard>
                  <H3 style={{ margin: 0 }}>
                    {stats.duration > 0 ? `${(stats.duration / 1000).toFixed(1)}s` : '0s'}
                  </H3>
                  <Text size="small" color="secondary">Duration</Text>
                </StatsCard>
              </div>

              <ProgressBar progress={progress} />

              <ResultsList>
                <H3>Test Results</H3>
                {results.map((result, index) => (
                  <ResultItem key={index} status={result.status}>
                    <Flex align="center" justify="between">
                      <Flex align="center" gap={3}>
                        {result.status === 'pending' && <Clock size={20} color={theme.colors.text.secondary} />}
                        {result.status === 'running' && <div className="spinner" />}
                        {result.status === 'passed' && <CheckCircle size={20} color="#10B981" />}
                        {result.status === 'failed' && <XCircle size={20} color="#EF4444" />}
                        {result.status === 'skipped' && <AlertCircle size={20} color={theme.colors.text.secondary} />}
                        
                        <div>
                          <Text weight="semibold">{result.requestName}</Text>
                          {result.statusCode && (
                            <Text size="small" color="secondary">
                              Status: {result.statusCode} • {result.duration}ms
                            </Text>
                          )}
                        </div>
                      </Flex>
                      
                      {result.assertions && (
                        <Flex gap={2}>
                          <Badge variant={result.assertions.every(a => a.passed) ? 'success' : 'danger'}>
                            {result.assertions.filter(a => a.passed).length}/{result.assertions.length} Passed
                          </Badge>
                        </Flex>
                      )}
                    </Flex>
                    
                    {result.error && (
                      <Text color="secondary" size="small" style={{ marginTop: theme.spacing[2] }}>
                        Error: {result.error}
                      </Text>
                    )}
                    
                    {result.assertions && result.assertions.some(a => !a.passed) && (
                      <div style={{ marginTop: theme.spacing[3] }}>
                        <Text weight="semibold" size="small">Failed Assertions:</Text>
                        {result.assertions.filter(a => !a.passed).map((assertion, i) => (
                          <Text key={i} size="small" color="secondary">
                            • {assertion.name}: {assertion.message}
                          </Text>
                        ))}
                      </div>
                    )}
                    
                    {result.response && (
                      <details style={{ marginTop: theme.spacing[3] }}>
                        <summary style={{ cursor: 'pointer' }}>
                          <Text size="small" weight="semibold">View Response</Text>
                        </summary>
                        <ResponseViewer>
                          {JSON.stringify(result.response, null, 2)}
                        </ResponseViewer>
                      </details>
                    )}
                  </ResultItem>
                ))}
              </ResultsList>
            </>
          )}
        </Content>
      </MainContent>
    </PageContainer>
  );
};

export default PostmanCollectionRunner;