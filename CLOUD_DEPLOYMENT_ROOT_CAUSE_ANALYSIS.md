# Cloud Deployment Root Cause Analysis

## Problem Statement

The Axiom Loom Catalog worked perfectly locally with 17 repositories but only 3 repositories are cloning in the cloud deployment.

## Root Cause Identified

**The clone script is trying to clone repositories that don't exist in the jamesenki GitHub account.**

## Evidence

### What the Catalog Expects (repository-metadata.json)
19 repositories defined:
1. ✅ ai-predictive-maintenance-engine-architecture (EXISTS - Private)
2. ❌ cloudtwin-ai (DOESN'T EXIST - Wrong name)
3. ❌ diagnostic-as-code (DOESN'T EXIST - Wrong name)
4. ❌ distributed-ledger-for-auto-insurance (DOESN'T EXIST)
5. ✅ future-mobility-consumer-platform (EXISTS - Private)
6. ❌ future-mobility-fleet-operations-platform (DOESN'T EXIST)
7. ❌ future-mobility-oems-tech-platform (DOESN'T EXIST)
8. ❌ iot-platform-axiom-loom (DOESN'T EXIST)
9. ❌ lambda-layer-pipeline (DOESN'T EXIST)
10. ❌ open-smart-mobility-platform (DOESN'T EXIST)
11. ❌ predictive-maintenance-model (DOESN'T EXIST)
12. ❌ serverless-application-pipeline (DOESN'T EXIST)
13. ❌ smart-vending-machine-platform (DOESN'T EXIST)
14. ❌ terraform-aws-cloud-infrastructure (DOESN'T EXIST)
15. ❌ vehicle-health-tracker (DOESN'T EXIST)
16. ✅ vehicle-to-cloud-communications-architecture (EXISTS - Public)
17. ❌ water-heater-platform (DOESN'T EXIST)
18. ❌ voice-enabled-vehicle-assistance (DOESN'T EXIST)
19. ❌ weather-dashboard (DOESN'T EXIST - exists but is dashboards)

### What Actually Exists in Local cloned-repositories/
17 repositories (working locally):
1. ✅ ai-predictive-maintenance-engine-architecture
2. ❌ claude-code-sub-agents (NOT in metadata)
3. ✅ cloudtwin-simulation-platform-architecture (CORRECT NAME)
4. ❌ copilot-architecture-template (NOT in metadata)
5. ✅ deploymaster-sdv-ota-platform
6. ✅ diagnostic-as-code-platform-architecture (CORRECT NAME)
7. ✅ fleet-digital-twin-platform-architecture
8. ✅ future-mobility-consumer-platform
9. ❌ future-mobility-enterprise-platform (CONSOLIDATED - NOT in metadata)
10. ❌ future-mobility-utilities-platform (CONSOLIDATED - NOT in metadata)
11. ✅ mobility-architecture-package-orchestrator
12. ❌ nslabsdashboards (RENAMED - NOT in metadata)
13. ✅ remote-diagnostic-assistance-platform-architecture
14. ❌ sample-arch-package (NOT in metadata)
15. ✅ sovd-diagnostic-ecosystem-platform-architecture
16. ✅ vehicle-to-cloud-communications-architecture
17. ✅ velocityforge-sdv-platform-architecture

### What Actually Exists in GitHub jamesenki Account
Relevant repositories:
1. ✅ ai-predictive-maintenance-engine-architecture (Private)
2. ✅ cloudtwin-simulation-platform-architecture (Private) - NOT cloudtwin-ai
3. ✅ deploymaster-sdv-ota-platform (Private)
4. ✅ diagnostic-as-code-platform-architecture (Private) - NOT diagnostic-as-code
5. ✅ fleet-digital-twin-platform-architecture (Private)
6. ✅ future-mobility-consumer-platform (Private)
7. ✅ future-mobility-fleet-platform (Private) - NOT future-mobility-fleet-operations-platform
8. ✅ future-mobility-oems-platform (Private) - NOT future-mobility-oems-tech-platform
9. ✅ future-mobility-tech-platform (Private)
10. ✅ future-mobility-regulatory-platform (Private)
11. ✅ mobility-architecture-package-orchestrator (Private)
12. ✅ nslabsdashboards (Private) - Renamed to axiom-loom-iot-core in metadata
13. ✅ remote-diagnostic-assistance-platform-architecture (Private)
14. ✅ rentalFleets (Private)
15. ✅ sdv-architecture-orchestration (Private)
16. ✅ sovd-diagnostic-ecosystem-platform-architecture (Private)
17. ✅ vehicle-to-cloud-communications-architecture (Public)
18. ✅ velocityforge-sdv-platform-architecture (Private)
19. ✅ dashboards (Private) - Was weather-dashboard?

## The Core Problem

**Three separate sources of truth:**

1. **repository-metadata.json** - Defines what the catalog UI shows (19 repos with WRONG NAMES)
2. **scripts/clone-repositories.sh** - Lists what to clone (uses wrong names from metadata)
3. **Local cloned-repositories/** - What actually works (17 repos with CORRECT NAMES)

## Why It Worked Locally

Locally, you had **manually cloned** the repositories with their **correct GitHub names**, so the server could read them even though:
- The clone script had wrong names
- The metadata had wrong names
- The UI displayed different names

The backend just reads whatever is in `cloned-repositories/` directory, so it worked!

## Why It Fails in Cloud

In the cloud:
1. Container starts fresh with empty `cloned-repositories/`
2. Clone script runs with **wrong repository names**
3. Most clones fail (16/19 repos)
4. Only 3 public/accessible repos succeed by luck
5. Backend has almost nothing to serve

## The Fix Required

We need to align ALL three sources:

### 1. Fix the Clone Script Repository Names

Current (WRONG):
```bash
cloudtwin-ai  # Should be: cloudtwin-simulation-platform-architecture
diagnostic-as-code  # Should be: diagnostic-as-code-platform-architecture
distributed-ledger-for-auto-insurance  # Doesn't exist
future-mobility-fleet-operations-platform  # Should be: future-mobility-fleet-platform
future-mobility-oems-tech-platform  # Split into: future-mobility-oems-platform + future-mobility-tech-platform
# ... 11 more wrong names
```

### 2. Repositories That Need Metadata Updates

These exist in GitHub but have NO metadata entries:
- rentalFleets (has metadata ✓)
- sdv-architecture-orchestration (has metadata ✓)
- nslabsdashboards (has metadata as axiom-loom-iot-core ✓)

### 3. Consolidated/Renamed Repositories

The metadata shows consolidation happened but repo names don't match:
- future-mobility-platform-suite (metadata) = Multiple repos consolidated
- axiom-loom-iot-* (metadata names) vs nslabsdashboards (GitHub name)
- appliances-co-water-heater-platform (metadata) vs ??? (GitHub)

## Action Plan

### Immediate Fix (Get Cloud Working)

1. **Update clone-repositories.sh** with CORRECT GitHub repository names
2. **Rebuild Docker image** with corrected script
3. **Redeploy to Azure** with GitHub token
4. **Verify all 17+ repos clone successfully**

### Proper Long-Term Fix

1. **Create a single source of truth** - Use repository-metadata.json IDs as GitHub repo names
2. **Rename GitHub repositories** to match metadata IDs (OR)
3. **Update metadata IDs** to match actual GitHub repo names
4. **Add mapping file** if names must differ (repo-name-mapping.json)

## Recommended Immediate Actions

### Option A: Quick Fix - Update Clone Script Only
Update `scripts/clone-repositories.sh` with actual GitHub repository names that exist.

**Pros:** Fastest, gets cloud working immediately
**Cons:** Metadata/clone script/GitHub names remain misaligned

### Option B: Comprehensive Fix - Align Everything
1. Decide on canonical names (use metadata IDs)
2. Rename all GitHub repositories to match
3. Update clone script
4. Redeploy

**Pros:** Clean, maintainable, single source of truth
**Cons:** Takes longer, requires GitHub repo renames

## Repository Name Mapping (What Needs to Change)

| Metadata/Clone Script Name | Actual GitHub Name | Status | Action |
|---|---|---|---|
| cloudtwin-ai | cloudtwin-simulation-platform-architecture | Private | Fix name |
| diagnostic-as-code | diagnostic-as-code-platform-architecture | Private | Fix name |
| distributed-ledger-for-auto-insurance | ??? | N/A | Remove or find |
| future-mobility-fleet-operations-platform | future-mobility-fleet-platform | Private | Fix name |
| future-mobility-oems-tech-platform | future-mobility-oems-platform<br>future-mobility-tech-platform | Private | Split entry |
| iot-platform-axiom-loom | nslabsdashboards | Private | Fix name |
| lambda-layer-pipeline | ??? | N/A | Remove |
| open-smart-mobility-platform | ecosystem-platform-architecture? | Public | Check |
| predictive-maintenance-model | ??? | N/A | Remove |
| serverless-application-pipeline | ??? | N/A | Remove |
| smart-vending-machine-platform | ??? | N/A | Remove |
| terraform-aws-cloud-infrastructure | ??? | N/A | Remove |
| vehicle-health-tracker | ??? | N/A | Remove |
| water-heater-platform | ??? or dashboards? | ??? | Check |
| voice-enabled-vehicle-assistance | ??? | N/A | Remove |
| weather-dashboard | dashboards? | Private | Check |

## Recommendation

**I recommend Option A (Quick Fix) to get you operational immediately:**

1. Update `scripts/clone-repositories.sh` with the 17 actual repository names from your local folder
2. Rebuild and redeploy
3. Test cloud deployment
4. **Then** schedule time to do Option B for long-term maintainability

Would you like me to:
1. **Create the corrected clone script now?** (Quick fix)
2. **Create a comprehensive rename plan?** (Proper fix)
3. **Both?**
