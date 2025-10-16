#!/bin/bash

# Axiom Loom Catalog - Automated Azure Deployment Script
# This script uses a GitHub Personal Access Token to avoid device flow timeout

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
LOCATION="eastus"
REGISTRY_NAME="dyingpoetsregistry"
STATIC_WEB_APP_NAME="axiom-loom-catalog"
STATIC_WEB_APP_LOCATION="eastus2"
CONTAINER_NAME="catalog-api"
DNS_LABEL="dying-poets-api"
GITHUB_REPO="https://github.com/jamesenki/eyns-ai-experience-center"

CREDENTIALS_FILE="azure-deployment-credentials.txt"

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}ERROR: GITHUB_TOKEN environment variable not set${NC}"
    echo ""
    echo "Please create a GitHub Personal Access Token with 'repo' and 'workflow' scopes:"
    echo "  1. Visit https://github.com/settings/tokens"
    echo "  2. Generate new token (classic)"
    echo "  3. Select scopes: repo, workflow"
    echo "  4. Copy the token"
    echo ""
    echo "Then run:"
    echo "  export GITHUB_TOKEN=<your-token>"
    echo "  ./scripts/deploy-with-token.sh"
    exit 1
fi

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Axiom Loom Azure Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Check prerequisites
echo -e "${GREEN}➜${NC} Checking prerequisites..."

if ! command -v az &> /dev/null; then
    echo -e "${RED}✗${NC} Azure CLI not found. Install with: brew install azure-cli"
    exit 1
fi

if ! az account show &> /dev/null; then
    echo -e "${RED}✗${NC} Not logged into Azure. Run: az login"
    exit 1
fi

echo -e "${GREEN}✓${NC} Prerequisites check passed"
echo ""

# Show current subscription
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${BLUE}Using subscription:${NC} $SUBSCRIPTION_NAME"
echo -e "${BLUE}Subscription ID:${NC} $SUBSCRIPTION_ID"
echo ""

# Confirm before proceeding
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi
echo ""

# Initialize credentials file
echo "# Azure Deployment Credentials - $(date)" > "$CREDENTIALS_FILE"
echo "# IMPORTANT: Add these to GitHub Secrets" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"

# Step 1: Create Resource Group
echo -e "${GREEN}➜${NC} Step 1/6: Creating resource group '$RESOURCE_GROUP'..."
if az group create --name "$RESOURCE_GROUP" --location "$LOCATION" -o none; then
    echo -e "${GREEN}✓${NC} Resource group created"
else
    echo -e "${YELLOW}⚠${NC} Resource group already exists (this is OK)"
fi
echo ""

# Step 2: Create Container Registry
echo -e "${GREEN}➜${NC} Step 2/6: Creating Azure Container Registry '$REGISTRY_NAME'..."
if az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$REGISTRY_NAME" \
    --sku Basic \
    --admin-enabled true \
    --location "$LOCATION" \
    -o none 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Container registry created"
else
    echo -e "${YELLOW}⚠${NC} Container registry already exists (this is OK)"
fi
echo ""

# Step 3: Create Static Web App with GitHub Token
echo -e "${GREEN}➜${NC} Step 3/6: Creating Azure Static Web App '$STATIC_WEB_APP_NAME'..."
echo -e "${YELLOW}⚠${NC} Using GitHub Personal Access Token..."

if az staticwebapp create \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --source "$GITHUB_REPO" \
    --location "$STATIC_WEB_APP_LOCATION" \
    --branch "main" \
    --app-location "/" \
    --output-location "build" \
    --token "$GITHUB_TOKEN" \
    -o none 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Static Web App created"
else
    echo -e "${YELLOW}⚠${NC} Static Web App may already exist (this is OK)"
fi
echo ""

