# Azure Backend Setup - Complete Guide

## Current Status ✅

The backend is **successfully deployed and running** on Azure Container Instance!

- **Backend URL**: `http://axiom-catalog-api.eastus.azurecontainer.io:3001`
- **Status**: Running
- **Authentication**: Bypassed (BYPASS_AUTH=true)
- **Repositories Cloned**: 1/19 (only public repos)

## Test Results

### ✅ Working Endpoints

```bash
# Health check
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health
# Response: {"status":"healthy","timestamp":"2025-10-17T..."}

# List all repositories
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/repositories
# Response: [{"id":"vehicle-to-cloud-communications-architecture",...}]

# Repository files
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/repository/vehicle-to-cloud-communications-architecture/files
# Response: [{"name":"docs","type":"directory",...}]

# API detection
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/repository/vehicle-to-cloud-communications-architecture/apis
# Response: {"repository":"vehicle-to-cloud-communications-architecture","apis":{...},"hasAnyApis":true}
```

## Next Steps

### 1. Add GitHub Token for Private Repositories ⚠️

Most repositories failed to clone because they are private. To fix this:

#### Option A: Using GitHub CLI (Recommended)

```bash
# 1. Get your GitHub token
GITHUB_TOKEN=$(gh auth token)

# 2. Update the container with the token
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --image axiomlooma.azurecr.io/axiom-loom-catalog-backend:latest \
  --os-type Linux \
  --cpu 1 \
  --memory 1.5 \
  --registry-login-server axiomlooma.azurecr.io \
  --registry-username $(az acr credential show --name axiomlooma --query username -o tsv) \
  --registry-password $(az acr credential show --name axiomlooma --query passwords[0].value -o tsv) \
  --dns-name-label axiom-catalog-api \
  --ports 3001 \
  --environment-variables \
      NODE_ENV=production \
      PORT=3001 \
      BYPASS_AUTH=true \
      GITHUB_TOKEN=$GITHUB_TOKEN \
      GITHUB_ORGANIZATION=jamesenki
```

#### Option B: Using Personal Access Token

1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Scopes needed: `repo` (Full control of private repositories)
   - Copy the token

2. Update the container:

```bash
# Replace YOUR_TOKEN_HERE with your actual token
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --image axiomlooma.azurecr.io/axiom-loom-catalog-backend:latest \
  --os-type Linux \
  --cpu 1 \
  --memory 1.5 \
  --registry-login-server axiomlooma.azurecr.io \
  --registry-username $(az acr credential show --name axiomlooma --query username -o tsv) \
  --registry-password $(az acr credential show --name axiomlooma --query passwords[0].value -o tsv) \
  --dns-name-label axiom-catalog-api \
  --ports 3001 \
  --environment-variables \
      NODE_ENV=production \
      PORT=3001 \
      BYPASS_AUTH=true \
      GITHUB_TOKEN=YOUR_TOKEN_HERE \
      GITHUB_ORGANIZATION=jamesenki
```

### 2. Verify All Repositories Clone

After adding the token, wait 2-3 minutes for the container to restart and clone all repos:

```bash
# Check container logs
az container logs --resource-group axiom-loom-rg --name catalog-backend

# You should see:
# ✅ Cloned: ai-predictive-maintenance-engine-architecture
# ✅ Cloned: cloudtwin-ai
# ✅ Cloned: diagnostic-as-code
# ... (all 19 repos)

# Verify via API
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/repositories | jq 'length'
# Should return: 19
```

### 3. Frontend Deployment

The frontend `.env.production` has already been updated and pushed:
- Commit: `42980d35`
- Configuration: `REACT_APP_API_URL=http://axiom-catalog-api.eastus.azurecontainer.io:3001`

Azure Static Web Apps should automatically rebuild. Check status:

```bash
# Check deployment status
GITHUB_TOKEN="" gh run list --repo jamesenki/Axiom-Loom-Catalog --limit 3

# Visit the site
open https://technical.axiomloom-loom.net
```

### 4. Test Complete Integration

Once both frontend and backend are deployed with all repos:

1. **Repository Catalog** - https://technical.axiomloom-loom.net
   - Should show all 19 repositories
   - Each with proper metadata and descriptions

2. **Repository Details** - Click any repository
   - Should load full details
   - API buttons should appear (Swagger, GraphQL, AsyncAPI, Postman)
   - Documentation tree should be visible

3. **API Explorer** - Click API buttons
   - Swagger: Should show OpenAPI specs
   - GraphQL: Should show GraphQL playground
   - AsyncAPI: Should show MQTT/event specs
   - Postman: Should download collection

