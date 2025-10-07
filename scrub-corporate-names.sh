#!/bin/bash

# Corporate name scrubbing script
# This script replaces corporate names with generic alternatives

echo "Starting corporate name scrubbing..."

# Function to replace text in files
replace_in_files() {
  local pattern=$1
  local replacement=$2
  local file_pattern=$3

  echo "Replacing '$pattern' with '$replacement' in $file_pattern files..."

  find . -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/build/*" \
    -not -path "*/dist/*" \
    -not -path "*/deploy/frontend/*" \
    -not -path "*/cache/*" \
    -not -path "*/.next/*" \
    -name "$file_pattern" \
    -exec sed -i.bak "s/$pattern/$replacement/g" {} \;

  # Clean up backup files
  find . -name "*.bak" -type f -delete
}

# 1. Replace nslabs with demo-labs (case variations)
echo "=== Replacing nslabs ==="
replace_in_files "nslabs" "demo-labs" "*.tsx"
replace_in_files "nslabs" "demo-labs" "*.ts"
replace_in_files "nslabs" "demo-labs" "*.js"
replace_in_files "nslabs" "demo-labs" "*.jsx"
replace_in_files "nslabs" "demo-labs" "*.json"
replace_in_files "nslabs" "demo-labs" "*.md"
replace_in_files "NSLabs" "DemoLabs" "*.tsx"
replace_in_files "NSLabs" "DemoLabs" "*.ts"
replace_in_files "NSLabs" "DemoLabs" "*.js"
replace_in_files "NSLabs" "DemoLabs" "*.jsx"
replace_in_files "NSLabs" "DemoLabs" "*.json"
replace_in_files "NSLabs" "DemoLabs" "*.md"

# 2. Replace IoT Sphere variations with IoT Platform
echo "=== Replacing IoT Sphere ==="
replace_in_files "IoT Sphere" "IoT Platform" "*.tsx"
replace_in_files "IoT Sphere" "IoT Platform" "*.ts"
replace_in_files "IoT Sphere" "IoT Platform" "*.js"
replace_in_files "IoT Sphere" "IoT Platform" "*.jsx"
replace_in_files "IoT Sphere" "IoT Platform" "*.json"
replace_in_files "IoT Sphere" "IoT Platform" "*.md"
replace_in_files "iot-sphere" "iot-platform" "*.tsx"
replace_in_files "iot-sphere" "iot-platform" "*.ts"
replace_in_files "iot-sphere" "iot-platform" "*.js"
replace_in_files "iot-sphere" "iot-platform" "*.jsx"
replace_in_files "iot-sphere" "iot-platform" "*.json"
replace_in_files "iot-sphere" "iot-platform" "*.md"
replace_in_files "iotsphere" "iotplatform" "*.tsx"
replace_in_files "iotsphere" "iotplatform" "*.ts"
replace_in_files "iotsphere" "iotplatform" "*.js"
replace_in_files "iotsphere" "iotplatform" "*.jsx"
replace_in_files "iotsphere" "iotplatform" "*.json"
replace_in_files "iotsphere" "iotplatform" "*.md"

# 3. Replace jamesenki with jamesenki
echo "=== Replacing jamesenki ==="
replace_in_files "jamesenki" "jamesenki" "*.tsx"
replace_in_files "jamesenki" "jamesenki" "*.ts"
replace_in_files "jamesenki" "jamesenki" "*.js"
replace_in_files "jamesenki" "jamesenki" "*.jsx"
replace_in_files "jamesenki" "jamesenki" "*.json"
replace_in_files "jamesenki" "jamesenki" "*.md"
replace_in_files "jamesenki" "jamesenki" "*.sh"
replace_in_files "jamesenki" "jamesenki" "*.txt"

# 4. Replace eygs remote references
echo "=== Replacing eygs ==="
replace_in_files "eygs" "axiom" "*.md"
replace_in_files "eygs" "axiom" "*.txt"
replace_in_files "EYGS" "Axiom" "*.md"
replace_in_files "EYGS" "Axiom" "*.txt"

echo "Corporate name scrubbing complete!"
echo "Please review the changes and test the application."
