#!/bin/bash

# Cleanup script to remove unnecessary clutter and old files
# This prepares the repository for public release

echo "🧹 Starting repository cleanup..."
echo ""

# Counter for removed items
REMOVED=0

# 1. Remove test/debug screenshots (keep only homepage.png for README)
echo "📸 Removing test/debug screenshots..."
find . -maxdepth 1 -type f \( \
    -name "*test*.png" \
    -o -name "*debug*.png" \
    -o -name "*qa*.png" \
    -o -name "*verification*.png" \
    -o -name "*contrast*.png" \
    -o -name "*blur*.png" \
    -o -name "*check*.png" \
    -o -name "*hover*.png" \
    -o -name "*api-explorer*.png" \
    -o -name "*screenshot*.png" \
    -o -name "*result*.png" \
    -o -name "*error*.png" \
    -o -name "readme-*.png" \
    -o -name "repository-*.png" \
    -o -name "coming-soon*.png" \
    -o -name "*deployed*.png" \
    -o -name "*actual*.png" \
    -o -name "*current*.png" \
    -o -name "*final*.png" \
    -o -name "*proof*.png" \
    -o -name "*axiom*.png" \
    -o -name "*clean*.png" \
    -o -name "*during*.png" \
    -o -name "*after*.png" \
    -o -name "*before*.png" \
    -o -name "detailed*.png" \
    -o -name "*deployment*.png" \
    -o -name "*documentation*.png" \
    -o -name "*broken*.png" \
    -o -name "*color*.png" \
    -o -name "high-*.png" \
    -o -name "*manual*.png" \
    -o -name "*state*.png" \
    -o -name "*ui*.png" \
    -o -name "visual*.png" \
    -o -name "*white*.png" \
    -o -name "*black*.png" \
    -o -name "*bright*.png" \
    -o -name "*text*.png" \
    -o -name "*apis*.png" \
    -o -name "*docs*.png" \
    -o -name "*graphql*.png" \
    -o -name "*page*.png" \
\) ! -name "homepage.png" -delete
REMOVED=$((REMOVED + $(find . -maxdepth 1 -name "*.png" ! -name "homepage.png" 2>/dev/null | wc -l)))

# 2. Remove test/debug scripts
echo "🔧 Removing test/debug scripts..."
find . -maxdepth 1 -type f \( \
    -name "test-*.js" \
    -o -name "debug-*.js" \
    -o -name "check-*.js" \
    -o -name "verify-*.js" \
    -o -name "analyze*.js" \
    -o -name "capture-*.js" \
    -o -name "content_*.js" \
    -o -name "sync-repos-properly.js" \
\) -delete
REMOVED=$((REMOVED + 76))

# 3. Remove validation and report JSON files
echo "📊 Removing report JSON files..."
find . -maxdepth 1 -type f \( \
    -name "*-report*.json" \
    -o -name "*-results*.json" \
    -o -name "*-validation*.json" \
    -o -name "*-status*.json" \
    -o -name "content-*.json" \
    -o -name "repositories-temp.json" \
    -o -name "curation-*.json" \
    -o -name "phase2-*.json" \
\) -delete
REMOVED=$((REMOVED + 15))

# 4. Remove old markdown reports (keep main documentation)
echo "📄 Removing report markdown files..."
find . -maxdepth 1 -type f \( \
    -name "*REPORT*.md" \
    -o -name "*VALIDATION*.md" \
    -o -name "*TEST*.md" \
    -o -name "*STATUS*.md" \
    -o -name "*SUMMARY*.md" \
    -o -name "*ANALYSIS*.md" \
    -o -name "*REQUIREMENTS*.md" \
    -o -name "*PLAN*.md" \
    -o -name "*PROMPT*.md" \
    -o -name "*SUCCESS*.md" \
    -o -name "*FIXES*.md" \
    -o -name "*CHECKLIST*.md" \
    -o -name "*VERIFICATION*.md" \
    -o -name "CONVERSATION*.md" \
    -o -name "WORK_SUMMARY*.md" \
    -o -name "SESSION*.md" \
    -o -name "*POLICY*.md" \
    -o -name "*STANDARD*.md" \
    -o -name "BROWSER*.md" \
    -o -name "DIRECT*.md" \
    -o -name "NETWORK*.md" \
    -o -name "FINAL*.md" \
    -o -name "POST_*.md" \
    -o -name "RULES.md" \
    -o -name "Jul25Chat.txt" \
\) ! -name "README.md" ! -name "CLAUDE.md" ! -name "DEPLOYMENT.md" ! -name "DOCKER_DEPLOYMENT.md" ! -name "SPECIFICATION.md" -delete
REMOVED=$((REMOVED + 29))

# 5. Remove screenshot directories
echo "📁 Removing screenshot directories..."
rm -rf screenshots/ uat-screenshots/ debug-screenshots/ visual-test-screenshots/
REMOVED=$((REMOVED + 4))

# 6. Remove old shell scripts (keep important ones)
echo "🗑️  Removing old shell scripts..."
find . -maxdepth 1 -type f \( \
    -name "push-*.sh" \
    -o -name "create-*.sh" \
    -o -name "fix-*.sh" \
    -o -name "execute-*.sh" \
    -o -name "quick-*.sh" \
    -o -name "run-ip-test.sh" \
\) ! -name "scrub-corporate-names.sh" -delete

# 7. Remove old python scripts
echo "🐍 Removing old python scripts..."
find . -maxdepth 1 -type f \( \
    -name "curation-script.py" \
    -o -name "phase2-*.py" \
    -o -name "*network*.py" \
\) -delete

# 8. Remove test configuration files
echo "⚙️  Removing test config files..."
find . -maxdepth 1 -type f \( \
    -name "playwright.config.ip.ts" \
    -o -name "lighthouserc.js" \
    -o -name "comprehensive-*.spec.ts" \
\) -delete

# 9. Remove performance reports
echo "📈 Removing performance reports..."
rm -rf performance-reports/
find . -maxdepth 1 -type f -name "performance-*.txt" -delete
find . -maxdepth 1 -type f -name "network-*.txt" -delete

# 10. Remove old docker compose files (keep main ones)
echo "🐳 Cleaning up old docker files..."
find . -maxdepth 1 -type f \( \
    -name "docker-compose.local.yml" \
    -o -name "docker-compose.production.yml" \
    -o -name "Dockerfile.test" \
\) -delete

# 11. Remove .svg test files
echo "🎨 Removing test SVG files..."
find . -maxdepth 1 -type f -name "test-*.svg" -delete

# 12. Remove old config files
echo "🔧 Removing old config files..."
find . -maxdepth 1 -type f \( \
    -name "axiom-config-template.json" \
    -o -name "ecosystem.config.js" \
    -o -name "nginx-static.conf" \
\) -delete

echo ""
echo "✅ Cleanup complete!"
echo "   Repository is now clean and ready for public release"
echo ""
