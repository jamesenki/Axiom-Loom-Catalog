# Metadata.json to UI Mapping Document

## Overview
This document maps the `.portal/metadata.json` structure to UI elements in both the Card View (RepositoryList) and Full Detail View (RepositoryDetailRedesigned) pages.

## Metadata Structure Reference
Based on `fleet-digital-twin-platform-architecture/.portal/metadata.json`

---

## 1. Card View (RepositoryList) - Compact Display

### Header Section
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Card Title** | `metadata.name` | `displayName` from repo structure |
| **Status Badge** | `metadata.status` | 'active' |
| **Short Description** | `metadata.tagline` | `metadata.description` (truncated to 150 chars) |

### Metrics Row
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **API Count** | `metadata.technical.apis.count` OR auto-detect from files | File detection |
| **Last Updated** | `metadata.communityMetrics.lastUpdated` OR file mtime | File system mtime |

### Action Buttons (Dynamic Detection)
These remain driven by repository structure detection:
- Repository Button (always shown)
- Documentation Button (if `/docs` exists)
- Postman Button (if `.hasPostman` is true)
- GraphQL Button (if `.hasGraphQL` is true)
- API Explorer (if any APIs detected)

---

## 2. Full Detail View (RepositoryDetailRedesigned) - Complete Information

### Hero Section (PageHeader)
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Main Headline** | `metadata.name` | Repo name (title-cased) |
| **Lead Description** | `metadata.marketing.headline` | `metadata.tagline` → `metadata.description` |
| **Status Badge** | `metadata.status` | 'active' |
| **Category Badges** | `metadata.category` + `metadata.tags[]` | ['General'] |

### Business Value Cards (3-column grid)

#### Card 1: Architecture Package Pricing
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Display Price** | `pricing.tiers[0].price` OR `pricing.model` | "Contact for Pricing" |
| **Tier Badge** | `pricing.tiers[0].name` | "Enterprise" |
| **Licensing Model** | `pricing.model` | "Commercial License" |
| **Support Included** | `pricing.tiers[0].features[]` (extract support info) | "Email Support" |
| **Customization** | Derived from `pricing.tiers[*].features[]` | false |
| **Value Score** | `pricing.roi.valueScore` OR `communityMetrics.valueScore` | 70 |

#### Card 2: Business Value
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Target Market** | `marketing.useCases[*].industry` (aggregated) | "Enterprise & Developers" |
| **Expected ROI** | `pricing.roi.paybackPeriod` + `pricing.roi.annualSavings` | "Accelerated development cycles" |

#### Card 3: Key Benefits
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Benefits List** | `marketing.keyBenefits[*].title` | `marketing.features[*].name` → Generic defaults |

### AI Agent Attribution Section (if present)
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Cycle Time Reduction** | `implementation.gettingStarted.timeToFirstTwin` | "6-12 months" (hardcoded) |
| **Cost Savings** | `pricing.roi.annualSavings` | "$200K-500K" (hardcoded) |
| **AI Team Size** | Hardcoded: 6 agents | 6 |
| **Traditional Team Size** | Hardcoded: 12-16 roles | "12-16" |
| **AI Agents Used** | Hardcoded list of agent types | Generic list |
| **Traditional Roles** | Hardcoded list of roles | Generic list |

**Note**: AI attribution section is currently hardcoded. Future enhancement could add:
- `metadata.development.aiAgents[]` - List of AI agents used
- `metadata.development.traditionalEquivalent` - Traditional team size
- `metadata.development.efficiencyGains` - Metrics

### Use Cases & Applications Section
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Use Case List** | `marketing.useCases[*].industry` + `useCases[*].description` | Generic use cases |

### Technical Overview Section
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Total APIs** | `technical.apis.count` OR auto-detect | File detection |
| **Postman Collections** | `technical.integrations.postman.collections` OR auto-detect | File detection |
| **GraphQL Badge** | `apiTypes.hasGraphQL` OR auto-detect | File detection |
| **gRPC Badge** | `apiTypes.hasGrpc` OR auto-detect | File detection |

### Technical Stack Display (if added)
| UI Element | Metadata Path | Fallback |
|------------|---------------|----------|
| **Languages** | `technical.core.languages[]` | Not shown |
| **Frameworks** | `technical.core.frameworks[]` | Not shown |
| **Databases** | `technical.core.databases[]` | Not shown |
| **Messaging** | `technical.core.messaging[]` | Not shown |
| **Infrastructure** | `technical.core.infrastructure[]` | Not shown |

