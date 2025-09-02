#!/bin/bash

###############################################################################
# Axiom Loom Complete Rebranding Script
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    AXIOM LOOM REBRANDING EXECUTION${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Counter for replacements
TOTAL_REPLACEMENTS=0

# Function to perform replacement and count
replace_in_files() {
    local pattern="$1"
    local replacement="$2"
    local file_pattern="$3"
    
    echo -e "${YELLOW}Replacing: ${pattern} → ${replacement}${NC}"
    
    # Find files and perform replacement
    find . -type f \( ${file_pattern} \) \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/build/*" \
        -not -path "*/dist/*" \
        -not -path "*/cloned-repositories/*" \
        -not -path "*/lib/*" \
        -not -path "*/coverage/*" \
        -not -path "*/.bak" \
        -exec grep -l "${pattern}" {} \; 2>/dev/null | while read file; do
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/${pattern}/${replacement}/g" "$file"
        else
            # Linux
            sed -i "s/${pattern}/${replacement}/g" "$file"
        fi
        echo "  ✓ Updated: $file"
        ((TOTAL_REPLACEMENTS++))
    done
}

# Define file patterns
FILE_PATTERNS='-name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" -o -name "*.yml" -o -name "*.yaml" -o -name "*.sh" -o -name "*.bat" -o -name "*.xml" -o -name "*.txt"'

echo -e "\n${BLUE}Phase 1: Primary Brand Replacements${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Main replacements (order matters!)
replace_in_files "Axiom Loom Catalog" "Axiom Loom Catalog" "$FILE_PATTERNS"
replace_in_files "Axiom Loom Platform" "Axiom Loom Platform" "$FILE_PATTERNS"
replace_in_files "Axiom Loom Innovation" "Axiom Loom Innovation" "$FILE_PATTERNS"
replace_in_files "EYGS Innovation" "Axiom Loom Innovation" "$FILE_PATTERNS"
replace_in_files "Ernst & Young" "Axiom Loom" "$FILE_PATTERNS"
replace_in_files "Ernst and Young" "Axiom Loom" "$FILE_PATTERNS"
replace_in_files "EYGS" "Axiom Loom" "$FILE_PATTERNS"
replace_in_files "Axiom Loom" "Axiom Loom" "$FILE_PATTERNS"
replace_in_files "eyns\.ai" "axiom-loom.ai" "$FILE_PATTERNS"
replace_in_files "eyns-innovation" "axiom-loom" "$FILE_PATTERNS"
replace_in_files "Eyns" "Axiom Loom" "$FILE_PATTERNS"

# EY replacements (careful with word boundaries)
echo -e "\n${BLUE}Phase 2: EY References (with word boundaries)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Use word boundary for EY to avoid replacing parts of other words
find . -type f \( ${FILE_PATTERNS} \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/build/*" \
    -not -path "*/cloned-repositories/*" \
    -exec grep -l "\bEY\b" {} \; 2>/dev/null | while read file; do
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/\bEY\b/Axiom Loom/g' "$file"
    else
        sed -i 's/\bEY\b/Axiom Loom/g' "$file"
    fi
    echo "  ✓ Updated EY references in: $file"
done

echo -e "\n${BLUE}Phase 3: Copyright and Legal Updates${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

replace_in_files "© 2025 Axiom Loom" "© 2025 Axiom Loom" "$FILE_PATTERNS"
replace_in_files "© 2024 Axiom Loom" "© 2024 Axiom Loom" "$FILE_PATTERNS"
replace_in_files "Copyright Axiom Loom" "Copyright Axiom Loom" "$FILE_PATTERNS"

echo -e "\n${BLUE}Phase 4: Email and Domain References${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

replace_in_files "@eyns\.ai" "@axiom-loom.ai" "$FILE_PATTERNS"
replace_in_files "https:\/\/eyns\.ai" "https://axiom-loom.ai" "$FILE_PATTERNS"

echo -e "\n${BLUE}Phase 5: Update Tagline in Key Files${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Add tagline to specific files
TAGLINE="Architecture Packages and Complete Solutions Built By Axiom Loom AI Agents!"

# Update package.json description
if [ -f "package.json" ]; then
    echo "Updating package.json..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/"name": "eyns-ai-experience-center"/"name": "axiom-loom-catalog"/g' package.json
        sed -i '' "s/\"description\": \"[^\"]*\"/\"description\": \"Axiom Loom Catalog - ${TAGLINE}\"/g" package.json
    else
        sed -i 's/"name": "eyns-ai-experience-center"/"name": "axiom-loom-catalog"/g' package.json
        sed -i "s/\"description\": \"[^\"]*\"/\"description\": \"Axiom Loom Catalog - ${TAGLINE}\"/g" package.json
    fi
    echo "  ✓ Updated package.json"
fi

echo -e "\n${BLUE}Phase 6: Repository Metadata${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update repository metadata
if [ -f "repository-metadata.json" ]; then
    echo "Updating repository-metadata.json..."
    replace_in_files "Axiom Loom" "Axiom Loom" "-name repository-metadata.json"
    replace_in_files "eyns" "axiom-loom" "-name repository-metadata.json"
    echo "  ✓ Updated repository-metadata.json"
fi

# Update all marketing briefs in cloned repositories
echo -e "\n${BLUE}Phase 7: Marketing Briefs in Cloned Repositories${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

find cloned-repositories -name "marketing-brief.md" -type f 2>/dev/null | while read file; do
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/Axiom Loom/Axiom Loom/g' "$file"
        sed -i '' 's/eyns\.ai/axiom-loom.ai/g' "$file"
    else
        sed -i 's/Axiom Loom/Axiom Loom/g' "$file"
        sed -i 's/eyns\.ai/axiom-loom.ai/g' "$file"
    fi
    echo "  ✓ Updated: $file"
done

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    REBRANDING COMPLETE!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

echo -e "\nNow running verification..."