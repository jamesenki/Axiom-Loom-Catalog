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

# List of repositories to clone (corrected to match actual GitHub repositories)
REPOSITORIES="
ai-predictive-maintenance-engine-architecture
cloudtwin-simulation-platform-architecture
deploymaster-sdv-ota-platform
diagnostic-as-code-platform-architecture
fleet-digital-twin-platform-architecture
future-mobility-consumer-platform
future-mobility-fleet-platform
future-mobility-oems-platform
future-mobility-regulatory-platform
future-mobility-tech-platform
mobility-architecture-package-orchestrator
nslabsdashboards
remote-diagnostic-assistance-platform-architecture
rentalFleets
sdv-architecture-orchestration
sovd-diagnostic-ecosystem-platform-architecture
vehicle-to-cloud-communications-architecture
velocityforge-sdv-platform-architecture
"

# Clone each repository
for repo in $REPOSITORIES; do
  if [ -d "$repo" ]; then
    echo "✓ $repo already exists, skipping..."
  else
    echo "Cloning $repo..."
    # Use GITHUB_TOKEN if available for private repos
    if [ -n "$GITHUB_TOKEN" ]; then
      CLONE_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$repo.git"
    else
      CLONE_URL="https://github.com/$GITHUB_USER/$repo.git"
    fi

    if git clone "$CLONE_URL" "$repo" 2>/dev/null; then
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
