# Phase 2 Strategy - Repository Metadata Alignment

## Current Situation

### Local vs GitHub Repositories Mismatch

**Local Repositories (17 total):**
- 3 consolidated repos: `future-mobility-enterprise-platform`, `future-mobility-utilities-platform`, `future-mobility-consumer-platform`
- 4 excluded repos: `ai-predictive-maintenance-engine-architecture`, `claude-code-sub-agents`, `copilot-architecture-template`, `sample-arch-package`

**GitHub Repositories (18 total - cloning in Azure):**
- Original separate repos: `future-mobility-fleet-platform`, `future-mobility-oems-platform`, `future-mobility-regulatory-platform`, `future-mobility-tech-platform`
- Plus: `rentalFleets`, `sdv-architecture-orchestration`

### Metadata Status

**Repositories WITH .portal/metadata.json (13 local):**
1. ✓ cloudtwin-simulation-platform-architecture
2. ✓ deploymaster-sdv-ota-platform
3. ✓ diagnostic-as-code-platform-architecture
4. ✓ fleet-digital-twin-platform-architecture
5. ✓ future-mobility-consumer-platform
6. ✓ future-mobility-enterprise-platform (local only - consolidated)
7. ✓ future-mobility-utilities-platform (local only - consolidated)
8. ✓ mobility-architecture-package-orchestrator
9. ✓ nslabsdashboards
1AUTOMOTIVE_MANUFACTURER. ✓ remote-diagnostic-assistance-platform-architecture
11. ✓ sovd-diagnostic-ecosystem-platform-architecture
12. ✓ vehicle-to-cloud-communications-architecture
13. ✓ velocityforge-sdv-platform-architecture

**Repositories to EXCLUDE (not in clone script, should be removed locally):**
1. ✗ ai-predictive-maintenance-engine-architecture (older version or incomplete)
2. ✗ claude-code-sub-agents (internal dev tool)
3. ✗ copilot-architecture-template (template only)
4. ✗ sample-arch-package (sample/demo)

**GitHub Repos that NEED metadata (6 total):**
1. ❓ future-mobility-fleet-platform (in GitHub, not local)
2. ❓ future-mobility-oems-platform (in GitHub, not local)
3. ❓ future-mobility-regulatory-platform (in GitHub, not local)
4. ❓ future-mobility-tech-platform (in GitHub, not local)
5. ❓ rentalFleets (in GitHub, not local)
6. ❓ sdv-architecture-orchestration (in GitHub, not local)

## Key Decision: Consolidation vs Separation

You mentioned you **combined some of them locally**. This means:

**Option A: Keep Consolidated (Local Approach)**
- Use: `future-mobility-enterprise-platform` (combines OEMs + Tech)
- Use: `future-mobility-utilities-platform` (combines Fleet + Regulatory)
- Benefits: Fewer repos, clearer product offerings
- Challenge: GitHub still has separate repos

**Option B: Keep Separated (GitHub Approach)**
- Use: 4 separate repos (fleet, oems, regulatory, tech)
- Benefits: Matches what's in GitHub
- Challenge: Need to create 4 new metadata files

## Recommended Approach

### Strategy: Align Local with GitHub (Use Separation)

**Rationale:**
1. GitHub is the source of truth
2. Azure deployment already has the separated repos
3. Easier to maintain (no manual consolidation needed)
4. Each repo can have focused metadata
5. Follows single-responsibility principle

### Phase 2 Action Plan

#### Step 1: Clone Missing GitHub Repos Locally
```bash
cd cloned-repositories
git clone git@github.com:jamesenki/future-mobility-fleet-platform.git
git clone git@github.com:jamesenki/future-mobility-oems-platform.git
git clone git@github.com:jamesenki/future-mobility-regulatory-platform.git
git clone git@github.com:jamesenki/future-mobility-tech-platform.git
git clone git@github.com:jamesenki/rentalFleets.git
git clone git@github.com:jamesenki/sdv-architecture-orchestration.git
```

#### Step 2: Check if GitHub Repos Already Have Metadata
For each of the 6 repos:
- Check if `.portal/metadata.json` exists
- If yes: Great, nothing to do!
- If no: Need to create metadata

#### Step 3: Create Missing Metadata Files

**Template Structure** (based on vehicle-to-cloud-communications-architecture):
```json
{
  "name": "Repository Name",
  "version": "1.AUTOMOTIVE_MANUFACTURER.AUTOMOTIVE_MANUFACTURER",
  "description": "Clear, business-focused description",
  "category": "Category Name",
  "status": "production-ready-alpha",
  "tags": ["tag1", "tag2"],
  "marketing": {
    "headline": "Short marketing headline",
    "keyBenefits": [
      {
        "title": "Benefit 1",
        "description": "Description",
        "icon": "icon-name"
      }
    ],
    "useCases": [
      {
        "title": "Use Case 1",
        "description": "Description",
        "benefits": ["benefit1"]
      }
    ]
  },
  "technical": {
    "architecture": "Description",
    "core": {
      "languages": ["TypeScript", "Python"],
      "frameworks": ["React", "FastAPI"],
      "databases": ["PostgreSQL"]
    },
    "apis": {
      "rest": ["OpenAPI spec location"],
      "graphql": ["schema location"],
      "grpc": ["proto location"],
      "asyncapi": ["spec location"],
      "postman": ["collection location"]
    },
    "documentation": {
      "readme": "/README.md",
      "apiReference": "/docs/API.md",
      "architecture": "/docs/ARCHITECTURE.md"
    }
  },
  "compliance": ["GDPR", "ISO 27AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1"]
}
```

