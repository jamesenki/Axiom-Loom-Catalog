#!/bin/bash

###############################################################################
# Push ALL Repositories to jamesenki Account
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    CREATING & PUSHING ALL REPOS TO jamesenki${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# All 29 repositories
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
CREATED=()
FAILED=()

# First, verify we're using the right account
CURRENT_USER=$(gh api user | jq -r '.login')
echo -e "${BLUE}Current GitHub user: ${CURRENT_USER}${NC}"

if [ "$CURRENT_USER" != "jamesenki" ]; then
  echo -e "${RED}ERROR: Not authenticated as jamesenki${NC}"
  echo "Please run: unset GITHUB_TOKEN && gh auth switch --user jamesenki"
  exit 1
fi

for repo in "${REPOSITORIES[@]}"; do
  echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}Processing: ${repo}${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  
  # Check if repo exists, if not create it
  if ! gh repo view "jamesenki/${repo}" >/dev/null 2>&1; then
    echo "Creating repository jamesenki/${repo}..."
    if gh repo create "${repo}" \
      --public \
      --description "Axiom Loom Platform - ${repo}" \
      --homepage "https://eyns.ai"; then
      echo -e "${GREEN}✓ Created repository: jamesenki/${repo}${NC}"
      CREATED+=("$repo")
    else
      echo -e "${RED}✗ Failed to create repository${NC}"
      FAILED+=("$repo")
      continue
    fi
  else
    echo "Repository already exists: jamesenki/${repo}"
  fi
  
  # Navigate to repository directory
  REPO_DIR="cloned-repositories/$repo"
  if [ "$repo" == "eyns-ai-experience-center" ]; then
    REPO_DIR="."
  fi
  
  if [ ! -d "$REPO_DIR/.git" ]; then
    echo -e "${YELLOW}⚠ Not a git repository: $REPO_DIR${NC}"
    continue
  fi
  
  cd "$REPO_DIR"
  
  # Remove any existing eygs remote and add the correct one
  git remote remove eygs 2>/dev/null || true
  git remote add eygs "https://github.com/jamesenki/${repo}.git"
  
  echo "Remote added: https://github.com/jamesenki/${repo}.git"
  
  # Get current branch
  CURRENT_BRANCH=$(git branch --show-current)
  if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
    git checkout -b main 2>/dev/null || git checkout main
  fi
  
  # Push to jamesenki
  echo -e "${YELLOW}Pushing to jamesenki/${repo}...${NC}"
  
  # Try normal push first
  if git push eygs "$CURRENT_BRANCH" 2>&1; then
    echo -e "${GREEN}✓ Successfully pushed to jamesenki/${repo}${NC}"
    SUCCESSFUL+=("$repo")
  else
    # If that fails, try force push
    echo "Normal push failed, trying force push..."
    if git push eygs "$CURRENT_BRANCH" --force 2>&1; then
      echo -e "${GREEN}✓ Successfully pushed to jamesenki/${repo} (forced)${NC}"
      SUCCESSFUL+=("$repo")
    else
      echo -e "${RED}✗ Failed to push to jamesenki/${repo}${NC}"
      FAILED+=("$repo")
    fi
  fi
  
  # Return to base directory
  if [ "$repo" == "eyns-ai-experience-center" ]; then
    cd .
  else
    cd ../..
  fi
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    FINAL SUMMARY FOR jamesenki${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if [ ${#CREATED[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Newly created (${#CREATED[@]}):${NC}"
  for repo in "${CREATED[@]}"; do
    echo "  ✓ jamesenki/$repo"
  done
fi

if [ ${#SUCCESSFUL[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Successfully pushed (${#SUCCESSFUL[@]}):${NC}"
  for repo in "${SUCCESSFUL[@]}"; do
    echo "  ✓ jamesenki/$repo"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ✗ $repo"
  done
fi

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Process complete for jamesenki account!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"