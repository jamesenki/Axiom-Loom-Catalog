#!/bin/bash
# Post-Deployment Monitoring Dashboard - DevOps Agent Implementation
# Real-time monitoring with automatic rollback triggers

set -e

# Colors for dashboard
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Monitoring configuration
ERROR_THRESHOLD=1.0  # 1% error rate triggers rollback
RESPONSE_TIME_THRESHOLD=2000  # 2 seconds
MEMORY_THRESHOLD=500  # 500MB
CPU_THRESHOLD=80  # 80%

# Initialize monitoring
MONITORING_START=$(date +%s)
DEPLOYMENT_VERSION=$(git describe --always)

clear_screen() {
    printf "\033c"
}

draw_dashboard() {
    clear_screen
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║          DEPLOYMENT MONITORING DASHBOARD v2.0                ║"
    echo "║                  DevOps Agent Active                         ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║ Deployment: $DEPLOYMENT_VERSION"
    echo "║ Started: $(date -d @$MONITORING_START)"
    echo "║ Uptime: $(($(date +%s) - MONITORING_START))s"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

check_error_rate() {
    local error_count=$(curl -s http://localhost:3001/api/metrics | jq '.errors // 0')
    local total_requests=$(curl -s http://localhost:3001/api/metrics | jq '.total_requests // 1')
    local error_rate=$(echo "scale=2; $error_count * 100 / $total_requests" | bc)
    
    if (( $(echo "$error_rate > $ERROR_THRESHOLD" | bc -l) )); then
        echo -e "${RED}❌ ERROR RATE: ${error_rate}% (THRESHOLD EXCEEDED)${NC}"
        return 1
    else
        echo -e "${GREEN}✅ ERROR RATE: ${error_rate}%${NC}"
        return 0
    fi
}

check_response_time() {
    local start_time=$(date +%s%N)
    curl -s http://localhost:3000/health > /dev/null
    local end_time=$(date +%s%N)
    local response_time=$((($end_time - $start_time) / 1000000))
    
    if [ $response_time -gt $RESPONSE_TIME_THRESHOLD ]; then
        echo -e "${RED}❌ RESPONSE TIME: ${response_time}ms (TOO SLOW)${NC}"
        return 1
    else
        echo -e "${GREEN}✅ RESPONSE TIME: ${response_time}ms${NC}"
        return 0
    fi
}

check_memory_usage() {
    local memory_usage=$(docker stats --no-stream --format "table {{.MemUsage}}" | tail -n +2 | awk '{print $1}' | sed 's/MiB//' | head -1)
    
    if (( $(echo "$memory_usage > $MEMORY_THRESHOLD" | bc -l) )); then
        echo -e "${YELLOW}⚠️  MEMORY USAGE: ${memory_usage}MB (HIGH)${NC}"
        return 1
    else
        echo -e "${GREEN}✅ MEMORY USAGE: ${memory_usage}MB${NC}"
        return 0
    fi
}

check_cpu_usage() {
    local cpu_usage=$(docker stats --no-stream --format "table {{.CPUPerc}}" | tail -n +2 | sed 's/%//' | head -1)
    
    if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        echo -e "${YELLOW}⚠️  CPU USAGE: ${cpu_usage}% (HIGH)${NC}"
        return 1
    else
        echo -e "${GREEN}✅ CPU USAGE: ${cpu_usage}%${NC}"
        return 0
    fi
}

check_health_endpoints() {
    local endpoints=(
        "http://localhost:3000/health"
        "http://localhost:3000/api/health"
        "http://localhost:3001/metrics"
    )
    
    local all_healthy=true
    for endpoint in "${endpoints[@]}"; do
        if curl -f -s "$endpoint" > /dev/null; then
            echo -e "${GREEN}✅ $endpoint - HEALTHY${NC}"
        else
            echo -e "${RED}❌ $endpoint - UNHEALTHY${NC}"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        return 0
    else
        return 1
    fi
}

trigger_rollback() {
    echo ""
    echo -e "${RED}🚨 CRITICAL ISSUE DETECTED - INITIATING AUTOMATIC ROLLBACK${NC}"
    echo ""
    
    # Log the issue
    cat > "rollback-trigger-$(date +%Y%m%d-%H%M%S).log" << EOF
Automatic Rollback Triggered
Time: $(date)
Version: $DEPLOYMENT_VERSION
Reason: $1
Metrics at failure:
- Error Rate: $2
- Response Time: $3
- Memory Usage: $4
- CPU Usage: $5
EOF
    
    # Execute rollback
    ./deploy/rollback-procedure.sh
    exit 1
}

# Main monitoring loop
FAILURE_COUNT=0
MAX_FAILURES=3

while true; do
    draw_dashboard
    
    echo "📊 SYSTEM METRICS"
    echo "════════════════════════════════════════"
    
    # Track individual check results
    ERROR_RATE_OK=true
    RESPONSE_TIME_OK=true
    MEMORY_OK=true
    CPU_OK=true
    HEALTH_OK=true
    
    # Run checks
    check_error_rate || ERROR_RATE_OK=false
    check_response_time || RESPONSE_TIME_OK=false
    check_memory_usage || MEMORY_OK=false
    check_cpu_usage || CPU_OK=false
    
    echo ""
    echo "🏥 HEALTH ENDPOINTS"
    echo "════════════════════════════════════════"
    check_health_endpoints || HEALTH_OK=false
    
    # Determine overall health
    if [ "$ERROR_RATE_OK" = false ] || [ "$RESPONSE_TIME_OK" = false ] || [ "$HEALTH_OK" = false ]; then
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        echo ""
        echo -e "${YELLOW}⚠️  System issues detected (Failure $FAILURE_COUNT/$MAX_FAILURES)${NC}"
        
        if [ $FAILURE_COUNT -ge $MAX_FAILURES ]; then
            trigger_rollback "Multiple consecutive failures" \
                "$(check_error_rate 2>&1)" \
                "$(check_response_time 2>&1)" \
                "$(check_memory_usage 2>&1)" \
                "$(check_cpu_usage 2>&1)"
        fi
    else
        FAILURE_COUNT=0
        echo ""
        echo -e "${GREEN}✅ All systems operational${NC}"
    fi
    
    # Show recent logs
    echo ""
    echo "📜 RECENT LOGS"
    echo "════════════════════════════════════════"
    docker-compose logs --tail=5 --no-log-prefix 2>/dev/null | tail -5 || echo "No logs available"
    
    echo ""
    echo "Press Ctrl+C to stop monitoring"
    echo "Refreshing in 10 seconds..."
    
    sleep 10
done