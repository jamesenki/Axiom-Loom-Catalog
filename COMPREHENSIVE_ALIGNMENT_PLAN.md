# Comprehensive Repository Alignment & Standardization Plan

## Executive Summary

This plan will transform the Axiom Loom Catalog from a fragmented multi-source system into a single-source-of-truth architecture where **each repository's `.portal/metadata.json` file** is the canonical source for all catalog information, API detection, documentation structure, and deployment configuration.

**Current State:** 17 local repos, 3 in cloud, mismatched names, 13/17 have .portal/metadata.json
**Target State:** All repos aligned, standardized, cloud-deployed, single source of truth

---

## Phase 1: Repository Name & Structure Alignment

### Objective
Align GitHub repository names, local folder names, clone scripts, and metadata to use a single canonical naming standard.

### 1.1 Repository Name Standardization

**Decision: Use actual GitHub repository names as the canonical standard**

| Current Clone Script Name | Actual GitHub Name | Action | Priority |
|---|---|---|---|
| cloudtwin-ai | cloudtwin-simulation-platform-architecture | ✅ Update script | PAUTOMOTIVE_MANUFACTURER |
| diagnostic-as-code | diagnostic-as-code-platform-architecture | ✅ Update script | PAUTOMOTIVE_MANUFACTURER |
| future-mobility-fleet-operations-platform | future-mobility-fleet-platform | ✅ Update script | PAUTOMOTIVE_MANUFACTURER |
| future-mobility-oems-tech-platform | Split: future-mobility-oems-platform + future-mobility-tech-platform | ✅ Update script | PAUTOMOTIVE_MANUFACTURER |
| iot-platform-axiom-loom | nslabsdashboards | ✅ Update script | PAUTOMOTIVE_MANUFACTURER |
| distributed-ledger-for-auto-insurance | N/A | ❌ Remove | P1 |
| lambda-layer-pipeline | N/A | ❌ Remove | P1 |
| open-smart-mobility-platform | ecosystem-platform-architecture | ❓ Verify | P1 |
| predictive-maintenance-model | N/A | ❌ Remove | P1 |
| serverless-application-pipeline | N/A | ❌ Remove | P1 |
| smart-vending-machine-platform | N/A | ❌ Remove | P1 |
| terraform-aws-cloud-infrastructure | N/A | ❌ Remove | P1 |
| vehicle-health-tracker | N/A | ❌ Remove | P1 |
| water-heater-platform | ❓ TBD | ❓ Verify | P1 |
| voice-enabled-vehicle-assistance | N/A | ❌ Remove | P1 |
| weather-dashboard | dashboards? | ❓ Verify | P1 |

### 1.2 Add Missing Repositories

Repositories that exist in GitHub but missing from clone script:
- ✅ rentalFleets (has metadata in repository-metadata.json)
- ✅ sdv-architecture-orchestration (has metadata)
- ✅ future-mobility-regulatory-platform (needs to be added)

### 1.3 Tasks for Phase 1

#### Task 1.1: Update Clone Script with Correct Names
**File:** `scripts/clone-repositories.sh`

```bash
#!/bin/sh
# Clone all repositories for the Axiom Loom Catalog
# This script runs on container startup

# Don't exit on errors - we want the server to start even if some clones fail
set +e

echo "=== Cloning Axiom Loom Repositories ==="
echo "Target directory: /app/cloned-repositories"

cd /app/cloned-repositories

# GitHub username
GITHUB_USER="jamesenki"

# List of repositories to clone (VERIFIED GITHUB NAMES)
REPOSITORIES="
ai-predictive-maintenance-engine-architecture
cloudtwin-simulation-platform-architecture
deploymaster-sdv-ota-platform
diagnostic-as-code-platform-architecture
fleet-digital-twin-platform-architecture
future-mobility-consumer-platform
future-mobility-fleet-platform
future-mobility-oems-platform
future-mobility-regulatory-platform
future-mobility-tech-platform
mobility-architecture-package-orchestrator
nslabsdashboards
remote-diagnostic-assistance-platform-architecture
rentalFleets
sdv-architecture-orchestration
sovd-diagnostic-ecosystem-platform-architecture
vehicle-to-cloud-communications-architecture
velocityforge-sdv-platform-architecture
"

# Clone each repository
for repo in $REPOSITORIES; do
  if [ -d "$repo" ]; then
    echo "✓ $repo already exists, skipping..."
  else
    echo "Cloning $repo..."
    # Use GITHUB_TOKEN if available for private repos
    if [ -n "$GITHUB_TOKEN" ]; then
      CLONE_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$repo.git"
    else
      CLONE_URL="https://github.com/$GITHUB_USER/$repo.git"
    fi

    if git clone "$CLONE_URL" "$repo" 2>/dev/null; then
      echo "✅ Cloned: $repo"
    else
      echo "⚠️  Failed to clone: $repo (might be private or not exist)"
    fi
  fi
done

echo ""
echo "=== Repository Cloning Complete ==="
ls -l | grep "^d" | wc -l | xargs echo "Total repositories:"
echo "======================================"
```

