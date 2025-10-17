#!/bin/bash

# Rollback script to restore files from Git before corporate name scrubbing

set -e

PARENT_DIR="/Users/lisasimon/repos/eyns-innovation-repos"

echo "=== Corporate Name Scrubbing Rollback ==="
echo ""

cd "$PARENT_DIR"

# Find all repos with Git
REPOS=$(find . -maxdepth 2 -name ".git" -type d | sed 's|/.git||' | sed 's|^./||')

if [ -z "$REPOS" ]; then
  echo "No Git repositories found to rollback"
  exit 1
fi

echo "Found Git repositories:"
echo "$REPOS"
echo ""

ROLLBACK_COUNT=0

for repo in $REPOS; do
  if [ -d "$repo/.git" ]; then
    echo "Checking $repo..."
    cd "$PARENT_DIR/$repo"

    # Check if there are uncommitted changes
    if git diff --quiet && git diff --cached --quiet; then
      echo "  No changes to rollback"
    else
      echo "  Rolling back changes..."
      git checkout -- .
      git clean -fd
      ROLLBACK_COUNT=$((ROLLBACK_COUNT + 1))
      echo "  ✓ Rolled back"
    fi
  fi
done

cd "$PARENT_DIR"

echo ""
echo "=== Rollback Summary ==="
echo "Repositories rolled back: $ROLLBACK_COUNT"
echo "✅ Rollback complete!"
