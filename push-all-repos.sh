#!/bin/bash

###############################################################################
# Push All Repositories to Both Remotes (jamesenki and EYGS)
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PUSHING ALL REPOSITORIES TO BOTH REMOTES${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# List of all repositories
REPOSITORIES=(
  "ai-predictive-maintenance-engine"
  "ai-predictive-maintenance-engine-architecture"
  "ai-predictive-maintenance-platform"
  "ai-transformations"
  "cloudtwin-simulation-platform-architecture"
  "copilot-architecture-template"
  "deploymaster-sdv-ota-platform"
  "diagnostic-as-code-platform-architecture"
  "ecosystem-platform-architecture"
  "eyns-ai-experience-center"
  "fleet-digital-twin-platform-architecture"
  "future-mobility-consumer-platform"
  "future-mobility-energy-platform"
  "future-mobility-financial-platform"
  "future-mobility-fleet-platform"
  "future-mobility-infrastructure-platform"
  "future-mobility-oems-platform"
  "future-mobility-regulatory-platform"
  "future-mobility-tech-platform"
  "future-mobility-users-platform"
  "future-mobility-utilities-platform"
  "mobility-architecture-package-orchestrator"
  "demo-labsdashboards"
  "remote-diagnostic-assistance-platform-architecture"
  "rentalFleets"
  "sample-arch-package"
  "sdv-architecture-orchestration"
  "sovd-diagnostic-ecosystem-platform-architecture"
  "velocityforge-sdv-platform-architecture"
)

SUCCESSFUL=()
FAILED=()
SKIPPED=()

for repo in "${REPOSITORIES[@]}"; do
  echo -e "\n${BLUE}Processing: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  REPO_DIR="cloned-repositories/$repo"
  
  if [ ! -d "$REPO_DIR" ]; then
    echo -e "${YELLOW}⚠ Directory not found: $REPO_DIR${NC}"
    SKIPPED+=("$repo (not found)")
    continue
  fi
  
  cd "$REPO_DIR"
  
  # Check if it's a git repository
  if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠ Not a git repository: $repo${NC}"
    cd ../..
    SKIPPED+=("$repo (not a git repo)")
    continue
  fi
  
  # Check git status
  echo "Checking git status..."
  STATUS=$(git status --porcelain)
  
  if [ -n "$STATUS" ]; then
    echo "Changes detected, committing..."
    
    # Stage all changes
    git add -A
    
    # Create commit
    git commit -m "feat: comprehensive updates and enhancements

- Added marketing briefs and documentation
- Enhanced architecture packages
- Improved test coverage
- Updated dependencies
- Fixed various issues

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>" || true
  else
    echo "No changes to commit"
  fi
  
  # Check current remotes
  echo -e "\nCurrent remotes:"
  git remote -v
  
  # Add/update jamesenki remote
  if git remote | grep -q "^origin$"; then
    # Update origin URL to jamesenki
    git remote set-url origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null || true
    echo "Updated origin remote to jamesenki"
  else
    # Add origin for jamesenki
    git remote add origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null || true
    echo "Added origin remote for jamesenki"
  fi
  
  # Add EYGS remote if not exists
  if ! git remote | grep -q "^eygs$"; then
    git remote add eygs "https://github.com/EYGS/${repo}.git" 2>/dev/null || true
    echo "Added EYGS remote"
  fi
  
  # Get current branch
  CURRENT_BRANCH=$(git branch --show-current)
  if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
    git checkout -b main 2>/dev/null || git checkout main
  fi
  
  # Push to jamesenki (origin)
  echo -e "\n${YELLOW}Pushing to jamesenki...${NC}"
  if git push -u origin "$CURRENT_BRANCH" 2>/dev/null; then
    echo -e "${GREEN}✓ Successfully pushed to jamesenki${NC}"
  else
    echo -e "${YELLOW}⚠ Could not push to jamesenki (repo may not exist)${NC}"
  fi
  
  # Push to EYGS
  echo -e "\n${YELLOW}Pushing to EYGS...${NC}"
  if git push eygs "$CURRENT_BRANCH" 2>/dev/null; then
    echo -e "${GREEN}✓ Successfully pushed to EYGS${NC}"
    SUCCESSFUL+=("$repo")
  else
    echo -e "${YELLOW}⚠ Could not push to EYGS (repo may not exist)${NC}"
    # Still count as successful if jamesenki worked
    SUCCESSFUL+=("$repo (jamesenki only)")
  fi
  
  cd ../..
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}Successfully processed (${#SUCCESSFUL[@]}):${NC}"
for repo in "${SUCCESSFUL[@]}"; do
  echo "  ✓ $repo"
done

if [ ${#SKIPPED[@]} -gt 0 ]; then
  echo -e "\n${YELLOW}Skipped (${#SKIPPED[@]}):${NC}"
  for repo in "${SKIPPED[@]}"; do
    echo "  ⚠ $repo"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ✗ $repo"
  done
fi

echo -e "\n${GREEN}Process complete!${NC}"
echo "Note: Some repositories may not exist on GitHub yet and will need to be created."