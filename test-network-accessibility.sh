#!/bin/bash

# Axiom Loom Catalog - Comprehensive Network Accessibility Tests
# This script performs thorough testing of the deployed application
# Target: http://10.0.0.109

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://10.0.0.109"
API_BASE_URL="http://10.0.0.109:3001"
LOCALHOST_URL="http://localhost"
LOCALHOST_API="http://localhost:3001"

# Test results file
RESULTS_FILE="network-accessibility-report-$(date +%Y%m%d-%H%M%S).txt"

# Function to print colored output
print_section() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    print_test "$description"
    
    response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}|%{size_download}" "$url" 2>/dev/null)
    IFS='|' read -r status_code time_total size_download <<< "$response"
    
    if [ "$status_code" == "$expected_status" ]; then
        print_success "Status: $status_code, Time: ${time_total}s, Size: ${size_download} bytes"
        echo "PASS: $description - Status: $status_code, Time: ${time_total}s" >> "$RESULTS_FILE"
        return 0
    else
        print_error "Expected $expected_status, got $status_code"
        echo "FAIL: $description - Expected $expected_status, got $status_code" >> "$RESULTS_FILE"
        return 1
    fi
}

# Function to test API endpoint with authentication
test_api_endpoint() {
    local url=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-}
    local expected_status=${5:-200}
    
    print_test "$description"
    
    # For now, test without auth to check if auth is properly enforced
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" -H "Content-Type: application/json" -d "$data" -o /dev/null -w "%{http_code}|%{time_total}" "$url" 2>/dev/null)
    else
        response=$(curl -s -X "$method" -o /dev/null -w "%{http_code}|%{time_total}" "$url" 2>/dev/null)
    fi
    
    IFS='|' read -r status_code time_total <<< "$response"
    
    if [ "$status_code" == "$expected_status" ]; then
        print_success "Status: $status_code, Time: ${time_total}s"
        echo "PASS: $description - Status: $status_code" >> "$RESULTS_FILE"
        return 0
    else
        print_error "Expected $expected_status, got $status_code"
        echo "FAIL: $description - Expected $expected_status, got $status_code" >> "$RESULTS_FILE"
        return 1
    fi
}

# Function to test CORS
test_cors() {
    local url=$1
    local origin=$2
    local description=$3
    
    print_test "$description"
    
    headers=$(curl -s -H "Origin: $origin" -H "Access-Control-Request-Method: GET" -I "$url" 2>/dev/null)
    
    if echo "$headers" | grep -q "Access-Control-Allow-Origin"; then
        print_success "CORS headers present"
        echo "PASS: $description - CORS headers present" >> "$RESULTS_FILE"
        return 0
    else
        print_error "CORS headers missing"
        echo "FAIL: $description - CORS headers missing" >> "$RESULTS_FILE"
        return 1
    fi
}

# Function to measure response time
measure_response_time() {
    local url=$1
    local description=$2
    local max_time=${3:-2.0}
    
    print_test "$description"
    
    time_total=$(curl -s -o /dev/null -w "%{time_total}" "$url" 2>/dev/null)
    
    if (( $(echo "$time_total < $max_time" | bc -l) )); then
        print_success "Response time: ${time_total}s (threshold: ${max_time}s)"
        echo "PASS: $description - Response time: ${time_total}s" >> "$RESULTS_FILE"
        return 0
    else
        print_error "Response time: ${time_total}s exceeds threshold: ${max_time}s"
        echo "FAIL: $description - Response time: ${time_total}s exceeds threshold" >> "$RESULTS_FILE"
        return 1
    fi
}

# Function to test WebSocket connectivity
test_websocket() {
    local url=$1
    local description=$2
    
    print_test "$description"
    
    # Simple WebSocket test using curl
    response=$(curl -s -o /dev/null -w "%{http_code}" -H "Upgrade: websocket" -H "Connection: Upgrade" "$url" 2>/dev/null)
    
    if [ "$response" == "101" ] || [ "$response" == "426" ]; then
        print_success "WebSocket endpoint responding"
        echo "PASS: $description - WebSocket endpoint responding" >> "$RESULTS_FILE"
        return 0
    else
        print_error "WebSocket not responding properly"
        echo "FAIL: $description - WebSocket not responding" >> "$RESULTS_FILE"
        return 1
    fi
}