**Commit Message:**
```
fix: Correct repository names in clone script to match actual GitHub repos

Updates clone-repositories.sh with verified GitHub repository names that
actually exist in the jamesenki account. Fixes cloud deployment where 16/19
repos were failing to clone due to incorrect names.

Changes:
- cloudtwin-ai → cloudtwin-simulation-platform-architecture
- diagnostic-as-code → diagnostic-as-code-platform-architecture
- future-mobility-fleet-operations-platform → future-mobility-fleet-platform
- Added: future-mobility-oems-platform, future-mobility-tech-platform
- Added: rentalFleets, sdv-architecture-orchestration
- Added: future-mobility-regulatory-platform
- iot-platform-axiom-loom → nslabsdashboards
- Removed 11 non-existent repositories

Total repositories: 18 (up from 3 working in cloud)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Phase 2: .portal/metadata.json Standardization

### Objective
Every repository MUST have a `.portal/metadata.json` file that serves as the single source of truth for all catalog information.

### 2.1 Current Status
- ✅ 13 repos have .portal/metadata.json
- ❌ 4 repos missing: ai-predictive-maintenance-engine-architecture, claude-code-sub-agents, copilot-architecture-template, sample-arch-package

### 2.2 .portal/metadata.json Standard Structure

Based on `vehicle-to-cloud-communications-architecture/.portal/metadata.json` (the gold standard):

```json
{
  "name": "Human-Friendly Repository Name",
  "version": "1.AUTOMOTIVE_MANUFACTURER.AUTOMOTIVE_MANUFACTURER",
  "description": "Comprehensive technical description for developers",
  "category": "Primary Category",
  "status": "production-ready-alpha | beta | production",
  "tags": ["tag1", "tag2", "tag3"],

  "marketing": {
    "headline": "Marketing headline for business value",
    "subheadline": "Supporting business value statement",

    "keyBenefits": [
      {
        "title": "Benefit Title with Metrics",
        "description": "Detailed explanation of business value and ROI"
      }
    ],

    "useCases": [
      {
        "industry": "Target Industry or Customer Type",
        "description": "Specific use case with measurable outcomes"
      }
    ]
  },

  "technical": {
    "architecture": "High-level architecture description",
    "core": {
      "protocols": ["Protocol1", "Protocol2"],
      "standards": ["Standard1", "Standard2"],
      "security": ["Security1", "Security2"],
      "buildSystem": ["Build1", "Build2"],
      "cloudPlatforms": ["AWS", "Azure", "GCP"]
    },

    "documentation": {
      "apiReference": "/docs/api/API_REFERENCE.md",
      "asyncapi": "asyncapi.yaml",
      "openapi": "openapi.yaml",
      "graphql": "schema.graphql",
      "protocolBuffers": "/docs/PROTOCOL_BUFFERS.md",
      "postman": "postman/collection.json",
      "sequenceDiagrams": "/docs/sequence-diagrams/",
      "security": "/docs/security/",
      "fmea": "/docs/fmea/"
    }
  },

  "integration": {
    "protocols": ["MQTT 5.AUTOMOTIVE_MANUFACTURER", "HTTPS", "GraphQL"],
    "formats": ["Protocol Buffers", "JSON", "YAML"],
    "authentication": ["mTLS", "JWT", "OAuth 2.AUTOMOTIVE_MANUFACTURER"],
    "sdks": ["Java", "Python", "TypeScript"],
    "codeGeneration": "Gradle | Maven | npm"
  },

  "compliance": [
    "ISO 21434",
    "GDPR",
    "SOC 2",
    "Industry Standard 1"
  ]
}
```

### 2.3 Tasks for Phase 2

#### Task 2.1: Create .portal/metadata.json for Missing Repositories

**Priority Repositories:**
1. **ai-predictive-maintenance-engine-architecture** - Has data in repository-metadata.json
2. **claude-code-sub-agents** - Needs assessment (may not belong in catalog)
3. **copilot-architecture-template** - Needs assessment
4. **sample-arch-package** - Likely should be removed

**Action for ai-predictive-maintenance-engine-architecture:**
```bash
# Create directory structure
mkdir -p cloned-repositories/ai-predictive-maintenance-engine-architecture/.portal

