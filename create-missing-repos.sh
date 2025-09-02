#!/bin/bash

###############################################################################
# Create Missing Repositories on GitHub
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    CREATING MISSING REPOSITORIES ON GITHUB${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Repositories that need to be created based on the push failures
MISSING_REPOS=(
  "deploymaster-sdv-ota-platform"
  "diagnostic-as-code-platform-architecture"
  "ecosystem-platform-architecture"
  "future-mobility-energy-platform"
  "future-mobility-financial-platform"
  "future-mobility-infrastructure-platform"
  "nslabsdashboards"
  "remote-diagnostic-assistance-platform-architecture"
  "rentalFleets"
  "sample-arch-package"
  "sdv-architecture-orchestration"
  "sovd-diagnostic-ecosystem-platform-architecture"
  "velocityforge-sdv-platform-architecture"
)

CREATED=()
FAILED=()

for repo in "${MISSING_REPOS[@]}"; do
  echo -e "\n${BLUE}Creating repository: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Check if repository already exists
  if gh repo view "jamesenki/${repo}" >/dev/null 2>&1; then
    echo -e "${YELLOW}Repository already exists: jamesenki/${repo}${NC}"
    continue
  fi
  
  # Create the repository
  if gh repo create "jamesenki/${repo}" \
    --public \
    --description "Axiom Loom Platform - ${repo}" \
    --homepage "https://eyns.ai" 2>/dev/null; then
    echo -e "${GREEN}✓ Created repository: jamesenki/${repo}${NC}"
    CREATED+=("$repo")
    
    # Now push the existing code
    REPO_DIR="cloned-repositories/$repo"
    if [ -d "$REPO_DIR/.git" ]; then
      cd "$REPO_DIR"
      
      # Set the remote URL
      git remote set-url origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null || \
        git remote add origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null
      
      # Push the code
      echo "Pushing code to new repository..."
      if git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null; then
        echo -e "${GREEN}✓ Code pushed successfully${NC}"
      else
        echo -e "${YELLOW}⚠ Could not push code automatically${NC}"
      fi
      
      cd ../..
    fi
  else
    echo -e "${RED}✗ Failed to create repository: ${repo}${NC}"
    FAILED+=("$repo")
  fi
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if [ ${#CREATED[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Successfully created (${#CREATED[@]}):${NC}"
  for repo in "${CREATED[@]}"; do
    echo "  ✓ $repo"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed to create (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ✗ $repo"
  done
fi

echo -e "\n${GREEN}Repository creation complete!${NC}"