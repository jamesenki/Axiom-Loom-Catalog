#!/bin/sh

# Health check script for Docker container
# Checks if nginx is running and the application is responding

# Check if nginx process is running
if ! pgrep -f nginx > /dev/null; then
    echo "ERROR: nginx process not found"
    exit 1
fi

# Check if the application responds to HTTP requests
response=$(wget --no-verbose --tries=1 --spider --timeout=3 http://localhost:8080/health 2>&1)
if [ $? -ne 0 ]; then
    echo "ERROR: Health check endpoint not responding"
    echo "$response"
    exit 1
fi

# Check if main application loads
response=$(wget --no-verbose --tries=1 --spider --timeout=3 http://localhost:8080/ 2>&1)
if [ $? -ne 0 ]; then
    echo "ERROR: Main application not responding"
    echo "$response"
    exit 1
fi

echo "Health check passed"
exit 0