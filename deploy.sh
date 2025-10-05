#!/bin/bash

# Holy Cross Convent School - Deployment Script
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful! Build directory created."
    echo "📁 Build contents:"
    ls -la build/
else
    echo "❌ Build failed! No build directory found."
    exit 1
fi

echo "🎉 Frontend is ready for deployment!"
echo "📋 Next steps:"
echo "1. Push this code to GitHub"
echo "2. Deploy to Vercel using the GitHub repository"
echo "3. Set environment variables in Vercel dashboard"