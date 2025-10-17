#!/bin/bash

# Fix Number Corruption Script
# Restores numbers that were corrupted by the first scrubbing script

set -e

PARENT_DIR="/Users/lisasimon/repos/eyns-innovation-repos"

echo "=== Number Corruption Fix Script ==="
echo "Restoring: AUTOMOTIVE_MANUFACTURER → 0, etc."
echo ""

# Find all files with corruption
echo "Finding corrupted files..."
FILES=$(find "$PARENT_DIR" -type f \( -name "*.md" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/build/*" \
  -not -path "*/dist/*" \
  -exec grep -l "AUTOMOTIVE_MANUFACTURER" {} \; 2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "✅ No corrupted files found!"
  exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT corrupted files"
echo ""

FIXED=0

for file in $FILES; do
  if [ ! -f "$file" ]; then
    continue
  fi

  echo "Fixing: $file"

  # Use perl to fix the corrupted numbers
  perl -i -pe '
    s/AUTOMOTIVE_MANUFACTURER/0/g;
  ' "$file"

  FIXED=$((FIXED + 1))
  echo "  ✓ Fixed"
done

echo ""
echo "=== Summary ==="
echo "Files fixed: $FIXED"
echo "✅ Number corruption fixed!"
