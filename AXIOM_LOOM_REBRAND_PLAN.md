# Axiom Loom Rebranding Plan

## Project: Complete Rebranding from Axiom Loom to Axiom Loom

### New Brand Identity
- **Name:** Axiom Loom Catalog
- **Tagline:** Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!
- **Domain References:** axiom-loom.ai (replace axiom-loom.ai)
- **Organization:** Axiom Loom (replace Axiom Loom/EY/Axiom Loom)

---

## COMPREHENSIVE REBRANDING CHECKLIST

### Phase 1: Text Content Updates

#### 1.1 Source Code Files
- [ ] **React Components** (`src/components/*.tsx`, `src/components/*.jsx`)
  - Replace "Axiom Loom Catalog" → "Axiom Loom Catalog"
  - Replace "Axiom Loom Platform" → "Axiom Loom Platform"
  - Update all UI text references

- [ ] **App Configuration** (`src/App.tsx`, `src/index.tsx`)
  - Update app title
  - Update meta descriptions
  - Replace brand references

- [ ] **API/Backend** (`src/api/*.js`, `src/server.js`)
  - Update API endpoint descriptions
  - Replace comments mentioning Axiom Loom/EY
  - Update response messages

- [ ] **Test Files** (`**/*.test.tsx`, `**/*.test.js`, `**/*.spec.ts`)
  - Update test descriptions
  - Replace Axiom Loom references in assertions
  - Update snapshot tests

#### 1.2 Configuration Files
- [ ] `package.json`
  - name: "axiom-loom-catalog"
  - description: Update to Axiom Loom
  - homepage: Update URL
  - author: Axiom Loom

- [ ] `README.md`
  - Complete rewrite with Axiom Loom branding
  - New tagline
  - Updated installation instructions

- [ ] `CLAUDE.md`
  - Update project name and references
  - Replace Axiom Loom with Axiom Loom

- [ ] Docker files (`Dockerfile`, `docker-compose.yml`)
  - Update image names
  - Replace comments
  - Update labels

#### 1.3 Documentation
- [ ] All markdown files (`docs/*.md`, `*.md`)
- [ ] API documentation
- [ ] Deployment guides
- [ ] Contributing guidelines

### Phase 2: HTML and Public Assets

#### 2.1 HTML Files
- [ ] `public/index.html`
  - Update `<title>` tag
  - Update meta descriptions
  - Replace Open Graph tags
  - Update favicon references

#### 2.2 Repository Metadata
- [ ] `repository-metadata.json`
  - Update all repository descriptions
  - Replace Axiom Loom/Axiom Loom references
  - Update organization field

### Phase 3: Environment and Config

#### 3.1 Environment Files
- [ ] `.env`, `.env.example`, `.env.production`
  - Update REACT_APP_TITLE
  - Update API URLs
  - Replace domain references

#### 3.2 CI/CD and Scripts
- [ ] GitHub Actions (`.github/workflows/*.yml`)
- [ ] Shell scripts (`*.sh`)
- [ ] Deployment scripts

### Phase 4: Repository Content

#### 4.1 Marketing Briefs
- [ ] All `marketing-brief.md` files in cloned repositories
- [ ] Replace company references
- [ ] Update copyright notices

#### 4.2 Repository Names (Decision Required)
- Consider if repository names should change
- Update references in code if changed

### Phase 5: Test Data and Fixtures

- [ ] Test fixtures
- [ ] Mock data
- [ ] E2E test configurations

### Phase 6: Legal and Copyright

- [ ] License files
- [ ] Copyright headers
- [ ] Terms of service references
- [ ] Privacy policy references

---

## SEARCH AND REPLACE PATTERNS

### Primary Replacements
```
Axiom Loom Catalog → Axiom Loom Catalog
Axiom Loom Platform → Axiom Loom Platform
Axiom Loom → Axiom Loom
eyns → axiom-loom (in URLs/paths)
axiom-loom.ai → axiom-loom.ai
Axiom Loom Innovation → Axiom Loom Innovation
Axiom Loom → Axiom Loom
Ernst and Young → Axiom Loom
Axiom Loom → Axiom Loom
EYGS → Axiom Loom
```

### Case Variations to Check
- Axiom Loom, Eyns, eyns
- EY, Ey, ey
- EYGS, Eygs, eygs

### Context-Specific Replacements
- "Axiom Loom team" → "Axiom Loom team"
- "Axiom Loom architecture" → "Axiom Loom architecture"
- "Axiom Loom solutions" → "Axiom Loom solutions"
- "© 2025 Axiom Loom" → "© 2025 Axiom Loom"

---

## IMPLEMENTATION SCRIPT

### Automated Search and Replace Script
```bash
#!/bin/bash
# Save as: axiom-loom-rebrand.sh

# Create backup
git stash
git checkout -b axiom-loom-rebrand-backup
git stash pop

# Primary replacements
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" -o -name "*.yml" -o -name "*.yaml" -o -name "*.sh" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec sed -i.bak 's/Axiom Loom Catalog/Axiom Loom Catalog/g' {} \;

# Continue with other patterns...
```

---

## MANUAL REVIEW CHECKLIST

### Critical Files Requiring Manual Review
1. **package.json** - Verify all fields
2. **public/index.html** - Check all meta tags
3. **README.md** - Ensure complete rebranding
4. **src/App.tsx** - Verify main app title
5. **repository-metadata.json** - Check all entries

### Visual Elements to Update
1. Logo references
2. Favicon
3. Social media preview images
4. Documentation diagrams

### Testing After Rebranding
1. Run all unit tests
2. Run E2E tests
3. Build production bundle
4. Test Docker deployment
5. Verify all links work
6. Check for console errors

---

## VERIFICATION COMMANDS

```bash
# Find remaining Axiom Loom references
grep -r "Axiom Loom" --exclude-dir=node_modules --exclude-dir=.git .

# Find remaining Axiom Loom references (careful with words like "they")
grep -r "\bEY\b" --exclude-dir=node_modules --exclude-dir=.git .

# Find remaining Ernst references
grep -r "Ernst" --exclude-dir=node_modules --exclude-dir=.git .

# Find domain references
grep -r "axiom-loom.ai" --exclude-dir=node_modules --exclude-dir=.git .

# Case-insensitive search
grep -ri "eyns\|ernst\|young" --exclude-dir=node_modules --exclude-dir=.git .
```

---

## ROLLBACK PLAN

If issues arise:
1. `git checkout main`
2. `git branch -D CleanIP`
3. `git checkout -b CleanIP`
4. Start fresh with more careful approach

---

## SUCCESS CRITERIA

- [ ] Zero references to Axiom Loom, EY, Axiom Loom remain
- [ ] All tests pass
- [ ] Application builds successfully
- [ ] Docker deployment works
- [ ] No broken links or references
- [ ] UI displays "Axiom Loom Catalog" consistently
- [ ] Tagline appears correctly

---

## ESTIMATED EFFORT

- Automated replacements: 30 minutes
- Manual review and fixes: 2-3 hours
- Testing and verification: 1 hour
- Total: ~4-5 hours

---

Generated: 2025-08-06