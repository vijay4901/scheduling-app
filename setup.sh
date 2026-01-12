#!/bin/bash

# Scheduling MVP - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Scheduling MVP - Quick Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not detected locally."
    echo "   You can use a cloud database like Neon instead."
    echo "   Visit: https://neon.tech"
    echo ""
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://localhost:5432/scheduling_mvp"

# Authentication
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional)
RESEND_API_KEY=""
FROM_EMAIL="noreply@yourdomain.com"

# Google Calendar (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# App URL
APP_URL="http://localhost:3000"
EOF
    echo "✅ .env file created with auto-generated secret"
else
    echo "✅ .env file already exists"
fi

# Create database if PostgreSQL is available locally
if command -v createdb &> /dev/null; then
    echo ""
    echo "🗄️  Setting up database..."
    
    if createdb scheduling_mvp 2>/dev/null; then
        echo "✅ Database 'scheduling_mvp' created"
    else
        echo "ℹ️  Database might already exist, continuing..."
    fi
fi

# Run Prisma migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "🎉 Your scheduling app is ready!"
echo ""
echo "Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Sign up to create your account"
echo "4. Create your first event type"
echo ""
echo "Optional:"
echo "- Setup email: Get Resend API key → Add to .env"
echo "- Setup calendar: Configure Google OAuth → Add to .env"
echo ""
echo "📚 Documentation:"
echo "- Quick start: SETUP.md"
echo "- Full guide: README.md"
echo "- Deploy: DEPLOYMENT.md"
echo ""
echo "Happy scheduling! 🚀"



