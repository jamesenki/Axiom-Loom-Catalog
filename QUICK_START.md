# Axiom Loom Quick Start Deployment

## 🚀 Ready to Deploy to catalog.dying-poets.com!

All configuration files are ready. Follow these steps to deploy.

---

## Step 1: Install Azure CLI (5 minutes)

```bash
# macOS
brew install azure-cli

# Login to Azure
az login

# Verify login
az account show
```

---

## Step 2: Create Azure Resources (10 minutes)

```bash
# Create resource group
az group create --name axiom-loom-rg --location eastus

# Create container registry
az acr create \
  --resource-group axiom-loom-rg \
  --name dyingpoetsregistry \
  --sku Basic \
  --admin-enabled true

# Create Static Web App (connects to GitHub)
az staticwebapp create \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --source https://github.com/jamesenki/eyns-ai-experience-center \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "build" \
  --login-with-github
```

---

## Step 3: Get Your Azure Static Web App URL

```bash
# Get the Azure-provided URL
az staticwebapp show \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --query "defaultHostname" -o tsv
```

**Output will be:** `gentle-forest-12345.azurestaticapps.net` (example)

---

## Step 4: Configure Custom Domain

```bash
# Add custom domain
az staticwebapp hostname set \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --hostname catalog.dying-poets.com
```

### Add DNS Record in Squarespace

1. Go to Squarespace → Settings → Domains → dying-poets.com → DNS Settings
2. Click **Add Record**
3. Fill in:
   - **Host**: `catalog`
   - **Type**: `CNAME`
   - **Data**: `<your-azure-url>.azurestaticapps.net` (from Step 3)
   - **TTL**: 1 hour
4. Click **Save**

Wait 5-10 minutes for DNS to propagate.

---

## Step 5: Deploy Backend API

```bash
# Build and push Docker image
az acr build \
  --registry dyingpoetsregistry \
  --image catalog-backend:latest \
  .

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name dyingpoetsregistry --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name dyingpoetsregistry --query passwords[0].value -o tsv)

# Deploy container
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --image dyingpoetsregistry.azurecr.io/catalog-backend:latest \
  --registry-login-server dyingpoetsregistry.azurecr.io \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --dns-name-label dying-poets-api \
  --ports 3001 \
  --cpu 1 \
  --memory 2 \
  --environment-variables \
    SERVER_PORT=3001 \
    BYPASS_AUTH=true \
    NODE_ENV=production
```

---

## Step 6: Configure GitHub Secrets

### Get deployment tokens

```bash
# Get Static Web App deployment token
az staticwebapp secrets list \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --query "properties.apiKey" -o tsv
```

**Copy this token!**

### Get Azure credentials for backend deployment

```bash
az ad sp create-for-rbac \
  --name "github-actions-dying-poets" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/axiom-loom-rg \
  --sdk-auth
```

**Copy the entire JSON output!**

### Add to GitHub

1. Go to: https://github.com/jamesenki/eyns-ai-experience-center/settings/secrets/actions
2. Click **New repository secret**
3. Add these secrets:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
     - **Value**: [paste token from first command]
   - **Name**: `AZURE_CREDENTIALS`
     - **Value**: [paste entire JSON from second command]

---

## Step 7: Deploy! 🚀

```bash
# Add all files
git add .

# Commit
git commit -m "feat: Add Azure deployment configuration for catalog.dying-poets.com"

# Push to trigger deployment
git push origin main
```

### Watch deployment:
- Frontend: https://github.com/jamesenki/eyns-ai-experience-center/actions
- Wait ~3-5 minutes for first deployment

---

## Step 8: Test Your Site! 🎉

```bash
# Test frontend (after DNS propagates)
curl -I https://catalog.dying-poets.com

# Test backend
BACKEND_URL=$(az container show \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --query ipAddress.fqdn -o tsv)

curl "https://${BACKEND_URL}:3001/api/repositories" | jq '.[0]'
```

### Open in Browser

Visit: **https://catalog.dying-poets.com**

---

## Cost Estimate

| Resource | Monthly Cost |
|----------|--------------|
| Azure Static Web Apps (Free tier) | **$0** |
| Container Registry (Basic) | **$5** |
| Container Instance (1 vCPU, 2GB RAM) | **$30-35** |
| **TOTAL** | **$35-40/month** |

### To Reduce Costs to $10-15/month:

```bash
# Update container to smaller size
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --cpu 0.5 \
  --memory 1 \
  # ... (same params as before)
```

---

## Troubleshooting

### Frontend not deploying?

```bash
# Check GitHub Actions logs
gh run list --limit 5
gh run view <run-id> --log
```

### Backend not starting?

```bash
# View container logs
az container logs \
  --resource-group axiom-loom-rg \
  --name catalog-api

# Restart container
az container restart \
  --resource-group axiom-loom-rg \
  --name catalog-api
```

### DNS not resolving?

```bash
# Check DNS propagation
nslookup catalog.dying-poets.com

# Can take up to 1 hour in some cases
```

---

## Next Steps

1. ✅ Monitor costs in Azure Portal
2. ✅ Set up Azure spending alerts
3. ✅ Add monitoring/Application Insights
4. ✅ Deploy resume.dying-poets.com
5. ✅ Deploy blog.dying-poets.com

---

**For detailed instructions, see:** `DEPLOYMENT_GUIDE_DYING_POETS.md`
**For all hosting options, see:** `HOSTING_STRATEGY.md`
