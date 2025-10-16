#!/bin/bash

BASE_DIR="/Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center/cloned-repositories"

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

for repo in "${REPOS[@]}"; do
    echo "========================================"
    echo "Repository: $repo"
    echo "========================================"

    cd "$BASE_DIR/$repo" || continue

    # Search for OpenAPI/Swagger YAML files
    echo "--- OpenAPI/Swagger YAML files:"
    find . -type f \( -name "*.yaml" -o -name "*.yml" \) ! -path "*/.git/*" ! -path "*/node_modules/*" -exec grep -l "openapi\|swagger" {} \; 2>/dev/null | head -10

    # Search for GraphQL schema files
    echo "--- GraphQL schema files:"
    find . -type f \( -name "*.graphql" -o -name "*.gql" -o -name "schema.json" \) ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | head -10

    # Search for gRPC proto files
    echo "--- gRPC proto files:"
    find . -type f -name "*.proto" ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | head -10

    # Search for Postman collections
    echo "--- Postman collections:"
    find . -type f -name "*postman*.json" ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | head -10
    find . -type f -name "*.postman_collection.json" ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | head -10

    # Search for API directories
    echo "--- API-related directories:"
    find . -type d \( -name "*api*" -o -name "*swagger*" -o -name "*graphql*" -o -name "*postman*" \) ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | head -10

    # Count all YAML/JSON files (excluding node_modules and .git)
    echo "--- File counts:"
    echo "  Total YAML files: $(find . -type f \( -name "*.yaml" -o -name "*.yml" \) ! -path "*/.git/*" ! -path "*/node_modules/*" ! -name "axiom.json" 2>/dev/null | wc -l | tr -d ' ')"
    echo "  Total JSON files: $(find . -type f -name "*.json" ! -path "*/.git/*" ! -path "*/node_modules/*" ! -name "axiom.json" ! -name "package*.json" 2>/dev/null | wc -l | tr -d ' ')"
    echo "  Total GraphQL files: $(find . -type f \( -name "*.graphql" -o -name "*.gql" \) ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | wc -l | tr -d ' ')"
    echo "  Total Proto files: $(find . -type f -name "*.proto" ! -path "*/.git/*" ! -path "*/node_modules/*" 2>/dev/null | wc -l | tr -d ' ')"

    echo ""
done
