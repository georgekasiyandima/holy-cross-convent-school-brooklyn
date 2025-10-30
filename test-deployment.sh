#!/bin/bash

# Holy Cross Convent School - Deployment Test Script
# This script tests if your Vercel deployment is publicly accessible

echo "🔍 Testing Holy Cross Convent School Deployment Accessibility..."
echo ""

# Get the deployment URL from user
read -p "Enter your Vercel deployment URL (e.g., https://holy-cross-convent-school-brooklyn-xxx.vercel.app): " DEPLOYMENT_URL

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🧪 Testing deployment: $DEPLOYMENT_URL"
echo ""

# Test 1: Basic HTTP response
echo "1️⃣ Testing basic HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
echo "   HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Site responds with HTTP 200 (OK)"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "   ❌ HTTP 401 (Unauthorized) - Authentication required"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "   ❌ HTTP 403 (Forbidden) - Access denied"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "   ❌ HTTP 404 (Not Found) - Site not found"
else
    echo "   ⚠️  HTTP $HTTP_CODE - Unexpected response"
fi

echo ""

# Test 2: Check for authentication headers
echo "2️⃣ Checking for authentication requirements..."
AUTH_HEADERS=$(curl -s -I "$DEPLOYMENT_URL" | grep -i "www-authenticate\|authorization")
if [ -z "$AUTH_HEADERS" ]; then
    echo "   ✅ No authentication headers found"
else
    echo "   ❌ Authentication headers detected:"
    echo "   $AUTH_HEADERS"
fi

echo ""

# Test 3: Check if content loads
echo "3️⃣ Testing content accessibility..."
CONTENT_LENGTH=$(curl -s -I "$DEPLOYMENT_URL" | grep -i "content-length" | awk '{print $2}' | tr -d '\r\n')
if [ -n "$CONTENT_LENGTH" ] && [ "$CONTENT_LENGTH" -gt 1000 ]; then
    echo "   ✅ Content length: $CONTENT_LENGTH bytes (looks good)"
else
    echo "   ⚠️  Content length: $CONTENT_LENGTH bytes (might be an error page)"
fi

echo ""

# Test 4: Check for Vercel-specific headers
echo "4️⃣ Checking Vercel deployment info..."
VERCEL_SERVER=$(curl -s -I "$DEPLOYMENT_URL" | grep -i "x-vercel")
if [ -n "$VERCEL_SERVER" ]; then
    echo "   ✅ Vercel headers found:"
    echo "   $VERCEL_SERVER"
else
    echo "   ⚠️  No Vercel headers detected"
fi

echo ""

# Test 5: Test specific pages
echo "5️⃣ Testing specific pages..."

# Test homepage
HOME_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
echo "   Homepage: HTTP $HOME_RESPONSE"

# Test a potential admin or protected route
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/admin")
echo "   /admin route: HTTP $ADMIN_RESPONSE"

echo ""

# Summary
echo "📊 DIAGNOSTIC SUMMARY"
echo "===================="

if [ "$HTTP_CODE" = "200" ] && [ -z "$AUTH_HEADERS" ]; then
    echo "✅ GOOD NEWS: Your deployment appears to be publicly accessible!"
    echo "   - No authentication required"
    echo "   - Site responds normally"
    echo ""
    echo "🔗 Share this URL with the school: $DEPLOYMENT_URL"
    echo ""
    echo "📱 Test it yourself:"
    echo "   - Open in incognito/private mode"
    echo "   - Try from your phone using mobile data"
    echo "   - Ask someone else to test it"
    
elif [ "$HTTP_CODE" = "401" ] || [ -n "$AUTH_HEADERS" ]; then
    echo "❌ AUTHENTICATION ISSUE DETECTED"
    echo "   Your deployment requires authentication."
    echo ""
    echo "🔧 TO FIX:"
    echo "   1. Go to Vercel Dashboard → Your Project → Settings"
    echo "   2. Check 'Deployment Protection' section"
    echo "   3. Disable any protection settings"
    echo "   4. Check 'Security' section"
    echo "   5. Disable 'Build Logs and Source Protection'"
    echo ""
    echo "📖 See detailed guide: VERCEL_AUTHENTICATION_FIX.md"
    
else
    echo "⚠️  MIXED RESULTS"
    echo "   Some tests passed, but there might be issues."
    echo "   Check the individual test results above."
fi

echo ""
echo "🔄 After making changes, run this script again to test."
echo ""








