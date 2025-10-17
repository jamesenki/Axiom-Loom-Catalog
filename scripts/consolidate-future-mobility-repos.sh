#!/bin/bash
# Consolidate Future Mobility Repositories
# Archives old separate repos and pushes consolidated ones to GitHub

set -e

echo "=== Future Mobility Repository Consolidation ==="
echo ""

# Configuration
GITHUB_USER="jamesenki"
OLD_REPOS=(
  "future-mobility-fleet-platform"
  "future-mobility-oems-platform"
  "future-mobility-regulatory-platform"
  "future-mobility-tech-platform"
)
CONSOLIDATED_REPOS=(
  "future-mobility-enterprise-platform"
  "future-mobility-utilities-platform"
  "future-mobility-consumer-platform"
)

# Step 1: Archive old repos in GitHub
echo "Step 1: Archiving old separate repositories in GitHub..."
for repo in "${OLD_REPOS[@]}"; do
  echo -n "  Checking $repo... "
  if GITHUB_TOKEN="" gh repo view $GITHUB_USER/$repo --json name 2>/dev/null | grep -q name; then
    echo "EXISTS - archiving..."
    GITHUB_TOKEN="" gh repo archive $GITHUB_USER/$repo --yes 2>/dev/null || echo "    (already archived or error)"
    echo "    ✓ Archived"
  else
    echo "DOES NOT EXIST - skipping"
  fi
done
echo ""

# Step 2: Check consolidated repos in GitHub
echo "Step 2: Checking consolidated repositories..."
cd cloned-repositories
for repo in "${CONSOLIDATED_REPOS[@]}"; do
  echo -n "  $repo: "
  if [ -d "$repo" ]; then
    echo "✓ Exists locally"

    # Check if it exists in GitHub
    if GITHUB_TOKEN="" gh repo view $GITHUB_USER/$repo --json name 2>/dev/null | grep -q name; then
      echo "    ✓ Exists in GitHub"
    else
      echo "    ✗ Does NOT exist in GitHub - will create"
    fi
  else
    echo "✗ Missing locally - ERROR!"
    exit 1
  fi
done
echo ""

# Step 3: Initialize git repos if needed and push to GitHub
echo "Step 3: Pushing consolidated repositories to GitHub..."
for repo in "${CONSOLIDATED_REPOS[@]}"; do
  echo "Processing $repo..."
  cd "$repo"

  # Check if git repo is initialized
  if [ ! -d ".git" ]; then
    echo "  Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Consolidated Future Mobility platform

This repository consolidates multiple Future Mobility platform components
into a unified solution with comprehensive metadata and documentation.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
  fi

  # Check if GitHub repo exists
  if ! GITHUB_TOKEN="" gh repo view $GITHUB_USER/$repo --json name 2>/dev/null | grep -q name; then
    echo "  Creating GitHub repository..."
    GITHUB_TOKEN="" gh repo create $GITHUB_USER/$repo --private --source=. --remote=origin --push
  else
    echo "  Repository exists in GitHub"
    # Check if remote exists
    if ! git remote get-url origin 2>/dev/null; then
      echo "  Adding remote origin..."
      git remote add origin git@github.com:$GITHUB_USER/$repo.git
    fi

    # Push to GitHub
    echo "  Pushing to GitHub..."
    git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || echo "    (already up to date)"
  fi

  cd ..
  echo "  ✓ $repo ready"
  echo ""
done

echo "=== Consolidation Complete ==="
echo ""
echo "Archived repositories (old):"
for repo in "${OLD_REPOS[@]}"; do
  echo "  - $repo (archived)"
done
echo ""
echo "Active repositories (consolidated):"
for repo in "${CONSOLIDATED_REPOS[@]}"; do
  echo "  - $repo (active)"
done
echo ""
echo "Next steps:"
echo "1. Update scripts/clone-repositories.sh with consolidated names"
echo "2. Remove old repos from clone script"
echo "3. Rebuild and redeploy to Azure"
