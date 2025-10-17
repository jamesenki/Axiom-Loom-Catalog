#!/bin/bash
# Enable HTTPS for Backend API using Azure Application Gateway

set -e

echo "=== Enable HTTPS for Axiom Loom Catalog Backend ==="
echo ""
echo "PROBLEM: Mixed Content Security - Frontend is HTTPS, Backend is HTTP"
echo "SOLUTION: Deploy Azure Application Gateway with SSL/TLS termination"
echo ""

# Configuration
RESOURCE_GROUP="axiom-loom-rg"
LOCATION="eastus"
APPGW_NAME="axiom-catalog-appgw"
PUBLIC_IP_NAME="axiom-catalog-pip"
VNET_NAME="axiom-catalog-vnet"
SUBNET_NAME="appgw-subnet"
BACKEND_POOL_NAME="catalog-backend-pool"
BACKEND_FQDN="axiom-catalog-api.eastus.azurecontainer.io"
BACKEND_PORT=3001

echo "Step 1: Create Public IP for Application Gateway..."
az network public-ip create \
    --resource-group $RESOURCE_GROUP \
    --name $PUBLIC_IP_NAME \
    --sku Standard \
    --allocation-method Static \
    --dns-name axiom-catalog-gateway

PUBLIC_IP=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP \
    --name $PUBLIC_IP_NAME \
    --query ipAddress \
    --output tsv)

echo "✅ Public IP created: $PUBLIC_IP"
echo ""

echo "Step 2: Create Virtual Network..."
az network vnet create \
    --resource-group $RESOURCE_GROUP \
    --name $VNET_NAME \
    --address-prefix 10.0.0.0/16 \
    --subnet-name $SUBNET_NAME \
    --subnet-prefix 10.0.0.0/24

echo "✅ Virtual Network created"
echo ""

echo "Step 3: Create Application Gateway with HTTP to HTTP (temporary)..."
az network application-gateway create \
    --resource-group $RESOURCE_GROUP \
    --name $APPGW_NAME \
    --location $LOCATION \
    --capacity 1 \
    --sku Standard_v2 \
    --public-ip-address $PUBLIC_IP_NAME \
    --vnet-name $VNET_NAME \
    --subnet $SUBNET_NAME \
    --http-settings-port $BACKEND_PORT \
    --http-settings-protocol Http \
    --frontend-port 443 \
    --servers $BACKEND_FQDN

echo "✅ Application Gateway created"
echo ""

echo "======================================"
echo "Next Steps - SSL Certificate Required:"
echo "======================================"
echo ""
echo "1. Generate or obtain SSL certificate for: api.technical.axiomloom-loom.net"
echo "   Option A: Use Let's Encrypt"
echo "   Option B: Use Azure Key Vault certificate"
echo ""
echo "2. Upload certificate to Application Gateway:"
echo "   az network application-gateway ssl-cert create \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --gateway-name $APPGW_NAME \\"
echo "     --name ssl-cert \\"
echo "     --cert-file /path/to/certificate.pfx \\"
echo "     --cert-password <password>"
echo ""
echo "3. Update frontend HTTPS listener:"
echo "   az network application-gateway frontend-port create \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --gateway-name $APPGW_NAME \\"
echo "     --name https-port \\"
echo "     --port 443"
echo ""
echo "4. Update DNS to point to Application Gateway:"
echo "   api.technical.axiomloom-loom.net -> $PUBLIC_IP"
echo ""
echo "5. Update frontend .env.production:"
echo "   REACT_APP_API_URL=https://api.technical.axiomloom-loom.net"
echo ""
echo "======================================"
echo "Application Gateway IP: $PUBLIC_IP"
echo "======================================"