# Create metadata.json based on repository-metadata.json data
cat > cloned-repositories/ai-predictive-maintenance-engine-architecture/.portal/metadata.json <<'EOF'
{
  "name": "AI Predictive Maintenance Architecture",
  "version": "1.AUTOMOTIVE_MANUFACTURER.AUTOMOTIVE_MANUFACTURER",
  "description": "Complete AI-powered predictive maintenance solution with engine, platform, and architecture",
  "category": "AI/ML Architecture",
  "status": "production-ready",
  "tags": ["Architecture", "AI/ML", "Enterprise", "Predictive Maintenance", "IoT"],

  "marketing": {
    "headline": "Transform Maintenance Operations with AI-Powered Predictive Analytics",
    "subheadline": "Reduce unplanned downtime by 7AUTOMOTIVE_MANUFACTURER% and extend equipment lifespan by 3AUTOMOTIVE_MANUFACTURER%",

    "keyBenefits": [
      {
        "title": "7AUTOMOTIVE_MANUFACTURER% Reduction in Unplanned Downtime",
        "description": "Advanced ML algorithms predict equipment failures before they occur, enabling proactive maintenance and dramatically reducing costly unplanned outages"
      },
      {
        "title": "2AUTOMOTIVE_MANUFACTURER-3AUTOMOTIVE_MANUFACTURER% Extended Equipment Lifespan",
        "description": "Optimize maintenance schedules based on actual equipment condition rather than fixed intervals, extending asset life and maximizing ROI"
      },
      {
        "title": "25-4AUTOMOTIVE_MANUFACTURER% Decrease in Maintenance Costs",
        "description": "Eliminate unnecessary preventive maintenance and reduce emergency repairs through accurate failure prediction and optimal resource allocation"
      },
      {
        "title": "3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER-5AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER% ROI Within 18 Months",
        "description": "Proven return on investment through reduced downtime, extended equipment life, and optimized maintenance operations across manufacturing, automotive, and energy sectors"
      }
    ],

    "useCases": [
      {
        "industry": "Manufacturing & Industrial Operations",
        "description": "Monitor critical production equipment in real-time, predict failures before they impact operations, and optimize maintenance schedules across multiple facilities"
      },
      {
        "industry": "Fleet & Transportation Management",
        "description": "Track vehicle health across entire fleets, predict component failures, and schedule maintenance to minimize downtime and maximize fleet availability"
      },
      {
        "industry": "Energy & Utilities",
        "description": "Monitor rotating equipment (turbines, pumps, generators) for early failure detection, optimize energy consumption, and ensure grid reliability"
      },
      {
        "industry": "Aerospace & Aviation",
        "description": "Implement predictive maintenance for aircraft systems, comply with regulatory requirements, and reduce maintenance-related flight delays"
      }
    ]
  },

  "technical": {
    "architecture": "Cloud-native AI/ML architecture with real-time streaming analytics, edge computing support, and enterprise data integration",
    "core": {
      "protocols": ["MQTT", "HTTPS", "WebSocket"],
      "standards": ["ISO 13374", "ISO 55AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER", "IEEE 1451"],
      "security": ["mTLS", "OAuth 2.AUTOMOTIVE_MANUFACTURER", "RBAC", "Data Encryption"],
      "buildSystem": ["Gradle", "Maven", "Docker"],
      "cloudPlatforms": ["AWS", "Azure", "GCP"],
      "mlFrameworks": ["TensorFlow", "PyTorch", "scikit-learn"]
    },

    "apis": {
      "rest": true,
      "graphql": true,
      "grpc": false,
      "asyncapi": false
    },

    "documentation": {
      "apiReference": "/docs/api/README.md",
      "architecture": "/docs/architecture/",
      "deployment": "/docs/deployment/",
      "integration": "/docs/integration/"
    }
  },

  "integration": {
    "protocols": ["MQTT", "HTTPS", "REST"],
    "formats": ["JSON", "Protocol Buffers", "Avro"],
    "authentication": ["OAuth 2.AUTOMOTIVE_MANUFACTURER", "API Keys", "mTLS"],
    "sdks": ["Python", "Java", "JavaScript"],
    "dataSources": ["IoT Sensors", "SCADA", "Historian", "ERP"]
  },

  "compliance": [
    "ISO 13374 (Condition Monitoring)",
    "ISO 55AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER (Asset Management)",
    "GDPR (Data Privacy)",
    "SOC 2 Type II"
  ]
}
EOF
```

**Commit Message for Each:**
```
feat: Add standardized .portal/metadata.json for [repo-name]

Creates comprehensive metadata file following the vehicle-to-cloud
communications architecture standard structure. This enables:
- Single source of truth for catalog display
- Automated API detection
- Consistent marketing and technical information
- Clear documentation structure

Migrated data from centralized repository-metadata.json into
repository-specific .portal/metadata.json for better maintainability.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Phase 3: Backend Integration with .portal/metadata.json

### Objective
Update backend server to **ONLY** read from `.portal/metadata.json` files, ignoring the centralized `repository-metadata.json`.

### 3.1 Backend Changes Required

#### File: `src/server.js`

**Current Behavior:**
```javascript
// Line 24AUTOMOTIVE_MANUFACTURER-246: Fallback to global metadata
const metadata = repositoryMetadata[dirent.name] || {};
```

**New Behavior:**
```javascript
// Priority: .portal/metadata.json > repository-metadata.json (deprecated)
let portalMetadata = null;
const portalMetadataPath = path.join(repoPath, '.portal', 'metadata.json');

if (fs.existsSync(portalMetadataPath)) {
  try {
    portalMetadata = JSON.parse(fs.readFileSync(portalMetadataPath, 'utf8'));
    console.log(`Loaded .portal/metadata.json for ${dirent.name}`);
  } catch (e) {
    console.error(`Error reading .portal/metadata.json for ${dirent.name}:`, e.message);
  }
}

// Use portal metadata if available, otherwise fall back to centralized
const metadata = portalMetadata || repositoryMetadata[dirent.name] || {};
```

### 3.2 API Detection from .portal/metadata.json

**Enhancement:** Read API types directly from metadata instead of scanning files.

```javascript
// In repositories endpoint
const apiTypes = {
  hasOpenAPI: portalMetadata?.technical?.apis?.rest ??
              metadata.apiTypes?.hasOpenAPI ??
              hasOpenAPI,
  hasGraphQL: portalMetadata?.technical?.apis?.graphql ??
              metadata.apiTypes?.hasGraphQL ??
              hasGraphQL,
  hasGrpc: portalMetadata?.technical?.apis?.grpc ??
           metadata.apiTypes?.hasGrpc ??
           hasGrpc,
  hasAsyncAPI: portalMetadata?.technical?.apis?.asyncapi ??
               metadata.apiTypes?.hasAsyncAPI ??
               false,
  hasPostman: portalMetadata?.technical?.documentation?.postman != null ||
              postmanCount > AUTOMOTIVE_MANUFACTURER
};
```

### 3.3 Documentation Structure from Metadata

