#!/bin/bash
# Test Mixed Content Issue
# This script tests if the frontend can reach the backend

set -e

echo "=== Mixed Content Security Test ==="
echo ""

# Test 1: Backend is accessible via HTTP
echo "Test 1: Backend HTTP Accessibility"
echo "-----------------------------------"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Backend is accessible via HTTP (status: $HTTP_STATUS)"
else
    echo "❌ Backend is NOT accessible via HTTP (status: $HTTP_STATUS)"
fi
echo ""

# Test 2: Check if backend supports HTTPS
echo "Test 2: Backend HTTPS Support"
echo "-----------------------------------"
if curl -k -s -o /dev/null -w "%{http_code}" https://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health 2>/dev/null | grep -q "200"; then
    echo "✅ Backend supports HTTPS"
else
    echo "❌ Backend does NOT support HTTPS"
    echo "   This is the root cause of Mixed Content blocking"
fi
echo ""

# Test 3: Check frontend configuration
echo "Test 3: Frontend Configuration"
echo "-----------------------------------"
if [ -f ".env.production" ]; then
    API_URL=$(grep REACT_APP_API_URL .env.production | cut -d '=' -f2)
    echo "Frontend API URL: $API_URL"
    if [[ $API_URL == https://* ]]; then
        echo "✅ Frontend is configured for HTTPS"
    else
        echo "❌ Frontend is configured for HTTP"
        echo "   Mixed Content Error will occur!"
    fi
else
    echo "⚠️  .env.production not found"
fi
echo ""

# Test 4: Test CORS headers
echo "Test 4: CORS Configuration"
echo "-----------------------------------"
CORS_HEADERS=$(curl -s -I -H "Origin: https://technical.axiomloom-loom.net" http://axiom-catalog-api.eastus.azurecontainer.io:3001/api/health | grep -i "access-control")
if [ -n "$CORS_HEADERS" ]; then
    echo "✅ CORS headers present:"
    echo "$CORS_HEADERS"
else
    echo "❌ No CORS headers found"
fi
echo ""

# Summary
echo "=== SUMMARY ==="
echo "-----------------------------------"
echo "Frontend URL: https://technical.axiomloom-loom.net/catalog"
echo "Backend URL:  http://axiom-catalog-api.eastus.azurecontainer.io:3001"
echo ""
echo "Mixed Content Status:"
echo "  Frontend protocol: HTTPS ✅"
echo "  Backend protocol:  HTTP  ❌"
echo ""
echo "⚠️  MIXED CONTENT DETECTED!"
echo ""
echo "Impact: Modern browsers will BLOCK all HTTP requests from HTTPS frontend"
echo ""
echo "Solutions:"
echo "1. Enable HTTPS on backend (RECOMMENDED)"
echo "2. Use HTTPS reverse proxy"
echo "3. Test locally with HTTP frontend"
echo ""
echo "To test in browser:"
echo "1. Open https://technical.axiomloom-loom.net/catalog"
echo "2. Open DevTools (F12)"
echo "3. Check Console for 'Mixed Content' errors"
echo "4. Check Network tab - requests should show as 'blocked'"
echo ""
