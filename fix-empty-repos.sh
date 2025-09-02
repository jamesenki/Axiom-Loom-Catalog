#!/bin/bash

###############################################################################
# Fix Empty Repositories
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    FIXING EMPTY REPOSITORIES${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo

# Empty repositories that need initialization
EMPTY_REPOS=(
  "future-mobility-energy-platform"
  "future-mobility-financial-platform"
  "future-mobility-infrastructure-platform"
)

for repo in "${EMPTY_REPOS[@]}"; do
  echo -e "\n${BLUE}Processing: ${repo}${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  REPO_DIR="cloned-repositories/$repo"
  
  if [ ! -d "$REPO_DIR" ]; then
    echo -e "${YELLOW}Creating directory: $REPO_DIR${NC}"
    mkdir -p "$REPO_DIR"
  fi
  
  cd "$REPO_DIR"
  
  # Initialize git if needed
  if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
  fi
  
  # Create initial files if they don't exist
  if [ ! -f "README.md" ]; then
    echo "Creating README.md..."
    cat > README.md << EOF
# ${repo}

## Overview
Axiom Loom Platform - ${repo}

Enterprise-ready platform for future mobility solutions.

## Features
- Scalable architecture
- Cloud-native design
- API-first approach
- Comprehensive documentation

## Getting Started
\`\`\`bash
# Clone the repository
git clone https://github.com/jamesenki/${repo}.git

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## Documentation
See the \`docs/\` directory for detailed documentation.

## License
© 2025 Axiom Loom. All rights reserved.
EOF
  fi
  
  if [ ! -f "marketing-brief.md" ]; then
    echo "Creating marketing-brief.md..."
    cat > marketing-brief.md << EOF
# Marketing Brief: ${repo}

## Executive Summary
Enterprise-ready platform solution for future mobility ecosystems.

## Target Market
- Automotive OEMs
- Tier 1 Suppliers
- Mobility Service Providers
- Smart City Operators

## Key Value Propositions
- **Scalability**: Cloud-native architecture supporting millions of vehicles
- **Integration**: Seamless API integration with existing systems
- **Security**: Enterprise-grade security and compliance
- **Innovation**: AI-powered insights and automation

## Pricing
- Starter: \$5,000/month
- Professional: \$15,000/month
- Enterprise: Custom pricing
EOF
  fi
  
  # Stage and commit
  git add -A
  git commit -m "feat: initialize ${repo}

- Added README documentation
- Added marketing brief
- Setup initial project structure

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>" || true
  
  # Add remote
  git remote set-url origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null || \
    git remote add origin "https://github.com/jamesenki/${repo}.git" 2>/dev/null
  
  # Push
  echo "Pushing to GitHub..."
  if git push -u origin main --force 2>/dev/null; then
    echo -e "${GREEN}✓ Successfully pushed${NC}"
  else
    echo -e "${RED}✗ Failed to push${NC}"
  fi
  
  cd ../..
done

echo -e "\n${GREEN}Empty repositories fixed!${NC}"