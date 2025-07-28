import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Mock modules
jest.mock('fs');
jest.mock('child_process');

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('analyzeRepositoryContent', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // Import the script in a way that allows testing
  const runAnalyzeScript = () => {
    jest.isolateModules(() => {
      require('../analyzeRepositoryContent');
    });
  };

  it('creates output directory if it does not exist', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockMkdirSync = fs.mkdirSync as jest.Mock;
    
    mockExistsSync.mockReturnValue(false);

    runAnalyzeScript();

    expect(mockMkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('analysis-output'),
      { recursive: true }
    );
  });

  it('processes all repositories in the cloned-repositories directory', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    const mockWriteFileSync = fs.writeFileSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      'repo1',
      'repo2',
      '.git', // Should be skipped
      'file.txt' // Should be skipped
    ]);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    // Mock repository analysis
    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('find') && cmd.includes('.yaml')) {
        return 'api.yaml\nswagger.yaml\n';
      }
      if (cmd.includes('find') && cmd.includes('.graphql')) {
        return 'schema.graphql\n';
      }
      if (cmd.includes('find') && cmd.includes('.proto')) {
        return '';
      }
      if (cmd.includes('find') && cmd.includes('.md')) {
        return 'README.md\ndocs/guide.md\n';
      }
      return '';
    });

    runAnalyzeScript();

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Analyzing repository: repo1'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Analyzing repository: repo2'));
    expect(mockWriteFileSync).toHaveBeenCalled();
  });

  it('handles repository analysis errors gracefully', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['error-repo']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    runAnalyzeScript();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error analyzing error-repo:'),
      expect.any(Error)
    );
  });

  it('correctly identifies REST API files', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    const mockWriteFileSync = fs.writeFileSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['rest-repo']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('.yaml') || cmd.includes('.yml')) {
        return 'openapi.yaml\napi/swagger.yml\n';
      }
      return '';
    });

    runAnalyzeScript();

    const writeCall = mockWriteFileSync.mock.calls[0];
    const content = writeCall[1];
    expect(content).toContain('REST/OpenAPI Files: 2');
    expect(content).toContain('openapi.yaml');
    expect(content).toContain('api/swagger.yml');
  });

  it('correctly identifies GraphQL files', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    const mockWriteFileSync = fs.writeFileSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['graphql-repo']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('.graphql') || cmd.includes('.gql')) {
        return 'schema.graphql\nqueries.gql\n';
      }
      return '';
    });

    runAnalyzeScript();

    const writeCall = mockWriteFileSync.mock.calls[0];
    const content = writeCall[1];
    expect(content).toContain('GraphQL Files: 2');
    expect(content).toContain('schema.graphql');
    expect(content).toContain('queries.gql');
  });

  it('generates summary statistics', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    const mockWriteFileSync = fs.writeFileSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['repo1', 'repo2', 'repo3']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('repo1') && cmd.includes('.yaml')) {
        return 'api.yaml\n';
      }
      if (cmd.includes('repo2') && cmd.includes('.graphql')) {
        return 'schema.graphql\n';
      }
      return '';
    });

    runAnalyzeScript();

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Total Repositories: 3'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Total REST APIs: 1'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Total GraphQL APIs: 1'));
  });

  it('handles specific repository branch switching', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['nslabsdashboards']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockReturnValue('');

    runAnalyzeScript();

    // Should attempt to switch to james-update branch for nslabsdashboards
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('git checkout james-update'),
      expect.objectContaining({
        cwd: expect.stringContaining('nslabsdashboards')
      })
    );
  });

  it('writes JSON output file', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    const mockWriteFileSync = fs.writeFileSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['test-repo']);
    mockStatSync.mockReturnValue({ isDirectory: () => true });

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockReturnValue('');

    runAnalyzeScript();

    // Should write JSON file
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining('repository-analysis.json'),
      expect.any(String),
      'utf8'
    );

    // Verify JSON structure
    const jsonCall = mockWriteFileSync.mock.calls.find(
      call => call[0].includes('.json')
    );
    if (jsonCall) {
      const jsonContent = JSON.parse(jsonCall[1]);
      expect(jsonContent).toHaveProperty('repositories');
      expect(jsonContent).toHaveProperty('summary');
      expect(jsonContent).toHaveProperty('timestamp');
    }
  });

  it('handles empty repository directories', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([]);

    runAnalyzeScript();

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Total Repositories: 0'));
  });

  it('ignores hidden directories and files', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReaddirSync = fs.readdirSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([
      '.git',
      '.DS_Store',
      'visible-repo',
      'README.md'
    ]);
    
    mockStatSync.mockImplementation((path: string) => ({
      isDirectory: () => !path.includes('.')
    }));

    const mockExecSync = execSync as jest.Mock;
    mockExecSync.mockReturnValue('');

    runAnalyzeScript();

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Analyzing repository: visible-repo'));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('.git'));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('.DS_Store'));
  });
});