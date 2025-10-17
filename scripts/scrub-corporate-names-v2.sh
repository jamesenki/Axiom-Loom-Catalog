#!/bin/bash

# Corporate Name Scrubbing Script V2
# Improved with word boundaries to prevent number corruption
# Maps all corporate names to Axiom

set -e

PARENT_DIR="/Users/lisasimon/repos/eyns-innovation-repos"

echo "=== Corporate Name Scrubbing Script V2 ==="
echo "Mapping: Mazda, Honda, EY, NSlabs, Quaker Houghton → Axiom"
echo ""

# Find all files containing corporate names
echo "Step 1: Finding files with corporate names..."
FILES=$(grep -r -l -iE "\b(mazda|honda|quaker.houghton|EY Global|EY\b|NSlabs|NS Labs|EYNS)\b" \
  --include="*.md" \
  --include="*.json" \
  --include="*.txt" \
  --include="*.yaml" \
  --include="*.yml" \
  "$PARENT_DIR" 2>/dev/null | \
  grep -v "node_modules" | \
  grep -v ".git" | \
  grep -v "build" | \
  grep -v "dist" | \
  grep -v "scripts/scrub-corporate-names" || true)

if [ -z "$FILES" ]; then
  echo "✅ No corporate names found!"
  exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT files to process"
echo ""

# Counter
CHANGED=0
SKIPPED=0

# Process each file using Perl for better regex support
for file in $FILES; do
  if [ ! -f "$file" ]; then
    continue
  fi

  echo "Processing: $file"

  # Create backup
  cp "$file" "$file.scrub-backup"

  # Apply replacements using Perl with word boundaries
  perl -i -pe '
    # Mazda variations (case-insensitive word boundary)
    s/\bMazda\b/Axiom/g;
    s/\bmazda\b/axiom/g;
    s/\bMAZDA\b/AXIOM/g;
    s/\bmazdafleet\b/axiom-fleet/g;
    s/\bMazdaFleet\b/AxiomFleet/g;

    # Honda variations
    s/\bHonda\b/Axiom/g;
    s/\bhonda\b/axiom/g;
    s/\bHONDA\b/AXIOM/g;

    # EY variations
    s/\bEY Global\b/Axiom/g;
    s/\bEY\b/Axiom/g;
    s/\bey\b/axiom/g;

    # NSlabs / NS Labs variations
    s/\bNSlabs\b/Axiom/g;
    s/\bnslabs\b/axiom/g;
    s/\bNS Labs\b/Axiom Labs/g;
    s/\bns labs\b/axiom labs/g;

    # EYNS variations (specific cases)
    s/\bEYNS\b/Axiom/g;
    s/\beyns\b/axiom/g;
    s/\beyns-/axiom-/g;

    # Quaker Houghton variations
    s/\bQuaker Houghton\b/Industrial Partner/g;
    s/\bquaker.houghton\b/industrial-partner/g;
    s/\bQH\b/IP/g;
  ' "$file"

  # Check if file changed
  if ! diff -q "$file" "$file.scrub-backup" > /dev/null 2>&1; then
    CHANGED=$((CHANGED + 1))
    echo "  ✓ Updated"
    rm "$file.scrub-backup"
  else
    echo "  - No changes needed"
    SKIPPED=$((SKIPPED + 1))
    # Restore from backup
    mv "$file.scrub-backup" "$file"
  fi
done

echo ""
echo "=== Summary ==="
echo "Total files processed: $FILE_COUNT"
echo "Files changed: $CHANGED"
echo "Files skipped: $SKIPPED"
echo ""
echo "✅ Corporate name scrubbing complete!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test that nothing broke"
echo "3. Commit: git add . && git commit -m 'chore: Replace corporate names with Axiom'"
