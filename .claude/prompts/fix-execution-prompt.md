# Application Fix Execution Prompt

You are tasked with fixing the Axiom Loom Catalog application that is currently showing a blank page and failing 1200 tests. You have access to specialized agents and must follow a systematic approach.

## Current State
- Application shows blank page
- JavaScript error: "Cannot read properties of undefined (reading 'button')"
- 1200 tests failing
- Docker containers running but unhealthy

## Your Mission
Execute the fix workflow systematically using the provided agents:

### Phase 1: Root Cause Analysis (IMMEDIATE)
Use the Root Cause Analysis Agent to:
1. Run `npx playwright test e2e/verify-deployment.spec.ts --reporter=json > error-report.json`
2. Analyze browser console errors from Playwright
3. Check all container logs: `docker logs axiom-loom-frontend`, `docker logs axiom-loom-backend`
4. Create error dependency graph
5. Output prioritized fix list

### Phase 2: Theme System Fix (CRITICAL)
Use the Theme Migration Agent to:
1. Audit all files importing theme
2. Ensure ThemeProvider properly wraps App
3. Fix all theme property access to use optional chaining
4. Create theme defaults for all missing properties
5. Validate no console errors after fixes

### Phase 3: Progressive Test Fixing (SYSTEMATIC)
Use the Test-Driven Fix Agent to:
1. Start with homepage rendering tests
2. Fix each test category in priority order:
   - Rendering (homepage, components visible)
   - Navigation (routing works)
   - Data fetching (API calls succeed)
   - Interactions (buttons, forms work)
3. After each fix, run related tests to ensure no regressions
4. Document each fix

### Phase 4: Integration Validation (FINAL)
Use the Integration Validation Agent to:
1. Run full test suite
2. Check all API endpoints
3. Validate database connections
4. Performance benchmarks
5. Deploy and verify

## Execution Rules
1. **NO SKIPPING STEPS** - Follow the workflow exactly
2. **TEST AFTER EACH FIX** - Verify fixes work before moving on
3. **DOCUMENT EVERYTHING** - Keep fix log for each change
4. **NO REGRESSIONS** - If a fix breaks something else, revert
5. **INCREMENTAL PROGRESS** - Commit working fixes frequently

## First Actions (START HERE)
1. Create fix tracking file: `.claude/fixes/fix-log.md`
2. Run root cause analysis
3. Fix the most critical blocker first
4. Test and verify
5. Move to next priority

## Success Criteria
- [ ] Homepage loads without errors
- [ ] No console errors in browser
- [ ] All navigation works
- [ ] API data loads correctly
- [ ] 1200 tests passing
- [ ] Application fully functional

Begin with Phase 1 immediately. Report findings after each phase.