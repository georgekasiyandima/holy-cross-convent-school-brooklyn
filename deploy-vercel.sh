#!/bin/bash

# Holy Cross Convent School - Vercel Deployment Script
# This script deploys the frontend to Vercel with public access

echo "🚀 Deploying Holy Cross Convent School to Vercel..."

# Navigate to frontend directory
cd frontend

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Logging into Vercel..."
vercel login

# Deploy to production with public access
echo "Deploying to production..."
vercel --prod --public

# Get the deployment URL
echo "Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')

echo "✅ Deployment complete!"
echo "🌐 Your school website is now live at: https://$DEPLOYMENT_URL"
echo "📧 Share this URL with the school: https://$DEPLOYMENT_URL"

# Return to root directory
cd ..









