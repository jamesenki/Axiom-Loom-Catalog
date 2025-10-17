#!/bin/bash

# Azure Front Door Deployment Script
# Configures HTTPS proxy for both frontend and backend

set -e

echo "=== Azure Front Door Deployment ==="
echo ""

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
FRONTDOOR_NAME="axiom-catalog-fd"
LOCATION="global"
FRONTEND_ORIGIN="technical.axiomloom-loom.net"
BACKEND_ORIGIN="axiom-catalog-api.eastus.azurecontainer.io"
CUSTOM_DOMAIN="technical.axiomloom-loom.net"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Verifying Azure CLI authentication...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${RED}❌ Not logged into Azure CLI${NC}"
    echo "Please run: az login"
    exit 1
fi
echo -e "${GREEN}✓ Azure CLI authenticated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Checking if Front Door profile exists...${NC}"
if az afd profile show --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Front Door profile already exists: $FRONTDOOR_NAME${NC}"
    echo "Updating existing profile..."
else
    echo "Creating Front Door profile..."
    az afd profile create \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --sku Standard_AzureFrontDoor
    echo -e "${GREEN}✓ Front Door profile created${NC}"
fi
echo ""

echo -e "${YELLOW}Step 3: Creating Front Door endpoint...${NC}"
ENDPOINT_NAME="${FRONTDOOR_NAME}-endpoint"
if az afd endpoint show --endpoint-name "$ENDPOINT_NAME" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Endpoint already exists: $ENDPOINT_NAME${NC}"
else
    az afd endpoint create \
        --endpoint-name "$ENDPOINT_NAME" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --enabled-state Enabled
    echo -e "${GREEN}✓ Endpoint created${NC}"
fi
echo ""

echo -e "${YELLOW}Step 4: Creating origin groups...${NC}"

# Frontend Origin Group
echo "Creating frontend origin group..."
if az afd origin-group show --origin-group-name "frontend-origins" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Frontend origin group already exists${NC}"
else
    az afd origin-group create \
        --origin-group-name "frontend-origins" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --probe-request-type GET \
        --probe-protocol Https \
        --probe-interval-in-seconds 30 \
        --probe-path "/" \
        --sample-size 4 \
        --successful-samples-required 3 \
        --additional-latency-in-milliseconds 50
    echo -e "${GREEN}✓ Frontend origin group created${NC}"
fi

# Backend Origin Group
echo "Creating backend origin group..."
if az afd origin-group show --origin-group-name "backend-origins" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Backend origin group already exists${NC}"
else
    az afd origin-group create \
        --origin-group-name "backend-origins" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --probe-request-type GET \
        --probe-protocol Http \
        --probe-interval-in-seconds 30 \
        --probe-path "/api/health" \
        --sample-size 4 \
        --successful-samples-required 3 \
        --additional-latency-in-milliseconds 50
    echo -e "${GREEN}✓ Backend origin group created${NC}"
fi
echo ""

echo -e "${YELLOW}Step 5: Adding origins...${NC}"

# Add frontend origin
echo "Adding frontend origin..."
if az afd origin show --origin-name "frontend-origin" --origin-group-name "frontend-origins" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Frontend origin already exists${NC}"
else
    az afd origin create \
        --origin-name "frontend-origin" \
        --origin-group-name "frontend-origins" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --host-name "$FRONTEND_ORIGIN" \
        --origin-host-header "$FRONTEND_ORIGIN" \
        --priority 1 \
        --weight 1000 \
        --enabled-state Enabled \
        --http-port 80 \
        --https-port 443
    echo -e "${GREEN}✓ Frontend origin added${NC}"
fi

