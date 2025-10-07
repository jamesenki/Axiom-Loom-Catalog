/**
 * Express Server for Axiom Loom Catalog
 * Provides API endpoints for repository management and dynamic API detection
 * Enhanced with authentication and security features
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const dynamicApiRoutes = require('./api/dynamicApiDetection');
const repositoryManagementRoutes = require('./api/repositoryManagement');
const repositoryFilesRoutes = require('./api/repositoryFiles');
const plantUmlRoutes = require('./api/plantUmlRenderer');
const searchRoutes = require('./api/searchApi');
const authRoutes = require('./api/authRoutes');

// Load repository metadata
let repositoryMetadata = {};
try {
  const metadataPath = path.join(__dirname, '..', 'repository-metadata.json');
  console.log('Loading repository metadata from:', metadataPath);
  repositoryMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log('Loaded metadata for repositories:', Object.keys(repositoryMetadata));
} catch (error) {
  console.warn('Repository metadata file not found or invalid, using defaults:', error.message);
}
const healthCheckRoutes = require('./api/healthCheck');
const analyticsApiRoutes = require('./api/analyticsApi');
const { 
  authenticate, 
  authorize, 
  dynamicRateLimit,
  auditLog 
} = require('./middleware/auth.middleware');
const {
  analyticsMiddleware,
  performanceTracking,
  trackRepositoryAccess
} = require('./middleware/analytics.middleware');
const {
  securityHeaders,
  enforceHTTPS,
  getCorsOptions,
  sanitizeRequest,
  detectSuspiciousActivity,
  cspReportHandler
} = require('./middleware/security.middleware');

// Function to strip markdown syntax from text
function stripMarkdown(text) {
  if (!text) return '';
  
  return text
    // Remove image syntax ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // Remove link syntax [text](url)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove code blocks
    .replace(/```[^`]*```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware - applied first
// Only enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use(enforceHTTPS);
}
app.use(securityHeaders());
app.use(detectSuspiciousActivity);

// Basic middleware
app.use(cors(getCorsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeRequest);

// CSP violation reporting endpoint
app.post('/csp-violation-report', express.json({ type: 'application/csp-report' }), cspReportHandler);

// Analytics and performance tracking
app.use(analyticsMiddleware);
app.use(performanceTracking);

// Health check endpoints (no auth required)
app.use('/api', healthCheckRoutes);

// Auth routes (no authentication required)
app.use('/api', authRoutes);

// Analytics API routes
app.use('/api/analytics', analyticsApiRoutes);

// Apply rate limiting to all API routes
app.use('/api', dynamicRateLimit);

// List all repositories endpoint (temporarily unprotected for testing)
// MOVED BEFORE PROTECTED ROUTES TO ENSURE IT'S NOT OVERRIDDEN
app.get('/api/repositories', (req, res) => {
  const reposPath = path.join(__dirname, '../cloned-repositories');
  
  if (!fs.existsSync(reposPath)) {
    return res.json([]);
  }
  
  try {
    const repos = fs.readdirSync(reposPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(dirent => {
        const repoPath = path.join(reposPath, dirent.name);
        const readmePath = path.join(repoPath, 'README.md');
        const packageJsonPath = path.join(repoPath, 'package.json');
        const marketingBriefPath = path.join(repoPath, 'marketing-brief.md');
        
        let description = '';
        let marketingDescription = '';
        let displayName = dirent.name;
        
        // Get marketing description
        if (fs.existsSync(marketingBriefPath)) {
          try {
            const fullMarketing = fs.readFileSync(marketingBriefPath, 'utf8').trim();
            // Extract the subtitle (first paragraph after ## heading)
            const subtitleMatch = fullMarketing.match(/##\s+(.+)\n\n(.+?)(?:\n|$)/);
            if (subtitleMatch) {
              marketingDescription = stripMarkdown(subtitleMatch[2].trim());
            } else {
              // Fallback to first sentence
              const firstSentence = fullMarketing.match(/^[^.!?]+[.!?]/);
              if (firstSentence) {
                marketingDescription = stripMarkdown(firstSentence[0]);
              } else {
                marketingDescription = stripMarkdown(fullMarketing.substring(0, 200)) + '...';
              }
            }
          } catch (e) {}
        }
        
        // Try to get description from package.json
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            description = packageData.description || '';
            // Don't override displayName with package.json name as it's often technical
            // displayName = packageData.name || dirent.name;
          } catch (e) {}
        }
        
        // Try to get description from README if not found
        if (!description && fs.existsSync(readmePath)) {
          try {
            const readmeContent = fs.readFileSync(readmePath, 'utf8');
            const lines = readmeContent.split('\n');
            for (let i = 0; i < Math.min(lines.length, 10); i++) {
              const line = lines[i].trim();
              if (line && !line.startsWith('#') && !line.startsWith('![')) {
                description = line.substring(0, 200);
                break;
              }
            }
          } catch (e) {}
        }
        
        // Count API files and Postman collections
        let apiCount = 0;
        let postmanCount = 0;
        let hasGrpc = false;
        let hasGraphQL = false;
        let hasOpenAPI = false;
        
        const countApis = (dir) => {
          try {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            files.forEach(file => {
              if (file.isFile()) {
                if (/\.(yaml|yml)$/i.test(file.name)) {
                  apiCount++;
                  hasOpenAPI = true;
                } else if (/\.(graphql|gql)$/i.test(file.name)) {
                  apiCount++;
                  hasGraphQL = true;
                } else if (/\.proto$/i.test(file.name)) {
                  apiCount++;
                  hasGrpc = true;
                } else if (/(?:postman.*\.json|.*postman.*\.json|.*collection.*\.json)$/i.test(file.name)) {
                  postmanCount++;
                }
              } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
                countApis(path.join(dir, file.name));
              }
            });
          } catch (e) {}
        };
        countApis(repoPath);
        
        // Get last modified time
        const stats = fs.statSync(repoPath);
        
        // Create a human-friendly display name from the repository name
        let friendlyName = displayName;
        if (!marketingDescription && displayName === dirent.name) {
          // Convert kebab-case to Title Case
          friendlyName = dirent.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        
        // Get repository metadata - prioritize axiom.json over global metadata
        let repoConfig = {};
        const axiomConfigPath = path.join(repoPath, 'axiom.json');
        
        if (fs.existsSync(axiomConfigPath)) {
          try {
            repoConfig = JSON.parse(fs.readFileSync(axiomConfigPath, 'utf8'));
          } catch (e) {
            console.warn(`Invalid axiom.json in ${dirent.name}:`, e.message);
          }
        }
        
        // Fallback to global metadata
        const metadata = repositoryMetadata[dirent.name] || {};
        
        // Extract normalized data from axiom.json
        const repo = repoConfig.repository || {};
        const desc = repoConfig.description || {};
        const classification = repoConfig.classification || {};
        const technical = repoConfig.technical || {};
        const business = repoConfig.business || {};
        const urls = repoConfig.urls || {};
        
        return {
          id: dirent.name,
          name: dirent.name,
          displayName: repo.displayName || metadata.displayName || friendlyName,
          shortName: repo.shortName || repo.displayName || friendlyName,
          brandName: repo.brandName || repo.displayName || friendlyName,
          description: stripMarkdown(desc.summary || metadata.description || marketingDescription || description) || `${friendlyName} Solution`,
          tagline: desc.tagline || `${friendlyName} solution`,
          marketingDescription: desc.marketingPitch || marketingDescription,
          category: classification.category || metadata.category || 'Platform',
          subcategory: classification.subcategory || 'Architecture',
          status: repoConfig.metadata?.status || 'active',
          demoUrl: urls.demo || metadata.demoUrl || null,
          tags: classification.tags || metadata.tags || [],
          industry: classification.industry || ['enterprise'],
          useCase: classification.useCase || ['platform'],
          metrics: {
            apiCount: technical.apis?.count || apiCount,
            postmanCollections: technical.integrations?.postman?.collections || postmanCount,
            lastUpdated: repoConfig.metadata?.lastUpdated || stats.mtime.toISOString(),
            valueScore: business.valueScore || metadata.pricing?.valueScore || 70
          },
          apiTypes: {
            hasOpenAPI: technical.apis?.types?.rest || hasOpenAPI,
            hasGraphQL: technical.apis?.types?.graphql || hasGraphQL,
            hasGrpc: technical.apis?.types?.grpc || hasGrpc,
            hasWebSocket: technical.apis?.types?.websocket || false,
            hasPostman: technical.integrations?.postman?.available || (postmanCount > 0)
          },
          integrations: {
            postman: technical.integrations?.postman || { available: postmanCount > 0, collections: postmanCount },
            swagger: technical.integrations?.swagger || { available: hasOpenAPI, path: '/docs/api.yaml' },
            graphql: technical.integrations?.graphql || { available: hasGraphQL, endpoint: '/graphql', playground: hasGraphQL }
          },
          url: urls.github || `https://github.com/${process.env.GITHUB_ORGANIZATION || 'jamesenki'}/${dirent.name}`,
          urls: {
            demo: urls.demo || metadata.demoUrl || null,
            documentation: urls.documentation || null,
            website: urls.website || null,
            github: urls.github || `https://github.com/${process.env.GITHUB_ORGANIZATION || 'jamesenki'}/${dirent.name}`
          },
          pricing: business.pricing || metadata.pricing || null,
          content: repoConfig.content || {
            keyFeatures: ['Enterprise-grade architecture', 'Comprehensive API coverage', 'Professional support'],
            benefits: ['Reduce operational costs', 'Improve efficiency', 'Scale seamlessly']
          },
          business: {
            targetMarket: business.targetMarket || ['Enterprise'],
            competitiveAdvantage: business.competitiveAdvantage || ['AI-Powered', 'Scalable'],
            valueScore: business.valueScore || metadata.pricing?.valueScore || 70
          }
        };
      });
    
    res.json(repos);
  } catch (error) {
    console.error('Error listing repositories:', error);
    res.status(500).json({ error: 'Failed to list repositories' });
  }
});

// Public individual repository endpoint
app.get('/api/repository/:repoName/public', (req, res) => {
  const { repoName } = req.params;
  const reposPath = path.join(__dirname, '../cloned-repositories');
  const repoPath = path.join(reposPath, repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }

  try {
    // Use same logic as the repositories endpoint but for a single repo
    const readmePath = path.join(repoPath, 'README.md');
    const packageJsonPath = path.join(repoPath, 'package.json');
    const marketingBriefPath = path.join(repoPath, 'marketing-brief.md');
    
    let description = '';
    let marketingDescription = '';
    let displayName = repoName;
    
    // Get marketing description
    if (fs.existsSync(marketingBriefPath)) {
      try {
        const fullMarketing = fs.readFileSync(marketingBriefPath, 'utf8').trim();
        const subtitleMatch = fullMarketing.match(/##\s+(.+)\n\n(.+?)(?:\n|$)/);
        if (subtitleMatch) {
          marketingDescription = stripMarkdown(subtitleMatch[2].trim());
        } else {
          const firstSentence = fullMarketing.match(/^[^.!?]+[.!?]/);
          if (firstSentence) {
            marketingDescription = stripMarkdown(firstSentence[0]);
          } else {
            marketingDescription = stripMarkdown(fullMarketing.substring(0, 200)) + '...';
          }
        }
      } catch (e) {}
    }
    
    // Try to get description from package.json
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        description = packageData.description || '';
      } catch (e) {}
    }
    
    // Try to get description from README if not found
    if (!description && fs.existsSync(readmePath)) {
      try {
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        const lines = readmeContent.split('\n');
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith('#') && !line.startsWith('![')) {
            description = line.substring(0, 200);
            break;
          }
        }
      } catch (e) {}
    }
    
    // Count API files and Postman collections
    let apiCount = 0;
    let postmanCount = 0;
    let hasGrpc = false;
    let hasGraphQL = false;
    let hasOpenAPI = false;
    
    const countApis = (dir) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          if (file.isFile()) {
            if (/\.(yaml|yml)$/i.test(file.name)) {
              apiCount++;
              hasOpenAPI = true;
            } else if (/\.(graphql|gql)$/i.test(file.name)) {
              apiCount++;
              hasGraphQL = true;
            } else if (/\.proto$/i.test(file.name)) {
              apiCount++;
              hasGrpc = true;
            } else if (/(?:postman.*\.json|.*postman.*\.json|.*collection.*\.json)$/i.test(file.name)) {
              postmanCount++;
            }
          } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            countApis(path.join(dir, file.name));
          }
        });
      } catch (e) {}
    };
    countApis(repoPath);
    
    // Get last modified time
    const stats = fs.statSync(repoPath);
    
    // Create a human-friendly display name from the repository name
    let friendlyName = displayName;
    if (!marketingDescription && displayName === repoName) {
      friendlyName = repoName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Get repository metadata - prioritize axiom.json over global metadata
    let repoConfig = {};
    const axiomConfigPath = path.join(repoPath, 'axiom.json');
    
    if (fs.existsSync(axiomConfigPath)) {
      try {
        repoConfig = JSON.parse(fs.readFileSync(axiomConfigPath, 'utf8'));
      } catch (e) {
        console.warn(`Invalid axiom.json in ${repoName}:`, e.message);
      }
    }
    
    // Fallback to global metadata
    const metadata = repositoryMetadata[repoName] || {};
    
    // Extract normalized data from axiom.json
    const repo = repoConfig.repository || {};
    const desc = repoConfig.description || {};
    const classification = repoConfig.classification || {};
    const technical = repoConfig.technical || {};
    const business = repoConfig.business || {};
    const urls = repoConfig.urls || {};
    
    const result = {
      id: repoName,
      name: repoName,
      displayName: repo.displayName || metadata.displayName || friendlyName,
      shortName: repo.shortName || repo.displayName || friendlyName,
      brandName: repo.brandName || repo.displayName || friendlyName,
      description: stripMarkdown(desc.summary || metadata.description || marketingDescription || description) || `${friendlyName} Solution`,
      tagline: desc.tagline || `${friendlyName} solution`,
      marketingDescription: desc.marketingPitch || marketingDescription,
      category: classification.category || metadata.category || 'Platform',
      subcategory: classification.subcategory || 'Architecture',
      status: repoConfig.metadata?.status || 'active',
      demoUrl: urls.demo || metadata.demoUrl || null,
      tags: classification.tags || metadata.tags || [],
      industry: classification.industry || ['enterprise'],
      useCase: classification.useCase || ['platform'],
      metrics: {
        apiCount: technical.apis?.count || apiCount,
        postmanCollections: technical.integrations?.postman?.collections || postmanCount,
        lastUpdated: repoConfig.metadata?.lastUpdated || stats.mtime.toISOString(),
        valueScore: business.valueScore || metadata.pricing?.valueScore || 70
      },
      apiTypes: {
        hasOpenAPI: technical.apis?.types?.rest || hasOpenAPI,
        hasGraphQL: technical.apis?.types?.graphql || hasGraphQL,
        hasGrpc: technical.apis?.types?.grpc || hasGrpc,
        hasWebSocket: technical.apis?.types?.websocket || false,
        hasPostman: technical.integrations?.postman?.available || (postmanCount > 0)
      },
      integrations: {
        postman: technical.integrations?.postman || { available: postmanCount > 0, collections: postmanCount },
        swagger: technical.integrations?.swagger || { available: hasOpenAPI, path: '/docs/api.yaml' },
        graphql: technical.integrations?.graphql || { available: hasGraphQL, endpoint: '/graphql', playground: hasGraphQL }
      },
      url: urls.github || `https://github.com/${process.env.GITHUB_ORGANIZATION || 'jamesenki'}/${repoName}`,
      urls: {
        demo: urls.demo || metadata.demoUrl || null,
        documentation: urls.documentation || null,
        website: urls.website || null,
        github: urls.github || `https://github.com/${process.env.GITHUB_ORGANIZATION || 'jamesenki'}/${repoName}`
      },
      pricing: business.pricing || metadata.pricing || null,
      content: repoConfig.content || {
        keyFeatures: ['Enterprise-grade architecture', 'Comprehensive API coverage', 'Professional support'],
        benefits: ['Reduce operational costs', 'Improve efficiency', 'Scale seamlessly']
      },
      business: {
        targetMarket: business.targetMarket || ['Enterprise'],
        competitiveAdvantage: business.competitiveAdvantage || ['AI-Powered', 'Scalable'],
        valueScore: business.valueScore || metadata.pricing?.valueScore || 70
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error getting repository details:', error);
    res.status(500).json({ error: 'Failed to get repository details' });
  }
});

// Demo Coming Soon page route
app.get('/demo/:repoName/*', (req, res) => {
  const demoPath = path.join(__dirname, '../public/demo-coming-soon.html');
  res.sendFile(demoPath);
});

// Handle demo subdomain routing (for demo.axiom-loom.com)
app.get('/ai-maintenance-architecture', (req, res) => {
  const demoPath = path.join(__dirname, '../public/demo-coming-soon.html');
  res.sendFile(demoPath);
});

app.get('/water-heater-platform', (req, res) => {
  const demoPath = path.join(__dirname, '../public/demo-coming-soon.html');
  res.sendFile(demoPath);
});

// Coming Soon routes are handled by React Router - no backend routes needed

// Protected API Routes
app.use('/api', authenticate, trackRepositoryAccess, dynamicApiRoutes);
app.use('/api', authenticate, trackRepositoryAccess, repositoryManagementRoutes);
app.use('/api', authenticate, trackRepositoryAccess, repositoryFilesRoutes);
app.use('/api', authenticate, plantUmlRoutes);
app.use('/api', authenticate, searchRoutes);

// Repository details endpoint (comprehensive, protected)
app.get('/api/repository/:repoName/details', authenticate, authorize('read:apis'), (req, res) => {
  const { repoName } = req.params;
  const reposPath = path.join(__dirname, '../cloned-repositories');
  const repoPath = path.join(reposPath, repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    // Get all metadata
    const readmePath = path.join(repoPath, 'README.md');
    const packageJsonPath = path.join(repoPath, 'package.json');
    const marketingBriefPath = path.join(repoPath, 'marketing-brief.md');
    
    let description = '';
    let marketingDescription = '';
    let displayName = repoName;
    let readme = '';
    
    // Get marketing description
    if (fs.existsSync(marketingBriefPath)) {
      try {
        const fullMarketing = fs.readFileSync(marketingBriefPath, 'utf8').trim();
        // Extract the subtitle (first paragraph after ## heading)
        const subtitleMatch = fullMarketing.match(/##\s+(.+)\n\n(.+?)(?:\n|$)/);
        if (subtitleMatch) {
          marketingDescription = stripMarkdown(subtitleMatch[2].trim());
        } else {
          marketingDescription = stripMarkdown(fullMarketing);
        }
      } catch (e) {}
    }
    
    // Get package.json data
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        description = packageData.description || '';
        // Don't override displayName with package.json name as it's often technical
        // displayName = packageData.name || repoName;
      } catch (e) {}
    }
    
    // Get README content
    if (fs.existsSync(readmePath)) {
      try {
        readme = fs.readFileSync(readmePath, 'utf8');
      } catch (e) {}
    }
    
    // Count and list APIs
    const apis = [];
    const postmanCollections = [];
    let hasGrpc = false;
    let hasGraphQL = false;
    let hasOpenAPI = false;
    
    const findApis = (dir, basePath = '') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const relativePath = path.join(basePath, file.name);
          if (file.isFile()) {
            if (/\.(yaml|yml)$/i.test(file.name) && /api|swagger|openapi/i.test(file.name)) {
              apis.push({
                name: file.name,
                type: 'OpenAPI',
                path: relativePath
              });
              hasOpenAPI = true;
            } else if (/\.(graphql|gql)$/i.test(file.name)) {
              apis.push({
                name: file.name,
                type: 'GraphQL',
                path: relativePath
              });
              hasGraphQL = true;
            } else if (/\.proto$/i.test(file.name)) {
              apis.push({
                name: file.name,
                type: 'gRPC',
                path: relativePath
              });
              hasGrpc = true;
            } else if (/(?:postman.*\.json|.*postman.*\.json|.*collection.*\.json)$/i.test(file.name)) {
              postmanCollections.push({
                name: file.name,
                path: relativePath
              });
            }
          } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            findApis(path.join(dir, file.name), relativePath);
          }
        });
      } catch (e) {}
    };
    
    findApis(repoPath);
    
    // Get last modified time
    const stats = fs.statSync(repoPath);
    
    // Create a human-friendly display name
    let friendlyName = displayName;
    if (!marketingDescription && displayName === repoName) {
      friendlyName = repoName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Get repository metadata if available
    const metadata = repositoryMetadata[repoName] || {};
    
    res.json({
      id: repoName,
      name: repoName,
      displayName: metadata.displayName || friendlyName,
      description: metadata.description || marketingDescription || description || `${friendlyName} Solution`,
      marketingDescription: marketingDescription,
      readme: readme,
      category: metadata.category || 'repository',
      status: 'active',
      demoUrl: metadata.demoUrl || null,
      tags: metadata.tags || [],
      url: `https://github.com/${process.env.GITHUB_ORGANIZATION || 'jamesenki'}/${repoName}`,
      metrics: {
        apiCount: apis.length,
        postmanCollections: postmanCollections.length,
        lastUpdated: stats.mtime.toISOString()
      },
      apiTypes: {
        hasOpenAPI: hasOpenAPI,
        hasGraphQL: hasGraphQL,
        hasGrpc: hasGrpc,
        hasPostman: postmanCollections.length > 0
      },
      apis: apis,
      postmanCollections: postmanCollections,
      pricing: metadata.pricing || null
    });
  } catch (error) {
    console.error('Error getting repository details:', error);
    res.status(500).json({ error: 'Failed to get repository details' });
  }
});

// Repository details endpoint (simple, protected)
app.get('/api/repository/:repoName', authenticate, authorize('read:apis'), (req, res) => {
  const { repoName } = req.params;
  const reposPath = path.join(__dirname, '../cloned-repositories');
  const repoPath = path.join(reposPath, repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    // Read repository metadata if available
    const readmePath = path.join(repoPath, 'README.md');
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    let description = '';
    let topics = [];
    let language = '';
    
    // Try to get description from README
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      const descMatch = readmeContent.match(/^#.*\n\n(.+)/m);
      if (descMatch) {
        description = descMatch[1].trim();
      }
    }
    
    // Try to get info from package.json
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.description) {
        description = packageJson.description;
      }
      if (packageJson.keywords) {
        topics = packageJson.keywords;
      }
      language = 'JavaScript';
    }
    
    // Get last modified time
    const stats = fs.statSync(repoPath);
    
    res.json({
      name: repoName,
      description,
      language,
      topics,
      updated_at: stats.mtime,
      default_branch: 'main',
      stargazers_count: 0,
      forks_count: 0
    });
    
  } catch (error) {
    console.error('Error fetching repository details:', error);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
});

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({ 
      error: 'An error occurred processing your request' 
    });
  } else {
    res.status(err.status || 500).json({ 
      error: err.message,
      stack: err.stack 
    });
  }
});

// Static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Get APIs for a repository (protected)
app.get('/api/repository/:repoName/apis', authenticate, authorize('read:apis'), (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(__dirname, '../cloned-repositories', repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    const apis = [];
    
    const findAPIs = (dir, basePath = '') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const relativePath = path.join(basePath, file.name);
          const fullPath = path.join(dir, file.name);
          
          if (file.isFile()) {
            // OpenAPI/Swagger files
            if (/\.(yaml|yml)$/i.test(file.name) && /api|swagger|openapi/i.test(file.name)) {
              let apiInfo = {
                name: file.name.replace(/\.(yaml|yml)$/i, ''),
                path: relativePath,
                type: 'OpenAPI'
              };
              
              // Try to parse YAML for more info
              try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('openapi:') || content.includes('swagger:')) {
                  const versionMatch = content.match(/(?:openapi|swagger):\s*["']?(\d+\.\d+\.\d+)["']?/);
                  if (versionMatch) {
                    apiInfo.version = versionMatch[1];
                  }
                  const titleMatch = content.match(/title:\s*["']?(.+?)["']?$/m);
                  if (titleMatch) {
                    apiInfo.name = titleMatch[1];
                  }
                  const descMatch = content.match(/description:\s*["']?(.+?)["']?$/m);
                  if (descMatch) {
                    apiInfo.description = descMatch[1];
                  }
                }
              } catch (e) {}
              
              apis.push(apiInfo);
            } 
            // GraphQL files
            else if (/\.(graphql|gql)$/i.test(file.name)) {
              apis.push({
                name: file.name.replace(/\.(graphql|gql)$/i, ''),
                path: relativePath,
                type: 'GraphQL'
              });
            }
            // gRPC Proto files
            else if (/\.proto$/i.test(file.name)) {
              apis.push({
                name: file.name.replace(/\.proto$/i, ''),
                path: relativePath,
                type: 'gRPC'
              });
            }
          } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            findAPIs(fullPath, relativePath);
          }
        });
      } catch (e) {}
    };
    
    findAPIs(repoPath);
    
    res.json({
      repository: repoName,
      count: apis.length,
      apis: apis
    });
  } catch (error) {
    console.error('Error finding APIs:', error);
    res.status(500).json({ error: 'Failed to find APIs' });
  }
});

// Get GraphQL schemas for a repository (protected)
app.get('/api/repository/:repoName/graphql-schemas', authenticate, authorize('read:apis'), (req, res) => {
  const { repoName } = req.params;
  const reposPath = path.join(__dirname, '../cloned-repositories');
  const repoPath = path.join(reposPath, repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    const schemas = [];
    
    const findSchemas = (dir, basePath = '') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const relativePath = basePath ? `${basePath}/${file.name}` : file.name;
          
          if (file.isFile() && /\.(graphql|gql)$/i.test(file.name)) {
            schemas.push({
              name: file.name,
              path: relativePath
            });
          } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            findSchemas(path.join(dir, file.name), relativePath);
          }
        });
      } catch (e) {}
    };
    
    findSchemas(repoPath);
    res.json(schemas);
  } catch (error) {
    console.error('Error finding GraphQL schemas:', error);
    res.status(500).json({ error: 'Failed to find GraphQL schemas' });
  }
});

// Get Postman collections for a repository (protected)
app.get('/api/repository/:repoName/postman-collections', authenticate, authorize('read:apis'), (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(__dirname, '../cloned-repositories', repoName);
  
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: 'Repository not found' });
  }
  
  try {
    const collections = [];
    
    const findPostmanCollections = (dir, basePath = '') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const relativePath = path.join(basePath, file.name);
          if (file.isFile() && /(?:postman.*\.json|.*postman.*\.json|.*collection.*\.json)$/i.test(file.name)) {
            collections.push({
              name: file.name.replace(/\.json$/i, '').replace(/[-_]/g, ' '),
              path: relativePath
            });
          } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
            findPostmanCollections(path.join(dir, file.name), relativePath);
          }
        });
      } catch (e) {}
    };
    
    findPostmanCollections(repoPath);
    res.json(collections);
  } catch (error) {
    console.error('Error finding Postman collections:', error);
    res.status(500).json({ error: 'Failed to find Postman collections' });
  }
});

// Get file content endpoint (protected)
app.get('/api/repository/:name/file', authenticate, authorize('read:documentation'), auditLog('file_access'), (req, res) => {
  const { name } = req.params;
  const { path: filePath, download } = req.query;
  
  console.log(`File request - repo: ${name}, path: ${filePath}`);
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }
  
  const fullPath = path.join(__dirname, '../cloned-repositories', name, filePath);
  
  // Security check - prevent directory traversal
  const normalizedPath = path.normalize(fullPath);
  const repoBasePath = path.join(__dirname, '../cloned-repositories', name);
  
  if (!normalizedPath.startsWith(repoBasePath)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // First try to read as file, if that fails and no extension, try as directory
  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err && err.code === 'EISDIR') {
      console.log('Directory detected, trying index.md:', fullPath);
      // It's a directory, try index.md
      const indexPath = path.join(fullPath, 'index.md');
      fs.readFile(indexPath, 'utf8', (indexErr, indexData) => {
        if (indexErr) {
          return res.status(404).json({ error: 'File not found' });
        }
        
        if (download === 'true') {
          res.setHeader('Content-Disposition', `attachment; filename="index.md"`);
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(indexData);
      });
    } else if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.status(500).json({ error: 'Failed to read file' });
    } else {
      // File read successfully
      if (download === 'true') {
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
      }
      
      // Set appropriate content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.json') {
        res.setHeader('Content-Type', 'application/json');
      } else if (ext === '.yaml' || ext === '.yml') {
        res.setHeader('Content-Type', 'text/yaml');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }
      
      res.send(data);
    }
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Axiom Loom Catalog backend running on port ${PORT}`);
  });
}

module.exports = app;