# Get Static Web App deployment token
echo -e "${GREEN}➜${NC} Getting Static Web App deployment token..."
SWA_TOKEN=$(az staticwebapp secrets list \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.apiKey" -o tsv)

if [ -n "$SWA_TOKEN" ]; then
    echo -e "${GREEN}✓${NC} Deployment token retrieved"
    echo "" >> "$CREDENTIALS_FILE"
    echo "# GitHub Secret: AZURE_STATIC_WEB_APPS_API_TOKEN" >> "$CREDENTIALS_FILE"
    echo "$SWA_TOKEN" >> "$CREDENTIALS_FILE"
    echo "" >> "$CREDENTIALS_FILE"
else
    echo -e "${RED}✗${NC} Failed to get deployment token"
fi
echo ""

# Step 4: Build and Push Docker Image
echo -e "${GREEN}➜${NC} Step 4/6: Building and pushing Docker image..."
cd "$(dirname "$0")/.."

# Login to ACR
az acr login --name "$REGISTRY_NAME"

# Build and push
az acr build --registry "$REGISTRY_NAME" \
    --image catalog-backend:latest \
    --file Dockerfile .

echo -e "${GREEN}✓${NC} Docker image built and pushed"
echo ""

# Step 5: Create Container Instance
echo -e "${GREEN}➜${NC} Step 5/6: Creating Azure Container Instance..."

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$REGISTRY_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$REGISTRY_NAME" --query passwords[0].value -o tsv)
ACR_LOGIN_SERVER=$(az acr show --name "$REGISTRY_NAME" --query loginServer -o tsv)

# Create or update container instance
if az container create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$CONTAINER_NAME" \
    --image "${ACR_LOGIN_SERVER}/catalog-backend:latest" \
    --cpu 1 \
    --memory 2 \
    --registry-login-server "$ACR_LOGIN_SERVER" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --dns-name-label "$DNS_LABEL" \
    --ports 3001 \
    --environment-variables NODE_ENV=production \
    --location "$LOCATION" \
    -o none 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Container instance created"
else
    echo -e "${YELLOW}⚠${NC} Container instance may already exist, updating..."
    # If it exists, restart it to pull latest image
    az container restart --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME" -o none
    echo -e "${GREEN}✓${NC} Container instance restarted"
fi

FQDN=$(az container show --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME" --query ipAddress.fqdn -o tsv)

echo -e "${BLUE}API URL:${NC} https://${FQDN}:3001"
echo ""

# Save API URL
echo "# API URL" >> "$CREDENTIALS_FILE"
echo "REACT_APP_API_URL=https://${FQDN}:3001" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"

# Step 6: Create Service Principal for GitHub Actions
echo -e "${GREEN}➜${NC} Step 6/6: Creating service principal for GitHub Actions..."

SP_NAME="github-actions-dying-poets"

# Delete existing service principal if it exists
if az ad sp list --display-name "$SP_NAME" --query [0].appId -o tsv &>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Service principal already exists, recreating..."
    SP_ID=$(az ad sp list --display-name "$SP_NAME" --query [0].appId -o tsv)
    az ad sp delete --id "$SP_ID" -o none 2>/dev/null || true
fi

# Create new service principal
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role contributor \
    --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
    --sdk-auth)

echo -e "${GREEN}✓${NC} Service principal created"
echo ""

# Save service principal credentials
echo "# GitHub Secret: AZURE_CREDENTIALS" >> "$CREDENTIALS_FILE"
echo "$SP_OUTPUT" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"

# Summary
echo -e "${GREEN}✓✓✓ Deployment completed successfully! ✓✓✓${NC}"
echo ""
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Deployment Summary${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${GREEN}✓${NC} Resource Group: $RESOURCE_GROUP"
echo -e "${GREEN}✓${NC} Container Registry: $REGISTRY_NAME"
echo -e "${GREEN}✓${NC} Static Web App: $STATIC_WEB_APP_NAME"
echo -e "${GREEN}✓${NC} Container Instance: $CONTAINER_NAME"
echo -e "${GREEN}✓${NC} API URL: https://${FQDN}:3001"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Add GitHub Secrets (from $CREDENTIALS_FILE):"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   - AZURE_CREDENTIALS"
echo ""
echo "2. Update .env.production with API URL:"
echo "   REACT_APP_API_URL=https://${FQDN}:3001"
echo ""
echo "3. Push to GitHub to trigger deployment:"
echo "   git add ."
echo "   git commit -m 'feat: Add Azure deployment configuration'"
echo "   git push origin main"
echo ""
echo -e "${YELLOW}Credentials saved to: $CREDENTIALS_FILE${NC}"
echo -e "${RED}IMPORTANT: Delete this file after adding to GitHub Secrets!${NC}"
