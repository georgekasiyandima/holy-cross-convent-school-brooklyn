#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Holy Cross Backend - Production Database Seeder${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set!${NC}\n"
    echo -e "${YELLOW}Please set your production DATABASE_URL:${NC}"
    echo -e "${YELLOW}export DATABASE_URL=\"your-database-url-here\"${NC}\n"
    echo -e "Get your DATABASE_URL from:"
    echo -e "  1. Render Dashboard → Your PostgreSQL Database"
    echo -e "  2. Copy the 'External Database URL'\n"
    exit 1
fi

echo -e "${GREEN}✓${NC} DATABASE_URL is set"
echo -e "${BLUE}Database:${NC} ${DATABASE_URL:0:30}...\n"

# Confirm before proceeding
echo -e "${YELLOW}⚠️  This will seed your production database with sample data.${NC}"
echo -e "${YELLOW}⚠️  If data already exists, duplicates may be created.${NC}\n"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
fi

echo -e "\n${BLUE}Starting database seeding...${NC}\n"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Generate Prisma Client
echo -e "\n${BLUE}Generating Prisma Client...${NC}"
npx prisma generate

# Run migrations
echo -e "\n${BLUE}Running database migrations...${NC}"
npx prisma migrate deploy

# Run seed script
echo -e "\n${BLUE}Seeding database...${NC}"
npm run seed:remote

# Check result
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ Database seeded successfully!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════${NC}\n"
    echo -e "Test your API endpoints:"
    echo -e "  • https://holy-cross-convent-school-brooklyn.onrender.com/api/health"
    echo -e "  • https://holy-cross-convent-school-brooklyn.onrender.com/api/staff"
    echo -e "  • https://holy-cross-convent-school-brooklyn.onrender.com/api/news"
    echo -e "  • https://holy-cross-convent-school-brooklyn.onrender.com/api/events\n"
else
    echo -e "\n${RED}════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ❌ Seeding failed!${NC}"
    echo -e "${RED}════════════════════════════════════════════════${NC}\n"
    echo -e "Check the error messages above.\n"
    exit 1
fi









