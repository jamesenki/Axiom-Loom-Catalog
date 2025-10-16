#!/bin/bash

# Script to check all repositories that exist on GitHub

REPOS=(
    "ai-predictive-maintenance-engine-architecture"
    "cloudtwin-simulation-platform-architecture"
    "deploymaster-sdv-ota-platform"
    "diagnostic-as-code-platform-architecture"
    "fleet-digital-twin-platform-architecture"
    "mobility-architecture-package-orchestrator"
    "remote-diagnostic-assistance-platform-architecture"
    "rentalFleets"
    "sdv-architecture-orchestration"
    "sovd-diagnostic-ecosystem-platform-architecture"
    "velocityforge-sdv-platform-architecture"
)

BASE_DIR="/Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center/cloned-repositories"

for repo in "${REPOS[@]}"; do
    echo "========================================"
    echo "Processing: $repo"
    echo "========================================"

    cd "$BASE_DIR/$repo" || continue

    # Fix the remote URL
    git remote set-url origin "https://github.com/jamesenki/$repo.git"

    # Fetch and reset
    git fetch origin 2>&1 | head -3
    git reset --hard origin/main 2>&1 | head -1

    # Count API files
    echo "API files found:"
    echo "  YAML/YML: $(find . -type f \( -name "*.yaml" -o -name "*.yml" \) 2>/dev/null | grep -v "\.git" | grep -v "axiom.json" | wc -l | tr -d ' ')"
    echo "  GraphQL: $(find . -type f -name "*.graphql" 2>/dev/null | grep -v "\.git" | wc -l | tr -d ' ')"
    echo "  Postman: $(find . -type f -name "*postman*.json" 2>/dev/null | grep -v "\.git" | wc -l | tr -d ' ')"
    echo "  Proto: $(find . -type f -name "*.proto" 2>/dev/null | grep -v "\.git" | wc -l | tr -d ' ')"

    # List some example files
    echo "Example files:"
    find . -type f \( -name "*.yaml" -o -name "*.yml" -o -name "*.graphql" -o -name "*.proto" \) 2>/dev/null | grep -v "\.git" | grep -v "axiom.json" | head -3

    echo ""
done
