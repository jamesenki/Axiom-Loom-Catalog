#!/bin/bash

# Deploy backend API only (skips Static Web App due to GitHub connectivity issues)

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
CONTAINER_NAME="catalog-api"
DNS_LABEL="dying-poets-api"

CREDENTIALS_FILE="azure-deployment-credentials.txt"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Backend API Deployment (Continued)${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Initialize credentials file
echo "# Azure Deployment Credentials - $(date)" > "$CREDENTIALS_FILE"
echo "# IMPORTANT: Add these to GitHub Secrets" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"

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

# Create container instance
az container create \
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
  --location "$LOCATION"

FQDN=$(az container show --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME" --query ipAddress.fqdn -o tsv)

echo -e "${GREEN}✓${NC} Container instance created"
echo -e "${BLUE}API URL:${NC} https://${FQDN}:3001"
echo ""

# Step 6: Create Service Principal
echo -e "${GREEN}➜${NC} Step 6/6: Creating service principal for GitHub Actions..."

SUBSCRIPTION_ID=$(az account show --query id -o tsv)

SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "github-actions-dying-poets" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

echo -e "${GREEN}✓${NC} Service principal created"
echo ""

# Save credentials
echo "# AZURE_CREDENTIALS (GitHub Secret)" >> "$CREDENTIALS_FILE"
echo "$SP_OUTPUT" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"
echo "# API URL" >> "$CREDENTIALS_FILE"
echo "REACT_APP_API_URL=https://${FQDN}:3001" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"

echo -e "${GREEN}✓✓✓ Backend deployment completed! ✓✓✓${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Create Static Web App manually in Azure Portal"
echo "2. Get deployment token: az staticwebapp secrets list --name axiom-loom-catalog"
echo "3. Add secrets to GitHub:"
echo "   - AZURE_CREDENTIALS (from $CREDENTIALS_FILE)"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN (from Azure Portal)"
echo "4. Push code to trigger GitHub Actions deployment"
echo ""
echo -e "${YELLOW}Credentials saved to: $CREDENTIALS_FILE${NC}"

