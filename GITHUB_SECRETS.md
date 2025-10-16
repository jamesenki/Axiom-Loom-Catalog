# GitHub Secrets Configuration

This document describes the GitHub secrets required for automated deployment via GitHub Actions.

## Required Secrets

### AZURE_CREDENTIALS

**Purpose**: Authentication credentials for Azure CLI in GitHub Actions

**How to Create**:

1. Create an Azure Service Principal:
   ```bash
   az ad sp create-for-rbac \
     --name "github-actions-axiom-loom" \
     --role contributor \
     --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/axiom-loom-rg \
     --sdk-auth
   ```

2. Copy the JSON output (it will look like this):
   ```json
   {
     "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
     "resourceManagerEndpointUrl": "https://management.azure.com/",
     "activeDirectoryGraphResourceId": "https://graph.windows.net/",
     "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
     "galleryEndpointUrl": "https://gallery.azure.com/",
     "managementEndpointUrl": "https://management.core.windows.net/"
   }
   ```

3. Add to GitHub Secrets:
   - Go to: https://github.com/jamesenki/eyns-ai-experience-center/settings/secrets/actions
   - Click "New repository secret"
   - Name: `AZURE_CREDENTIALS`
   - Value: Paste the entire JSON output
   - Click "Add secret"

### Alternative Method (Manual Setup)

If you already have a service principal:

```bash
# Get subscription ID
az account show --query id --output tsv

# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-axiom-loom" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/axiom-loom-rg \
  --sdk-auth
```

## Verifying Secrets

To verify your secrets are configured correctly:

1. Go to: https://github.com/jamesenki/eyns-ai-experience-center/settings/secrets/actions
2. You should see: `AZURE_CREDENTIALS` (added on date)

## Testing the Workflow

Once secrets are configured, test the deployment:

1. **Manual Trigger** (Recommended for first deployment):
   - Go to: https://github.com/jamesenki/eyns-ai-experience-center/actions/workflows/deploy-backend.yml
   - Click "Run workflow"
   - Select branch: `main`
   - Click "Run workflow"

2. **Automatic Trigger** (After manual test succeeds):
   - Push changes to any backend file:
     - `src/server.js`
     - `src/api/**`
     - `src/services/**`
     - `Dockerfile.backend`
     - `scripts/clone-repositories.sh`
     - `repository-metadata.json`

## Monitoring Deployment

Watch the deployment progress:

1. Go to: https://github.com/jamesenki/eyns-ai-experience-center/actions
2. Click on the running workflow
3. Click on the "Deploy Backend to Azure" job
4. Expand each step to see detailed output

## Expected Workflow Output

The workflow will:

1. ✅ Create resource group (if needed)
2. ✅ Create Azure Container Registry (if needed)
3. ✅ Build and push Docker image
4. ✅ Deploy to Azure Container Instance
5. ✅ Wait for container to become healthy (up to 3 minutes)
6. ✅ Test health endpoint
7. ✅ Display deployment summary with backend URL

## Troubleshooting

### Error: "No subscription found"

**Fix**: Your `AZURE_CREDENTIALS` secret is missing or invalid. Re-create the service principal and update the secret.

### Error: "Resource group not found"

**Fix**: The workflow creates the resource group automatically. Check that the service principal has `contributor` role.

### Error: "Container failed to become healthy"

**Check**:
1. View container logs in GitHub Actions output
2. Common issues:
   - Git clone failures (check repository visibility)
   - Out of memory (increase to 2GB in workflow)
   - Port conflicts (should be 3001)

### Manual Verification

After deployment completes, verify manually:

```bash
# Get backend URL from workflow output, then:
curl http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-16T...","repositories":19}
```

## Security Notes

1. **Never commit AZURE_CREDENTIALS to the repository**
2. Service principal should have minimal permissions (contributor on resource group only)
3. Rotate service principal credentials periodically
4. Use GitHub environment protection rules for production deployments

## Cost Management

- Resource group: axiom-loom-rg
- Container Registry: axiomloomacr (~$5/month)
- Container Instance: catalog-backend (~$35/month)
- **Total**: ~$40/month

To delete all resources:
```bash
az group delete --name axiom-loom-rg --yes
```

---

**Last Updated**: October 2025
**Maintained By**: Axiom Loom Team
