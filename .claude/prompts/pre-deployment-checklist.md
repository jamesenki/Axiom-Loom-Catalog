# Pre-Deployment Checklist for Axiom Loom Catalog

## CRITICAL: This checklist MUST be completed before marking any deployment as successful

### 1. Build Validation ✅
- [ ] Run `npm run type-check` - MUST pass with 0 errors
- [ ] Run `npm run lint` - MUST pass with 0 errors  
- [ ] Run `npm run build` - MUST complete successfully
- [ ] Verify `build/` directory exists and contains `index.html`

### 2. Test Coverage ✅
- [ ] Run `npm run test:ci` - All tests MUST pass
- [ ] Run `npm run test:e2e` - All E2E tests MUST pass
- [ ] Test coverage MUST be > 80%

### 3. Manual UI Testing ✅
- [ ] Start application with `npm start`
- [ ] Navigate to http://localhost:3000
- [ ] Verify homepage loads without console errors
- [ ] Test all navigation links work
- [ ] Test API Explorer functionality
- [ ] Test Documentation viewer
- [ ] Test Search functionality
- [ ] Verify responsive design on mobile viewport

### 4. API Verification ✅
- [ ] Backend server starts without errors (`npm run server`)
- [ ] Health check endpoint responds: `curl http://localhost:3001/api/health`
- [ ] Repository sync works correctly
- [ ] API documentation loads

### 5. Performance Checks ✅
- [ ] Page load time < 3 seconds
- [ ] No memory leaks in console
- [ ] Bundle size < 5MB
- [ ] Lighthouse score > 80

### 6. Security Validation ✅
- [ ] No hardcoded secrets or API keys
- [ ] Environment variables properly configured
- [ ] CORS settings appropriate
- [ ] Authentication works (if enabled)

### 7. Docker Deployment (if applicable) ✅
- [ ] Docker build completes: `docker-compose build`
- [ ] Containers start successfully: `docker-compose up`
- [ ] Application accessible on configured ports
- [ ] Health checks pass

### 8. Documentation ✅
- [ ] README.md is up to date
- [ ] Deployment instructions are accurate
- [ ] API documentation is current
- [ ] Changelog updated

## DO NOT PROCEED with deployment if ANY item above fails!

## Quick Validation Script
Run this command to perform automated checks:
```bash
./scripts/validate-build.sh
```

## Manual Testing Script
```bash
# Start services
npm run dev

# In another terminal, run tests
curl http://localhost:3000 -I  # Should return 200
curl http://localhost:3001/api/health  # Should return {"status":"ok"}

# Open browser and manually test UI
open http://localhost:3000
```