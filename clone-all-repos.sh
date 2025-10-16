#!/bin/bash

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
cd "$BASE_DIR" || exit 1

for repo in "${REPOS[@]}"; do
    echo "========================================"
    echo "Cloning: $repo"
    echo "========================================"

    gh repo clone "jamesenki/$repo" "$repo" 2>&1 | head -3

    if [ -d "$repo/docs/api" ]; then
        echo "✅ Successfully cloned with docs/api"
        echo "API files:"
        ls "$repo/docs/api" | head -5
    else
        echo "❌ WARNING: No docs/api directory!"
    fi

    echo ""
done

echo "========================================"
echo "Summary:"
echo "========================================"
for repo in "${REPOS[@]}"; do
    if [ -d "$repo/docs/api" ]; then
        api_count=$(find "$repo/docs/api" -type f \( -name "*.yaml" -o -name "*.graphql" -o -name "*.json" \) 2>/dev/null | wc -l | tr -d ' ')
        echo "✅ $repo - $api_count API files"
    else
        echo "❌ $repo - MISSING docs/api"
    fi
done
