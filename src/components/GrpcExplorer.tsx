import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getApiUrl } from '../utils/apiConfig';
import { 
  ArrowLeft,
  Globe,
  Play,
  FileCode,
  ChevronRight,
  ChevronDown,
  Copy,
  Download,
  Settings,
  AlertCircle,
  CheckCircle
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
  CardDescription,
  CardContent,
  Flex,
  Badge,
  FullPageLoading,
  Input
} from './styled';

interface GrpcService {
  name: string;
  methods: GrpcMethod[];
  package?: string;
}

interface GrpcMethod {
  name: string;
  requestType: string;
  responseType: string;
  requestStream: boolean;
  responseStream: boolean;
  description?: string;
}

interface ProtoField {
  name: string;
  type: string;
  repeated: boolean;
  required: boolean;
  description?: string;
  fields?: ProtoField[];
}

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 350px;
  background: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.light};
  overflow-y: auto;
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

const ServiceItem = styled.div<{ active?: boolean }>`
  padding: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background.primary};
  margin: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const MethodItem = styled.div<{ selected?: boolean }>`
  padding: ${props => props.theme.spacing[3]};
  margin-left: ${props => props.theme.spacing[6]};
  margin-right: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[2]};
  background: ${props => props.selected ? theme.colors.primary.yellow : theme.colors.background.secondary};
  color: ${props => props.selected ? theme.colors.primary.black : theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.selected ? theme.colors.primary.yellow : 'rgba(255, 230, 0, 0.1)'};
  }
`;

const StreamBadge = styled(Badge)`
  background: ${props => props.theme.colors.accent.purple};
  color: white;
  margin-left: ${props => props.theme.spacing[2]};
`;

const RequestEditor = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const JsonEditor = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${props => props.theme.spacing[4]};
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

const ConfigSection = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
`;

const MetadataEditor = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
`;

const MetadataRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
`;

const ProtoViewer = styled(Card)`
  margin-top: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.background.primary};
`;

const ProtoContent = styled.pre`
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  white-space: pre-wrap;
  margin: 0;
`;

