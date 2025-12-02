#!/bin/bash
set -e

echo "Validating Restaurant API service..."

# Wait for application to start
sleep 5

# Check if the health endpoint responds
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)

if [ "$HEALTH_CHECK" -eq 200 ]; then
    echo "✓ Health check passed (Status: $HEALTH_CHECK)"
    echo "✓ Restaurant API is running successfully"
    exit 0
else
    echo "✗ Health check failed (Status: $HEALTH_CHECK)"
    echo "✗ Restaurant API is not responding correctly"
    exit 1
fi
