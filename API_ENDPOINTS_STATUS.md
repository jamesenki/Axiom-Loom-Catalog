# API Endpoints Status

This document tracks the status of all API endpoints used in the application and their fallback strategies for production deployment without a backend.

## ✅ Fixed Endpoints (Static Fallback Implemented)

### `/api/repositories`
- **Component**: `RepositoryList.tsx`, `VirtualizedRepositoryList.tsx`, `RepositoryListSimple.tsx`
- **Fallback**: `/data/repository-metadata.json`
- **Status**: ✅ Working with static data fallback
- **Implementation**: Falls back to static JSON when API returns 404

### `/api/repository/{repoName}/public`
- **Component**: `RepositoryDetailRedesigned.tsx`
- **Fallback**: `/data/repository-metadata.json` (finds specific repository by name)
- **Status**: ✅ Working with static data fallback
- **Implementation**: Loads full metadata file and extracts specific repository

## ⚠️ Endpoints Needing Static Fallback

### Priority 1 - Core Functionality

#### `/api/repository/{repoName}/files`
- **Component**: `DocumentationView.tsx`
- **Used For**: File tree navigation
- **Impact**: Documentation browsing
- **Suggested Fix**: Pre-generate file tree in metadata or use GitHub API in production

#### `/api/repository/{repoName}/file?path={path}`
- **Components**: `DocumentationView.tsx`, `PostmanCollectionView.tsx`, `GraphQLPlaygroundLocal.tsx`, `SwaggerViewer.tsx`, `UnifiedApiExplorer.tsx`
- **Used For**: Loading file contents (README, Postman collections, GraphQL schemas, OpenAPI specs)
- **Impact**: All documentation and API explorer features
- **Suggested Fix**: Pre-fetch and bundle critical files or use GitHub raw content API

#### `/api/detect-apis/{repoName}`
- **Components**: `APIExplorerView.tsx`, `DynamicApiButtons.tsx`, `GrpcExplorer.tsx`, `GraphQLSchemaViewer.tsx`, `UnifiedApiExplorer.tsx`
- **Used For**: API detection (OpenAPI, GraphQL, gRPC, Postman)
- **Impact**: API Explorer features
- **Suggested Fix**: Pre-compute API detection results and store in metadata

### Priority 2 - Enhanced Features

#### `/api/repository/{repoName}/postman-collections`
- **Components**: `PostmanCollectionView.tsx`, `PostmanCollectionViewSidebar.tsx`, `PostmanCollectionsView.tsx`, `UnifiedApiExplorer.tsx`
- **Used For**: Listing Postman collections
- **Impact**: Postman integration features
- **Suggested Fix**: Include collection metadata in repository-metadata.json

#### `/api/repository/{repoName}/graphql-schemas`
- **Component**: `GraphQLPlaygroundLocal.tsx`
- **Used For**: Listing GraphQL schema files
- **Impact**: GraphQL playground features
- **Suggested Fix**: Include schema file list in metadata

### Priority 3 - Advanced Features

#### `/api/plantuml/render`
- **Component**: `PlantUmlDiagram.tsx`
- **Used For**: Rendering PlantUML diagrams
- **Impact**: Diagram visualization
- **Suggested Fix**: Pre-render diagrams to PNG during build or use external PlantUML service

#### `/api/plantuml/validate`
- **Component**: `PlantUmlDiagram.tsx`
- **Used For**: Validating PlantUML syntax
- **Impact**: Diagram editing features
- **Suggested Fix**: Client-side validation or external service

## 🔒 Auth Endpoints (Not Needed for Public Deployment)

These endpoints are only needed if authentication is enabled:

- `/api/auth/callback`
- `/api/auth/refresh`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/api-keys`
- `/api/auth/verify`
- `/api/auth/local-login`

**Status**: Not applicable for static deployment

## 🔧 Repository Management Endpoints (Not Needed for Public Deployment)

These endpoints are for repository management and are not needed for read-only public deployment:

- `/api/repository/sync`
- `/api/repository/sync/status`
- `/api/repository/clone/{repoName}`
- `/api/repository/metadata/{repoName}`
- `/api/verify-repository/{owner}/{name}`
- `/api/repositories/add`
- `/api/sync-repository/{name}`

**Status**: Not applicable for static deployment

## 🔍 Search Endpoints (Future Enhancement)

- `/api/search`
- `/api/search/suggestions`

**Suggested Fix**: Implement client-side search using Fuse.js or similar library over static data

## 📊 Statistics Endpoints

- `/api/statistics` (implied by `StatisticsDashboard.tsx`)

**Suggested Fix**: Pre-compute statistics and include in metadata

## Implementation Strategy

### Short Term (Current)
- ✅ Core listing works with static data
- ✅ Repository details work with static data
- ✅ Basic navigation functional

### Medium Term (Recommended Next Steps)
1. **Enhance metadata file** to include:
   - File tree for each repository
   - API detection results (OpenAPI, GraphQL, gRPC, Postman)
   - List of Postman collections
   - List of GraphQL schemas
   - Pre-computed statistics

2. **Implement GitHub API fallback** for:
   - File content loading (using GitHub raw.githubusercontent.com)
   - File tree navigation (using GitHub API)

3. **Pre-build static assets** for:
   - Rendered PlantUML diagrams
   - Critical README files
   - Important documentation

### Long Term (Full Static Support)
1. **Build-time preprocessing**:
   - Clone all repositories during build
   - Extract all metadata
   - Render all diagrams
   - Generate search index
   - Compute all statistics

2. **Client-side features**:
   - Search using Fuse.js
   - Syntax highlighting
   - Diagram rendering using client-side libraries

## Testing

Post-deployment smoke tests are implemented in:
- `e2e/post-deployment-smoke-test.spec.ts`

Run with:
```bash
npm run test:deployment
```

This test suite validates:
- ✅ All main routes accessible
- ✅ Repository catalog loads
- ✅ Repository details load
- ✅ Static data fallback works
- ✅ No JavaScript errors
- ✅ SPA routing configured correctly

## Deployment Checklist

Before deploying:
1. ✅ Verify static data file is up-to-date: `repository-metadata.json`
2. ✅ Ensure `staticwebapp.config.json` excludes `/api/*`
3. ✅ Run deployment smoke tests: `npm run test:deployment`
4. ✅ Check Azure workflow copies static files to build
5. ⚠️ Test critical user journeys manually after deployment

## Future Enhancements

### Proposed: Enhanced Metadata Schema

```json
{
  "repositoryName": {
    "id": "...",
    "name": "...",
    "displayName": "...",
    "description": "...",

    // Existing fields...

    // NEW: Pre-computed data
    "apis": {
      "openapi": [{ "file": "path/to/spec.yaml", "title": "API Name" }],
      "graphql": [{ "file": "path/to/schema.graphql", "title": "Schema Name" }],
      "grpc": [{ "file": "path/to/proto.proto", "services": ["ServiceName"] }],
      "postman": [{ "file": "path/to/collection.json", "name": "Collection Name" }]
    },

    "fileTree": {
      "type": "directory",
      "name": "/",
      "children": [...]
    },

    "criticalFiles": {
      "README.md": "Pre-fetched content...",
      "docs/getting-started.md": "..."
    },

    "renderedDiagrams": {
      "docs/architecture.puml": "data:image/png;base64,..."
    },

    "statistics": {
      "totalFiles": 150,
      "linesOfCode": 50000,
      "contributors": 5,
      "lastUpdated": "2025-10-16"
    }
  }
}
```

This enhanced schema would enable fully static deployment with rich features!
