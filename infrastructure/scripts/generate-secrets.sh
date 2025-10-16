#!/bin/bash

# Generate Secrets Script - AI Predictive Maintenance Engine
# This script generates secure passwords and tokens for the application

set -euo pipefail

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Output file
OUTPUT_FILE=".env.secrets"

echo -e "${GREEN}AI Predictive Maintenance Engine - Secret Generator${NC}"
echo "================================================="
echo ""

# Function to generate secrets
generate_secret() {
    local name=$1
    local length=$2
    local value=$(openssl rand -base64 $length | tr -d "\n")
    echo "export $name=\"$value\""
    echo "$name=\"$value\"" >> "$OUTPUT_FILE"
}

# Create or clear output file
> "$OUTPUT_FILE"
chmod 600 "$OUTPUT_FILE"

echo -e "${GREEN}Generating secrets...${NC}"
echo ""

# Generate database passwords
echo "# Database Credentials" >> "$OUTPUT_FILE"
generate_secret "POSTGRES_PASSWORD" 32
generate_secret "REDIS_PASSWORD" 32
generate_secret "INFLUXDB_ADMIN_PASSWORD" 32
generate_secret "INFLUXDB_TOKEN" 48

echo "" >> "$OUTPUT_FILE"
echo "# Application Secrets" >> "$OUTPUT_FILE"
generate_secret "JWT_SECRET" 64

echo ""
echo -e "${YELLOW}SOVD Integration Credentials:${NC}"
echo "The following values must be obtained from your SOVD service provider:"
echo "  - SOVD_CLIENT_ID"
echo "  - SOVD_CLIENT_SECRET"
echo "  - SOVD_CA_CERT"
echo "  - SOVD_CLIENT_CERT"
echo "  - SOVD_CLIENT_KEY"

echo "" >> "$OUTPUT_FILE"
echo "# SOVD Credentials (must be provided by SOVD service)" >> "$OUTPUT_FILE"
echo "export SOVD_CLIENT_ID=\"\"" >> "$OUTPUT_FILE"
echo "export SOVD_CLIENT_SECRET=\"\"" >> "$OUTPUT_FILE"
echo "export SOVD_CA_CERT_BASE64=\"\"" >> "$OUTPUT_FILE"
echo "export SOVD_CLIENT_CERT_BASE64=\"\"" >> "$OUTPUT_FILE"
echo "export SOVD_CLIENT_KEY_BASE64=\"\"" >> "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}Secrets generated successfully!${NC}"
echo ""
echo "Generated secrets have been saved to: $OUTPUT_FILE"
echo ""
echo "To use these secrets:"
echo "  1. Edit $OUTPUT_FILE and add SOVD credentials"
echo "  2. Source the file: source $OUTPUT_FILE"
echo "  3. Run the deployment: ./deploy.sh"
echo ""
echo -e "${YELLOW}IMPORTANT SECURITY NOTES:${NC}"
echo "  - Never commit $OUTPUT_FILE to version control"
echo "  - Keep this file secure and limit access"
echo "  - Rotate these secrets regularly"
echo "  - Delete this file after secrets are stored in Kubernetes"
echo ""

# Add to .gitignore if not already there
if ! grep -q "^\.env\.secrets$" .gitignore 2>/dev/null; then
    echo ".env.secrets" >> .gitignore
    echo "Added $OUTPUT_FILE to .gitignore"
fi