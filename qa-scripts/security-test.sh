#!/bin/bash
# Security Testing Script - QA Agent Implementation
# Zero tolerance for security vulnerabilities

set -e

echo "🔒 Running security tests..."

# Check for exposed secrets
echo "🔑 Scanning for exposed secrets..."
if command -v trufflehog &> /dev/null; then
    trufflehog filesystem . --json > secrets-scan.json
    if [ -s secrets-scan.json ]; then
        echo "❌ Exposed secrets detected!"
        cat secrets-scan.json
        exit 1
    fi
else
    echo "⚠️  Trufflehog not installed, using git-secrets"
    git secrets --scan || exit 1
fi

# Dependency vulnerability scanning
echo "📦 Checking for vulnerable dependencies..."
npm audit --json > npm-audit.json
CRITICAL_VULNS=$(jq '.metadata.vulnerabilities.critical' npm-audit.json)
HIGH_VULNS=$(jq '.metadata.vulnerabilities.high' npm-audit.json)

if [ "$CRITICAL_VULNS" -gt 0 ] || [ "$HIGH_VULNS" -gt 0 ]; then
    echo "❌ Critical/High vulnerabilities found!"
    echo "  - Critical: $CRITICAL_VULNS"
    echo "  - High: $HIGH_VULNS"
    npm audit
    exit 1
fi

# Check security headers
echo "🛡️ Checking security headers..."
HEADERS=$(curl -sI http://localhost:3000)

check_header() {
    if ! echo "$HEADERS" | grep -qi "$1"; then
        echo "❌ Missing security header: $1"
        return 1
    fi
    echo "✅ Found header: $1"
    return 0
}

MISSING_HEADERS=0
check_header "X-Frame-Options" || ((MISSING_HEADERS++))
check_header "X-Content-Type-Options" || ((MISSING_HEADERS++))
check_header "Content-Security-Policy" || ((MISSING_HEADERS++))
check_header "Strict-Transport-Security" || ((MISSING_HEADERS++))
check_header "X-XSS-Protection" || ((MISSING_HEADERS++))

if [ $MISSING_HEADERS -gt 0 ]; then
    echo "❌ Missing $MISSING_HEADERS security headers!"
    exit 1
fi

# XSS vulnerability testing
echo "🛡️ Testing for XSS vulnerabilities..."
cat > xss-test-payloads.txt << 'EOF'
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg/onload=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')"></iframe>
<body onload=alert('XSS')>
<input onfocus=alert('XSS') autofocus>
<select onfocus=alert('XSS') autofocus>
<textarea onfocus=alert('XSS') autofocus>
<keygen onfocus=alert('XSS') autofocus>
<video><source onerror="alert('XSS')">
<audio src=x onerror=alert('XSS')>
<details open ontoggle=alert('XSS')>
<marquee onstart=alert('XSS')>
EOF

# Test each payload
while IFS= read -r payload; do
    ENCODED=$(printf '%s' "$payload" | jq -sRr @uri)
    RESPONSE=$(curl -s "http://localhost:3000/api/search?q=$ENCODED")
    
    if echo "$RESPONSE" | grep -F "$payload" > /dev/null; then
        echo "❌ XSS vulnerability detected with payload: $payload"
        exit 1
    fi
done < xss-test-payloads.txt

# SQL injection testing (basic)
echo "💉 Testing for SQL injection vulnerabilities..."
cat > sql-test-payloads.txt << 'EOF'
' OR '1'='1
'; DROP TABLE users; --
' UNION SELECT * FROM users --
1' AND '1'='1
admin'--
' OR 1=1--
EOF

while IFS= read -r payload; do
    ENCODED=$(printf '%s' "$payload" | jq -sRr @uri)
    RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:3000/api/search?q=$ENCODED")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    # Check for SQL errors in response
    if echo "$RESPONSE" | grep -iE "(sql|syntax|query|database)" > /dev/null; then
        echo "❌ Potential SQL injection vulnerability detected!"
        exit 1
    fi
    
    # 500 errors might indicate SQL issues
    if [ "$HTTP_CODE" = "500" ]; then
        echo "⚠️  Server error with SQL payload - potential vulnerability"
    fi
done < sql-test-payloads.txt

# Path traversal testing
echo "📁 Testing for path traversal vulnerabilities..."
cat > path-test-payloads.txt << 'EOF'
../../../etc/passwd
..\\..\\..\\windows\\system32\\config\\sam
....//....//....//etc/passwd
%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd
%252e%252e%252f%252e%252e%252fetc%252fpasswd
EOF

while IFS= read -r payload; do
    RESPONSE=$(curl -s "http://localhost:3000/api/documents/$payload")
    
    if echo "$RESPONSE" | grep -E "(root:|admin:|passwd:|shadow:)" > /dev/null; then
        echo "❌ Path traversal vulnerability detected!"
        exit 1
    fi
done < path-test-payloads.txt

# CORS testing
echo "🌐 Testing CORS configuration..."
CORS_RESPONSE=$(curl -s -H "Origin: http://evil.com" -I http://localhost:3000/api/repositories)
if echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin: \*" > /dev/null; then
    echo "⚠️  Warning: CORS allows all origins (Access-Control-Allow-Origin: *)"
fi

# Content type validation
echo "📋 Testing content type validation..."
curl -s -X POST http://localhost:3000/api/data \
    -H "Content-Type: application/json" \
    -d "not json" \
    --write-out "\n%{http_code}" > ct-test.txt

if grep "200" ct-test.txt > /dev/null; then
    echo "⚠️  API accepts malformed JSON"
fi

# Clean up test files
rm -f xss-test-payloads.txt sql-test-payloads.txt path-test-payloads.txt ct-test.txt

echo "✅ All security tests passed!"