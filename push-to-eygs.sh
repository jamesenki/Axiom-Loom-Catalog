#!/bin/bash

###############################################################################
# Push All Repositories to EYGS Organization
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    PUSHING ALL REPOSITORIES TO EYGS ORGANIZATION${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# All repositories
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
  "nslabsdashboards"
  "remote-diagnostic-assistance-platform-architecture"
  "rentalFleets"
  "sample-arch-package"
  "sdv-architecture-orchestration"
  "sovd-diagnostic-ecosystem-platform-architecture"
  "velocityforge-sdv-platform-architecture"
)

SUCCESSFUL=()
CREATED=()
FAILED=()

for repo in "${REPOSITORIES[@]}"; do
  echo -e "\n${BLUE}Processing: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # First, check if EYGS repo exists, if not create it
  if ! gh repo view "EYGS/${repo}" >/dev/null 2>&1; then
    echo "Creating EYGS repository..."
    if gh repo create "EYGS/${repo}" \
      --public \
      --description "EYNS Platform - ${repo}" \
      --homepage "https://eyns.ai" 2>/dev/null; then
      echo -e "${GREEN}✓ Created EYGS/${repo}${NC}"
      CREATED+=("$repo")
    else
      # Try creating under user account if org fails
      if gh repo create "${repo}" \
        --public \
        --description "EYNS Platform - ${repo}" \
        --homepage "https://eyns.ai" 2>/dev/null; then
        echo -e "${GREEN}✓ Created ${repo} under user account${NC}"
        CREATED+=("$repo (user)")
      else
        echo -e "${YELLOW}⚠ Repository may already exist${NC}"
      fi
    fi
  else
    echo "Repository EYGS/${repo} already exists"
  fi
  
  # Now push the code
  REPO_DIR="cloned-repositories/$repo"
  
  # Special case for eyns-ai-experience-center
  if [ "$repo" == "eyns-ai-experience-center" ]; then
    REPO_DIR="."
  fi
  
  if [ ! -d "$REPO_DIR/.git" ]; then
    echo -e "${YELLOW}⚠ Directory not found or not a git repo: $REPO_DIR${NC}"
    continue
  fi
  
  cd "$REPO_DIR"
  
  # Try EYGS org first
  echo "Setting up EYGS remote..."
  git remote remove eygs 2>/dev/null || true
  
  # Try organization URL first
  if gh repo view "EYGS/${repo}" >/dev/null 2>&1; then
    git remote add eygs "https://github.com/EYGS/${repo}.git"
    REMOTE_URL="EYGS/${repo}"
  else
    # Fall back to user account
    git remote add eygs "https://github.com/20230011612_EYGS/${repo}.git" 2>/dev/null || \
    git remote add eygs "https://github.com/EYGS/${repo}.git"
    REMOTE_URL="20230011612_EYGS/${repo}"
  fi
  
  # Get current branch
  CURRENT_BRANCH=$(git branch --show-current)
  if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
  fi
  
  # Push to EYGS
  echo "Pushing to $REMOTE_URL..."
  if git push eygs "$CURRENT_BRANCH" --force 2>/dev/null; then
    echo -e "${GREEN}✓ Successfully pushed to EYGS${NC}"
    SUCCESSFUL+=("$repo")
  else
    echo -e "${YELLOW}⚠ Could not push to EYGS${NC}"
    FAILED+=("$repo")
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

if [ ${#CREATED[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Newly created (${#CREATED[@]}):${NC}"
  for repo in "${CREATED[@]}"; do
    echo "  ✓ $repo"
  done
fi

if [ ${#SUCCESSFUL[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Successfully pushed (${#SUCCESSFUL[@]}):${NC}"
  for repo in "${SUCCESSFUL[@]}"; do
    echo "  ✓ $repo"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${YELLOW}Failed to push (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ⚠ $repo"
  done
fi

echo -e "\n${GREEN}EYGS push process complete!${NC}"
echo "Note: Some repositories may be under the user account (20230011612_EYGS) instead of the EYGS org."