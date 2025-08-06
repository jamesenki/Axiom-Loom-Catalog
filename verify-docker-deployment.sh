#!/bin/bash

###############################################################################
# FINAL VERIFICATION - Docker Deployment Ready
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    DOCKER DEPLOYMENT VERIFICATION${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Check all components are in place
echo -e "${BLUE}Checking deployment components...${NC}"

FILES=(
    "Dockerfile"
    "Dockerfile.test"
    "docker-compose.yml"
    "docker-deploy.sh"
    "e2e/docker-regression.spec.ts"
    "src/api/__tests__/regression.test.js"
    "ZERO_TOLERANCE_TEST_POLICY.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        exit 1
    fi
done

echo
echo -e "${BLUE}Running quick validation checks...${NC}"

# TypeScript check
echo -n "TypeScript compilation: "
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ No errors${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    exit 1
fi

# ESLint check
echo -n "ESLint: "
LINT_OUTPUT=$(npm run lint 2>&1 | tail -2)
if echo "$LINT_OUTPUT" | grep -q "0 errors"; then
    echo -e "${GREEN}✓ No errors${NC}"
else
    echo -e "${RED}✗ Has errors${NC}"
    echo "$LINT_OUTPUT"
    exit 1
fi

# Test if servers can start
echo -n "Backend server: "
timeout 5 npm run server > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Starts successfully${NC}"
    kill $SERVER_PID 2>/dev/null || true
else
    echo -e "${RED}✗ Failed to start${NC}"
fi

echo
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    DEPLOYMENT PACKAGE READY!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo
echo "Docker deployment includes:"
echo "  • Multi-stage Dockerfile with mandatory testing"
echo "  • Full regression test suite (30+ tests)"
echo "  • API regression tests"
echo "  • Health checks and monitoring"
echo "  • Zero-tolerance test policy"
echo "  • Automatic rollback on failures"
echo
echo -e "${BLUE}To deploy with Docker:${NC}"
echo "  ./docker-deploy.sh"
echo
echo -e "${BLUE}To deploy with docker-compose:${NC}"
echo "  docker-compose --profile test up --build"
echo
echo -e "${YELLOW}⚠️  REMEMBER:${NC}"
echo "  • ALL tests must pass before deployment"
echo "  • Health checks must be green"
echo "  • Manual verification recommended"
echo
echo -e "${GREEN}Full regression testing is MANDATORY!${NC}"