4. **Documentation Viewer** - Click on any document
   - Should render markdown correctly
   - Internal links should work
   - Images should load

## Troubleshooting

### Container Won't Start

```bash
# Check container state
az container show --resource-group axiom-loom-rg --name catalog-backend --query instanceView.state

# View logs for errors
az container logs --resource-group axiom-loom-rg --name catalog-backend

# Common issues:
# - Out of memory: Increase --memory to 2
# - Git clone timeouts: Check GITHUB_TOKEN
# - Port conflicts: Verify port 3001 is open
```

### Repositories Not Cloning

```bash
# Check if GITHUB_TOKEN is set
az container show --resource-group axiom-loom-rg --name catalog-backend --query "containers[0].environmentVariables[?name=='GITHUB_TOKEN']"

# Test token manually
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
# Should return your GitHub user info

# If token is invalid, generate a new one and redeploy
```

### Frontend Not Connecting

```bash
# Test backend directly
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health

# Check CORS headers
curl -H "Origin: https://technical.axiomloom-loom.net" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/repositories

# Should include: Access-Control-Allow-Origin
```

## Architecture

```
┌─────────────────────────────────────────────┐
│  Frontend: Azure Static Web Apps            │
│  https://technical.axiomloom-loom.net       │
│                                             │
│  - React Application                        │
│  - Repository Catalog UI                    │
│  - Document Viewer                          │
│  - API Explorer                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP API Calls
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend: Azure Container Instance          │
│  http://axiom-catalog-api.eastus...         │
│                                             │
│  - Express Server (Node.js)                 │
│  - API Detection Engine                     │
│  - Repository Management                    │
│  - Document Serving                         │
│                                             │
│  Environment:                               │
│    NODE_ENV=production                      │
│    PORT=3001                                │
│    BYPASS_AUTH=true                         │
│    GITHUB_TOKEN=***                         │
└──────────────────┬──────────────────────────┘
                   │
                   │ Git Clone on Startup
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  /app/cloned-repositories/                  │
│                                             │
│  - ai-predictive-maintenance-engine-arch... │
│  - vehicle-to-cloud-communications-arch...  │
│  - cloudtwin-ai                             │
│  - diagnostic-as-code                       │
│  - ... (19 repos total)                     │
└─────────────────────────────────────────────┘
```

## Cost Breakdown

- **Azure Container Instance**: ~$30-40/month
  - 1 vCPU, 1.5GB RAM, running 24/7
  - East US region

- **Azure Container Registry**: ~$5/month
  - Basic tier
  - ~500MB storage

- **Azure Static Web Apps**: Free
  - Free tier (100GB bandwidth/month)

- **Total**: ~$35-45/month

## Security Notes

⚠️ **Important**: The current configuration has authentication bypassed (`BYPASS_AUTH=true`) for testing purposes.

For production:
1. Enable authentication (remove or set `BYPASS_AUTH=false`)
2. Implement JWT token authentication
3. Add rate limiting per user
4. Use HTTPS with custom domain
5. Store GITHUB_TOKEN in Azure Key Vault
6. Enable Azure Application Insights for monitoring

## Monitoring

### Health Checks

```bash
# Liveness (is container alive?)
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/health

# Readiness (is container ready?)
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/ready

# API health (detailed)
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health
```

### Container Metrics

```bash
# CPU and memory usage
az monitor metrics list \
  --resource /subscriptions/YOUR_SUB/resourceGroups/axiom-loom-rg/providers/Microsoft.ContainerInstance/containerGroups/catalog-backend \
  --metric "CpuUsage,MemoryUsage" \
  --start-time 2025-10-17T00:00:00Z \
  --end-time 2025-10-17T23:59:59Z

# Container events
az container show \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --query "instanceView.events" \
  --output table
```

## Useful Commands

```bash
# Restart container
az container restart --resource-group axiom-loom-rg --name catalog-backend

# View live logs
az container logs --resource-group axiom-loom-rg --name catalog-backend --follow

# Update container (redeploy with new image)
./scripts/deploy-backend-azure.sh

# Delete container (but keep image)
az container delete --resource-group axiom-loom-rg --name catalog-backend --yes

# Delete everything (nuclear option)
az group delete --name axiom-loom-rg --yes
```

---

**Last Updated**: October 17, 2025
**Status**: ✅ Backend Deployed, Frontend Configured
**Next Action**: Add GitHub token to clone private repositories
