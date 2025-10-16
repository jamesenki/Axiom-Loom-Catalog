#!/bin/bash
# Static Analysis Script - QA Agent Implementation
# Zero tolerance for code quality issues

set -e  # Exit on any error

echo "🔍 Starting Static Analysis..."

# Code smell detection
echo "🔍 Detecting code smells..."

# Complexity analysis
npx complexity-report src/**/*.{ts,tsx} --format json > complexity-report.json
MAX_COMPLEXITY=$(jq '.reports[].complexity' complexity-report.json | sort -nr | head -1)
if [ "$MAX_COMPLEXITY" -gt 10 ]; then
    echo "❌ Excessive complexity detected: $MAX_COMPLEXITY"
    exit 1
fi

# Duplicate code detection
npx jscpd src --min-tokens 50 --reporters json > duplication-report.json
DUPLICATION=$(jq '.statistics.total.percentage' duplication-report.json)
if (( $(echo "$DUPLICATION > 5" | bc -l) )); then
    echo "❌ High code duplication: ${DUPLICATION}%"
    exit 1
fi

# Dead code detection
npx ts-prune --error > dead-code.log 2>&1
if [ -s dead-code.log ]; then
    echo "❌ Dead code detected!"
    cat dead-code.log
    exit 1
fi

echo "✅ Static analysis passed!"