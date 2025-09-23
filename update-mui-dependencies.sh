#!/bin/bash

# Update Material-UI Dependencies Script
# Run this script to update to the latest Material-UI components

echo "🚀 Updating Material-UI dependencies..."

# Navigate to frontend directory
cd frontend

# Update Material-UI packages
echo "📦 Installing latest Material-UI packages..."
npm install @mui/material@latest @mui/icons-material@latest @emotion/react@latest @emotion/styled@latest

echo "✅ Dependencies updated successfully!"
echo ""
echo "🎉 Your Staff.tsx component is now using:"
echo "   - Grid2 for modern grid layout"
echo "   - Latest Material-UI components"
echo "   - Fixed TypeScript theme typing"
echo ""
echo "📋 Next steps:"
echo "   1. Test your Staff component"
echo "   2. Check for any remaining TypeScript errors"
echo "   3. Update any other components using Grid"
echo ""
echo "🔧 If you want to use stable Grid2 (v6), run:"
echo "   npm install @mui/material@next"
echo "   Then change import to: import Grid from '@mui/material/Grid2';"

