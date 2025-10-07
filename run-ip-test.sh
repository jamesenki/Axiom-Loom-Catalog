#!/bin/bash

# AI Predictive Maintenance Engine Workflow Test Runner
# This script runs the specific test against the IP address 10.0.0.109:3000

echo "🚀 Starting AI Predictive Maintenance Engine Workflow Test"
echo "🌐 Target URL: http://10.0.0.109:3000"
echo "📁 Creating screenshots directory..."

# Create screenshots directory if it doesn't exist
mkdir -p e2e/screenshots

echo "🧪 Running AI Predictive Maintenance Engine workflow test..."

# Run the specific test with the IP configuration
npx playwright test ai-predictive-maintenance-workflow.spec.ts \
  --config=playwright.config.ip.ts \
  --reporter=list \
  --headed \
  --timeout=300000

echo ""
echo "📊 Test Results:"
echo "=================="

# Check if screenshots were created
if [ -d "e2e/screenshots" ]; then
  screenshot_count=$(find e2e/screenshots -name "*.png" | wc -l)
  echo "📸 Screenshots captured: $screenshot_count"
  echo "📁 Screenshots location: e2e/screenshots/"
  
  # List all screenshots
  if [ $screenshot_count -gt 0 ]; then
    echo ""
    echo "📸 Generated screenshots:"
    ls -la e2e/screenshots/*.png 2>/dev/null | awk '{print "  " $9 " (" $5 " bytes)"}'
  fi
fi

# Check if test results exist
if [ -f "test-results/ip-results.json" ]; then
  echo "📋 Test results saved to: test-results/ip-results.json"
fi

# Check if HTML report was generated
if [ -d "playwright-report-ip" ]; then
  echo "📊 HTML report generated: playwright-report-ip/index.html"
  echo "🌐 View report: npx playwright show-report playwright-report-ip"
fi

echo ""
echo "🏁 Test execution completed!"
echo "💡 To run again: ./run-ip-test.sh"
echo "💡 To run with different browser: npx playwright test ai-predictive-maintenance-workflow.spec.ts --config=playwright.config.ip.ts --project=firefox"