```javascript
// Read documentation paths from metadata
const docPaths = portalMetadata?.technical?.documentation || {};

// Serve specific docs based on metadata
app.get('/api/repository/:repoName/documentation', (req, res) => {
  const { repoName } = req.params;
  const metadataPath = path.join(__dirname, '../cloned-repositories', repoName, '.portal/metadata.json');

  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const docs = metadata.technical?.documentation || {};

    res.json({
      repository: repoName,
      documentation: docs,
      available: Object.keys(docs)
    });
  } else {
    res.status(4AUTOMOTIVE_MANUFACTURER4).json({ error: 'No metadata found' });
  }
});
```

### 3.4 Tasks for Phase 3

#### Task 3.1: Update Repository List Endpoint
**File:** `src/server.js` (lines 112-316)

**Changes:**
1. Prioritize `.portal/metadata.json` over centralized metadata
2. Extract `name`, `description`, `category`, `tags` from portal metadata
3. Extract `marketing.keyBenefits` and `marketing.useCases`
4. Extract API types from `technical.apis`
5. Extract documentation paths from `technical.documentation`

#### Task 3.2: Update Repository Details Endpoint
**File:** `src/server.js` (lines 533-717)

**Changes:**
1. Read `.portal/metadata.json` first
2. Build `businessValue` from `marketing.keyBenefits` and `marketing.useCases`
3. Build `techStack` from `technical.core`
4. Use `technical.documentation` for doc paths

#### Task 3.3: Create New Documentation Discovery Endpoint

```javascript
app.get('/api/repository/:repoName/docs-structure', authenticate, (req, res) => {
  const { repoName } = req.params;
  const portalMetadataPath = path.join(
    __dirname,
    '../cloned-repositories',
    repoName,
    '.portal/metadata.json'
  );

  if (!fs.existsSync(portalMetadataPath)) {
    return res.status(4AUTOMOTIVE_MANUFACTURER4).json({ error: 'Repository metadata not found' });
  }

  const metadata = JSON.parse(fs.readFileSync(portalMetadataPath, 'utf8'));
  const docPaths = metadata.technical?.documentation || {};

  // Verify each documented path exists
  const verifiedDocs = {};
  for (const [key, docPath] of Object.entries(docPaths)) {
    const fullPath = path.join(
      __dirname,
      '../cloned-repositories',
      repoName,
      docPath
    );

    verifiedDocs[key] = {
      path: docPath,
      exists: fs.existsSync(fullPath),
      type: path.extname(docPath)
    };
  }

  res.json({
    repository: repoName,
    documentation: verifiedDocs,
    metadata: {
      name: metadata.name,
      version: metadata.version,
      category: metadata.category
    }
  });
});
```

**Commit Message:**
```
feat: Prioritize .portal/metadata.json as single source of truth

Updates backend to read repository metadata from .portal/metadata.json
files within each repository instead of centralized repository-metadata.json.
This enables:

- Per-repository control of catalog information
- Versioned metadata alongside code
- Automated API and documentation detection
- Consistent structure across all repos

Changes:
- Updated /api/repositories endpoint to prioritize .portal metadata
- Enhanced /api/repository/:id/details with portal metadata
- Added /api/repository/:id/docs-structure for documentation discovery
- Maintained backward compatibility with centralized metadata

Breaking Changes: None (graceful fallback maintained)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Phase 4: API, GraphQL, gRPC, and Postman Standardization

### Objective
Establish consistent structure and discovery for all API types across repositories.

### 4.1 API Structure Standard

Each repository MUST organize APIs in standard locations:

```
repository-name/
├── .portal/
│   └── metadata.json          # Declares API types and locations
├── docs/
│   └── api/
│       ├── API_REFERENCE.md   # Human-readable API docs
│       ├── openapi.yaml       # OpenAPI/Swagger spec
│       └── asyncapi.yaml      # AsyncAPI spec (for MQTT/events)
├── graphql/
│   ├── schema.graphql         # GraphQL schema
│   └── README.md              # GraphQL documentation
├── grpc/
│   ├── proto/
│   │   └── *.proto            # Protocol Buffer definitions
│   └── README.md              # gRPC documentation
└── postman/
    ├── collection.json        # Postman collection
    └── environment.json       # Postman environment variables
```

### 4.2 .portal/metadata.json API Declaration

```json
{
  "technical": {
    "apis": {
      "rest": true,      // Has OpenAPI/REST APIs
      "graphql": true,   // Has GraphQL APIs
      "grpc": false,     // Has gRPC APIs
      "asyncapi": true   // Has AsyncAPI/MQTT specs
    },

    "documentation": {
      "openapi": "docs/api/openapi.yaml",
      "asyncapi": "asyncapi.yaml",
      "graphql": "graphql/schema.graphql",
      "grpc": "grpc/proto/",
      "postman": "postman/collection.json",
      "apiReference": "docs/api/API_REFERENCE.md"
    }
  }
}
```

### 4.3 Backend API Detection Enhancement

```javascript
// File: src/api/dynamicApiDetection.js

