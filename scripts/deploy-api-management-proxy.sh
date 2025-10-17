#!/bin/bash
# Deploy Azure API Management as HTTPS Proxy for Backend
# This solves the Mixed Content security issue

set -e

echo "=== Deploy Azure API Management HTTPS Proxy ==="
echo ""
echo "Solution: API Management (Consumption Tier) as HTTPS proxy"
echo "Cost: ~$50-100/month (pay per request)"
echo "Time: 15-30 minutes"
echo ""

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
LOCATION="eastus"
APIM_NAME="axiom-catalog-apim"
BACKEND_URL="http://axiom-catalog-api.eastus.azurecontainer.io:3001"
PUBLISHER_EMAIL="admin@axiomloom.ai"
PUBLISHER_NAME="Axiom Loom"

echo "Step 1: Check if API Management already exists..."
if az apim show --name $APIM_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✅ API Management '$APIM_NAME' already exists"
else
    echo "Creating new API Management instance (this takes 10-30 minutes)..."

    az apim create \
        --resource-group $RESOURCE_GROUP \
        --name $APIM_NAME \
        --location $LOCATION \
        --publisher-email $PUBLISHER_EMAIL \
        --publisher-name "$PUBLISHER_NAME" \
        --sku-name Consumption \
        --enable-managed-identity true

    echo "✅ API Management created"
fi
echo ""

echo "Step 2: Get API Management gateway URL..."
APIM_GATEWAY_URL=$(az apim show \
    --name $APIM_NAME \
    --resource-group $RESOURCE_GROUP \
    --query 'gatewayUrl' \
    --output tsv)

echo "✅ Gateway URL: $APIM_GATEWAY_URL"
echo ""

echo "Step 3: Create Backend for Container Instance..."
az apim backend create \
    --resource-group $RESOURCE_GROUP \
    --service-name $APIM_NAME \
    --backend-id catalog-backend \
    --url $BACKEND_URL \
    --protocol http \
    --title "Axiom Catalog Backend" \
    --description "Backend container instance"

echo "✅ Backend configured"
echo ""

echo "Step 4: Create API definition..."

# Create API definition JSON
cat > /tmp/catalog-api-def.json <<EOF
{
  "openapi": "3.0.1",
  "info": {
    "title": "Axiom Loom Catalog API",
    "version": "1.0.0",
    "description": "Repository catalog and documentation API"
  },
  "servers": [
    {
      "url": "${APIM_GATEWAY_URL}/catalog"
    }
  ],
  "paths": {
    "/api/health": {
      "get": {
        "operationId": "health-check",
        "responses": {
          "200": {
            "description": "Health check response"
          }
        }
      }
    },
    "/api/repositories": {
      "get": {
        "operationId": "list-repositories",
        "responses": {
          "200": {
            "description": "List of repositories"
          }
        }
      }
    },
    "/api/repository/{id}/files": {
      "get": {
        "operationId": "get-repository-files",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Repository files"
          }
        }
      }
    },
    "/api/repository/{id}/apis": {
      "get": {
        "operationId": "get-repository-apis",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Repository APIs"
          }
        }
      }
    }
  }
}
EOF

az apim api import \
    --resource-group $RESOURCE_GROUP \
    --service-name $APIM_NAME \
    --path /catalog \
    --api-id catalog-api \
    --display-name "Axiom Catalog API" \
    --protocols https \
    --specification-format OpenApi \
    --specification-path /tmp/catalog-api-def.json \
    --service-url $BACKEND_URL

echo "✅ API imported"
echo ""

echo "Step 5: Configure CORS policy..."

# Create CORS policy
cat > /tmp/cors-policy.xml <<EOF
<policies>
    <inbound>
        <base />
        <cors allow-credentials="true">
            <allowed-origins>
                <origin>https://technical.axiomloom-loom.net</origin>
                <origin>http://localhost:3000</origin>
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
                <method>POST</method>
                <method>PUT</method>
                <method>DELETE</method>
                <method>OPTIONS</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
            <expose-headers>
                <header>X-Total-Count</header>
                <header>X-Page-Count</header>
                <header>X-Current-Page</header>
                <header>X-Rate-Limit-Remaining</header>
            </expose-headers>
        </cors>
        <set-backend-service backend-id="catalog-backend" />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
EOF

az apim api policy create \
    --resource-group $RESOURCE_GROUP \
    --service-name $APIM_NAME \
    --api-id catalog-api \
    --xml-policy /tmp/cors-policy.xml

echo "✅ CORS policy configured"
echo ""

echo "Step 6: Create wildcard operation for all API routes..."

# Add a catch-all operation for all /api/* routes
az apim api operation create \
    --resource-group $RESOURCE_GROUP \
    --service-name $APIM_NAME \
    --api-id catalog-api \
    --url-template "/*" \
    --method GET \
    --display-name "Proxy all GET requests"

az apim api operation create \
    --resource-group $RESOURCE_GROUP \
    --service-name $APIM_NAME \
    --api-id catalog-api \
    --url-template "/*" \
    --method POST \
    --display-name "Proxy all POST requests"

echo "✅ Wildcard operations created"
echo ""

echo "Step 7: Test API Management proxy..."
HEALTH_URL="${APIM_GATEWAY_URL}/catalog/api/health"
echo "Testing: $HEALTH_URL"

if curl -k -s "$HEALTH_URL" | grep -q "healthy"; then
    echo "✅ API Management proxy is working!"
else
    echo "⚠️  Waiting for API Management to be fully ready..."
    echo "   Try testing manually in a few minutes"
fi
echo ""

echo "======================================"
echo "✅ API Management HTTPS Proxy Deployed"
echo "======================================"
echo ""
echo "API Management Gateway: $APIM_GATEWAY_URL"
echo "API Endpoint: ${APIM_GATEWAY_URL}/catalog/api"
echo ""
echo "Next Steps:"
echo "-----------------------------------"
echo "1. Update frontend configuration:"
echo "   File: .env.production"
echo "   Change: REACT_APP_API_URL=${APIM_GATEWAY_URL}/catalog"
echo ""
echo "2. Redeploy frontend:"
echo "   git add .env.production"
echo "   git commit -m 'fix: Update API URL to use HTTPS via API Management'"
echo "   git push"
echo ""
echo "3. Test endpoints:"
echo "   curl ${APIM_GATEWAY_URL}/catalog/api/health"
echo "   curl ${APIM_GATEWAY_URL}/catalog/api/repositories"
echo ""
echo "4. Verify in browser:"
echo "   Open: https://technical.axiomloom-loom.net/catalog"
echo "   DevTools Console: Should show NO mixed content errors"
echo "   DevTools Network: Should show successful API calls"
echo ""
echo "Cost: Consumption tier charges per API call"
echo "      ~$1 per million calls"
echo "      Estimated: $50-100/month for typical usage"
echo ""
echo "======================================"

# Clean up temp files
rm -f /tmp/catalog-api-def.json /tmp/cors-policy.xml
