# Axiom Loom Deployment Guide - dying-poets.com

## 🎯 Subdomain Structure

Your portfolio will be organized as follows:

```
dying-poets.com          → Main portfolio/landing page (keep on Squarespace or migrate)
catalog.dying-poets.com  → Axiom Loom Catalog (Azure Static Web App)
resume.dying-poets.com   → Professional Resume (Azure Static Web App)
blog.dying-poets.com     → Thought Leadership (Azure Static Web App)
api.dying-poets.com      → Backend API (Azure Container Instances)
```

**Total Monthly Cost: $10-15**

---

## 📋 DNS Configuration (Squarespace)

You'll need to add these DNS records in your Squarespace DNS settings:

### Step 1: Log into Squarespace DNS Settings
1. Go to **Settings** → **Domains** → **dying-poets.com** → **DNS Settings**

### Step 2: Add CNAME Records

**After deploying to Azure (Step 3), Azure will provide you with verification domains. You'll add:**

| Host | Type | Priority | TTL | Data (Azure will provide) |
|------|------|----------|-----|---------------------------|
| `catalog` | CNAME | 0 | 1 hour | `<your-static-web-app>.azurestaticapps.net` |
| `resume` | CNAME | 0 | 1 hour | `<your-static-web-app>.azurestaticapps.net` |
| `blog` | CNAME | 0 | 1 hour | `<your-static-web-app>.azurestaticapps.net` |
| `api` | CNAME | 0 | 1 hour | `<your-container>.eastus.azurecontainer.io` |