async function detectRepositoryApis(repoPath, repoName) {
  // First, check .portal/metadata.json for declared APIs
  const portalMetadataPath = path.join(repoPath, '.portal/metadata.json');

  if (fs.existsSync(portalMetadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(portalMetadataPath, 'utf8'));
    const declaredApis = metadata.technical?.apis || {};
    const docPaths = metadata.technical?.documentation || {};

    // Verify declared APIs exist
    const result = {
      repository: repoName,
      apis: {
        rest: [],
        graphql: [],
        grpc: [],
        asyncapi: []
      },
      postman: [],
      hasAnyApis: false,
      recommendedButtons: []
    };

    // Check REST/OpenAPI
    if (declaredApis.rest && docPaths.openapi) {
      const openapiPath = path.join(repoPath, docPaths.openapi);
      if (fs.existsSync(openapiPath)) {
        result.apis.rest.push({
          file: docPaths.openapi,
          title: metadata.name + ' REST API',
          version: metadata.version
        });
        result.recommendedButtons.push('swagger');
      }
    }

    // Check GraphQL
    if (declaredApis.graphql && docPaths.graphql) {
      const graphqlPath = path.join(repoPath, docPaths.graphql);
      if (fs.existsSync(graphqlPath)) {
        result.apis.graphql.push({
          file: docPaths.graphql,
          type: 'schema'
        });
        result.recommendedButtons.push('graphql');
      }
    }

    // Check gRPC
    if (declaredApis.grpc && docPaths.grpc) {
      const grpcPath = path.join(repoPath, docPaths.grpc);
      if (fs.existsSync(grpcPath)) {
        // Find all .proto files
        const protoFiles = await findFiles(grpcPath, ['**/*.proto']);
        protoFiles.forEach(file => {
          const content = fs.readFileSync(path.join(repoPath, file), 'utf8');
          const services = extractGrpcServices(content);
          if (services.length > AUTOMOTIVE_MANUFACTURER) {
            result.apis.grpc.push({
              file,
              services,
              package: extractGrpcPackage(content)
            });
          }
        });

        if (result.apis.grpc.length > AUTOMOTIVE_MANUFACTURER) {
          result.recommendedButtons.push('grpc');
        }
      }
    }

    // Check AsyncAPI
    if (declaredApis.asyncapi && docPaths.asyncapi) {
      const asyncapiPath = path.join(repoPath, docPaths.asyncapi);
      if (fs.existsSync(asyncapiPath)) {
        const content = fs.readFileSync(asyncapiPath, 'utf8');
        result.apis.asyncapi.push({
          file: docPaths.asyncapi,
          title: metadata.name + ' AsyncAPI',
          version: metadata.version,
          protocol: extractAsyncProtocol(content)
        });
        result.recommendedButtons.push('asyncapi');
      }
    }

    // Check Postman
    if (docPaths.postman) {
      const postmanPath = path.join(repoPath, docPaths.postman);
      if (fs.existsSync(postmanPath)) {
        result.postman.push({
          file: docPaths.postman,
          name: metadata.name + ' Postman Collection'
        });
        result.recommendedButtons.push('postman');
      }
    }

    result.hasAnyApis = result.apis.rest.length > AUTOMOTIVE_MANUFACTURER ||
                        result.apis.graphql.length > AUTOMOTIVE_MANUFACTURER ||
                        result.apis.grpc.length > AUTOMOTIVE_MANUFACTURER ||
                        result.apis.asyncapi.length > AUTOMOTIVE_MANUFACTURER;

    return result;
  }

  // Fallback to file scanning if no metadata
  return detectRepositoryApisLegacy(repoPath, repoName);
}
```

### 4.4 Frontend API Button Generation

```javascript
// Frontend code to show API buttons based on metadata
function renderApiButtons(repository) {
  const buttons = [];

  if (repository.apiTypes.hasOpenAPI) {
    buttons.push({
      label: 'Swagger UI',
      icon: '📋',
      url: `/swagger/${repository.id}`,
      color: 'green'
    });
  }

  if (repository.apiTypes.hasGraphQL) {
    buttons.push({
      label: 'GraphQL Playground',
      icon: '🔮',
      url: `/graphql/${repository.id}`,
      color: 'pink'
    });
  }

  if (repository.apiTypes.hasGrpc) {
    buttons.push({
      label: 'gRPC UI',
      icon: '⚡',
      url: `/grpc/${repository.id}`,
      color: 'blue'
    });
  }

  if (repository.apiTypes.hasAsyncAPI) {
    buttons.push({
      label: 'AsyncAPI',
      icon: '📡',
      url: `/asyncapi/${repository.id}`,
      color: 'purple'
    });
  }

  if (repository.apiTypes.hasPostman) {
    buttons.push({
      label: 'Postman Collection',
      icon: '📮',
      url: `/api/postman/${repository.id}`,
      color: 'orange'
    });
  }

  return buttons;
}
```

### 4.5 Tasks for Phase 4

#### Task 4.1: Standardize API Structures in All Repos

For each repository with APIs:
1. Create standard directory structure
2. Move API files to standard locations
3. Update `.portal/metadata.json` with paths
4. Test API discovery

#### Task 4.2: Update Backend API Detection
**File:** `src/api/dynamicApiDetection.js`

**Changes:**
1. Prioritize metadata-declared APIs
2. Fallback to file scanning
3. Add validation for declared paths

#### Task 4.3: Test API Discovery

```bash
# Test each repository
curl http://localhost:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repository/vehicle-to-cloud-communications-architecture/apis | jq
curl http://localhost:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repository/ai-predictive-maintenance-engine-architecture/apis | jq
# ... test all 18 repos
```

**Commit Message:**
```
feat: Standardize API structure and metadata-driven discovery

Implements consistent API organization across all repositories with
metadata-driven discovery. Changes:

