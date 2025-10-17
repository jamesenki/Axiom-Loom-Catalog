# Credential Setup Guide - dying-poets.com Azure Deployment

## 🔐 Overview

This guide explains how to securely manage credentials for your Azure deployment. All secrets are stored in **GitHub Secrets** (not in code).

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [x] Azure account created
- [x] Azure CLI installed (`brew install azure-cli`)
- [x] Logged into Azure (`az login`)
- [x] GitHub repository access (jamesenki/axiom-ai-experience-center)
- [x] Run `./scripts/deploy-to-azure.sh` (this generates all credentials)

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Run Azure Deployment Script

```bash
# This script creates all resources AND generates all credentials
./scripts/deploy-to-azure.sh
```

**Output**: Creates `azure-deployment-credentials.txt` with all secrets.

### Step 2: Add Credentials to GitHub

1. Go to: https://github.com/jamesenki/axiom-ai-experience-center/settings/secrets/actions
2. Click **New repository secret**
3. Add these two secrets from `azure-deployment-credentials.txt`:

#### Secret #1: AZURE_STATIC_WEB_APPS_API_TOKEN
- **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- **Value**: Copy from "GitHub Secret: AZURE_STATIC_WEB_APPS_API_TOKEN" section

#### Secret #2: AZURE_CREDENTIALS
- **Name**: `AZURE_CREDENTIALS`
- **Value**: Copy the entire JSON from "GitHub Secret: AZURE_CREDENTIALS" section

### Step 3: Verify Secrets

```bash
# List secrets (values are hidden for security)
gh secret list
```

**Expected output**:
```
AZURE_CREDENTIALS                    Updated 2025-10-15
AZURE_STATIC_WEB_APPS_API_TOKEN     Updated 2025-10-15
```

---

## ✅ That's It!

Your credentials are now securely stored in GitHub. The GitHub Actions workflows will automatically use them.

---

## 🔄 Manual Credential Creation (If Needed)

### Get Static Web App Token

```bash
az staticwebapp secrets list \
  --name axiom-loom-catalog \
  --resource-group axiom-loom-rg \
  --query "properties.apiKey" -o tsv
```

### Create Service Principal

```bash
az ad sp create-for-rbac \
  --name "github-actions-dying-poets" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/axiom-loom-rg \
  --sdk-auth
```

---

## 🛡️ Security Best Practices

✅ **DO**:
- Use GitHub Secrets for all credentials
- Delete `azure-deployment-credentials.txt` after adding to GitHub
- Rotate service principals every 90 days
- Use least-privilege scopes

❌ **DON'T**:
- Commit credentials to Git
- Share credentials in Slack/email
- Use admin credentials in production
- Store secrets in CI/CD logs

---

## 🔧 Troubleshooting

### GitHub Actions Can't Access Azure

**Problem**: Workflow fails with "Authentication failed"

**Solution**:
1. Verify `AZURE_CREDENTIALS` secret exists
2. Check JSON format is valid
3. Verify service principal has contributor role

### Static Web App Not Deploying

**Problem**: Frontend deployment fails

**Solution**:
1. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists
2. Check token is not expired
3. Regenerate token if needed

---

## 📞 Need Help?

1. Check `azure-deployment-credentials.txt` for credential values
2. Review `DEPLOYMENT_AUDIT.md` for complete security architecture
3. Run `./scripts/deploy-to-azure.sh` again to regenerate credentials

---

**Last Updated**: 2025-10-15