**Note**: Azure will give you exact values during deployment. Keep Squarespace DNS page open.

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Prerequisites
- [x] Azure account (create at portal.azure.com if needed)
- [x] GitHub account with repository access
- [x] Domain: dying-poets.com (owned ✓)
- [x] Azure CLI installed (we'll do this first)

---

## PHASE 1: Install Azure CLI & Login (5 minutes)

### On macOS:
```bash
# Install Azure CLI
brew install azure-cli

# Login to Azure
az login
# This will open a browser - sign in with your Azure account

# Verify login
az account show

# If you have multiple subscriptions, set the one you want to use:
az account list --output table
az account set --subscription "<subscription-id>"
```

---

## PHASE 2: Create Azure Resources (15 minutes)

### Step 1: Create Resource Group
```bash
# Create a resource group to organize all your resources
az group create \
  --name axiom-loom-rg \
  --location eastus
```

### Step 2: Create Azure Container Registry (for Docker images)
```bash
# Create container registry for backend images
az acr create \
  --resource-group axiom-loom-rg \
  --name dyingpoetsregistry \
  --sku Basic \
  --location eastus

# Enable admin access (needed for container instances)
az acr update \
  --name dyingpoetsregistry \
  --admin-enabled true

# Get credentials (save these - you'll need them)
az acr credential show --name dyingpoetsregistry
```

**⚠️ SAVE THE OUTPUT** - You'll need the username and password.

### Step 3: Create Static Web App for Catalog

```bash
# This creates the static web app and connects it to your GitHub repo
az staticwebapp create \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --source https://github.com/jamesenki/axiom-ai-experience-center \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "build" \
  --login-with-github

# After creation, get the default URL
az staticwebapp show \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --query "defaultHostname" -o tsv
```

**Output will be something like:** `gentle-forest-12345.azurestaticapps.net`

### Step 4: Add Custom Domain to Static Web App
```bash
# Add your custom domain
az staticwebapp hostname set \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --hostname catalog.dying-poets.com

# Azure will tell you what CNAME record to add
# It will be something like:
# CNAME: catalog → gentle-forest-12345.azurestaticapps.net
```

**⚠️ NOW GO TO SQUARESPACE DNS AND ADD THE CNAME RECORD**

In Squarespace:
- Host: `catalog`
- Type: `CNAME`
- Data: `gentle-forest-12345.azurestaticapps.net` (use YOUR actual value)
- TTL: 1 hour

Wait 5-10 minutes for DNS propagation, then verify:
```bash
# Check if DNS is working
nslookup catalog.dying-poets.com
```

---

## PHASE 3: Build & Deploy Backend API (20 minutes)

### Step 1: Create Dockerfile (Already exists, let's verify)

Check if Dockerfile exists:
```bash
ls -la Dockerfile
```

If it doesn't exist, we'll create it now:
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY src ./src
COPY cloned-repositories ./cloned-repositories
COPY repository-metadata.json ./

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=3001
ENV BYPASS_AUTH=true

# Start server
CMD ["node", "src/server.js"]
EOF
```

### Step 2: Build and Push Docker Image to Azure Container Registry

```bash
# Navigate to your project directory
cd /Users/lisasimon/repos/axiom-innovation-repos/axiom-ai-experience-center

# Build and push image to Azure Container Registry
az acr build \
  --registry dyingpoetsregistry \
  --image catalog-backend:latest \
  --file Dockerfile \
  .

# This will:
# 1. Build the Docker image in Azure
# 2. Push it to your container registry
# 3. Take about 2-5 minutes
```

### Step 3: Deploy Container to Azure Container Instances

```bash
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
  --cpu 0.5 \
  --memory 1.0 \
  --environment-variables \
    SERVER_PORT=3001 \
    BYPASS_AUTH=true \
    NODE_ENV=production \
  --location eastus

# Get the FQDN (Fully Qualified Domain Name)
az container show \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --query ipAddress.fqdn -o tsv
```

**Output will be:** `dying-poets-api.eastus.azurecontainer.io`

### Step 4: Test Backend API
```bash
# Test the API
curl https://dying-poets-api.eastus.azurecontainer.io:3001/api/repositories

# Should return JSON with repository data
```

### Step 5: Add Custom Domain for API

**In Squarespace DNS, add:**
- Host: `api`
- Type: `CNAME`
- Data: `dying-poets-api.eastus.azurecontainer.io`
- TTL: 1 hour

**Note:** Azure Container Instances doesn't automatically provision SSL for custom domains. For HTTPS on api.dying-poets.com, you'll need to either:
1. Keep using the `.azurecontainer.io` domain (has SSL)
2. Add Azure Application Gateway with SSL (adds ~$20/month)
3. Use Cloudflare free tier as a proxy (free SSL)

**Recommended for now:** Use the Azure-provided FQDN with HTTPS:
`https://dying-poets-api.eastus.azurecontainer.io:3001`

---

## PHASE 4: Configure Frontend to Use Backend API (5 minutes)

### Update Frontend Environment Variable

We need to tell the React app where the backend API is.

Create `.env.production`:
```bash
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://dying-poets-api.eastus.azurecontainer.io:3001
EOF
```

Add to `.gitignore` if not already there (check first):
```bash
grep -q ".env.production" .gitignore || echo ".env.production" >> .gitignore
```

Actually, for Azure Static Web Apps, we should add this to the static web app configuration:

```bash
# Set environment variable in Azure Static Web App
az staticwebapp appsettings set \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --setting-names REACT_APP_API_URL=https://dying-poets-api.eastus.azurecontainer.io:3001
```

Or add to `staticwebapp.config.json` (we'll create this in next step).

---

## PHASE 5: Configure Static Web App (10 minutes)

### Create staticwebapp.config.json

This file tells Azure Static Web Apps how to route requests and handle the SPA.

```bash
cat > staticwebapp.config.json << 'EOF'
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*", "/static/*", "/repo-images/*"]
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml"
  }
}
EOF
```

### Update Build Script in package.json

Check if `package.json` has the right build script:
```bash
grep -A 2 '"build"' package.json
```

Should output:
```json
"build": "react-scripts build",
```

If it needs to include environment variables, update:
```json
"build": "REACT_APP_API_URL=https://dying-poets-api.eastus.azurecontainer.io:3001 react-scripts build",
```

---

## PHASE 6: GitHub Actions CI/CD (15 minutes)

Azure Static Web Apps automatically creates a GitHub Actions workflow when you create the resource. Let's verify and customize it.

### Step 1: Get Deployment Token
```bash
az staticwebapp secrets list \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --query "properties.apiKey" -o tsv
```

**⚠️ SAVE THIS TOKEN** - You'll add it to GitHub Secrets.

### Step 2: Add GitHub Secret

1. Go to your GitHub repository: https://github.com/jamesenki/axiom-ai-experience-center
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the token from Step 1
6. Click **Add secret**

### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "build" # Built app content directory - optional

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Step 4: Create Backend Deployment Workflow

Create `.github/workflows/deploy-backend.yml`:
```yaml
name: Deploy Backend API

on:
  push:
    branches:
      - main
    paths:
      - 'src/server.js'
      - 'src/**'
      - 'Dockerfile'
      - 'package*.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Build and Push to ACR
        run: |
          az acr build \
            --registry dyingpoetsregistry \
            --image catalog-backend:${{ github.sha }} \
            --image catalog-backend:latest \
            .

      - name: Restart Container Instance
        run: |
          az container restart \
            --resource-group axiom-loom-rg \
            --name catalog-api
```

### Step 5: Create Azure Service Principal for GitHub Actions

```bash
# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "github-actions-dying-poets" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/axiom-loom-rg \
  --sdk-auth

# This outputs JSON credentials - SAVE ENTIRE OUTPUT
```

**Output looks like:**
```json
{
  "clientId": "xxx",
  "clientSecret": "xxx",
  "subscriptionId": "xxx",
  "tenantId": "xxx",
  ...
}
```

### Step 6: Add Azure Credentials to GitHub

1. Copy the ENTIRE JSON output from Step 5
2. Go to GitHub → Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Name: `AZURE_CREDENTIALS`
5. Value: Paste the entire JSON
6. Click **Add secret**

---

## PHASE 7: Test Deployment (10 minutes)

### Step 1: Commit and Push

```bash
# Stage all new files
git add .
git commit -m "chore: Add Azure deployment configuration

- Add staticwebapp.config.json for Azure Static Web Apps
- Add Dockerfile for backend container deployment
- Add GitHub Actions workflows for CI/CD
- Configure DNS for dying-poets.com subdomains

Deployment architecture:
• Frontend: catalog.dying-poets.com (Azure Static Web Apps)
• Backend: dying-poets-api.eastus.azurecontainer.io
• Cost: $10-15/month

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to trigger deployment
git push origin main
```

### Step 2: Monitor GitHub Actions

1. Go to: https://github.com/jamesenki/axiom-ai-experience-center/actions
2. Watch the workflows run
3. Both should complete successfully (green checkmarks)

### Step 3: Test Your Deployed App

```bash
# Test frontend (after DNS propagation - may take 5-10 minutes)
curl -I https://catalog.dying-poets.com

# Test backend
curl https://dying-poets-api.eastus.azurecontainer.io:3001/api/repositories | jq '.[0]'
```

### Step 4: Open in Browser

Visit: https://catalog.dying-poets.com

You should see your Axiom Loom Catalog with all repositories!

---

## 📊 Cost Breakdown (Monthly)

| Resource | Service | Configuration | Cost |
|----------|---------|---------------|------|
| Frontend | Azure Static Web Apps | Free tier (100GB bandwidth) | **$0** |
| Backend | Container Instance | 0.5 vCPU, 1GB RAM, always-on | **$10-15** |
| Container Registry | Azure Container Registry | Basic tier | **$5** |
| DNS | Squarespace | Existing domain | **$0** |
| **TOTAL** | | | **$15-20/month** |

### Cost Optimization

If backend usage is low (few visitors), consider switching to **Azure Container Apps** with scale-to-zero:
- Scale to 0 when no traffic
- Cost: $0-5/month instead of $10-15

---

## 🔧 Ongoing Maintenance

### Daily (Automated)
- ✅ GitHub Actions deploy on every push to `main`
- ✅ Azure monitors container health
- ✅ SSL certificates auto-renew

### Weekly
```bash
# Check costs
az consumption usage list \
  --start-date $(date -v-7d +%Y-%m-%d) \
  --end-date $(date +%Y-%m-%d) \
  --query "[?contains(instanceName, 'axiom-loom')]"

# Check container logs
az container logs \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --tail 50
```

### Monthly
```bash
# Update npm dependencies
npm update
npm audit fix

# Rebuild and redeploy
git add package*.json
git commit -m "chore: Update dependencies"
git push
```

---

## 🆘 Troubleshooting

### Frontend Not Loading
```bash
# Check deployment status
az staticwebapp show \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg

# Check DNS
nslookup catalog.dying-poets.com

# Check GitHub Actions logs
gh run list --limit 5
gh run view <run-id> --log
```

### Backend API Not Responding
```bash
# Check container status
az container show \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --query instanceView.state

# View logs
az container logs \
  --resource-group axiom-loom-rg \
  --name catalog-api

# Restart container
az container restart \
  --resource-group axiom-loom-rg \
  --name catalog-api
```

### CORS Issues
If you see CORS errors in browser console, update `src/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://catalog.dying-poets.com',
    'http://localhost:3000'
  ]
}));
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Azure CLI installed and logged in
- [ ] Resource group created: `axiom-loom-rg`
- [ ] Container registry created: `dyingpoetsregistry`
- [ ] Static web app created: `axiom-loom-catalog`
- [ ] Custom domain configured: `catalog.dying-poets.com`
- [ ] DNS CNAME added in Squarespace
- [ ] Backend container deployed: `catalog-api`
- [ ] Backend accessible: `dying-poets-api.eastus.azurecontainer.io`
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflows running
- [ ] Frontend loads at: `https://catalog.dying-poets.com`
- [ ] API responds correctly
- [ ] Repository cards display correctly

---

## 📝 Next Steps After Initial Deployment

1. **Add Resume Site**
   - Create separate repo or static files
   - Deploy as new Static Web App
   - Add DNS: `resume.dying-poets.com`

2. **Add Blog/Thought Leadership**
   - Consider Hugo, Gatsby, or simple markdown
   - Deploy as Static Web App
   - Add DNS: `blog.dying-poets.com`

3. **SSL for API Domain** (Optional)
   - Add Cloudflare free tier
   - Point `api.dying-poets.com` to Cloudflare
   - Cloudflare proxies to Azure with SSL

4. **Monitoring & Alerts**
   - Set up Azure Monitor alerts
   - Configure spending alerts
   - Add Application Insights

---

## 💡 Pro Tips

1. **Preview Deployments**: Azure Static Web Apps creates preview URLs for each PR automatically

2. **Environment Variables**: Add via Azure Portal or CLI:
   ```bash
   az staticwebapp appsettings set \
     --name axiom-loom-catalog \
     --resource-group axiom-loom-rg \
     --setting-names KEY=value
   ```

3. **Custom 404 Page**: Add `staticwebapp.config.json`:
   ```json
   {
     "responseOverrides": {
       "404": {
         "rewrite": "/404.html"
       }
     }
   }
   ```

4. **Analytics**: Add Google Analytics or Plausible to `public/index.html`

---

**Estimated Time to Complete: 1-2 hours**
**Monthly Cost: $15-20**
**Maintenance: < 1 hour/month**
