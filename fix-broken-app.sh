#!/bin/bash
# Emergency Fix Orchestration
# Coordinates all agents to fix the broken application

set -e

echo "🚨 EMERGENCY FIX ORCHESTRATION"
echo "=============================="
echo "Current State: Application BROKEN (8% success rate)"
echo "Target State: 100% functional application"
echo ""

# Step 1: Diagnose all issues
echo "📋 Step 1: Full Diagnosis"
echo "-------------------------"

# Check current errors
echo "Checking frontend errors..."
docker logs eyns-frontend 2>&1 | grep -i error | tail -10 || true

echo -e "\nChecking backend errors..."
docker logs eyns-backend 2>&1 | grep -i error | tail -10 || true

echo -e "\nChecking browser console..."
curl -s http://localhost | grep -o "static/js/.*\.js" | head -5 || true

# Step 2: Fix Theme Issues
echo -e "\n🎨 Step 2: Fix Theme Issues"
echo "-------------------------"

# Find all files with theme problems
echo "Finding theme usage..."
grep -r "theme\." src --include="*.tsx" --include="*.ts" | grep -v "props.theme" | head -10 || true

# Step 3: Fix CORS Issues
echo -e "\n🌐 Step 3: Fix CORS Configuration"
echo "-------------------------"

# Check CORS settings
echo "Current CORS configuration in backend..."
grep -A 5 -B 5 "cors" src/server.js || true

# Step 4: Fix Authentication
echo -e "\n🔐 Step 4: Fix Authentication"
echo "-------------------------"

# Test auth endpoint
echo "Testing auth endpoint..."
curl -X POST http://localhost/api/auth/local-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localhost","password":"admin"}' \
  -w "\nHTTP Status: %{http_code}\n" || true

# Step 5: Create Fix Plan
echo -e "\n📝 Step 5: Fix Plan"
echo "-------------------------"

cat > FIX_PLAN.md << 'EOF'
# Emergency Fix Plan

## Critical Issues Found:
1. Theme interpolation errors in styled-components
2. CORS blocking frontend-backend communication
3. Authentication failing with 500 errors
4. Blank page after login
5. No repository cards rendering

## Fix Order:
1. Fix all theme imports (props => props.theme)
2. Update CORS configuration to allow localhost
3. Fix authentication context imports
4. Rebuild with corrections
5. Run comprehensive E2E tests

## Commands to Execute:
```bash
# 1. Fix theme issues
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "theme\." | grep -v "props.theme" | xargs sed -i '' 's/\${theme\./\${props => props.theme./g'

# 2. Fix CORS
# Update server.js CORS configuration

# 3. Rebuild
npm run build

# 4. Redeploy
docker-compose down
docker-compose up -d --build

# 5. Test
npm run test:e2e
```
EOF

echo -e "\n🤖 Agent Coordination Plan:"
echo "1. DevOps Agent: Execute build validation"
echo "2. QA Agent: Run comprehensive tests" 
echo "3. DevOps Agent: Deploy if tests pass"
echo "4. QA Agent: Verify production deployment"

echo -e "\n🚀 Ready to execute fixes?"
echo "Run: ./execute-fixes.sh"