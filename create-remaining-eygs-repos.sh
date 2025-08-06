#!/bin/bash

###############################################################################
# Create Remaining EYGS Repositories as PRIVATE
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    CREATING REMAINING REPOS AS PRIVATE FOR 20230011612_EYGS${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Repositories that need to be created as PRIVATE
REMAINING_REPOS=(
  "ai-predictive-maintenance-engine"
  "ai-predictive-maintenance-platform"
  "ai-transformations"
  "cloudtwin-simulation-platform-architecture"
  "deploymaster-sdv-ota-platform"
  "diagnostic-as-code-platform-architecture"
  "fleet-digital-twin-platform-architecture"
  "future-mobility-energy-platform"
  "future-mobility-financial-platform"
  "future-mobility-infrastructure-platform"
  "future-mobility-users-platform"
  "remote-diagnostic-assistance-platform-architecture"
  "sdv-architecture-orchestration"
  "velocityforge-sdv-platform-architecture"
)

SUCCESSFUL=()
CREATED=()
FAILED=()

# Verify we're using the right account
CURRENT_USER=$(GITHUB_TOKEN="" gh api user | jq -r '.login')
echo -e "${BLUE}Current GitHub user: ${CURRENT_USER}${NC}"

if [ "$CURRENT_USER" != "20230011612_EYGS" ]; then
  echo -e "${RED}ERROR: Not authenticated as 20230011612_EYGS${NC}"
  exit 1
fi

for repo in "${REMAINING_REPOS[@]}"; do
  echo -e "\n${BLUE}Processing: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Create as PRIVATE repository
  echo "Creating PRIVATE repository 20230011612_EYGS/${repo}..."
  if GITHUB_TOKEN="" gh repo create "${repo}" \
    --private \
    --description "EYNS Platform - ${repo}" \
    --homepage "https://eyns.ai" 2>&1; then
    echo -e "${GREEN}✓ Created repository: 20230011612_EYGS/${repo}${NC}"
    CREATED+=("$repo")
    
    # Now push the code
    REPO_DIR="cloned-repositories/$repo"
    if [ "$repo" == "eyns-ai-experience-center" ]; then
      REPO_DIR="."
    fi
    
    if [ -d "$REPO_DIR/.git" ]; then
      cd "$REPO_DIR"
      
      # Remove any existing eygs remote and add the correct one
      git remote remove eygs 2>/dev/null || true
      git remote add eygs "https://github.com/20230011612_EYGS/${repo}.git"
      
      # Get current branch
      CURRENT_BRANCH=$(git branch --show-current)
      if [ -z "$CURRENT_BRANCH" ]; then
        CURRENT_BRANCH="main"
      fi
      
      # Push to 20230011612_EYGS
      echo -e "${YELLOW}Pushing to 20230011612_EYGS/${repo}...${NC}"
      if git push eygs "$CURRENT_BRANCH" --force 2>&1; then
        echo -e "${GREEN}✓ Successfully pushed to 20230011612_EYGS/${repo}${NC}"
        SUCCESSFUL+=("$repo")
      else
        echo -e "${RED}✗ Failed to push${NC}"
        FAILED+=("$repo")
      fi
      
      # Return to base directory
      if [ "$repo" == "eyns-ai-experience-center" ]; then
        cd .
      else
        cd ../..
      fi
    fi
  else
    echo -e "${YELLOW}⚠ Repository may already exist${NC}"
    # Try to push anyway if it exists
    REPO_DIR="cloned-repositories/$repo"
    if [ -d "$REPO_DIR/.git" ]; then
      cd "$REPO_DIR"
      git remote remove eygs 2>/dev/null || true
      git remote add eygs "https://github.com/20230011612_EYGS/${repo}.git"
      CURRENT_BRANCH=$(git branch --show-current)
      if [ -z "$CURRENT_BRANCH" ]; then
        CURRENT_BRANCH="main"
      fi
      echo -e "${YELLOW}Attempting to push existing repo...${NC}"
      if git push eygs "$CURRENT_BRANCH" --force 2>&1; then
        echo -e "${GREEN}✓ Successfully pushed to 20230011612_EYGS/${repo}${NC}"
        SUCCESSFUL+=("$repo")
      else
        FAILED+=("$repo")
      fi
      cd ../..
    fi
  fi
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if [ ${#CREATED[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Newly created (${#CREATED[@]}):${NC}"
  for repo in "${CREATED[@]}"; do
    echo "  ✓ 20230011612_EYGS/$repo"
  done
fi

if [ ${#SUCCESSFUL[@]} -gt 0 ]; then
  echo -e "\n${GREEN}Successfully pushed (${#SUCCESSFUL[@]}):${NC}"
  for repo in "${SUCCESSFUL[@]}"; do
    echo "  ✓ 20230011612_EYGS/$repo"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "\n${RED}Failed (${#FAILED[@]}):${NC}"
  for repo in "${FAILED[@]}"; do
    echo "  ✗ $repo"
  done
fi

echo -e "\n${GREEN}Remaining repositories created and pushed!${NC}"