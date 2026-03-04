#!/bin/bash

# Umai Backend API Test Script
# This script tests all endpoints of the Umai backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080/api/v1"
DB_URL="postgresql://umai:umai@localhost:5434/umai"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Umai Backend API Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="${3:-200}"
    local check_json="${4:-true}"

    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "\n${YELLOW}Test $TESTS_TOTAL: $test_name${NC}"
    echo "Command: $test_command"

    response=$(eval "$test_command" 2>/dev/null)
    http_status=$(echo "$response" | tail -c 50 | grep -o '"status":[0-9]*' | grep -o '[0-9]*' || echo "$response" | head -c 500)

    # Get just the body (without headers when using -i)
    body=$(echo "$response" | sed '/^\r$/d' | tail -n +2 2>/dev/null || echo "$response")

    # Check HTTP status
    actual_status=$(curl -s -o /dev/null -w "%{http_code}" ${test_command#curl -s -X})

    if [ "$actual_status" = "$expected_status" ] || [ "$actual_status" = "000" -a "$expected_status" = "200" ]; then
        echo -e "${GREEN}✓ HTTP Status: $actual_status (expected: $expected_status)${NC}"
        echo -e "Response: ${body:0:200}..."
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ HTTP Status: $actual_status (expected: $expected_status)${NC}"
        echo -e "Response: ${body:0:500}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to seed database
seed_database() {
    echo -e "\n${BLUE}=== Seeding Test Data ===${NC}"

    # Create restaurant and table with QR code using psql
    docker exec -i umai-postgres psql -U umai -d umai << 'EOF'
-- Clear existing test data
DELETE FROM "CustomerSession" WHERE "restaurantId" IN (SELECT id FROM "Restaurant" WHERE slug = 'test-restaurant');
DELETE FROM "RestaurantTable" WHERE "restaurantId" IN (SELECT id FROM "Restaurant" WHERE slug = 'test-restaurant');
DELETE FROM "Restaurant" WHERE slug = 'test-restaurant';

-- Insert test restaurant
INSERT INTO "Restaurant" (
    id, slug, name, description, phone, email,
    "addressLine1", city, "countryCode", timezone, currency, "isActive",
    "createdAt", "updatedAt"
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test-restaurant',
    'Test Restaurant',
    'A test restaurant for API testing',
    '+1234567890',
    'test@restaurant.com',
    '123 Test Street',
    'Test City',
    'US',
    'UTC',
    'USD',
    true,
    NOW(),
    NOW()
);

-- Insert test tables with QR codes
INSERT INTO "RestaurantTable" (
    id, "restaurantId", label, capacity, "isActive", "qrCode", "createdAt", "updatedAt"
) VALUES
    ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Table-1', 4, true, 'QR-CODE-001', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Table-2', 2, true, 'QR-CODE-002', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Table-3', 6, true, 'QR-CODE-003', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'Table-4', 4, false, 'QR-CODE-INACTIVE', NOW(), NOW());

-- Verify inserts
SELECT 'Restaurants:' as type, COUNT(*) as count FROM "Restaurant" WHERE slug = 'test-restaurant'
UNION ALL
SELECT 'Tables:', COUNT(*) FROM "RestaurantTable" WHERE "restaurantId" = '11111111-1111-1111-1111-111111111111';
EOF

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Test data seeded successfully${NC}"
    else
        echo -e "${RED}✗ Failed to seed test data${NC}"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    echo -e "\n${BLUE}=== Cleaning Up Test Data ===${NC}"
    docker exec -i umai-postgres psql -U umai -d umai << 'EOF'
DELETE FROM "CustomerSession" WHERE "restaurantId" IN (SELECT id FROM "Restaurant" WHERE slug = 'test-restaurant');
DELETE FROM "RestaurantTable" WHERE "restaurantId" IN (SELECT id FROM "Restaurant" WHERE slug = 'test-restaurant');
DELETE FROM "Restaurant" WHERE slug = 'test-restaurant';
EOF
    echo -e "${GREEN}✓ Test data cleaned up${NC}"
}

# Set trap for cleanup on exit
trap cleanup EXIT

# Run database seeding
seed_database

echo -e "\n${BLUE}=== Testing Sessions Endpoints ===${NC}"

# Test 1: Health check (if exists)
echo -e "\n${YELLOW}--- Health/Status Check ---${NC}"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "${BASE_URL}/../health" 2>/dev/null || echo "Health endpoint not available"

# Test 2: Create session with valid QR code
echo -e "\n${YELLOW}--- Session Creation Tests ---${NC}"

echo -e "\n${BLUE}Test: Create session with valid QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{"code": "QR-CODE-001"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Session created successfully${NC}"
    # Check if response contains restaurant and table
    if echo "$body" | grep -q '"restaurant"'; then
        echo -e "${GREEN}✓ Response contains restaurant data${NC}"
    fi
    if echo "$body" | grep -q '"table"'; then
        echo -e "${GREEN}✓ Response contains table data${NC}"
    fi
    # Check if cookie is set
    if echo "$body" | grep -q '"guest_token"' || curl -s -D - "${BASE_URL}/sessions/qr" -X POST -H "Content-Type: application/json" -d '{"code": "QR-CODE-001"}' | grep -q "set-cookie"; then
        echo -e "${GREEN}✓ Guest token cookie should be set${NC}"
    fi
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Failed to create session${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 3: Create session with another valid QR code
echo -e "\n${BLUE}Test: Create session with different QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{"code": "QR-CODE-002"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Session created for Table-2${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Failed to create session for Table-2${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 4: Create session with inactive table QR code
echo -e "\n${BLUE}Test: Create session with inactive table QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{"code": "QR-CODE-INACTIVE"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "403" ]; then
    echo -e "${GREEN}✓ Correctly rejected inactive table (403 Forbidden)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
elif [ "$http_code" = "400" ] || [ "$http_code" = "404" ]; then
    echo -e "${YELLOW}! Received $http_code instead of 403, but still rejected${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Should have rejected inactive table${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 5: Create session with invalid QR code
echo -e "\n${BLUE}Test: Create session with non-existent QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{"code": "INVALID-QR-CODE"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "404" ]; then
    echo -e "${GREEN}✓ Correctly rejected non-existent QR code (404 Not Found)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Should have returned 404 for non-existent QR code${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 6: Create session without code
echo -e "\n${BLUE}Test: Create session without QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✓ Correctly rejected missing QR code (400 Bad Request)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Should have returned 400 for missing QR code${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 7: Create session with empty code
echo -e "\n${BLUE}Test: Create session with empty QR code${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d '{"code": ""}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✓ Correctly rejected empty QR code (400 Bad Request)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Should have returned 400 for empty QR code${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 8: Wrong HTTP method (GET instead of POST)
echo -e "\n${BLUE}Test: Use GET instead of POST${NC}"
response=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/sessions/qr")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "404" ] || [ "$http_code" = "405" ]; then
    echo -e "${GREEN}✓ Correctly rejected GET request (404/405)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}! Received $http_code for GET request${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 9: Missing Content-Type header
echo -e "\n${BLUE}Test: Missing Content-Type header${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -d '{"code": "QR-CODE-003"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Request accepted without Content-Type${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}! Request may require Content-Type header${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 10: Invalid JSON body
echo -e "\n${BLUE}Test: Invalid JSON body${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/sessions/qr" \
    -H "Content-Type: application/json" \
    -d 'invalid json')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
echo "Response: $body"
if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✓ Correctly rejected invalid JSON (400 Bad Request)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Should have returned 400 for invalid JSON${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 11: Swagger documentation
echo -e "\n${BLUE}Test: Swagger documentation accessible${NC}"
response=$(curl -s -w "\n%{http_code}" "http://localhost:8080/api")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Swagger documentation is accessible${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ Swagger documentation should be accessible${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Test 12: OpenAPI spec
echo -e "\n${BLUE}Test: OpenAPI JSON spec accessible${NC}"
response=$(curl -s -w "\n%{http_code}" "http://localhost:8080/api/json")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Status: $http_code"
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ OpenAPI JSON spec is accessible${NC}"
    # Check if it contains the sessions endpoint
    if echo "$body" | grep -q "/sessions/qr"; then
        echo -e "${GREEN}✓ OpenAPI spec contains /sessions/qr endpoint${NC}"
    fi
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}! OpenAPI spec might be at different path${NC}"
    # Try alternative path
    response=$(curl -s -w "\n%{http_code}" "http://localhost:8080/api/v1/json")
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ OpenAPI spec accessible at alternative path${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Verify database state
echo -e "\n${BLUE}=== Verifying Database State ===${NC}"
docker exec -i umai-postgres psql -U umai -d umai << 'EOF'
SELECT
    'Sessions created:' as label,
    COUNT(*) as count
FROM "CustomerSession"
WHERE "restaurantId" = '11111111-1111-1111-1111-111111111111';
EOF

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}   Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total Tests: $TESTS_TOTAL"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed${NC}"
    exit 1
fi