# Start testing
echo "Axiom Loom Catalog - Network Accessibility Test Report" > "$RESULTS_FILE"
echo "Test Date: $(date)" >> "$RESULTS_FILE"
echo "Target: $BASE_URL" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Section 1: Local Access Tests
print_section "1. LOCAL ACCESS TESTS"

test_endpoint "$LOCALHOST_URL" "Frontend on localhost" 200
test_endpoint "$BASE_URL" "Frontend on LAN IP" 200
test_endpoint "$BASE_URL:80" "Frontend on port 80" 200
test_endpoint "$BASE_URL:8080" "Frontend on port 8080" 200
test_endpoint "$LOCALHOST_API/api/health" "API health check on localhost" 200
test_endpoint "$API_BASE_URL/api/health" "API health check on LAN IP" 200

# Section 2: Network Connectivity Tests
print_section "2. NETWORK CONNECTIVITY TESTS"

# Test different ports
test_endpoint "$BASE_URL" "Port 80 accessibility" 200
test_endpoint "$API_BASE_URL/api/health" "Port 3001 accessibility" 200

# Test CORS
test_cors "$API_BASE_URL/api/health" "http://localhost:3000" "CORS from localhost"
test_cors "$API_BASE_URL/api/health" "$BASE_URL" "CORS from LAN IP"
test_cors "$API_BASE_URL/api/health" "https://example.com" "CORS from external origin"

# Section 3: API Endpoint Tests
print_section "3. API ENDPOINT TESTS"

# Health endpoints
test_endpoint "$BASE_URL/health" "Nginx health check" 200
test_api_endpoint "$API_BASE_URL/api/health" "Backend health check" "GET" "" 200

# Repository endpoints (should require auth)
test_api_endpoint "$API_BASE_URL/api/repositories" "List repositories (no auth)" "GET" "" 401
test_api_endpoint "$API_BASE_URL/api/repository/test-repo" "Get repository (no auth)" "GET" "" 401
test_api_endpoint "$API_BASE_URL/api/repository/test-repo/apis" "Get APIs (no auth)" "GET" "" 401

# Auth endpoints
test_api_endpoint "$API_BASE_URL/api/login" "Login endpoint" "POST" '{"username":"test","password":"test"}' 401
test_api_endpoint "$API_BASE_URL/api/register" "Register endpoint" "POST" '{"username":"test","password":"test"}' 200

# Search endpoint
test_api_endpoint "$API_BASE_URL/api/search" "Search endpoint (no auth)" "GET" "" 401

# Section 4: Performance Tests
print_section "4. PERFORMANCE TESTS"

# Page load times
measure_response_time "$BASE_URL" "Frontend page load time" 2.0
measure_response_time "$BASE_URL/static/js/main.js" "JavaScript bundle load time" 1.0
measure_response_time "$BASE_URL/static/css/main.css" "CSS bundle load time" 0.5

# API response times
measure_response_time "$API_BASE_URL/api/health" "API health check response time" 0.1

# Static asset caching test
print_test "Static asset caching"
cache_header=$(curl -s -I "$BASE_URL/static/js/main.js" 2>/dev/null | grep -i "cache-control")
if echo "$cache_header" | grep -q "public"; then
    print_success "Static assets are cached: $cache_header"
    echo "PASS: Static assets are cached" >> "$RESULTS_FILE"
else
    print_error "Static assets not properly cached"
    echo "FAIL: Static assets not properly cached" >> "$RESULTS_FILE"
fi

# Section 5: Security Tests
print_section "5. SECURITY TESTS"

# Security headers
print_test "Security headers check"
headers=$(curl -s -I "$BASE_URL" 2>/dev/null)

security_headers=(
    "X-Frame-Options"
    "X-XSS-Protection"
    "X-Content-Type-Options"
    "Referrer-Policy"
    "Permissions-Policy"
    "Content-Security-Policy"
)

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
        print_success "$header present"
        echo "PASS: $header present" >> "$RESULTS_FILE"
    else
        print_error "$header missing"
        echo "FAIL: $header missing" >> "$RESULTS_FILE"
    fi