const FieldRow = styled.div`
  padding: ${props => props.theme.spacing[2]} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const FieldType = styled.span`
  color: ${props => props.theme.colors.accent.blue};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const GrpcExplorer: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [searchParams] = useSearchParams();
  const protoPath = searchParams.get('proto') || searchParams.get('file');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<GrpcService[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<{ service: GrpcService; method: GrpcMethod } | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [availableProtos, setAvailableProtos] = useState<string[]>([]);
  
  // Request state
  const [endpoint, setEndpoint] = useState('localhost:50051');
  const [metadata, setMetadata] = useState<Record<string, string>>({
    'authorization': 'Bearer token'
  });
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  
  // Proto content
  const [protoContent, setProtoContent] = useState<string>('');
  const [showProto, setShowProto] = useState(false);

  useEffect(() => {
    if (protoPath) {
      loadProtoFile();
    } else {
      // If no proto file specified, fetch available proto files
      fetchAvailableProtos();
    }
  }, [repoName, protoPath]);

  const loadProtoFile = async () => {
    try {
      if (protoPath) {
        const response = await fetch(getApiUrl(`/api/repository/${repoName}/file?path=${encodeURIComponent(protoPath)}`));
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to load proto file: ${response.status} ${errorText}`);
        }
        
        const content = await response.text();
        setProtoContent(content);
        
        // Parse proto file to extract services and methods
        const parsedServices = parseProtoFile(content);
        setServices(parsedServices);
        
        // Auto-expand first service
        if (parsedServices.length > 0) {
          setExpandedServices(new Set([parsedServices[0].name]));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProtos = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/detect-apis/${repoName}`));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API data: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.apis && data.apis.grpc && data.apis.grpc.length > 0) {
        setAvailableProtos(data.apis.grpc.map((g: any) => g.file));
        // Automatically load the first proto file
        const firstProto = data.apis.grpc[0].file;
        window.history.replaceState(null, '', `${window.location.pathname}?proto=${encodeURIComponent(firstProto)}`);
        // Reload with the proto parameter
        window.location.reload();
      } else {
        setError('No gRPC services found in this repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch available proto files');
    } finally {
      setLoading(false);
    }
  };

  const parseProtoFile = (content: string): GrpcService[] => {
    const services: GrpcService[] = [];
    
    // Extract package name
    const packageMatch = content.match(/package\s+([\w.]+);/);
    const packageName = packageMatch ? packageMatch[1] : undefined;
    
    // Extract services
    const serviceRegex = /service\s+(\w+)\s*{([^}]*)}/g;
    let serviceMatch;
    
    while ((serviceMatch = serviceRegex.exec(content)) !== null) {
      const serviceName = serviceMatch[1];
      const serviceBody = serviceMatch[2];
      
      // Extract methods from service
      const methods: GrpcMethod[] = [];
      const methodRegex = /rpc\s+(\w+)\s*\(\s*(stream\s+)?(\w+)\s*\)\s*returns\s*\(\s*(stream\s+)?(\w+)\s*\)/g;
      let methodMatch;
      
      while ((methodMatch = methodRegex.exec(serviceBody)) !== null) {
        methods.push({
          name: methodMatch[1],
          requestType: methodMatch[3],
          responseType: methodMatch[5],
          requestStream: !!methodMatch[2],
          responseStream: !!methodMatch[4]
        });
      }
      
      services.push({
        name: serviceName,
        methods,
        package: packageName
      });
    }
    
    return services;
  };

  const toggleService = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  const selectMethod = (service: GrpcService, method: GrpcMethod) => {
    setSelectedMethod({ service, method });
    
    // Generate sample request based on method
    const sampleRequest = generateSampleRequest(method.requestType);
    setRequestBody(JSON.stringify(sampleRequest, null, 2));
  };

  const generateSampleRequest = (typeName: string): any => {
    // Generate a sample request based on common patterns
    const commonTypes: Record<string, any> = {
      'GetRequest': { id: '123' },
      'ListRequest': { page: 1, pageSize: 10 },
      'CreateRequest': { name: 'Example', description: 'Sample data' },
      'UpdateRequest': { id: '123', name: 'Updated' },
      'DeleteRequest': { id: '123' }
    };
    
    return commonTypes[typeName] || { 
      field1: 'value1',
      field2: 123,
      field3: true
    };
  };

  const executeRequest = async () => {
    if (!selectedMethod) return;
    
    setExecuting(true);
    const startTime = Date.now();
    
    try {
      // Parse request body
      const requestData = JSON.parse(requestBody);
      
      // For demo purposes, simulate a gRPC response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse = {
        success: true,
        data: {
          message: `Response from ${selectedMethod.method.name}`,
          timestamp: new Date().toISOString(),
          request: requestData,
          metadata: {
            service: selectedMethod.service.name,
            method: selectedMethod.method.name,
            endpoint: endpoint
          }
        },
        duration: Date.now() - startTime
      };
      
      setResponse(mockResponse);
    } catch (err) {
      setResponse({
        error: err instanceof Error ? err.message : 'Request failed',
        code: 'INTERNAL',
        details: 'Failed to execute gRPC request'
      });
    } finally {
      setExecuting(false);
    }
  };

  const generateCodeSnippet = (language: string): string => {
    if (!selectedMethod) return '';
    
    const { service, method } = selectedMethod;
    
    switch (language) {
      case 'node':
        return `const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto file
const packageDefinition = protoLoader.loadSync('path/to/your.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

// Create client
const client = new proto.${service.package || 'package'}.${service.name}(
  '${endpoint}',
  grpc.credentials.createInsecure()
);

// Make request
const request = ${requestBody};

client.${method.name}(request, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Response:', response);
  }
});`;

      case 'python':
        return `import grpc
import your_pb2
import your_pb2_grpc

# Create channel and stub
channel = grpc.insecure_channel('${endpoint}')
stub = your_pb2_grpc.${service.name}Stub(channel)

# Create request
request = your_pb2.${method.requestType}(
${requestBody.split('\n').map(line => '    ' + line).join('\n')}
)

# Make request
try:
    response = stub.${method.name}(request)
    print(f"Response: {response}")
except grpc.RpcError as e:
    print(f"Error: {e.code()}: {e.details()}")`;

      case 'go':
        return `package main

import (
    "context"
    "log"
    "google.golang.org/grpc"
    pb "path/to/your/proto"
)

func main() {
    // Create connection
    conn, err := grpc.Dial("${endpoint}", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Failed to connect: %v", err)
    }
    defer conn.Close()
    
    // Create client
    client := pb.New${service.name}Client(conn)
    
    // Create request
    request := &pb.${method.requestType}{
        // Fill in request fields
    }
    
    // Make request
    response, err := client.${method.name}(context.Background(), request)
    if err != nil {
        log.Fatalf("Request failed: %v", err)
    }
    
    log.Printf("Response: %v", response)
}`;

      default:
        return '';
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading gRPC definitions..." />;
  }

  if (error || services.length === 0) {
    return (
      <Container maxWidth="lg">
        <Section>
          <H1 color="secondary">
            <AlertCircle size={32} style={{ marginRight: theme.spacing[2] }} />
            No gRPC Services Found
          </H1>
          <Text color="secondary">
            {error || 'No proto files found in this repository.'}
          </Text>
          <Button as={Link} to={`/api-explorer/${repoName}`}>
            Back to API Explorer
          </Button>
        </Section>
      </Container>
    );
  }

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
          
          <H2 style={{ marginBottom: theme.spacing[4] }}>
            <Globe size={24} style={{ marginRight: theme.spacing[2] }} />
            gRPC Services
          </H2>
        </div>
        
        {services.map(service => (
          <div key={service.name}>
            <ServiceItem onClick={() => toggleService(service.name)}>
              <Flex align="center" justify="between">
                <div>
                  <Text weight="semibold">{service.name}</Text>
                  <Text size="small" color="secondary">
                    {service.methods.length} methods
                  </Text>
                </div>
                {expandedServices.has(service.name) ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </Flex>
            </ServiceItem>
            
            {expandedServices.has(service.name) && (
              <div>
                {service.methods.map(method => (
                  <MethodItem
                    key={method.name}
                    selected={selectedMethod?.method.name === method.name}
                    onClick={() => selectMethod(service, method)}
                  >
                    <Flex align="center" justify="between">
                      <Text weight="medium">{method.name}</Text>
                      <div>
                        {method.requestStream && <StreamBadge size="sm">stream</StreamBadge>}
                        {method.responseStream && <StreamBadge size="sm">stream</StreamBadge>}
                      </div>
                    </Flex>
                    <Text size="small" color="secondary">
                      {method.requestType} → {method.responseType}
                    </Text>
                  </MethodItem>
                ))}
              </div>
            )}
          </div>
        ))}
      </Sidebar>

      <MainContent>
        <Header>
          <Flex align="center" justify="between">
            <div>
              <H2 style={{ margin: 0 }}>
                {selectedMethod ? selectedMethod.method.name : 'Select a method'}
              </H2>
              {selectedMethod && (
                <Text color="secondary" style={{ marginTop: theme.spacing[1] }}>
                  {selectedMethod.service.name} Service
                </Text>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowProto(!showProto)}
            >
              <FileCode size={20} />
              {showProto ? 'Hide' : 'View'} Proto
            </Button>
          </Flex>
        </Header>

        <Content>
          {selectedMethod ? (
            <>
              <ConfigSection>
                <H3>Connection</H3>
                <Flex gap={3} style={{ marginBottom: theme.spacing[4] }}>
                  <Input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="localhost:50051"
                    style={{ flex: 1 }}
                  />
                  <Button variant="outline">
                    <Settings size={20} />
                    TLS Config
                  </Button>
                </Flex>

                <MetadataEditor>
                  <Text weight="semibold" style={{ marginBottom: theme.spacing[2] }}>
                    Metadata
                  </Text>
                  {Object.entries(metadata).map(([key, value], index) => (
                    <MetadataRow key={index}>
                      <Input
                        type="text"
                        value={key}
                        placeholder="Key"
                        onChange={(e) => {
                          const newMetadata = { ...metadata };
                          delete newMetadata[key];
                          newMetadata[e.target.value] = value;
                          setMetadata(newMetadata);
                        }}
                      />
                      <Input
                        type="text"
                        value={value}
                        placeholder="Value"
                        onChange={(e) => {
                          setMetadata({ ...metadata, [key]: e.target.value });
                        }}
                      />
                    </MetadataRow>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMetadata({ ...metadata, '': '' })}
                  >
                    Add Metadata
                  </Button>
                </MetadataEditor>
              </ConfigSection>

              <RequestEditor>
                <Flex align="center" justify="between" style={{ marginBottom: theme.spacing[2] }}>
                  <H3>Request ({selectedMethod.method.requestType})</H3>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const formatted = JSON.stringify(JSON.parse(requestBody), null, 2);
                        setRequestBody(formatted);
                      }}
                    >
                      Format
                    </Button>
                    <Button
                      onClick={executeRequest}
                      disabled={executing}
                    >
                      {executing ? 'Executing...' : (
                        <>
                          <Play size={20} />
                          Execute
                        </>
                      )}
                    </Button>
                  </Flex>
                </Flex>
                <JsonEditor
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Enter request JSON..."
                />
              </RequestEditor>

              {response && (
                <ResponseViewer>
                  <ResponseHeader>
                    <Flex align="center" gap={3}>
                      <Text weight="semibold">Response</Text>
                      {response.success ? (
                        <Badge variant="success">Success</Badge>
                      ) : (
                        <Badge variant="danger">Error</Badge>
                      )}
                      {response.duration && (
                        <Text size="small" color="secondary">
                          {response.duration}ms
                        </Text>
                      )}
                    </Flex>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                        }}
                      >
                        <Copy size={16} />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedMethod.method.name}-response.json`;
                          a.click();
                        }}
                      >
                        <Download size={16} />
                        Download
                      </Button>
                    </Flex>
                  </ResponseHeader>
                  <ResponseBody>
                    {JSON.stringify(response.data || response.error, null, 2)}
                  </ResponseBody>
                </ResponseViewer>
              )}

              <div style={{ marginTop: theme.spacing[6] }}>
                <H3>Code Examples</H3>
                <Flex gap={2} style={{ marginBottom: theme.spacing[3] }}>
                  {['node', 'python', 'go'].map(lang => (
                    <Button
                      key={lang}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const code = generateCodeSnippet(lang);
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy size={16} />
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Button>
                  ))}
                </Flex>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: theme.spacing[16] }}>
              <Globe size={64} color={theme.colors.text.secondary} />
              <H2 color="secondary" style={{ marginTop: theme.spacing[4] }}>
                Select a gRPC Method
              </H2>
              <Text color="secondary">
                Choose a service and method from the sidebar to start testing
              </Text>
            </div>
          )}

          {showProto && protoContent && (
            <ProtoViewer>
              <CardHeader>
                <CardTitle>Proto Definition</CardTitle>
              </CardHeader>
              <CardContent>
                <ProtoContent>{protoContent}</ProtoContent>
              </CardContent>
            </ProtoViewer>
          )}
        </Content>
      </MainContent>
    </PageContainer>
  );
};

export default GrpcExplorer;