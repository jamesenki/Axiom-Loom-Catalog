#!/bin/bash
# Deploy Axiom Loom Catalog Backend to Azure Container Instance

set -e

echo "=== Axiom Loom Catalog Backend Deployment ==="
echo ""

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
LOCATION="eastus"
ACR_NAME="axiomlooma"
CONTAINER_NAME="catalog-backend"
IMAGE_NAME="axiom-loom-catalog-backend"
DNS_NAME="axiom-catalog-api"

# Check if logged in to Azure
if ! az account show &>/dev/null; then
    echo "Error: Not logged in to Azure. Run 'az login' first."
    exit 1
fi

echo "✓ Azure CLI authenticated"
echo ""

# Step 1: Create Resource Group (if it doesn't exist)
echo "Step 1: Ensuring resource group exists..."
if ! az group show --name $RESOURCE_GROUP &>/dev/null; then
    az group create --name $RESOURCE_GROUP --location $LOCATION
    echo "✅ Created resource group: $RESOURCE_GROUP"
else
    echo "✓ Resource group already exists: $RESOURCE_GROUP"
fi
echo ""

# Step 2: Create Azure Container Registry (if it doesn't exist)
echo "Step 2: Ensuring Azure Container Registry exists..."
if ! az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    az acr create --resource-group $RESOURCE_GROUP \
        --name $ACR_NAME \
        --sku Basic \
        --admin-enabled true
    echo "✅ Created ACR: $ACR_NAME"
else
    echo "✓ ACR already exists: $ACR_NAME"
fi
echo ""

# Step 3: Build and push Docker image
echo "Step 3: Building and pushing Docker image..."
az acr build --registry $ACR_NAME \
    --image $IMAGE_NAME:latest \
    --file Dockerfile.backend \
    .
echo "✅ Image built and pushed: $IMAGE_NAME:latest"
echo ""

# Step 4: Get ACR credentials
echo "Step 4: Getting ACR credentials..."
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)
echo "✓ ACR credentials retrieved"
echo ""

# Step 5: Deploy container to Azure Container Instance
echo "Step 5: Deploying to Azure Container Instance..."
az container create \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_NAME \
    --image $ACR_LOGIN_SERVER/$IMAGE_NAME:latest \
    --os-type Linux \
    --cpu 1 \
    --memory 1.5 \
    --registry-login-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label $DNS_NAME \
    --ports 3001 \
    --environment-variables \
        NODE_ENV=production \
        PORT=3001 \
        BYPASS_AUTH=true
        
echo "✅ Container deployed: $CONTAINER_NAME"
echo ""

# Step 6: Get container URL
CONTAINER_FQDN=$(az container show \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_NAME \
    --query ipAddress.fqdn \
    --output tsv)

echo "======================================"
echo "🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "Backend API URL: http://$CONTAINER_FQDN:3001"
echo "Health Check: http://$CONTAINER_FQDN:3001/api/health"
echo ""
echo "Next steps:"
echo "1. Update frontend REACT_APP_API_URL to: http://$CONTAINER_FQDN:3001"
echo "2. Redeploy frontend with new API URL"
echo "3. Test at: https://technical.axiomloom-loom.net"
echo ""
echo "Useful commands:"
echo "  View logs: az container logs --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME"
echo "  Restart:   az container restart --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME"
echo "  Delete:    az container delete --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME"
echo "======================================"