done

# Rate limiting test
print_test "Rate limiting test"
echo "Making 10 rapid requests to test rate limiting..."
rate_limit_triggered=false
for i in {1..10}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/api/health" 2>/dev/null)
    if [ "$status" == "429" ]; then
        rate_limit_triggered=true
        break
    fi
done

if [ "$rate_limit_triggered" == true ]; then
    print_success "Rate limiting is active"
    echo "PASS: Rate limiting is active" >> "$RESULTS_FILE"
else
    print_error "Rate limiting might not be configured properly"
    echo "WARN: Rate limiting might not be configured" >> "$RESULTS_FILE"
fi

# Test authentication requirement
print_test "Authentication enforcement"
protected_endpoints=(
    "/api/repositories"
    "/api/repository/test/details"
    "/api/repository/test/file?path=README.md"
)

auth_working=true
for endpoint in "${protected_endpoints[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL$endpoint" 2>/dev/null)
    if [ "$status" != "401" ] && [ "$status" != "403" ]; then
        print_error "$endpoint not protected (status: $status)"
        echo "FAIL: $endpoint not protected" >> "$RESULTS_FILE"
        auth_working=false
    fi
done

if [ "$auth_working" == true ]; then
    print_success "All endpoints require authentication"
    echo "PASS: All endpoints require authentication" >> "$RESULTS_FILE"
fi

# WebSocket test
print_section "6. WEBSOCKET CONNECTIVITY"
test_websocket "$BASE_URL/ws" "WebSocket endpoint"

# Additional connectivity tests
print_section "7. ADDITIONAL CONNECTIVITY TESTS"

# Test from different source IPs (if possible)
print_test "Testing connectivity from different network interfaces"
interfaces=$(ip -o link show | awk -F': ' '{print $2}' | grep -v lo)
for interface in $interfaces; do
    ip=$(ip -4 addr show $interface | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
    if [ -n "$ip" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" --interface $interface "$BASE_URL" 2>/dev/null)
        if [ "$response" == "200" ]; then
            print_success "Accessible from $interface ($ip)"
            echo "PASS: Accessible from $interface ($ip)" >> "$RESULTS_FILE"
        else
            print_error "Not accessible from $interface ($ip)"
            echo "FAIL: Not accessible from $interface ($ip)" >> "$RESULTS_FILE"
        fi
    fi
done

# DNS resolution test
print_test "DNS resolution test"
if host 10.0.0.109 > /dev/null 2>&1; then
    print_success "Reverse DNS lookup successful"
    echo "PASS: Reverse DNS lookup successful" >> "$RESULTS_FILE"
else
    print_error "Reverse DNS lookup failed (this is normal for IP addresses)"
    echo "INFO: Reverse DNS lookup not available" >> "$RESULTS_FILE"
fi

# Summary
print_section "TEST SUMMARY"

total_tests=$(grep -c "PASS\|FAIL\|WARN" "$RESULTS_FILE")
passed_tests=$(grep -c "PASS" "$RESULTS_FILE")
failed_tests=$(grep -c "FAIL" "$RESULTS_FILE")
warnings=$(grep -c "WARN" "$RESULTS_FILE")

echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $failed_tests"
echo "Warnings: $warnings"

echo "" >> "$RESULTS_FILE"
echo "SUMMARY:" >> "$RESULTS_FILE"
echo "Total Tests: $total_tests" >> "$RESULTS_FILE"
echo "Passed: $passed_tests" >> "$RESULTS_FILE"
echo "Failed: $failed_tests" >> "$RESULTS_FILE"
echo "Warnings: $warnings" >> "$RESULTS_FILE"

if [ $failed_tests -eq 0 ]; then
    print_success "All tests passed!"
    echo "" >> "$RESULTS_FILE"
    echo "Result: ALL TESTS PASSED" >> "$RESULTS_FILE"
else
    print_error "Some tests failed. Check $RESULTS_FILE for details."
    echo "" >> "$RESULTS_FILE"
    echo "Result: SOME TESTS FAILED" >> "$RESULTS_FILE"
fi

echo -e "\n${GREEN}Full report saved to: $RESULTS_FILE${NC}"