#!/bin/bash

echo "🧪 Testing Staff Image Upload Functionality"
echo "============================================"

# Create a simple test image (1x1 pixel PNG)
echo "🖼️  Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > test-image.png

echo "📤 Testing image upload to first staff member..."

# Get staff data and extract first ID manually
STAFF_RESPONSE=$(curl -s http://localhost:5000/api/staff)
echo "📋 Staff API Response:"
echo "$STAFF_RESPONSE" | head -3

# Test the upload endpoint with a known staff ID
# We'll use the first staff ID from the response we saw earlier
STAFF_ID="cmebxmkud0001fh052cp4oc7q"

echo "📤 Testing image upload for staff ID: $STAFF_ID"

# Test the upload endpoint
curl -X PUT "http://localhost:5000/api/staff/$STAFF_ID" \
  -F "image=@test-image.png" \
  -F "name=Sr. Mary Principal" \
  -F "role=Principal" \
  -F "category=LEADERSHIP" \
  -w "\nHTTP Status: %{http_code}\n"

echo "🔄 Checking if uploads directory was created..."
ls -la backend/uploads/staff/ 2>/dev/null || echo "Uploads directory not found"

echo "🧹 Cleanup..."
rm -f test-image.png
echo "✅ Test complete!"