#### Step 4: Handle Consolidated Local Repos

**Option A: Archive Consolidated Repos (Recommended)**
```bash
cd cloned-repositories
mv future-mobility-enterprise-platform _archived_future-mobility-enterprise-platform
mv future-mobility-utilities-platform _archived_future-mobility-utilities-platform
```

**Option B: Keep for Reference**
- Add `.gitignore` entry to exclude from commits
- Document that these are local-only consolidated views

#### Step 5: Remove Excluded Repos
```bash
cd cloned-repositories
rm -rf ai-predictive-maintenance-engine-architecture
rm -rf claude-code-sub-agents
rm -rf copilot-architecture-template
rm -rf sample-arch-package
```

#### Step 6: Update Backend to Use .portal/metadata.json

Modify `src/server.js` to:
1. Check for `.portal/metadata.json` in each repository FIRST
2. Fall back to centralized `repository-metadata.json` ONLY if .portal doesn't exist
3. Log which metadata source is being used

#### Step 7: Test Locally

```bash
# Start backend
npm run server

# Check API returns correct repos
curl http://localhost:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repositories | jq 'length'
# Should return: 18

# Check metadata is from .portal files
curl http://localhost:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repository/vehicle-to-cloud-communications-architecture | jq '.metadata_source'
# Should return: ".portal/metadata.json"
```

#### Step 8: Deploy to Azure

```bash
# Redeploy backend with updated metadata logic
./scripts/deploy-backend-azure.sh

# Verify in Azure
curl http://axiom-catalog-api.eastus.azurecontainer.io:3AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER1/api/repositories | jq 'length'
# Should return: 18
```

## Expected Outcome

### Final Repository Count: 18

**Core Repositories (11):**
1. cloudtwin-simulation-platform-architecture
2. deploymaster-sdv-ota-platform
3. diagnostic-as-code-platform-architecture
4. fleet-digital-twin-platform-architecture
5. mobility-architecture-package-orchestrator
6. nslabsdashboards
7. remote-diagnostic-assistance-platform-architecture
8. sovd-diagnostic-ecosystem-platform-architecture
9. vehicle-to-cloud-communications-architecture
1AUTOMOTIVE_MANUFACTURER. velocityforge-sdv-platform-architecture
11. future-mobility-consumer-platform

**Future Mobility Platforms (4):**
12. future-mobility-fleet-platform
13. future-mobility-oems-platform
14. future-mobility-regulatory-platform
15. future-mobility-tech-platform

**Additional Platforms (3):**
16. rentalFleets
17. sdv-architecture-orchestration
18. (one more to identify)

### Metadata Coverage: 1AUTOMOTIVE_MANUFACTURERAUTOMOTIVE_MANUFACTURER%

All 18 repositories will have `.portal/metadata.json` files with:
- Complete marketing information
- Technical specifications
- API declarations
- Documentation links
- Compliance information

## Timeline Estimate

- **Step 1-2**: Clone and check metadata - 3AUTOMOTIVE_MANUFACTURER minutes
- **Step 3**: Create missing metadata - 2-3 hours (depends on how many are missing)
- **Step 4-5**: Cleanup local repos - 15 minutes
- **Step 6**: Update backend logic - 1 hour
- **Step 7**: Local testing - 3AUTOMOTIVE_MANUFACTURER minutes
- **Step 8**: Deploy to Azure - 3AUTOMOTIVE_MANUFACTURER minutes

**Total**: 5-6 hours

## Success Criteria

✅ All 18 GitHub repositories have `.portal/metadata.json`
✅ Backend prioritizes `.portal/metadata.json` over centralized metadata
✅ Local and Azure deployments match (same 18 repos)
✅ No excluded repos in production
✅ All metadata properly structured
✅ API detection working from metadata
✅ Documentation links working

## Next Phase: Phase 3

After Phase 2 completion:
- Backend integration fully tested
- API standardization (OpenAPI, GraphQL, gRPC, AsyncAPI)
- Documentation structure standardization
- Postman collection verification
- Deprecate centralized repository-metadata.json

---

**Decision Point**: Do you want to:
1. Keep the consolidated local repos and add metadata to the 6 GitHub repos?
2. Archive consolidated repos and fully align with GitHub's separated structure?
3. Some other approach?

Please confirm the strategy before I proceed with Phase 2 execution.
