#\!/bin/bash
echo "Running tests and collecting summary..."
npm test -- --no-watch --passWithNoTests 2>&1 | tee test-results.log | grep -E "(Test Suites:|Tests:|PASS |FAIL )" &
PID=$\!

# Wait for up to 60 seconds
COUNTER=0
while [ $COUNTER -lt 60 ]; do
    if \! ps -p $PID > /dev/null; then
        break
    fi
    sleep 1
    COUNTER=$((COUNTER + 1))
done

# Kill if still running
if ps -p $PID > /dev/null; then
    kill $PID
fi

# Extract summary
echo ""
echo "=== TEST SUMMARY ==="
tail -100 test-results.log | grep -E "Test Suites:|Tests:" | tail -2
echo ""
echo "=== FAILING TESTS ==="
grep "FAIL " test-results.log | sort | uniq -c | sort -nr | head -10