### Get Started Section (Action Buttons)
Buttons remain driven by detection:
- Documentation
- API Explorer
- Postman Collections
- GraphQL Playground
- gRPC Playground
- View on GitHub

---

## 3. Fallback Strategy

### Priority Order for Data Sources:
1. **`.portal/metadata.json`** (highest priority - repository-specific)
2. **`axiom.json`** (repository configuration)
3. **Repository structure detection** (file-based detection)
4. **Global `repository-metadata.json`** (centralized defaults)
5. **Hardcoded defaults** (lowest priority - generic text)

### Fallback Rules by Field Type:

#### Text Fields
- If primary field is missing → Try secondary field
- If secondary is missing → Use generic default
- Always strip markdown from descriptions
- Truncate to reasonable lengths (150 chars for cards, 250 for detail views)

#### Numeric Fields
- If missing → Use file detection count
- If file detection fails → Use 0 (don't show metric)

#### Boolean Flags
- If missing → Use file detection (e.g., check for .graphql files)
- If file detection fails → false

#### Array Fields
- If missing or empty → Use generic defaults OR hide section
- Never show empty sections

#### Pricing Fields
- If missing → Show "Contact for Pricing"
- If partial → Fill with sensible defaults
- Always show value proposition even without exact pricing

### Graceful Degradation Examples:

**Example 1: Minimal Metadata**
```json
{
  "name": "My Platform",
  "description": "A simple platform"
}
```
Result:
- Card shows name + description
- Detail page shows basic info
- No pricing card (hidden)
- Generic benefits shown
- Technical overview uses file detection

**Example 2: Complete Metadata**
```json
{
  "name": "Fleet Digital Twin",
  "marketing": { "headline": "...", "keyBenefits": [...] },
  "pricing": { "tiers": [...] },
  "technical": { "core": {...} }
}
```
Result:
- Card shows rich tagline
- Detail page shows all sections
- Pricing card fully populated
- Benefits from metadata
- Tech stack displayed

---

## 4. Implementation Checklist

### Backend Changes
- [x] Read `.portal/metadata.json` in `/api/repositories` endpoint
- [x] Read `.portal/metadata.json` in `/api/repository/:name/public` endpoint
- [ ] Include ALL metadata fields in API response (not just selected ones)
- [ ] Properly extract nested fields (marketing.*, pricing.*, technical.*)

### Frontend Changes - Card View
- [ ] Replace hardcoded description with `tagline` → `description`
- [ ] Use `marketing.metrics` for dynamic metrics if available
- [ ] Keep button detection logic (no changes needed)

### Frontend Changes - Detail View
- [ ] Replace hardcoded hero text with `marketing.headline`
- [ ] Dynamically render pricing card from `pricing.tiers[]`
- [ ] Map `marketing.keyBenefits[*]` to benefits list
- [ ] Map `marketing.useCases[*]` to use cases section
- [ ] Add optional tech stack section from `technical.core.*`
- [ ] Implement proper null/undefined checks for all metadata fields

### Testing Scenarios
- [ ] Test with `fleet-digital-twin-platform-architecture` (complete metadata)
- [ ] Test with repository having minimal metadata
- [ ] Test with repository having NO `.portal/metadata.json`
- [ ] Verify graceful fallbacks at each level
- [ ] Ensure no console errors for missing fields

---

## 5. Future Enhancements

### Phase 2 (Optional)
- Add `metadata.marketing.testimonials[]` section
- Add `metadata.roadmap` timeline visualization
- Add `metadata.compliance[]` badges
- Add `metadata.technical.performance` metrics dashboard
- Add `metadata.support` section with SLA details
- Add `metadata.development.aiAgents[]` for real AI attribution

### Phase 3 (Optional)
- Admin UI to edit metadata.json files
- Metadata validation and schema enforcement
- A/B testing for different headline/tagline variations
- Analytics tracking for which sections drive engagement

---

## 6. Metadata Schema Validation

### Required Fields (Minimum Viable)
```json
{
  "name": "string",
  "description": "string",
  "status": "string"
}
```

### Recommended Fields (Good UX)
```json
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "status": "string",
  "category": "string",
  "tags": ["string"],
  "marketing": {
    "headline": "string",
    "keyBenefits": [{"title": "string", "description": "string"}]
  }
}
```

### Complete Schema (Full Featured)
See `fleet-digital-twin-platform-architecture/.portal/metadata.json` as reference.

---

## Summary

This mapping ensures:
1. **100% metadata-driven** content where available
2. **Graceful degradation** with multiple fallback levels
3. **No broken UI** even with minimal or missing metadata
4. **Professional appearance** regardless of data completeness
5. **Easy extensibility** for future metadata fields
