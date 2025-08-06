#!/bin/bash

# Test deployment script with automated answers
# This script tests the deployment process with predefined inputs

echo "Testing EYNS AI Experience Center Deployment"
echo "============================================"
echo ""

# Test with existing .env file (Standard Node.js deployment)
echo "Test 1: Using existing .env with Standard Node.js deployment"
{
echo "y"     # Use existing configuration
echo "1"     # Standard Node.js deployment
} | ./deploy.sh

# Alternative test: Create new env file
# Uncomment below to test env creation flow
# {
# echo "n"     # Don't use existing configuration
# echo "y"     # Backup existing .env
# echo "3000"  # Frontend port
# echo "3001"  # Backend port
# echo ""      # Default production environment
# echo "y"     # Enable network access
# echo ""      # Use detected IP
# echo ""      # Default GitHub org
# echo ""      # Skip GitHub token (using gh cli)
# echo "y"     # Enable demo mode
# echo "n"     # No external MongoDB
# echo "y"     # Enable CORS
# echo "y"     # Enable rate limiting
# echo "n"     # No analytics
# echo "1"     # Standard Node.js deployment
# } | ./deploy.sh

echo ""
echo "Deployment test completed!"