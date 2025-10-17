#!/bin/sh
# Clone all repositories for the Axiom Loom Catalog
# This script runs on container startup

# Don't exit on errors - we want the server to start even if some clones fail
set +e

echo "=== Cloning Axiom Loom Repositories ==="
echo "Target directory: /app/cloned-repositories"

cd /app/cloned-repositories

# GitHub username
GITHUB_USER="jamesenki"

# List of repositories to clone (from repository-metadata.json)
REPOSITORIES="
ai-predictive-maintenance-engine-architecture
cloudtwin-ai
diagnostic-as-code
distributed-ledger-for-auto-insurance
future-mobility-consumer-platform
future-mobility-fleet-operations-platform
future-mobility-oems-tech-platform
iot-platform-axiom-loom
lambda-layer-pipeline
open-smart-mobility-platform
predictive-maintenance-model
serverless-application-pipeline
smart-vending-machine-platform
terraform-aws-cloud-infrastructure
vehicle-health-tracker
vehicle-to-cloud-communications-architecture
water-heater-platform
voice-enabled-vehicle-assistance
weather-dashboard
"

# Clone each repository
for repo in $REPOSITORIES; do
  if [ -d "$repo" ]; then
    echo "✓ $repo already exists, skipping..."
  else
    echo "Cloning $repo..."
    if git clone "https://github.com/$GITHUB_USER/$repo.git" "$repo" 2>/dev/null; then
      echo "✅ Cloned: $repo"
    else
      echo "⚠️  Failed to clone: $repo (might be private or not exist)"
    fi
  fi
done

echo ""
echo "=== Repository Cloning Complete ==="
ls -l | grep "^d" | wc -l | xargs echo "Total repositories:"
echo "======================================"
