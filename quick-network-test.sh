#!/bin/bash

# Quick Network Accessibility Test for Axiom Loom Catalog
# This provides a rapid health check of the deployment

TARGET_IP="10.0.0.109"
API_PORT="3001"

echo "Axiom Loom Catalog - Quick Network Test"
echo "============================================="
echo "Target: http://$TARGET_IP"
echo "Date: $(date)"
echo ""

# Function to check endpoint
check_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    # Get status code and response time
    response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" "$url" 2>/dev/null)
    IFS='|' read -r status_code time_total <<< "$response"
    
    if [ "$status_code" == "200" ] || [ "$status_code" == "401" ]; then
        echo "✓ OK (Status: $status_code, Time: ${time_total}s)"
    else
        echo "✗ FAIL (Status: $status_code)"
    fi
}

# 1. Basic Connectivity
echo "1. BASIC CONNECTIVITY"
echo "--------------------"
check_endpoint "http://$TARGET_IP" "Frontend (port 80)"
check_endpoint "http://$TARGET_IP:$API_PORT/api/health" "API Health (port $API_PORT)"
check_endpoint "http://$TARGET_IP/health" "Nginx Health"

echo ""

# 2. API Endpoints
echo "2. API ENDPOINTS"
echo "----------------"
check_endpoint "http://$TARGET_IP:$API_PORT/api/repositories" "Repositories (auth required)"
check_endpoint "http://$TARGET_IP:$API_PORT/api/login" "Login endpoint"
check_endpoint "http://$TARGET_IP:$API_PORT/api/register" "Register endpoint"

echo ""

# 3. CORS Check
echo "3. CORS CHECK"
echo "-------------"
echo -n "Testing CORS headers... "
cors_headers=$(curl -s -H "Origin: http://localhost:3000" -I "http://$TARGET_IP:$API_PORT/api/health" 2>/dev/null | grep -i "access-control-allow-origin")
if [ -n "$cors_headers" ]; then
    echo "✓ CORS enabled"
else
    echo "✗ CORS headers missing"
fi

echo ""

# 4. Security Headers
echo "4. SECURITY HEADERS"
echo "------------------"
headers=$(curl -s -I "http://$TARGET_IP" 2>/dev/null)

security_headers=("X-Frame-Options" "X-XSS-Protection" "X-Content-Type-Options" "Content-Security-Policy")
for header in "${security_headers[@]}"; do
    echo -n "Checking $header... "
    if echo "$headers" | grep -qi "$header"; then
        echo "✓ Present"
    else
        echo "✗ Missing"
    fi
done

echo ""

# 5. Port Scan
echo "5. PORT ACCESSIBILITY"
echo "--------------------"
for port in 80 443 3001 8080; do
    echo -n "Port $port: "
    if nc -z -w2 $TARGET_IP $port 2>/dev/null; then
        echo "✓ Open"
    else
        echo "✗ Closed"
    fi
done

echo ""

# 6. Response Time Test
echo "6. PERFORMANCE CHECK"
echo "-------------------"
total_time=0
count=5
echo "Testing average response time (${count} requests)..."

for i in $(seq 1 $count); do
    time=$(curl -s -o /dev/null -w "%{time_total}" "http://$TARGET_IP" 2>/dev/null)
    total_time=$(echo "$total_time + $time" | bc)
done

avg_time=$(echo "scale=3; $total_time / $count" | bc)
echo "Average response time: ${avg_time}s"

if (( $(echo "$avg_time < 1.0" | bc -l) )); then
    echo "✓ Performance: Good"
elif (( $(echo "$avg_time < 2.0" | bc -l) )); then
    echo "⚠ Performance: Acceptable"
else
    echo "✗ Performance: Poor"
fi

echo ""
echo "Quick test completed!"