# Portal Metadata Status Report

**Generated:** 2025-10-14
**Purpose:** Track which repositories have `.portal/metadata.json` for businessValue display

---

## Summary

- **Total Repositories:** 22
- **With .portal/metadata.json:** 8 (36%)
- **Missing .portal/metadata.json:** 14 (64%)

---

## ✅ Repositories WITH .portal/metadata.json (8)

These repositories will display their **Key Benefits** and **Use Cases** from their own metadata:

1. **ai-predictive-maintenance-engine-architecture** ✅ VERIFIED WORKING
   - Location: `cloned-repositories/ai-predictive-maintenance-engine-architecture/.portal/metadata.json`
   - Has: 4 keyBenefits, 4 useCases
   - Status: ✅ Data displaying correctly on portal

2. **deploymaster-sdv-ota-platform**
   - Location: `cloned-repositories/deploymaster-sdv-ota-platform/.portal/metadata.json`

3. **fleet-digital-twin-platform-architecture**
   - Location: `cloned-repositories/fleet-digital-twin-platform-architecture/.portal/metadata.json`

4. **future-mobility-fleet-platform**
   - Location: `cloned-repositories/future-mobility-fleet-platform/.portal/metadata.json`

5. **nslabsdashboards**
   - Location: `cloned-repositories/nslabsdashboards/.portal/metadata.json`

6. **remote-diagnostic-assistance-platform-architecture**
   - Location: `cloned-repositories/remote-diagnostic-assistance-platform-architecture/.portal/metadata.json`

7. **rentalFleets**
   - Location: `cloned-repositories/rentalFleets/.portal/metadata.json`

8. **sovd-diagnostic-ecosystem-platform-architecture**
   - Location: `cloned-repositories/sovd-diagnostic-ecosystem-platform-architecture/.portal/metadata.json`

---

## ❌ Repositories MISSING .portal/metadata.json (14)

These repositories will display **hardcoded placeholder data** until they get their own metadata files:

### High Priority (Architecture & Platform Repos)

1. **vehicle-to-cloud-communications-architecture** ⚠️ HIGH PRIORITY
   - Has comprehensive FMEA documentation
   - Should showcase MQTT 5.0, Protocol Buffers, AsyncAPI capabilities

2. **velocityforge-sdv-platform-architecture**
   - SDV platform architecture
   - Should showcase high-performance capabilities

3. **cloudtwin-simulation-platform-architecture**
   - Digital twin platform
   - Should showcase simulation capabilities

4. **diagnostic-as-code-platform-architecture**
   - Diagnostics platform
   - Should showcase code-driven automation

### Medium Priority (Future Mobility Components)

5. **future-mobility-consumer-platform**
6. **future-mobility-oems-platform**
7. **future-mobility-regulatory-platform**
8. **future-mobility-tech-platform**
9. **future-mobility-utilities-platform**

### Lower Priority

10. **mobility-architecture-package-orchestrator**
11. **claude-code-sub-agents**
12. **copilot-architecture-template**
13. **sample-arch-package**
14. **smartpath**

---

## Required .portal/metadata.json Structure

Each repository should have a `.portal/metadata.json` file with this structure:

```json
{
  "name": "Repository Name",
  "description": "Brief description",
  "category": "Platform|Architecture|Solution",
  "marketing": {
    "headline": "Main value proposition",
    "subheadline": "Supporting message",
    "keyBenefits": [
      {
        "title": "Primary benefit title",
        "description": "Detailed explanation"
      }
    ],
    "useCases": [
      {
        "industry": "Target industry",
        "description": "How it's used"
      }
    ]
  }
}
```

---

## Current Data Flow

```
Repository/.portal/metadata.json
  ↓
Server (src/server.js) reads .portal/metadata.json
  ↓
Transforms marketing.keyBenefits → simple string array
  ↓
API returns businessValue.keyBenefits and businessValue.useCases
  ↓
Frontend (RepositoryDetailRedesigned.tsx) displays data
  ↓
User sees Key Benefits and Use Cases on repository detail page
```

---

## Fallback Behavior

If `.portal/metadata.json` doesn't exist:

1. **First fallback:** Check `repository-metadata.json` in portal root
2. **Second fallback:** Use hardcoded defaults:
   ```
   keyBenefits: ['Modern architecture patterns', 'Scalable solutions', 'Best practices implementation']
   useCases: ['API development', 'System integration', 'Cloud deployment']
   ```

---

## Action Items

### Immediate

- [x] Update server.js to read from `.portal/metadata.json`
- [x] Fix frontend to prioritize API data over hardcoded defaults
- [x] Verify ai-predictive-maintenance-engine-architecture displays correctly

### Next Steps

1. **Create .portal/metadata.json for high-priority repos:**
   - vehicle-to-cloud-communications-architecture
   - velocityforge-sdv-platform-architecture
   - cloudtwin-simulation-platform-architecture
   - diagnostic-as-code-platform-architecture

2. **Push .portal/metadata.json to GitHub repos:**
   - Each repository should have its metadata file committed to GitHub
   - Not just in local clones

3. **Validate all existing .portal/metadata.json files:**
   - Ensure they have the correct structure
   - Verify marketing.keyBenefits and marketing.useCases arrays exist

---

## Notes

- The portal reads metadata from **local cloned repositories**
- Changes to `.portal/metadata.json` require repository re-sync to be visible
- The server prioritizes `.portal/metadata.json` over centralized `repository-metadata.json`
- Frontend hot-reloads automatically when server data changes
