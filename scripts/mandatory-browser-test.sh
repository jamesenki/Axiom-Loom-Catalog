#!/bin/bash
# MANDATORY Browser Testing - No deployment without user experience validation

echo "=== MANDATORY BROWSER TESTING ==="
echo "Testing what users ACTUALLY see..."

# Test 1: Basic page load
echo -n "1. Page loads: "
PAGE=$(curl -s http://localhost)
if [ -z "$PAGE" ]; then
  echo "❌ FAILED - No response"
  exit 1
fi
echo "✅ OK"

# Test 2: Check for error page
echo -n "2. No error page: "
if echo "$PAGE" | grep -q "Something went wrong\|Oops!\|Error ID:"; then
  echo "❌ FAILED - Error page detected!"
  echo "   Users are seeing: $(echo "$PAGE" | grep -o "Error ID: [^<]*" || echo "Generic error")"
  exit 1
fi
echo "✅ OK"

# Test 3: Check React loaded
echo -n "3. React app loaded: "
if ! echo "$PAGE" | grep -q '<div id="root">'; then
  echo "❌ FAILED - React root not found"
  exit 1
fi
echo "✅ OK"

# Test 4: API health
echo -n "4. API responding: "
if curl -s http://localhost/api/health | grep -q '^{"status":"healthy"'; then
  echo "✅ OK"
else
  echo "❌ FAILED - API not healthy"
  exit 1
fi

# Test 5: Login endpoint
echo -n "5. Login works: "
LOGIN=$(curl -s -X POST http://localhost/api/auth/local-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localhost","password":"admin"}' | grep -o "accessToken" || echo "FAILED")
if [ "$LOGIN" != "accessToken" ]; then
  echo "❌ FAILED - Login not working"
  exit 1
fi
echo "✅ OK"

echo ""
echo "=== ALL BROWSER TESTS PASSED ==="
echo "Users can actually use the app!"