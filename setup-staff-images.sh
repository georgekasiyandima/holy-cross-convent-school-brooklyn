#!/bin/bash

# Staff Image Setup Script
# This script helps set up the staff image upload system

echo "🚀 Setting up Staff Image Upload System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📁 Creating necessary directories..."

# Create static image directory
mkdir -p frontend/public/staff-images
echo "✅ Created frontend/public/staff-images/"

# Ensure backend upload directories exist
mkdir -p backend/uploads/staff
echo "✅ Created backend/uploads/staff/"

echo "🔧 Installing dependencies..."

# Install frontend dependencies
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Install backend dependencies
cd ../backend
npm install
echo "✅ Backend dependencies installed"

cd ..

echo "🗄️ Setting up database..."

# Run database migrations
cd backend
npx prisma generate
npx prisma db push
echo "✅ Database setup complete"

cd ..

echo "🧪 Testing setup..."

# Check if backend can start
echo "Starting backend server..."
cd backend
timeout 10s npm run dev &
BACKEND_PID=$!

# Wait a moment for server to start
sleep 5

# Test if backend is responding
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "⚠️ Backend may need manual start"
fi

# Kill the test backend process
kill $BACKEND_PID 2>/dev/null

cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm start"
echo "3. Add staff images to: frontend/public/staff-images/"
echo "4. Or use the admin interface at: http://localhost:3000/admin/staff-upload"
echo ""
echo "📖 See STAFF_IMAGE_IMPLEMENTATION_GUIDE.md for detailed instructions"
echo ""
echo "🔍 Quick Test Commands:"
echo "curl http://localhost:5000/api/staff  # Test backend API"
echo "curl http://localhost:3000/staff      # Test frontend"
echo ""
