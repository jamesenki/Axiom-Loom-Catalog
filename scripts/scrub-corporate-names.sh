#!/bin/bash

# Script to remove all corporate names from repositories
# Replaces: Mazda, Honda, EY, NSlabs, NS Labs, Quaker Houghton, QH

set -e

PARENT_DIR="/Users/lisasimon/repos/eyns-innovation-repos"

echo "=== Corporate Name Scrubbing Script ==="
echo "Searching for corporate names in repositories..."

# Find all files containing corporate names
FILES=$(grep -r -l -i "mazda\|honda\|quaker.houghton\|EY Global\|NSlabs\|NS Labs" \
  --include="*.md" \
  --include="*.json" \
  --include="*.txt" \
  --include="*.yaml" \
  --include="*.yml" \
  "$PARENT_DIR" 2>/dev/null | \
  grep -v "node_modules" | \
  grep -v ".git" | \
  grep -v "build" | \
  grep -v "dist" || true)

if [ -z "$FILES" ]; then
  echo "✅ No corporate names found!"
  exit 0
fi

echo "Found files with corporate names:"
echo "$FILES" | head -20
echo ""

FILE_COUNT=$(echo "$FILES" | wc -l)
echo "Total files to scrub: $FILE_COUNT"
echo ""

# Replacements
declare -A replacements=(
  ["Mazda"]="OEM Partner"
  ["mazda"]="oem-partner"
  ["MAZDA"]="OEM_PARTNER"
  ["mazdafleet"]="fleet-platform"
  ["Honda"]="Automotive Manufacturer"
  ["honda"]="automotive-manufacturer"
  ["HONDA"]="AUTOMOTIVE_MANUFACTURER"
  ["Quaker Houghton"]="Industrial Partner"
  ["quaker.houghton"]="industrial-partner"
  ["QH"]="IP"
  ["EY Global"]="Enterprise Partner"
  ["EY"]="EP"
  ["NSlabs"]="Innovation Labs"
  ["nslabs"]="innovation-labs"
  ["NS Labs"]="Innovation Labs"
  ["EYNS"]="Axiom"
  ["eyns"]="axiom"
)

# Counter for changes
CHANGED=0

# Process each file
for file in $FILES; do
  if [ ! -f "$file" ]; then
    continue
  fi

  echo "Processing: $file"

  # Create backup
  cp "$file" "$file.bak"

  # Apply all replacements
  for find_term in "${!replacements[@]}"; do
    replace_term="${replacements[$find_term]}"

    # Use sed with case-sensitive replacement
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS sed
      sed -i '' "s/${find_term}/${replace_term}/g" "$file"
    else
      # Linux sed
      sed -i "s/${find_term}/${replace_term}/g" "$file"
    fi
  done

  # Check if file changed
  if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
    CHANGED=$((CHANGED + 1))
    echo "  ✓ Updated"
  else
    echo "  - No changes needed"
  fi

  # Remove backup
  rm "$file.bak"
done

echo ""
echo "=== Summary ==="
echo "Total files processed: $FILE_COUNT"
echo "Files changed: $CHANGED"
echo ""
echo "✅ Corporate name scrubbing complete!"
echo ""
echo "Next steps:"
echo "1. Review changes with: git diff"
echo "2. Test that nothing broke"
echo "3. Commit changes: git add . && git commit -m 'chore: Remove corporate names'"
