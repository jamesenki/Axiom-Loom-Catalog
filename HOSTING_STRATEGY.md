# Axiom Loom Public Hosting Strategy

## Properties to Host
1. **Axiom Loom Catalog** - React app + Node.js backend (current project)
2. **Resume** - Static site
3. **Blogs/Thought Leadership** - Static content or CMS
4. **Other Projects** - Various web applications

---

## 🏆 RECOMMENDED OPTION: Azure Static Web Apps (Hybrid)

**Total Monthly Cost: $0 - $15/month**

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Custom Domain (axiom-loom.com)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Static Web Apps (FREE TIER)              │
├─────────────────────────────────────────────────────────────┤
│  • axiom-loom.com         → Main landing page              │
│  • catalog.axiom-loom.com → Axiom Loom Catalog (Frontend)  │
│  • resume.axiom-loom.com  → Resume                          │
│  • blog.axiom-loom.com    → Thought leadership             │
│  • *.axiom-loom.com       → Other projects                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│        Azure Container Instances (Backend API Only)         │
│              catalog-api.axiom-loom.com                     │
│                                                              │
│  • Node.js Express server                                   │
│  • Serves repository data & API endpoints                  │
│  • Cost: ~$10-15/month (always-on, 0.5 vCPU, 1GB RAM)     │
└─────────────────────────────────────────────────────────────┘
```

### Cost Breakdown
| Component | Service | Monthly Cost |
|-----------|---------|--------------|
| Frontend (Catalog, Resume, Blog) | Azure Static Web Apps | **$0** (Free tier) |
| Backend API | Azure Container Instances | **$10-15** |
| Custom Domain SSL | Azure (Auto) | **$0** (Included) |
| CDN/Traffic | Azure | **$0** (100GB free/month) |
| **TOTAL** | | **$10-15/month** |

### Why This Option?
✅ **Lowest Cost** - Free static hosting, minimal backend costs
✅ **Easy Deployment** - GitHub Actions built-in, push to deploy
✅ **Zero Maintenance** - Fully managed, auto-scaling
✅ **Custom Domains** - Unlimited subdomains included
✅ **SSL Certificates** - Auto-provisioned and renewed
✅ **Global CDN** - Azure CDN included in free tier
✅ **Staging Environments** - Preview deployments for PRs

---

## Option 2: AWS Amplify + Lightsail Containers

**Total Monthly Cost: $5 - $20/month**

### Architecture
```
AWS Route 53 (Domain) → AWS Amplify (Static Apps) + Lightsail Containers (Backend)
```

### Cost Breakdown
| Component | Service | Monthly Cost |
|-----------|---------|--------------|
| Static Apps (Catalog, Resume, Blog) | AWS Amplify | **$0** (Free tier: 5GB storage, 15GB/month transfer) |
| Backend API | Lightsail Container (512MB) | **$7/month** |
| Domain/SSL | Route 53 + ACM | **$0.50** (Hosted zone) |
| **TOTAL** | | **$7.50/month** |

### Pros
✅ Lower backend cost than Azure ($7 vs $10)
✅ AWS ecosystem integration
✅ Amplify is very developer-friendly

### Cons
❌ Lightsail has limited scaling (need to manually upgrade)
❌ Route 53 hosted zone costs $0.50/month
❌ Less generous free tier than Azure Static Web Apps

---

## Option 3: All Azure Static Web Apps + Azure Functions

**Total Monthly Cost: $0 - $5/month**

### Architecture
Convert the Node.js backend to Azure Functions (serverless)

### Cost Breakdown
| Component | Service | Monthly Cost |
|-----------|---------|--------------|
| All Static Sites | Azure Static Web Apps | **$0** |
| Backend API | Azure Functions | **$0** (1M free executions/month) |
| **TOTAL** | | **$0-5/month** |

### Pros
✅ **Potentially FREE** if traffic stays under limits
✅ True serverless - scales to zero
✅ No always-on costs

### Cons
❌ Requires refactoring backend to serverless functions
❌ Cold start latency (first request may be slow)
❌ 10-minute timeout on functions (may affect large repo operations)

---

## Option 4: Single Docker Container on Lightsail

**Total Monthly Cost: $10/month**

### Architecture
Single container running both frontend and backend (monolith)

### Cost Breakdown
| Component | Service | Monthly Cost |
|-----------|---------|--------------|
| Full Stack App | AWS Lightsail Container (1GB) | **$10/month** |
| Domain | Route 53 | **$0.50/month** |
| **TOTAL** | | **$10.50/month** |

### Pros
✅ Simple architecture - one container
✅ Fixed cost, no surprises
✅ Fast - no API calls across services

### Cons
❌ No free tier
❌ Single point of failure
❌ Manual scaling required
❌ Rebuilds entire container for frontend changes

---

## Option 5: Netlify/Vercel (Static) + Azure Container Instances (Backend)

**Total Monthly Cost: $10-15/month**

### Architecture
```
Netlify/Vercel (Free) → Azure Container Instances ($10-15)
```

### Cost Breakdown
| Component | Service | Monthly Cost |
|-----------|---------|--------------|
| Static Sites | Netlify or Vercel | **$0** (Free tier) |
| Backend API | Azure Container Instances | **$10-15** |
| **TOTAL** | | **$10-15/month** |

### Pros
✅ Best-in-class static hosting (Netlify/Vercel)
✅ Excellent developer experience
✅ Instant rollbacks, preview deployments

### Cons
❌ Split across two providers (more complexity)
❌ CORS configuration required

---

## 📊 Cost Comparison Summary

| Option | Monthly Cost | Complexity | Free Tier | Best For |
|--------|--------------|------------|-----------|----------|
| **Option 1: Azure Static Web Apps** | **$10-15** | ⭐⭐ Low | ✅ Yes | **RECOMMENDED** |
| Option 2: AWS Amplify + Lightsail | $7.50 | ⭐⭐ Low | ✅ Yes | AWS preference |
| Option 3: Azure Functions (Serverless) | $0-5 | ⭐⭐⭐⭐ High | ✅ Yes | Low traffic |
| Option 4: Single Lightsail Container | $10.50 | ⭐ Very Low | ❌ No | Simplicity |
| Option 5: Netlify + Azure | $10-15 | ⭐⭐⭐ Medium | ✅ Yes | Best static hosting |

---

## 🚀 IMPLEMENTATION PLAN: Azure Static Web Apps (Recommended)

### Phase 1: Setup Azure Static Web Apps (Week 1)

#### Step 1: Create Azure Static Web App Resource
```bash
# Install Azure CLI
brew install azure-cli  # macOS

