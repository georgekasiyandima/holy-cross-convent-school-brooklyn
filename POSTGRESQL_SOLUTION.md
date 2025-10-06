# PostgreSQL Solution for Render

## 🚨 SQLite Issues on Render

SQLite files can have permission issues on cloud platforms. PostgreSQL is more reliable for production deployments.

## 🔧 Quick PostgreSQL Setup

### Option 1: Use Render's PostgreSQL (Recommended)

1. **Create a PostgreSQL database in Render:**
   - Go to Render dashboard
   - Click "New" → "PostgreSQL"
   - Name it: `holy-cross-db`
   - Choose the same region as your backend

2. **Get the connection string:**
   - Copy the "External Database URL" from your PostgreSQL service
   - It looks like: `postgresql://user:password@host:port/database`

3. **Update your backend environment variables:**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

4. **Run database migrations:**
   - Add this to your Render build command:
   ```bash
   npm install && npm run prisma:generate && npm run prisma:deploy && npm run build
   ```

### Option 2: Use External PostgreSQL (Alternative)

1. **Use a free PostgreSQL service:**
   - [Neon](https://neon.tech) (free tier)
   - [Supabase](https://supabase.com) (free tier)
   - [Railway](https://railway.app) (free tier)

2. **Get connection string and update DATABASE_URL**

## 📋 Migration Steps

### 1. Update Prisma Schema (if needed)
Your current schema should work with PostgreSQL, but you might need to update the `datasource`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Update Build Command in Render
```bash
npm install && npm run prisma:generate && npm run prisma:deploy && npm run build
```

### 3. Seed the Database
After deployment, you'll need to populate the database with your existing data.

## 🎯 Benefits of PostgreSQL

- ✅ **More reliable** on cloud platforms
- ✅ **Better performance** for production
- ✅ **Automatic backups** (with Render)
- ✅ **No file permission issues**
- ✅ **Better concurrent access**

## 🚀 Quick Start

1. **Create PostgreSQL database in Render**
2. **Update DATABASE_URL environment variable**
3. **Update build command to include migrations**
4. **Redeploy**
5. **Seed with your existing data**

This will solve the SQLite permission issues permanently!
