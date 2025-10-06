# Render Database Fix

## 🚨 Issue Identified
The error shows: `Error code 14: Unable to open the database file`

This means the SQLite database file exists but can't be accessed due to file permissions or path issues.

## 🔧 Solution

### Update Render Environment Variables

In your Render dashboard, update the `DATABASE_URL` environment variable to:

```
DATABASE_URL=file:./prisma/dev.db
```

**OR** try the absolute path:

```
DATABASE_URL=file:/opt/render/project/src/backend/prisma/dev.db
```

### Alternative Solution: Use PostgreSQL

If SQLite continues to have issues on Render, we can switch to PostgreSQL:

1. **Create a PostgreSQL database** in Render
2. **Update DATABASE_URL** to the PostgreSQL connection string
3. **Run migrations** to set up the schema

### Quick Test

After updating the environment variable, test these endpoints:

- `https://holy-cross-convent-school-brooklyn.onrender.com/api/staff`
- `https://holy-cross-convent-school-brooklyn.onrender.com/api/board`

## Expected Results

✅ **Staff API** should return your 26 staff members
✅ **Board API** should return your 5 board members  
✅ **No more "Unable to open database file" errors**

## Next Steps

1. Update DATABASE_URL in Render dashboard
2. Wait for redeployment (2-3 minutes)
3. Test the endpoints
4. Check your website - should show real data!
