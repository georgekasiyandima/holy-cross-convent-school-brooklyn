# 🔧 Vercel Deployment Fix

## Problem
```
Error: Command "cd frontend && npm install" exited with 1
sh: line 1: cd: frontend: No such file or directory
```

## Solution

Vercel needs to know that your frontend is in a subdirectory. You have **TWO options**:

---

## ✅ Option 1: Fix via Vercel Dashboard (RECOMMENDED)

This is the easiest and most reliable method:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Go to Settings → General**
   - Scroll down to **"Root Directory"**
   - Click **"Edit"**
   - Set it to: `frontend`
   - Click **"Save"**

3. **Update Build Settings** (in same section):
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
   - Click **"Save"**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on latest deployment
   - Select **"Use existing Build Cache"**
   - Click **"Redeploy"**

✅ **This should fix the issue immediately!**

---

## ✅ Option 2: Use Updated vercel.json (Alternative)

I've updated `vercel.json` to use the `builds` format which should work better with monorepos.

After the fix, you still need to **commit and push**:

```bash
git add vercel.json
git commit -m "Fix Vercel deployment configuration for monorepo"
git push origin main
```

Then Vercel will automatically redeploy with the new configuration.

---

## 🎯 Why This Happened

Vercel was trying to run commands from the repository root, but your React app is in the `frontend` subdirectory. Vercel needs to know:
- Where your frontend code is located (`frontend` folder)
- Where to run build commands from
- Where to find the built output (`frontend/build`)

---

## ✅ Verification

After applying the fix, check:

1. **Deployment logs** should show:
   - ✅ `Installing dependencies from npm`
   - ✅ `Running "npm run build"`
   - ✅ `Uploading build outputs`

2. **No errors** about "No such file or directory"

3. **Website loads** at your Vercel URL

---

## 📝 Quick Reference

**Root Directory**: `frontend`  
**Build Command**: `npm run build`  
**Output Directory**: `build`  
**Install Command**: `npm install`

---

**Status**: ✅ Fixed! Apply Option 1 (Vercel Dashboard) for immediate fix.