Structure:
- Standard /docs/api/, /graphql/, /grpc/, /postman/ directories
- All API specs declared in .portal/metadata.json
- Consistent naming conventions

Backend:
- Metadata-first API detection in dynamicApiDetection.js
- Fallback to file scanning for backward compatibility
- Path validation for declared APIs

Frontend:
- Dynamic button generation based on declared APIs
- Consistent UI for all API types
- Better error handling for missing APIs

Tested with all 18 repositories.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Phase 5: Documentation Structure Standardization

### Objective
Every repository follows consistent documentation structure with proper linking from README.

### 5.1 Standard Documentation Structure

```
repository-name/
├── README.md                      # Main entry point
├── ARCHITECTURE.md                # Architecture overview
├── .portal/
│   └── metadata.json              # Catalog metadata
├── docs/
│   ├── README.md                  # Documentation index
│   ├── api/
│   │   ├── README.md
│   │   ├── API_REFERENCE.md
│   │   ├── openapi.yaml
│   │   └── asyncapi.yaml
│   ├── architecture/
│   │   ├── README.md
│   │   ├── SYSTEM_DESIGN.md
│   │   └── diagrams/
│   ├── deployment/
│   │   ├── README.md
│   │   ├── DEPLOYMENT_GUIDE.md
│   │   └── docker-compose.yml
│   ├── security/
│   │   ├── README.md
│   │   ├── SECURITY.md
│   │   └── THREAT_MODEL.md
│   ├── fmea/                      # Failure Mode Analysis
│   │   ├── README.md
│   │   └── *.md
│   ├── sequence-diagrams/
│   │   ├── README.md
│   │   └── *.puml, *.png
│   └── integration/
│       ├── README.md
│       └── INTEGRATION_GUIDE.md
└── examples/
    ├── README.md
    └── *.example.js
```

### 5.2 README.md Standard Template

```markdown
# [Repository Name]

> [One-line description from .portal/metadata.json]

## Overview

[2-3 paragraph overview from metadata.marketing]

## Key Benefits

[From metadata.marketing.keyBenefits]
- **Benefit 1:** Description
- **Benefit 2:** Description
- **Benefit 3:** Description

## Quick Start

\`\`\`bash
# Installation/setup commands
\`\`\`

## Documentation

- 📖 [API Reference](docs/api/API_REFERENCE.md)
- 🏗️ [Architecture](docs/architecture/README.md)
- 🚀 [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)
- 🔒 [Security](docs/security/SECURITY.md)
- 🔗 [Integration Guide](docs/integration/INTEGRATION_GUIDE.md)
- 📊 [FMEA Analysis](docs/fmea/README.md)

## APIs

[Generated from .portal/metadata.json technical.apis]

- **REST API:** [OpenAPI Spec](docs/api/openapi.yaml)
- **GraphQL:** [Schema](graphql/schema.graphql)
- **AsyncAPI:** [MQTT Spec](asyncapi.yaml)
- **Postman:** [Collection](postman/collection.json)

## Use Cases

[From metadata.marketing.useCases]

## Technical Details

[From metadata.technical]

## Compliance

[From metadata.compliance]

## Support

For questions or issues, please contact [support info]

## License

[License information]
```

### 5.3 docs/README.md Index Template

```markdown
# Documentation Index

Welcome to the [Repository Name] documentation.

## Getting Started

- [Quick Start Guide](../README.md#quick-start)
- [Installation](deployment/DEPLOYMENT_GUIDE.md)
- [Configuration](deployment/CONFIGURATION.md)

## API Documentation

- [API Reference](api/API_REFERENCE.md)
- [OpenAPI Specification](api/openapi.yaml)
- [AsyncAPI Specification](api/asyncapi.yaml)
- [GraphQL Schema](../graphql/schema.graphql)
- [Postman Collection](../postman/collection.json)

## Architecture

- [System Design](architecture/SYSTEM_DESIGN.md)
- [Architecture Diagrams](architecture/diagrams/)
- [Sequence Diagrams](sequence-diagrams/)
- [Data Models](architecture/DATA_MODELS.md)

## Deployment

- [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)
- [Docker Deployment](deployment/docker-compose.yml)
- [Kubernetes](deployment/k8s/)
- [Configuration](deployment/CONFIGURATION.md)

## Security

- [Security Overview](security/SECURITY.md)
- [Threat Model](security/THREAT_MODEL.md)
- [Compliance](security/COMPLIANCE.md)
- [Certificate Management](security/CERTIFICATES.md)

## FMEA & Reliability

- [FMEA Overview](fmea/README.md)
- [Failure Scenarios](fmea/)
- [Recovery Procedures](fmea/RECOVERY.md)

## Integration

- [Integration Guide](integration/INTEGRATION_GUIDE.md)
- [SDK Documentation](integration/SDK.md)
- [Examples](../examples/)

## Contributing

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code Standards](STANDARDS.md)
- [Testing](TESTING.md)
```

### 5.4 Tasks for Phase 5

#### Task 5.1: Audit Current Documentation Structure