# Login
az login

# Create resource group
az group create \
  --name axiom-loom-rg \
  --location eastus

# Create static web apps (one for each property)
az staticwebapp create \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --source https://github.com/jamesenki/axiom-ai-experience-center \
  --branch main \
  --app-location "/build" \
  --api-location "" \
  --location eastus2

# Repeat for resume, blog, etc.
```

#### Step 2: Configure GitHub Actions (Auto-generated)
Azure automatically creates `.github/workflows/azure-static-web-apps-*.yml`

#### Step 3: Build Configuration
Create `staticwebapp.config.json` in project root:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://catalog-api.axiom-loom.com/api/*"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
}
```

### Phase 2: Deploy Backend to Azure Container Instances (Week 1)

#### Step 1: Create Dockerfile (Already exists)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY cloned-repositories ./cloned-repositories
EXPOSE 3001
CMD ["node", "src/server.js"]
```

#### Step 2: Build and Push to Azure Container Registry
```bash
# Create container registry
az acr create \
  --resource-group axiom-loom-rg \
  --name axiomloomregistry \
  --sku Basic

# Build and push
az acr build \
  --registry axiomloomregistry \
  --image catalog-backend:latest \
  .
```

#### Step 3: Deploy to Azure Container Instances
```bash
az container create \
  --resource-group axiom-loom-rg \
  --name catalog-api \
  --image axiomloomregistry.azurecr.io/catalog-backend:latest \
  --registry-login-server axiomloomregistry.azurecr.io \
  --registry-username $(az acr credential show --name axiomloomregistry --query username -o tsv) \
  --registry-password $(az acr credential show --name axiomloomregistry --query passwords[0].value -o tsv) \
  --dns-name-label catalog-api-axiom-loom \
  --ports 3001 \
  --cpu 0.5 \
  --memory 1 \
  --environment-variables SERVER_PORT=3001 BYPASS_AUTH=true
