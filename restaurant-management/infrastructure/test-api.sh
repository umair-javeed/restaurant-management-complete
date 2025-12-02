#!/bin/bash

# Restaurant API Testing Script
# This script tests all API endpoints

# Configuration
API_URL="${1:-http://localhost:3001}"

echo "========================================="
echo "Restaurant API Testing Script"
echo "Testing API at: ${API_URL}"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "Testing: $description"
    echo "  Method: $method"
    echo "  Endpoint: $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "${API_URL}${endpoint}" -w "\nHTTP_CODE:%{http_code}")
    else
        response=$(curl -s -X $method "${API_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\nHTTP_CODE:%{http_code}")
    fi
    
    http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE/d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ PASSED${NC} (HTTP $http_code)"
    else
        echo -e "  ${RED}✗ FAILED${NC} (HTTP $http_code)"
    fi
    
    echo "  Response: $(echo $body | head -c 100)..."
    echo ""
}

# Health Check
echo "=== Health Check ==="
test_endpoint "GET" "/health" "" "Health check endpoint"

# Menu Tests
echo "=== Menu Endpoints ==="
test_endpoint "GET" "/api/menu" "" "Get all menu items"

# Create menu item
MENU_ITEM='{
  "name": "Test Burger",
  "description": "A delicious test burger",
  "price": 12.99,
  "category": "Main Course",
  "image": "",
  "available": true
}'
test_endpoint "POST" "/api/menu" "$MENU_ITEM" "Create menu item"

# Order Tests
echo "=== Order Endpoints ==="
test_endpoint "GET" "/api/orders" "" "Get all orders"
test_endpoint "GET" "/api/orders?status=pending" "" "Get pending orders"

# Create order
ORDER='{
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "+1234567890",
  "items": [
    {
      "id": "test-id",
      "name": "Test Burger",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "totalAmount": 25.98,
  "deliveryAddress": "123 Test St",
  "orderType": "delivery",
  "specialInstructions": "Test order"
}'
test_endpoint "POST" "/api/orders" "$ORDER" "Create order"

# Reservation Tests
echo "=== Reservation Endpoints ==="
test_endpoint "GET" "/api/reservations" "" "Get all reservations"

# Create reservation
RESERVATION='{
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "+1234567890",
  "date": "2024-12-25",
  "time": "19:00",
  "numberOfGuests": 4,
  "specialRequests": "Test reservation"
}'
test_endpoint "POST" "/api/reservations" "$RESERVATION" "Create reservation"

echo "========================================="
echo "Testing Complete!"
echo "========================================="
echo ""
echo "Summary:"
echo "  API URL: ${API_URL}"
echo "  Check the results above for any failures"
echo ""
echo "For detailed logs, check:"
echo "  Backend: pm2 logs restaurant-api"
echo "  DynamoDB: AWS Console"
echo ""