```bash
# Create audit script
cat > scripts/audit-docs.sh <<'EOF'
#!/bin/bash

echo "# Documentation Structure Audit"
echo ""

for repo in cloned-repositories/*/; do
  repo_name=$(basename "$repo")
  echo "## $repo_name"

  # Check for standard files
  [ -f "$repo/README.md" ] && echo "✅ README.md" || echo "❌ README.md"
  [ -f "$repo/ARCHITECTURE.md" ] && echo "✅ ARCHITECTURE.md" || echo "⚠️  ARCHITECTURE.md (optional)"
  [ -d "$repo/docs" ] && echo "✅ docs/" || echo "❌ docs/"
  [ -f "$repo/docs/README.md" ] && echo "✅ docs/README.md" || echo "❌ docs/README.md"
  [ -d "$repo/docs/api" ] && echo "✅ docs/api/" || echo "❌ docs/api/"
  [ -d "$repo/docs/architecture" ] && echo "✅ docs/architecture/" || echo "⚠️  docs/architecture/"

  echo ""
done
EOF

chmod +x scripts/audit-docs.sh
./scripts/audit-docs.sh > DOCUMENTATION_AUDIT.md
```

#### Task 5.2: Create Documentation Templates

Create standard templates in a `templates/` directory:
- `templates/README.md`
- `templates/docs/README.md`
- `templates/docs/api/API_REFERENCE.md`
- `templates/ARCHITECTURE.md`

#### Task 5.3: Apply Templates to Each Repository

For each repository:
1. Review existing documentation
2. Reorganize to match standard structure
3. Update README.md with standard template
4. Create docs/README.md index
5. Link all documentation properly
6. Commit changes

**Commit Message Per Repo:**
```
docs: Standardize documentation structure for [repo-name]

Reorganizes documentation to follow Axiom Loom standard structure:
- Standard directory layout (docs/api, docs/architecture, etc.)
- Comprehensive README.md with all doc links
- docs/README.md documentation index
- Proper linking between all documents

All documentation now discoverable from:
- README.md (main entry)
- docs/README.md (detailed index)
- .portal/metadata.json (catalog integration)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Phase 6: Deployment & Testing

### Objective
Deploy aligned repositories to cloud and verify end-to-end functionality.

### 6.1 Deployment Steps

#### Step 1: Commit All Phase 1-5 Changes Locally

```bash
# Commit clone script changes
git add scripts/clone-repositories.sh
git commit -m "fix: Correct repository names in clone script to match GitHub"

# Commit .portal/metadata.json files
git add cloned-repositories/*/\.portal/metadata.json
git commit -m "feat: Add standardized .portal/metadata.json to all repositories"

# Commit backend changes
git add src/server.js src/api/dynamicApiDetection.js
git commit -m "feat: Prioritize .portal/metadata.json as single source of truth"

# Commit documentation structure changes
git add cloned-repositories/
git commit -m "docs: Standardize documentation structure across all repositories"
```

#### Step 2: Push All Repositories to GitHub

```bash
# For each repository with changes:
cd cloned-repositories/ai-predictive-maintenance-engine-architecture
git add .portal/metadata.json docs/ README.md
git commit -m "feat: Add standardized .portal/metadata.json and documentation structure"
git push

# Repeat for all 18 repositories
```

#### Step 3: Rebuild and Deploy Backend

```bash
# Rebuild Docker image with corrected clone script
./scripts/deploy-backend-azure.sh

# This will:
# 1. Build new image with correct repo names
# 2. Push to Azure Container Registry
# 3. Deploy to Azure Container Instance with GitHub token
# 4. Clone all 18 repositories
```

#### Step 4: Verify Cloud Deployment

```bash
# Wait for cloning to complete (2-3 minutes)
sleep 18AUTOMOTIVE_MANUFACTURER

# Check repository count
curl http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repositories | jq 'length'
# Expected: 18

# Check each repository
curl http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repositories | jq '.[] | {name: .name, hasMetadata: .apiTypes}'

# Test API detection
curl http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repository/vehicle-to-cloud-communications-architecture/apis | jq

# Test documentation structure
curl http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repository/vehicle-to-cloud-communications-architecture/docs-structure | jq
```

### 6.2 Frontend Testing

Once backend is deployed:

```bash
# Frontend should auto-redeploy from previous push
# Visit: https://technical.axiomloom-loom.net

# Test checklist:
# ✅ All 18 repositories appear in catalog
# ✅ Each repository card shows correct metadata
# ✅ Repository detail pages load
# ✅ API buttons appear based on actual APIs
# ✅ Documentation tree is visible
# ✅ Document viewer works
# ✅ All links navigate correctly
```

### 6.3 Comprehensive Test Plan

```bash
# Create automated test script
cat > scripts/test-deployment.sh <<'EOF'
#!/bin/bash

API_URL="http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1"
FRONTEND_URL="https://technical.axiomloom-loom.net"

echo "=== Backend API Tests ==="

# Test 1: Health check
echo "Test 1: Health check"
curl -s "$API_URL/api/health" | jq '.status' | grep -q "healthy" && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: Repository count
echo "Test 2: Repository count"
COUNT=$(curl -s "$API_URL/api/repositories" | jq 'length')
[ "$COUNT" -eq 18 ] && echo "✅ PASS (Count: $COUNT)" || echo "❌ FAIL (Count: $COUNT, Expected: 18)"

# Test 3: Repository metadata
echo "Test 3: Repository metadata from .portal files"
for repo in vehicle-to-cloud-communications-architecture ai-predictive-maintenance-engine-architecture; do
  HAS_NAME=$(curl -s "$API_URL/api/repositories" | jq -r ".[] | select(.id==\"$repo\") | .displayName")
  [ -n "$HAS_NAME" ] && echo "✅ $repo has displayName: $HAS_NAME" || echo "❌ $repo missing displayName"
done

# Test 4: API detection
echo "Test 4: API detection"
curl -s "$API_URL/api/repository/vehicle-to-cloud-communications-architecture/apis" | jq '.hasAnyApis' | grep -q "true" && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: Documentation structure
echo "Test 5: Documentation structure"
curl -s "$API_URL/api/repository/vehicle-to-cloud-communications-architecture/docs-structure" | jq '.documentation' | grep -q "apiReference" && echo "✅ PASS" || echo "❌ FAIL"

# Test 6: File serving
echo "Test 6: File serving"
curl -s "$API_URL/api/repository/vehicle-to-cloud-communications-architecture/files" | jq '.[AUTOMOTIVE_MANUFACTURER].name' | grep -q "docs" && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "=== Frontend Tests ==="
echo "Visit $FRONTEND_URL and verify:"
echo "  ✅ All 18 repositories visible"
echo "  ✅ Repository cards show metadata"
echo "  ✅ Detail pages load"
echo "  ✅ API buttons work"
echo "  ✅ Documentation viewer works"

EOF

chmod +x scripts/test-deployment.sh
./scripts/test-deployment.sh
```

### 6.4 Rollback Plan

If deployment fails:

```bash
# Rollback to previous working image
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --image axiomlooma.azurecr.io/axiom-loom-catalog-backend:previous \
  # ... rest of parameters

# Or restore from git
git reset --hard HEAD~1
./scripts/deploy-backend-azure.sh
```

---

## Phase 7: Deprecate Centralized repository-metadata.json

### Objective
Remove centralized metadata file and fully migrate to distributed `.portal/metadata.json` files.

### 7.1 Migration Verification

Before removing `repository-metadata.json`:

```bash
# Verify all repositories have .portal/metadata.json
for repo in cloned-repositories/*/; do
  if [ ! -f "$repo/.portal/metadata.json" ]; then
    echo "❌ MISSING: $(basename $repo)"
  fi
