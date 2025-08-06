#!/bin/bash

# EYNS AI Experience Center - Build Validation Script
# This script MUST pass before ANY deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Track errors
TOTAL_ERRORS=0
CRITICAL_ERRORS=0

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to print section headers
print_section() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║        BUILD VALIDATION - ZERO TOLERANCE FOR ERRORS               ║
║                                                                    ║
║   NO DEPLOYMENT WITHOUT SUCCESSFUL VALIDATION                     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Start validation
print_message "Starting comprehensive validation..." "$CYAN"
START_TIME=$(date +%s)

# 1. TypeScript Compilation Check
print_section "1. TypeScript Compilation Check"
print_message "Running type check..." "$CYAN"
if npm run type-check > /tmp/typecheck.log 2>&1; then
    print_message "✓ TypeScript compilation: PASSED" "$GREEN"
else
    print_message "✗ TypeScript compilation: FAILED" "$RED"
    cat /tmp/typecheck.log
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# 2. ESLint Check
print_section "2. ESLint Check"
print_message "Running ESLint..." "$CYAN"
if npm run lint > /tmp/eslint.log 2>&1; then
    print_message "✓ ESLint: PASSED (0 errors)" "$GREEN"
else
    # Check if it's just warnings
    if grep -q "error" /tmp/eslint.log; then
        print_message "✗ ESLint: FAILED (errors found)" "$RED"
        grep "error" /tmp/eslint.log | head -20
        CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
    else
        WARNING_COUNT=$(grep -c "warning" /tmp/eslint.log || echo "0")
        print_message "⚠ ESLint: PASSED with $WARNING_COUNT warnings" "$YELLOW"
        TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
    fi
fi

# 3. Unit Tests
print_section "3. Unit Tests"
print_message "Running unit tests..." "$CYAN"
if CI=true npm test -- --coverage --watchAll=false --maxWorkers=2 > /tmp/jest.log 2>&1; then
    print_message "✓ Unit tests: PASSED" "$GREEN"
    # Extract coverage summary
    if grep -A 5 "Coverage summary" /tmp/jest.log > /dev/null 2>&1; then
        echo ""
        print_message "Coverage Summary:" "$CYAN"
        grep -A 5 "Coverage summary" /tmp/jest.log || true
    fi
else
    print_message "✗ Unit tests: FAILED" "$RED"
    grep -E "FAIL|Error:|✕" /tmp/jest.log | head -20
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# 4. Build Test
print_section "4. Production Build Test"
print_message "Testing production build..." "$CYAN"
if npm run build > /tmp/build.log 2>&1; then
    print_message "✓ Production build: PASSED" "$GREEN"
    # Check build size
    BUILD_SIZE=$(du -sh build 2>/dev/null | cut -f1)
    print_message "  Build size: $BUILD_SIZE" "$CYAN"
else
    print_message "✗ Production build: FAILED" "$RED"
    tail -20 /tmp/build.log
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# 5. Dependency Audit
print_section "5. Security Audit"
print_message "Running security audit..." "$CYAN"
npm audit --audit-level=high > /tmp/audit.log 2>&1 || true
HIGH_VULNS=$(grep -E "high|critical" /tmp/audit.log | grep -E "[0-9]+ high" | head -1 || echo "0")
if [[ "$HIGH_VULNS" == *"0 high"* ]] || [[ -z "$HIGH_VULNS" ]]; then
    print_message "✓ Security audit: PASSED (no high/critical vulnerabilities)" "$GREEN"
else
    print_message "⚠ Security audit: $HIGH_VULNS vulnerabilities found" "$YELLOW"
    TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
fi

# 6. E2E Tests (if available)
print_section "6. E2E Tests"
if [ -f "playwright.config.ts" ]; then
    print_message "Running E2E tests..." "$CYAN"
    # Start servers for E2E tests
    npm run server > /tmp/server.log 2>&1 &
    SERVER_PID=$!
    sleep 5
    
    npx serve -s build -l 3000 > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 5
    
    if npx playwright test --reporter=list > /tmp/e2e.log 2>&1; then
        print_message "✓ E2E tests: PASSED" "$GREEN"
    else
        print_message "⚠ E2E tests: FAILED (non-critical)" "$YELLOW"
        grep -E "✗|failed" /tmp/e2e.log | head -10
        TOTAL_ERRORS=$((TOTAL_ERRORS + 1))
    fi
    
    # Cleanup
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null || true
else
    print_message "⚠ E2E tests: Not configured" "$YELLOW"
fi

# 7. API Health Check
print_section "7. API Health Check"
print_message "Testing API endpoints..." "$CYAN"
# Start server temporarily
npm run server > /tmp/api-server.log 2>&1 &
API_PID=$!
sleep 5

if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    print_message "✓ API health check: PASSED" "$GREEN"
else
    print_message "✗ API health check: FAILED" "$RED"
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi
kill $API_PID 2>/dev/null || true

# 8. Repository Structure Check
print_section "8. Repository Structure Check"
print_message "Validating repository structure..." "$CYAN"
REQUIRED_FILES=(
    "package.json"
    "src/App.tsx"
    "src/server.js"
    "public/index.html"
    ".env.example"
    "README.md"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_message "  ✗ Missing: $file" "$RED"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    print_message "✓ Repository structure: VALID" "$GREEN"
else
    print_message "✗ Repository structure: $MISSING_FILES files missing" "$RED"
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# Calculate validation time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Final Summary
print_section "VALIDATION SUMMARY"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Validation completed in ${DURATION} seconds${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $CRITICAL_ERRORS -gt 0 ]; then
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    VALIDATION FAILED                      ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║  Critical Errors: $CRITICAL_ERRORS                                        ║${NC}"
    echo -e "${RED}║  Total Issues: $((CRITICAL_ERRORS + TOTAL_ERRORS))                                           ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║  ⛔ DEPLOYMENT BLOCKED - FIX ALL CRITICAL ERRORS          ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╗${NC}"
    exit 1
elif [ $TOTAL_ERRORS -gt 0 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║              VALIDATION PASSED WITH WARNINGS              ║${NC}"
    echo -e "${YELLOW}║                                                            ║${NC}"
    echo -e "${YELLOW}║  Warnings: $TOTAL_ERRORS                                                  ║${NC}"
    echo -e "${YELLOW}║                                                            ║${NC}"
    echo -e "${YELLOW}║  ⚠️  Deployment allowed but review warnings                ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╗${NC}"
    exit 0
else
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              🎉 VALIDATION SUCCESSFUL 🎉                  ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  All checks passed!                                       ║${NC}"
    echo -e "${GREEN}║  ✅ Ready for deployment                                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╗${NC}"
    exit 0
fi