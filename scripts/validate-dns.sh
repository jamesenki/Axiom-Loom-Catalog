#!/bin/bash

# DNS Validation Script for dying-poets.com

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Validating DNS Configuration for dying-poets.com"
echo ""

# Check catalog subdomain
echo -n "Checking catalog.dying-poets.com... "
if nslookup catalog.dying-poets.com > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Configured${NC}"
    nslookup catalog.dying-poets.com | grep -A 2 "Non-authoritative"
else
    echo -e "${RED}✗ Not configured${NC}"
    echo "  Add CNAME: catalog → <your-static-app>.azurestaticapps.net"
fi
echo ""

# Check API subdomain
echo -n "Checking api.dying-poets.com... "
if nslookup api.dying-poets.com > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Configured${NC}"
    nslookup api.dying-poets.com | grep -A 2 "Non-authoritative"
else
    echo -e "${YELLOW}⚠ Not configured (optional)${NC}"
    echo "  You can use Azure-provided URL instead"
fi
echo ""

# Test HTTPS
echo "Testing HTTPS endpoints..."
if command -v curl &> /dev/null; then
    echo -n "  Frontend: "
    if curl -s -o /dev/null -w "%{http_code}" https://catalog.dying-poets.com | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ Accessible${NC}"
    else
        echo -e "${YELLOW}⚠ Not ready (may take time for DNS to propagate)${NC}"
    fi
fi

echo ""
echo "DNS propagation can take 5-60 minutes."
echo "Check status at: https://dnschecker.org"