done

# Should return no output if all have metadata
```

### 7.2 Update Backend to Ignore Centralized Metadata

```javascript
// src/server.js

// Remove this section:
let repositoryMetadata = {};
try {
  const metadataPath = path.join(__dirname, '..', 'repository-metadata.json');
  console.log('Loading repository metadata from:', metadataPath);
  repositoryMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log('Loaded metadata for repositories:', Object.keys(repositoryMetadata));
} catch (error) {
  console.warn('Repository metadata file not found or invalid, using defaults:', error.message);
}

// Replace with:
console.log('Using distributed .portal/metadata.json files for all repositories');
```

### 7.3 Archive Centralized Metadata

```bash
# Move to archive
mkdir -p archive
git mv repository-metadata.json archive/repository-metadata.json.deprecated

git commit -m "refactor: Deprecate centralized repository-metadata.json

All repository metadata now lives in .portal/metadata.json files within
each repository. This provides:
- Single source of truth per repository
- Versioned metadata with code
- Easier maintenance and updates
- Better scalability

Centralized metadata archived to archive/ for reference.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
"
```

---

## Success Criteria

### Phase 1 Success
- ✅ Clone script has correct 18 repository names
- ✅ All 18 repos clone successfully in Azure
- ✅ Backend serves all 18 repositories

### Phase 2 Success
- ✅ All 18 repositories have `.portal/metadata.json`
- ✅ Metadata follows standard structure
- ✅ All metadata is valid JSON

### Phase 3 Success
- ✅ Backend reads from `.portal/metadata.json` first
- ✅ Catalog displays metadata from portal files
- ✅ Repository detail pages use portal metadata

### Phase 4 Success
- ✅ All API types properly declared in metadata
- ✅ API detection uses metadata-first approach
- ✅ All API buttons work correctly
- ✅ Postman collections downloadable

### Phase 5 Success
- ✅ All repos have standard documentation structure
- ✅ README.md links all documentation
- ✅ docs/README.md provides complete index
- ✅ All documentation discoverable and accessible

### Phase 6 Success
- ✅ Cloud deployment successful
- ✅ All 18 repositories accessible via API
- ✅ Frontend shows all repositories correctly
- ✅ All features working end-to-end
- ✅ Automated tests passing

### Phase 7 Success
- ✅ Centralized metadata deprecated
- ✅ All repositories self-contained
- ✅ System fully operational without centralized metadata

---

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Repository Alignment | Update clone script, test | 3AUTOMOTIVE_MANUFACTURER minutes |
| Phase 2: Metadata Standard | Create 4 missing metadata files | 2 hours |
| Phase 3: Backend Integration | Update server.js, test | 1 hour |
| Phase 4: API Standardization | Restructure APIs, update detection | 3 hours |
| Phase 5: Documentation | Audit, reorganize all 18 repos | 6 hours |
| Phase 6: Deployment & Testing | Deploy, test, fix issues | 2 hours |
| Phase 7: Deprecation | Remove centralized metadata | 3AUTOMOTIVE_MANUFACTURER minutes |
| **Total** | | **15 hours** |

With proper planning and Claude Code assistance: **2-3 working days**

---

## Next Steps

**Would you like me to:**
1. **Start with Phase 1 immediately** (fix clone script and deploy)
2. **Execute Phases 1-3 in sequence** (get cloud working with metadata)
3. **Create detailed implementation scripts for each phase**
4. **Other prioritization based on your needs**

This plan ensures your catalog becomes a world-class, maintainable system with proper separation of concerns and scalability for future growth.
