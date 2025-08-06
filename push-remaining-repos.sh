#!/bin/bash

###############################################################################
# Push Remaining Repositories That Failed Earlier
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PUSHING REMAINING REPOSITORIES${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Repositories that failed to push earlier
REMAINING_REPOS=(
  "deploymaster-sdv-ota-platform"
  "diagnostic-as-code-platform-architecture"
  "eyns-ai-experience-center"
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

SUCCESSFUL=()
FAILED=()

for repo in "${REMAINING_REPOS[@]}"; do
  echo -e "\n${BLUE}Processing: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  REPO_DIR="cloned-repositories/$repo"
  
  # Special case for eyns-ai-experience-center (it's in the parent directory)
  if [ "$repo" == "eyns-ai-experience-center" ]; then
    REPO_DIR="."
  fi
  
  if [ ! -d "$REPO_DIR/.git" ]; then
    echo -e "${YELLOW}⚠ Not a git repository: $REPO_DIR${NC}"
    continue
  fi
  
  cd "$REPO_DIR"
  
  # Set the correct remote URL
  git remote set-url origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null || \
    git remote add origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null
  
  # Get current branch
  CURRENT_BRANCH=$(git branch --show-current)
  if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
  fi
  
  # Try to push
  echo "Pushing to jamesenki/${repo}..."
  if git push -u origin "$CURRENT_BRANCH" 2>/dev/null; then
    echo -e "${GREEN}✓ Successfully pushed${NC}"
    SUCCESSFUL+=("$repo")
  else
    # Try with --force if needed (for new repos)
    if git push -u origin "$CURRENT_BRANCH" --force 2>/dev/null; then
      echo -e "${GREEN}✓ Successfully pushed (forced)${NC}"
      SUCCESSFUL+=("$repo")
    else
      echo -e "${RED}✗ Failed to push${NC}"
      FAILED+=("$repo")
    fi
  fi
  
  # Return to original directory
  if [ "$repo" == "eyns-ai-experience-center" ]; then
    cd .
  else
    cd ../..
  fi
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}Successfully pushed (${#SUCCESSFUL[@]}):${NC}"
for repo in "${SUCCESSFUL[@]}"; do
  echo "  ✓ $repo"
done

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ✗ $repo"
  done
fi

echo -e "\n${GREEN}Push complete!${NC}"