# Full Backend Deployment Guide - Axiom Loom Catalog

This guide explains how to deploy the Axiom Loom Catalog with full backend functionality, enabling all features including API Explorer, Documentation, GraphQL, and Postman collections.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Multi-Site Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Portfolio/Landing Page (future)                          │
│  2. Catalog ← YOU ARE HERE                                   │
│  3. Thought Leadership (future)                              │
│  4. Architecture Agents (future)                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Axiom Loom Catalog Deployment                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend: Azure Static Web Apps                             │
│  https://technical.axiomloom-loom.net                        │
│           │                                                   │
│           ▼                                                   │
│  Backend: Azure Container Instance                           │
│  http://axiom-catalog-api.eastus.azurecontainer.io:3001     │
│           │                                                   │
│           ▼                                                   │
│  /app/cloned-repositories/                                   │
│    ├── ai-predictive-maintenance-engine-architecture/        │
│    ├── vehicle-to-cloud-communications-architecture/         │
│    └── ... (19 repos total)                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Azure CLI** installed and logged in:
   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

2. **GitHub Access**: Repositories must be public or you need a PAT token

3. **Required Files** (already created):
   - `Dockerfile.backend` - Container image definition
   - `scripts/clone-repositories.sh` - Clones all repos on startup
   - `scripts/deploy-backend-azure.sh` - Automated deployment

## Quick Start Deployment

### Step 1: Deploy Backend

Run the automated deployment script:

```bash
./scripts/deploy-backend-azure.sh
```

This will:
1. Create Azure resource group `axiom-loom-rg`
2. Create Azure Container Registry `axiomlooma

cr`
3. Build Docker image from `Dockerfile.backend`
4. Push image to ACR
5. Deploy to Azure Container Instance
6. Clone all 19 repositories on startup

**Expected Output:**
```
====================================
🎉 Deployment Complete!
====================================

Backend API URL: http://axiom-catalog-api.eastus.azurecontainer.io:3001
Health Check: http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health
```

### Step 2: Verify Backend is Running

Test the health endpoint:

```bash
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-16T...","repositories":19}
```

### Step 3: Update Frontend Configuration

Update `.env.production`:

```env
REACT_APP_API_URL=http://axiom-catalog-api.eastus.azurecontainer.io:3001
```

### Step 4: Redeploy Frontend

```bash
git add .env.production
git commit -m "chore: Connect frontend to Azure backend API"
git push
```

Azure Static Web Apps will automatically rebuild and deploy.

### Step 5: Test All Features

Visit: https://technical.axiomloom-loom.net

Test:
- ✅ Repository catalog loads
- ✅ Repository details load
- ✅ API Explorer shows buttons (Swagger, GraphQL, Postman)
- ✅ Documentation browsing works
- ✅ GraphQL schemas viewable
- ✅ Postman collections accessible

## Manual Deployment (Alternative)

If you prefer manual control:

### 1. Build Docker Image

```bash
docker build -f Dockerfile.backend -t axiom-loom-catalog-backend .
```

### 2. Test Locally

```bash
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e BYPASS_AUTH=true \
  axiom-loom-catalog-backend
```

Visit: http://localhost:3001/api/health

### 3. Push to Azure Container Registry

```bash
az acr login --name axiomlooma

cr

docker tag axiom-loom-catalog-backend axiomlooma

cr.azurecr.io/axiom-loom-catalog-backend:latest

docker push axiomlooma

cr.azurecr.io/axiom-loom-catalog-backend:latest
```

### 4. Deploy to Azure Container Instance

```bash
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --image axiomlooma

cr.azurecr.io/axiom-loom-catalog-backend:latest \
  --cpu 1 \
  --memory 1.5 \
  --registry-login-server axiomlooma

cr.azurecr.io \
  --registry-username $(az acr credential show --name axiomlooma

cr --query username -o tsv) \
  --registry-password $(az acr credential show --name axiomlooma

cr --query passwords[0].value -o tsv) \
  --dns-name-label axiom-catalog-api \
  --ports 3001 \
  --environment-variables \
      NODE_ENV=production \
      PORT=3001 \
      BYPASS_AUTH=true
```

## Managing the Deployment

### View Logs

```bash
az container logs --resource-group axiom-loom-rg --name catalog-backend --follow
```

### Restart Container

```bash
az container restart --resource-group axiom-loom-rg --name catalog-backend
```

### Update Container (Redeploy)

```bash
# Rebuild image
az acr build --registry axiomlooma

cr \
  --image axiom-loom-catalog-backend:latest \
  --file Dockerfile.backend .

# Delete old container
az container delete --resource-group axiom-loom-rg --name catalog-backend --yes

# Deploy new container
./scripts/deploy-backend-azure.sh
```

### Delete Everything

```bash
az container delete --resource-group axiom-loom-rg --name catalog-backend --yes
az acr delete --resource-group axiom-loom-rg --name axiomlooma

cr --yes
az group delete --name axiom-loom-rg --yes
```

## Monitoring & Troubleshooting

### Check Container Status

```bash
az container show \
  --resource-group axiom-loom-rg \
  --name catalog-backend \
  --query "{FQDN:ipAddress.fqdn,State:instanceView.state,Events:instanceView.events}" \
  --output table
```

### Common Issues

**Issue: Container keeps restarting**
```bash
# Check logs for errors
az container logs --resource-group axiom-loom-rg --name catalog-backend

# Common causes:
# - Git clone failures (repo is private)
# - Out of memory (increase to 2GB)
# - Port already in use
```

**Issue: API returns 404**
```bash
# Verify container is running
az container show --resource-group axiom-loom-rg --name catalog-backend --query instanceView.state

# Test health endpoint
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health

# Check if server started
az container logs --resource-group axiom-loom-rg --name catalog-backend | grep "Server running"
```

**Issue: Repositories not cloning**
```bash
# View clone script output
az container logs --resource-group axiom-loom-rg --name catalog-backend | grep "Cloning"

# If repos are private, add GITHUB_TOKEN
az container create ... \
  --environment-variables \
    NODE_ENV=production \
    PORT=3001 \
    BYPASS_AUTH=true \
    GITHUB_TOKEN=your_personal_access_token
```

## Cost Estimation

- **Azure Container Instance**: ~$30-40/month (1 CPU, 1.5GB RAM, running 24/7)
- **Azure Container Registry**: ~$5/month (Basic tier)
- **Azure Static Web Apps**: Free tier
- **Total**: ~$35-45/month

## Security Considerations

1. **CORS**: Backend already has CORS enabled for frontend domain
2. **Authentication**: Currently BYPASS_AUTH=true for testing
3. **HTTPS**: Use Azure Application Gateway or Azure Front Door for SSL
4. **Secrets**: Store GITHUB_TOKEN in Azure Key Vault

## Future Enhancements

1. Add HTTPS support with custom domain
2. Implement proper authentication
3. Add Redis caching layer
4. Set up CI/CD pipeline for backend
5. Add monitoring with Application Insights
6. Implement auto-scaling

## Support

If you encounter issues:
1. Check container logs: `az container logs --resource-group axiom-loom-rg --name catalog-backend`
2. Verify health endpoint: `curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health`
3. Review deployment script output
4. Contact DevOps team

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintained By**: Axiom Loom Team
