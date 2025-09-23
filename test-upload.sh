#!/bin/bash

# Test script for staff image upload functionality

echo "🧪 Testing Staff Image Upload Functionality"
echo "============================================"

# Get the first staff member ID
STAFF_ID=$(curl -s http://localhost:5000/api/staff | jq -r '.data.staff[0].id')
STAFF_NAME=$(curl -s http://localhost:5000/api/staff | jq -r '.data.staff[0].name')

echo "📋 Staff Member: $STAFF_NAME (ID: $STAFF_ID)"

# Create a simple test image (1x1 pixel PNG)
echo "🖼️  Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > test-image.png

echo "📤 Testing image upload..."
# Test the upload endpoint
RESPONSE=$(curl -s -X PUT "http://localhost:5000/api/staff/$STAFF_ID" \
  -F "image=@test-image.png" \
  -F "name=$STAFF_NAME" \
  -F "role=Principal" \
  -F "category=LEADERSHIP")

echo "📊 Upload Response:"
echo "$RESPONSE" | jq '.'

# Check if upload was successful
if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Upload successful!"
    
    # Get the updated staff member data
    echo "🔄 Checking updated staff data..."
    UPDATED_DATA=$(curl -s http://localhost:5000/api/staff | jq -r '.data.staff[0].imageUrl')
    echo "📷 New image URL: $UPDATED_DATA"
    
    # Test if the image is accessible
    if [ "$UPDATED_DATA" != "null" ] && [ "$UPDATED_DATA" != "" ]; then
        echo "🔗 Testing image accessibility..."
        curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "$UPDATED_DATA"
    fi
else
    echo "❌ Upload failed!"
    echo "$RESPONSE" | jq -r '.error // .message'
fi

# Cleanup
rm -f test-image.png
echo "🧹 Cleanup complete"
