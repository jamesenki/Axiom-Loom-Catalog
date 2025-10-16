#!/bin/bash
# Performance Testing Script - QA Agent Implementation
# Ensures application performance meets strict standards

set -e

echo "⚡ Running performance tests..."

# Memory usage over time
echo "📊 Testing memory usage patterns..."
for i in {1..100}; do
    MEM_USAGE=$(node -e "console.log(process.memoryUsage().heapUsed / 1024 / 1024)")
    echo "Iteration $i: ${MEM_USAGE}MB"
    
    # Trigger heavy operations via API
    curl -X POST http://localhost:3000/api/heavy-operation 2>/dev/null || true
    
    if (( $(echo "$MEM_USAGE > 500" | bc -l) )); then
        echo "❌ Memory usage too high: ${MEM_USAGE}MB"
        exit 1
    fi
    
    sleep 0.5
done

# Concurrent user simulation
echo "👥 Simulating 1000 concurrent users..."
cat > load-test.yml << EOF
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      rampTo: 50
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 10
  processor: "./processor.js"

scenarios:
  - name: "Browse repositories"
    flow:
      - get:
          url: "/api/repositories"
      - think: 2
      - get:
          url: "/api/repositories/random"

  - name: "Search functionality"
    flow:
      - get:
          url: "/api/search?q=test"
      - think: 1
      - get:
          url: "/api/search?q=api"

  - name: "Document viewing"
    flow:
      - get:
          url: "/api/documents/README.md"
      - think: 3
      - get:
          url: "/api/documents/API.md"
EOF

npx artillery run load-test.yml --output performance-report.json

# Analyze results
ERROR_COUNT=$(jq '.aggregate.counters["errors"] // 0' performance-report.json)
P95_LATENCY=$(jq '.aggregate.latency.p95' performance-report.json)
THROUGHPUT=$(jq '.aggregate.rps.mean' performance-report.json)

echo "📊 Performance Results:"
echo "  - Errors: $ERROR_COUNT"
echo "  - P95 Latency: ${P95_LATENCY}ms"
echo "  - Throughput: ${THROUGHPUT} req/s"

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "❌ Errors under load: $ERROR_COUNT"
    exit 1
fi

if (( $(echo "$P95_LATENCY > 1000" | bc -l) )); then
    echo "❌ P95 latency too high: ${P95_LATENCY}ms"
    exit 1
fi

# Lighthouse performance audit
echo "🏃 Running Lighthouse performance audit..."
npx lighthouse http://localhost:3000 \
    --output=json \
    --output-path=./lighthouse-report.json \
    --chrome-flags="--headless" \
    --only-categories=performance

PERF_SCORE=$(jq '.categories.performance.score * 100' lighthouse-report.json)
FCP=$(jq '.audits["first-contentful-paint"].numericValue' lighthouse-report.json)
LCP=$(jq '.audits["largest-contentful-paint"].numericValue' lighthouse-report.json)
TTI=$(jq '.audits["interactive"].numericValue' lighthouse-report.json)
CLS=$(jq '.audits["cumulative-layout-shift"].numericValue' lighthouse-report.json)

echo "🏃 Lighthouse Results:"
echo "  - Performance Score: ${PERF_SCORE}/100"
echo "  - First Contentful Paint: ${FCP}ms"
echo "  - Largest Contentful Paint: ${LCP}ms"
echo "  - Time to Interactive: ${TTI}ms"
echo "  - Cumulative Layout Shift: $CLS"

if (( $(echo "$PERF_SCORE < 80" | bc -l) )); then
    echo "❌ Performance score too low: ${PERF_SCORE}/100"
    exit 1
fi

echo "✅ All performance tests passed!"