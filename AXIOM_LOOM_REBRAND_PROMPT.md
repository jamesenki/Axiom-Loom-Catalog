# Axiom Loom Rebranding Task Prompt

## CRITICAL MISSION: Complete Rebranding to Axiom Loom

You are tasked with completely rebranding this project from EYNS/EY/Ernst & Young to Axiom Loom. This is a comprehensive rebranding that must be thorough and leave zero references to the old brand.

### YOUR OBJECTIVES:

1. **Replace ALL references** to:
   - EYNS → Axiom Loom
   - EY → Axiom Loom  
   - Ernst & Young → Axiom Loom
   - Ernst and Young → Axiom Loom
   - EYGS → Axiom Loom
   - eyns (lowercase) → axiom-loom
   - eyns.ai → axiom-loom.ai

2. **Update the brand identity**:
   - App Name: "Axiom Loom Catalog"
   - Tagline: "Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!"
   - Company: Axiom Loom
   - Domain: axiom-loom.ai

### STEP-BY-STEP EXECUTION:

#### Step 1: Create Safety Backup
```bash
git add -A
git commit -m "chore: backup before Axiom Loom rebrand"
```

#### Step 2: Run Automated Replacements
Execute systematic find-and-replace operations across all file types:
- Source code files (*.js, *.jsx, *.ts, *.tsx)
- Configuration files (*.json, *.yml, *.yaml)
- Documentation (*.md)
- Web files (*.html, *.css)
- Scripts (*.sh, *.bat)

#### Step 3: Update Critical Files Manually
1. **package.json**
   - name: "axiom-loom-catalog"
   - description: Include new tagline
   - homepage: Update to axiom-loom domain

2. **public/index.html**
   - Title: "Axiom Loom Catalog"
   - Meta descriptions
   - Open Graph tags

3. **README.md**
   - Complete rewrite with Axiom Loom branding
   - New tagline prominently displayed

4. **src/App.tsx**
   - App title
   - Header text
   - Footer copyright

#### Step 4: Update Repository Metadata
- repository-metadata.json
- All marketing-brief.md files
- Test fixtures and mock data

#### Step 5: Environment Configuration
- .env files
- Docker configurations
- CI/CD workflows

#### Step 6: Verification
Run these commands to ensure complete rebranding:
```bash
# Find any remaining EYNS references
grep -r "EYNS" --exclude-dir=node_modules --exclude-dir=.git .

# Find any remaining EY references
grep -r "\bEY\b" --exclude-dir=node_modules --exclude-dir=.git .

# Find any remaining Ernst references  
grep -r "Ernst" --exclude-dir=node_modules --exclude-dir=.git .

# Find any remaining EYGS references
grep -r "EYGS" --exclude-dir=node_modules --exclude-dir=.git .

# Check for domain references
grep -r "eyns.ai" --exclude-dir=node_modules --exclude-dir=.git .
```

#### Step 7: Testing
```bash
# Run tests
npm test

# Build the application
npm run build

# Start and verify
npm start
```

#### Step 8: Commit Changes
```bash
git add -A
git commit -m "feat: complete rebrand to Axiom Loom Catalog

- Replaced all EYNS/EY/Ernst & Young references with Axiom Loom
- Updated app name to 'Axiom Loom Catalog'
- Added tagline: 'Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!'
- Updated all configuration files
- Updated documentation and metadata
- Verified zero references to old brand remain"
```

### IMPORTANT NOTES:

1. **Be Thorough**: Check EVERY file type, including:
   - Comments in code
   - Console.log statements
   - Error messages
   - Test descriptions
   - API responses
   - Docker labels
   - Script comments

2. **Preserve Functionality**: 
   - Don't break any imports or file paths
   - Maintain all existing features
   - Keep all tests passing

3. **Case Sensitivity**: Watch for variations:
   - EYNS, Eyns, eyns
   - EY, ey
   - EYGS, Eygs, eygs

4. **Context Matters**: 
   - Don't replace "they" when looking for "ey"
   - Don't replace parts of other words
   - Use word boundaries in regex

5. **Special Attention**:
   - Copyright notices: "© 2025 Axiom Loom"
   - Email domains: @axiom-loom.ai
   - GitHub URLs: May need to stay as-is initially

### SUCCESS CRITERIA:
- ✅ Zero references to EYNS, EY, Ernst & Young, EYGS
- ✅ App displays "Axiom Loom Catalog" 
- ✅ Tagline visible: "Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!"
- ✅ All tests pass
- ✅ Application builds and runs
- ✅ No console errors

### DELIVERABLES:
1. Fully rebranded codebase on CleanIP branch
2. Verification report showing zero old brand references
3. Screenshot of running app with new branding
4. Test results showing all passing

BEGIN THE REBRANDING NOW!