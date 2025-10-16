#!/bin/bash

# Axiom Loom Catalog - Automated Azure Deployment Script
# This script creates all Azure resources needed for dying-poets.com

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
LOCATION="eastus"
REGISTRY_NAME="dyingpoetsregistry"
STATIC_WEB_APP_NAME="axiom-loom-catalog"
STATIC_WEB_APP_LOCATION="eastus2"
CONTAINER_NAME="catalog-api"
DNS_LABEL="dying-poets-api"
GITHUB_REPO="https://github.com/jamesenki/eyns-ai-experience-center"

# Output file for credentials
CREDENTIALS_FILE="azure-deployment-credentials.txt"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Axiom Loom Azure Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${GREEN}➜${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not found. Install with: brew install azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    print_error "Not logged into Azure. Run: az login"
    exit 1
fi

print_success "Prerequisites check passed"
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
print_step "Step 1/6: Creating resource group '$RESOURCE_GROUP'..."
if az group create --name "$RESOURCE_GROUP" --location "$LOCATION" -o none; then
    print_success "Resource group created"
else
    print_warning "Resource group may already exist (this is OK)"
fi
echo ""

# Step 2: Create Container Registry
print_step "Step 2/6: Creating Azure Container Registry '$REGISTRY_NAME'..."
if ! az acr show --name "$REGISTRY_NAME" &> /dev/null; then
    az acr create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$REGISTRY_NAME" \
        --sku Basic \
        --admin-enabled true \
        -o none
    print_success "Container registry created"
else
    print_warning "Container registry already exists (this is OK)"
    az acr update --name "$REGISTRY_NAME" --admin-enabled true -o none
fi

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$REGISTRY_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$REGISTRY_NAME" --query passwords[0].value -o tsv)

echo "" >> "$CREDENTIALS_FILE"
echo "## Container Registry Credentials" >> "$CREDENTIALS_FILE"
echo "ACR_USERNAME=$ACR_USERNAME" >> "$CREDENTIALS_FILE"
echo "ACR_PASSWORD=$ACR_PASSWORD" >> "$CREDENTIALS_FILE"
echo ""

# Step 3: Create Azure Static Web App
print_step "Step 3/6: Creating Azure Static Web App '$STATIC_WEB_APP_NAME'..."
print_warning "This will open a browser for GitHub authentication..."
sleep 2

if ! az staticwebapp show --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    az staticwebapp create \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --source "$GITHUB_REPO" \
        --location "$STATIC_WEB_APP_LOCATION" \
        --branch main \
        --app-location "/" \
        --output-location "build" \
        --login-with-github

    print_success "Static Web App created"
else
    print_warning "Static Web App already exists (this is OK)"
fi

# Get Static Web App details
STATIC_WEB_APP_HOSTNAME=$(az staticwebapp show \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "defaultHostname" -o tsv)

STATIC_WEB_APP_TOKEN=$(az staticwebapp secrets list \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.apiKey" -o tsv)

echo "" >> "$CREDENTIALS_FILE"
echo "## Static Web App Details" >> "$CREDENTIALS_FILE"
echo "DEFAULT_HOSTNAME=$STATIC_WEB_APP_HOSTNAME" >> "$CREDENTIALS_FILE"
echo "" >> "$CREDENTIALS_FILE"
echo "## GitHub Secret: AZURE_STATIC_WEB_APPS_API_TOKEN" >> "$CREDENTIALS_FILE"
echo "$STATIC_WEB_APP_TOKEN" >> "$CREDENTIALS_FILE"
echo ""

print_success "Static Web App URL: https://$STATIC_WEB_APP_HOSTNAME"
echo ""

# Step 4: Add Custom Domain to Static Web App
print_step "Step 4/6: Configuring custom domain..."
print_warning "You need to add DNS CNAME record in Squarespace:"
echo -e "   ${BLUE}Host:${NC} catalog"
echo -e "   ${BLUE}Type:${NC} CNAME"
echo -e "   ${BLUE}Data:${NC} $STATIC_WEB_APP_HOSTNAME"
echo ""

read -p "Have you added the DNS record? Skip for now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if az staticwebapp hostname set \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --hostname "catalog.dying-poets.com" &> /dev/null; then
        print_success "Custom domain configured"
    else
        print_warning "Custom domain already configured or DNS not ready"
    fi
else
    print_warning "Skipping custom domain setup (you can do this later)"
fi
echo ""

# Step 5: Build and Deploy Backend Container
print_step "Step 5/6: Building backend Docker image..."
print_warning "This will take 3-5 minutes..."

az acr build \
    --registry "$REGISTRY_NAME" \
    --image catalog-backend:latest \
    --file Dockerfile \
    . \
    -o table

print_success "Docker image built and pushed to registry"
echo ""

# Step 6: Deploy Container to Azure Container Instances
print_step "Step 6/6: Deploying backend to Azure Container Instances..."

az container create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$CONTAINER_NAME" \
    --image "$REGISTRY_NAME.azurecr.io/catalog-backend:latest" \
    --registry-login-server "$REGISTRY_NAME.azurecr.io" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --dns-name-label "$DNS_LABEL" \
    --ports 3001 \
    --cpu 1 \
    --memory 2 \
    --environment-variables \
        SERVER_PORT=3001 \
        BYPASS_AUTH=true \
        NODE_ENV=production \
    --location "$LOCATION" \
    -o table

# Get container FQDN
CONTAINER_FQDN=$(az container show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$CONTAINER_NAME" \
    --query ipAddress.fqdn -o tsv)

print_success "Backend deployed at: https://$CONTAINER_FQDN:3001"
echo ""

# Save backend URL to credentials file
echo "" >> "$CREDENTIALS_FILE"
echo "## Backend API URL" >> "$CREDENTIALS_FILE"
echo "BACKEND_API_URL=https://$CONTAINER_FQDN:3001" >> "$CREDENTIALS_FILE"
echo ""

# Create Service Principal for GitHub Actions
print_step "Creating Service Principal for GitHub Actions..."
SP_NAME="github-actions-dying-poets"

# Check if SP already exists
if az ad sp list --display-name "$SP_NAME" --query "[0].appId" -o tsv &> /dev/null; then
    print_warning "Service Principal already exists. Deleting old one..."
    OLD_APP_ID=$(az ad sp list --display-name "$SP_NAME" --query "[0].appId" -o tsv)
    az ad sp delete --id "$OLD_APP_ID" || true
fi

# Create new service principal
AZURE_CREDENTIALS=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role contributor \
    --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
    --sdk-auth)

echo "" >> "$CREDENTIALS_FILE"
echo "## GitHub Secret: AZURE_CREDENTIALS" >> "$CREDENTIALS_FILE"
echo "$AZURE_CREDENTIALS" >> "$CREDENTIALS_FILE"
echo ""

print_success "Service Principal created"
echo ""

# Summary
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Add GitHub Secrets (see $CREDENTIALS_FILE):"
echo "   • AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   • AZURE_CREDENTIALS"
echo ""
echo "2. Add DNS Records in Squarespace:"
echo "   • catalog → $STATIC_WEB_APP_HOSTNAME"
echo "   • api → $CONTAINER_FQDN"
echo ""
echo "3. Test your deployments:"
echo "   • Frontend: https://$STATIC_WEB_APP_HOSTNAME"
echo "   • Backend: https://$CONTAINER_FQDN:3001/api/repositories"
echo ""
echo "4. Push to GitHub to trigger CI/CD:"
echo "   git push origin main"
echo ""
echo -e "${YELLOW}Credentials saved to: $CREDENTIALS_FILE${NC}"
echo -e "${RED}IMPORTANT: Do NOT commit this file to Git!${NC}"
echo ""
