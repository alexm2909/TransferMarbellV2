#!/usr/bin/env bash
# Simple tests for local Netlify functions (adjust URL if deployed)
BASE_URL="http://localhost:8888/.netlify/functions/api"

echo "Creating test booking..."
resp=$(curl -s -X POST "$BASE_URL/bookings" -H "Content-Type: application/json" -d '{"clientEmail":"test@example.com","origin":{"address":"From A"},"destination":{"address":"To B"},"date":"2025-10-01","time":"12:00"}')
echo "Response: $resp"

echo "Fetching bookings..."
curl -s "$BASE_URL/bookings" | jq '.'

# Extract tag
TAG=$(echo "$resp" | jq -r '.booking.reservation_tag')
if [ "$TAG" != "null" ]; then
  echo "Resending confirmation for $TAG"
  curl -s -X POST "$BASE_URL/send-confirmation" -H "Content-Type: application/json" -d "{\"to\":\"test@example.com\",\"reservationTag\":\"$TAG\",\"subject\":\"Test $TAG\",\"text\":\"Test email\"}"
fi

echo "Done"