# Add backend origin
echo "Adding backend origin..."
if az afd origin show --origin-name "backend-origin" --origin-group-name "backend-origins" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Backend origin already exists${NC}"
else
    az afd origin create \
        --origin-name "backend-origin" \
        --origin-group-name "backend-origins" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --host-name "$BACKEND_ORIGIN" \
        --origin-host-header "$BACKEND_ORIGIN" \
        --priority 1 \
        --weight 1000 \
        --enabled-state Enabled \
        --http-port 3001 \
        --https-port 443
    echo -e "${GREEN}✓ Backend origin added${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Creating routes...${NC}"

# Frontend route (default)
echo "Creating frontend route..."
if az afd route show --route-name "frontend-route" --endpoint-name "$ENDPOINT_NAME" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Frontend route already exists${NC}"
else
    az afd route create \
        --route-name "frontend-route" \
        --endpoint-name "$ENDPOINT_NAME" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --origin-group "frontend-origins" \
        --supported-protocols Https \
        --link-to-default-domain Enabled \
        --https-redirect Enabled \
        --forwarding-protocol HttpsOnly \
        --patterns-to-match "/*"
    echo -e "${GREEN}✓ Frontend route created${NC}"
fi

# Backend API route
echo "Creating backend API route..."
if az afd route show --route-name "backend-api-route" --endpoint-name "$ENDPOINT_NAME" --profile-name "$FRONTDOOR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Backend API route already exists${NC}"
else
    az afd route create \
        --route-name "backend-api-route" \
        --endpoint-name "$ENDPOINT_NAME" \
        --profile-name "$FRONTDOOR_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --origin-group "backend-origins" \
        --supported-protocols Https \
        --link-to-default-domain Enabled \
        --https-redirect Enabled \
        --forwarding-protocol HttpOnly \
        --patterns-to-match "/api/*"
    echo -e "${GREEN}✓ Backend API route created${NC}"
fi
echo ""

echo -e "${YELLOW}Step 7: Getting Front Door endpoint URL...${NC}"
ENDPOINT_HOSTNAME=$(az afd endpoint show \
    --endpoint-name "$ENDPOINT_NAME" \
    --profile-name "$FRONTDOOR_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "hostName" -o tsv)

echo -e "${GREEN}✓ Front Door endpoint: https://$ENDPOINT_HOSTNAME${NC}"
echo ""

echo "======================================"
echo -e "${GREEN}🎉 Front Door Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "Front Door Endpoint: https://$ENDPOINT_HOSTNAME"
echo ""
echo "Routes configured:"
echo "  • https://$ENDPOINT_HOSTNAME/*        → Frontend (Azure Static Web Apps)"
echo "  • https://$ENDPOINT_HOSTNAME/api/*   → Backend (Container Instance)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Add custom domain (optional):"
echo "   az afd custom-domain create \\"
echo "     --custom-domain-name axiom-catalog-custom \\"
echo "     --profile-name $FRONTDOOR_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --host-name $CUSTOM_DOMAIN"
echo ""
echo "2. Update frontend .env.production:"
echo "   REACT_APP_API_URL=https://$ENDPOINT_HOSTNAME"
echo ""
echo "3. Rebuild and redeploy frontend:"
echo "   git add .env.production"
echo "   git commit -m \"fix: Update API URL to use Front Door HTTPS endpoint\""
echo "   git push"
echo ""
echo "4. Test the deployment:"
echo "   curl https://$ENDPOINT_HOSTNAME/api/health"
echo "   curl https://$ENDPOINT_HOSTNAME/api/repositories"
echo ""
echo "5. Access your catalog:"
echo "   https://$ENDPOINT_HOSTNAME/catalog"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View Front Door: az afd profile show --profile-name $FRONTDOOR_NAME --resource-group $RESOURCE_GROUP"
echo "  View endpoints: az afd endpoint list --profile-name $FRONTDOOR_NAME --resource-group $RESOURCE_GROUP"
echo "  View routes: az afd route list --endpoint-name $ENDPOINT_NAME --profile-name $FRONTDOOR_NAME --resource-group $RESOURCE_GROUP"
echo "  Delete Front Door: az afd profile delete --profile-name $FRONTDOOR_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "======================================"
