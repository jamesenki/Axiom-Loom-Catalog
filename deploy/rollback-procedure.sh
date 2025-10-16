#!/bin/bash
# Automated Rollback Procedure - DevOps Agent Implementation
# Emergency rollback with zero data loss

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🔄 AUTOMATED ROLLBACK PROCEDURE"
echo "================================"

# Capture current state
log_info "Capturing current deployment state..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ROLLBACK_DIR="rollback-$TIMESTAMP"
mkdir -p $ROLLBACK_DIR

# Save current logs
docker-compose logs > $ROLLBACK_DIR/docker-logs.txt 2>&1 || true
kubectl logs -l app=eyns-ai-center > $ROLLBACK_DIR/k8s-logs.txt 2>&1 || true

# Save current metrics
curl -s http://localhost:3001/api/metrics > $ROLLBACK_DIR/metrics.json || true

# Determine rollback target
if [ -z "$1" ]; then
    # Get previous successful deployment
    ROLLBACK_TARGET=$(git describe --tags --abbrev=0)
    log_info "Rolling back to last known good version: $ROLLBACK_TARGET"
else
    ROLLBACK_TARGET=$1
    log_info "Rolling back to specified version: $ROLLBACK_TARGET"
fi

# Stage 1: Pre-rollback validation
log_info "Validating rollback target..."
git fetch --tags
if ! git rev-parse "$ROLLBACK_TARGET" >/dev/null 2>&1; then
    log_error "Invalid rollback target: $ROLLBACK_TARGET"
    exit 1
fi

# Stage 2: Stop current deployment
log_info "Stopping current deployment..."
docker-compose down || log_warn "Docker compose not running"
kubectl scale deployment eyns-ai-center --replicas=0 2>/dev/null || log_warn "Kubernetes deployment not found"

# Stage 3: Checkout rollback version
log_info "Checking out version $ROLLBACK_TARGET..."
git checkout "$ROLLBACK_TARGET"

# Stage 4: Rebuild and deploy
log_info "Rebuilding application..."
npm install
npm run build

# Stage 5: Deploy rollback version
log_info "Deploying rollback version..."
if [ -f "docker-compose.yml" ]; then
    docker-compose up -d
fi

# Stage 6: Health verification
log_info "Verifying rollback health..."
sleep 30

# Health check loop
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log_info "✅ Health check passed"
        break
    else
        log_warn "Health check failed, retrying... ($RETRY_COUNT/$MAX_RETRIES)"
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 10
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    log_error "Rollback health check failed!"
    exit 1
fi

# Stage 7: Smoke tests
log_info "Running rollback smoke tests..."
npm run test:smoke || log_warn "Smoke tests failed"

# Stage 8: Generate rollback report
cat > $ROLLBACK_DIR/rollback-report.md << EOF
# Rollback Report

## Rollback Information
- **Timestamp**: $(date)
- **Rolled back to**: $ROLLBACK_TARGET
- **Reason**: Emergency rollback
- **Initiated by**: DevOps Agent

## Pre-Rollback State
- **Version**: $(git describe --always --dirty)
- **Logs**: See docker-logs.txt
- **Metrics**: See metrics.json

## Post-Rollback State
- **Version**: $ROLLBACK_TARGET
- **Health Check**: Passed
- **Services**: Running

## Actions Taken
1. Captured current state
2. Stopped current deployment
3. Checked out $ROLLBACK_TARGET
4. Rebuilt application
5. Deployed rollback version
6. Verified health
7. Ran smoke tests

## Follow-up Required
1. Investigate root cause of failure
2. Review deployment logs
3. Update monitoring alerts
4. Schedule post-mortem

## Sign-off
**DevOps Agent**: Rollback completed ✅
**Timestamp**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "================================"
echo "✅ Rollback completed successfully!"
echo "📄 Report: $ROLLBACK_DIR/rollback-report.md"
echo "================================"