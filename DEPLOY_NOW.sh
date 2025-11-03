#!/bin/bash

# 🚀 Quick Deployment Script for Holy Cross Convent School
# This script commits and pushes changes to trigger Vercel auto-deployment

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Show current status
echo "📋 Current git status:"
git status --short | head -20
echo ""

# Ask for confirmation
read -p "Do you want to commit and push these changes? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Add all changes (except those in .gitignore)
echo "📦 Staging changes..."
git add .

# Create commit
echo "💾 Creating commit..."
COMMIT_MESSAGE="Update website: Fix Info page images, Donate currency, History page enhancements, and deployment fixes"
git commit -m "$COMMIT_MESSAGE" || {
    echo "⚠️  No changes to commit or commit failed"
}

# Push to main branch
echo "📤 Pushing to GitHub (this will trigger Vercel deployment)..."
git push origin main || {
    echo "❌ Push failed. Check your git configuration and remote."
    exit 1
}

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 Vercel will automatically deploy in 2-3 minutes"
echo "📊 Check deployment status at: https://vercel.com/dashboard"
echo ""
echo "🔍 To verify deployment:"
echo "   1. Go to Vercel dashboard"
echo "   2. Check the Deployments tab"
echo "   3. Wait for green checkmark"
echo "   4. Visit your production URL"
echo ""
echo "✨ Deployment initiated successfully!"