```

### Phase 3: Custom Domain Configuration (Week 2)

#### Step 1: Add Custom Domains
```bash
# Add custom domain to static web app
az staticwebapp hostname set \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --hostname catalog.axiom-loom.com

# Configure DNS (in your domain registrar)
# Add CNAME record: catalog.axiom-loom.com → <static-web-app-url>
```

#### Step 2: SSL Certificates (Automatic)
Azure automatically provisions and renews SSL certificates.

### Phase 4: CI/CD Configuration (Week 2)

Create `.github/workflows/deploy-catalog.yml`:
```yaml
name: Deploy Axiom Loom Catalog

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]

jobs:
  build_and_deploy_frontend:
    runs-on: ubuntu-latest
    name: Build and Deploy Frontend
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "build"

  deploy_backend:
    runs-on: ubuntu-latest
    name: Deploy Backend API
    steps:
      - uses: actions/checkout@v3

      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Build and Push to ACR
        run: |
          az acr build \
            --registry axiomloomregistry \
            --image catalog-backend:${{ github.sha }} \
            --image catalog-backend:latest \
            .

      - name: Restart Container Instance
        run: |
          az container restart \
            --resource-group axiom-loom-rg \
            --name catalog-api
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Choose hosting option (Recommendation: Option 1)
- [ ] Purchase domain name (axiom-loom.com or similar)
- [ ] Set up Azure account (if not already)
- [ ] Set up GitHub repository access tokens

### Week 1: Infrastructure Setup
- [ ] Create Azure resource group
- [ ] Deploy Azure Static Web Apps (catalog, resume, blog)
- [ ] Build Docker image for backend
- [ ] Deploy Azure Container Instances
- [ ] Test all services on Azure default domains

### Week 2: Domain & CI/CD
- [ ] Configure custom domain DNS records
- [ ] Set up SSL certificates (automatic)
- [ ] Configure GitHub Actions workflows
- [ ] Test automated deployments
- [ ] Configure monitoring and alerts

### Week 3: Testing & Optimization
- [ ] Load testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Backup procedures

---

## 🛠 Maintenance Plan

### Daily (Automated)
- Health checks via Azure Monitor
- Automatic deployments on git push
- SSL certificate renewal (Azure handles)

### Weekly
- Review Azure cost reports
- Check for security updates
- Review application logs

### Monthly
- Update npm dependencies
- Review and optimize cloud resources
- Backup configurations

### Quarterly
- Security audit
- Performance review
- Cost optimization analysis

---

## 💰 Cost Optimization Tips

1. **Use Azure Free Tier Aggressively**
   - Static Web Apps free tier covers 100GB bandwidth/month
   - Azure Functions 1M executions free/month

2. **Right-Size Backend Container**
   - Start with 0.5 vCPU, 1GB RAM ($10/month)
   - Monitor and scale only if needed

3. **Enable CDN Caching**
   - Cache static assets at edge (included free)
   - Reduces backend API calls

4. **Use Reserved Instances**
   - If scaling backend, commit to 1-year reserved = 30% savings

5. **Monitor and Alert**
   - Set spending alerts at $15/month
   - Auto-scale down during low traffic

---

## 🔄 Migration Path to Serverless (Future)

If traffic remains low, consider migrating to fully serverless:

**Phase 1**: Keep current architecture ($10-15/month)
**Phase 2**: Move API routes to Azure Functions ($0-5/month)
**Phase 3**: Use Azure Storage for static repository files ($1-2/month)

**Target**: $1-7/month total cost for low-traffic scenarios

---

## 📞 Next Steps

1. **Decision Point**: Choose hosting option (Recommend: Option 1)
2. **Domain**: Purchase domain name if not owned
3. **Azure Setup**: Create Azure account and resource group
4. **Implementation**: Follow deployment plan above

**Estimated Time to Production**: 1-2 weeks
**Estimated Monthly Cost**: $10-15/month
**Maintenance Time**: 1-2 hours/month
