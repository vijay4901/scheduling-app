# 🔧 Signup Failed - Troubleshooting Guide

## Common Issue: Database Not Set Up on Production

If signup is failing on your deployed Vercel app, it's likely because the production database hasn't been configured yet.

---

## ✅ Solution: Complete Database Setup

### Step 1: Create Production Database (Neon)

1. Go to **[https://neon.tech](https://neon.tech)**
2. Sign up/login (free tier available)
3. Click **"Create a project"**
   - Project name: `scheduling-production`
   - Region: Choose closest to your users
4. **Copy the Connection String**
   - It looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

### Step 2: Add Database URL to Vercel

1. Go to **[https://vercel.com](https://vercel.com/dashboard)**
2. Select your project: `scheduling-app`
3. Go to **Settings** → **Environment Variables**
4. Add or Update:
   ```
   Name: DATABASE_URL
   Value: postgresql://your-neon-connection-string-here
   ```
5. Click **Save**

---

### Step 3: Run Database Migrations

You need to create the database tables. Run these commands in your terminal:

```bash
# Make sure you're in your project directory
cd "/Users/vijay.chouhan/Documents/Login Auth"

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (select your scheduling-app when prompted)
vercel link

# Pull production environment variables
vercel env pull .env.production

# Run Prisma migrations on production database
npx prisma migrate deploy
```

This will create all the necessary tables in your production database.

---

### Step 4: Redeploy on Vercel

After adding the `DATABASE_URL`:

1. Go to Vercel Dashboard
2. Click **Deployments** tab
3. Click **"⋯"** on the latest deployment
4. Click **"Redeploy"**

Or simply push any change to GitHub (Vercel auto-deploys).

---

## 🧪 Test Again

After completing the steps above:

1. Visit your Vercel URL
2. Go to `/signup`
3. Try creating an account
4. Should work now! ✅

---

## 🔍 Check Error Logs

If it still fails, check the error details:

### In Vercel Dashboard:
1. Go to your project
2. Click **Deployments** → Select latest
3. Click **"View Function Logs"**
4. Look for errors from `/api/auth/signup`

### Common Errors:

**"Can't reach database server"**
- Fix: Make sure `DATABASE_URL` is correct in Vercel
- Check: Neon database is active

**"Prepared statement already exists"** or **"Table doesn't exist"**
- Fix: Run `npx prisma migrate deploy` (Step 3 above)

**"Invalid connection string"**
- Fix: Make sure connection string includes `?sslmode=require`

---

## 📋 Quick Checklist

Before signup will work on production, you need:

- [ ] Neon database created
- [ ] `DATABASE_URL` added to Vercel environment variables
- [ ] Prisma migrations run on production database (`npx prisma migrate deploy`)
- [ ] Vercel redeployed with new environment variable
- [ ] At minimum, these environment variables in Vercel:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (your Vercel app URL)
  - `APP_URL` (your Vercel app URL)

---

## 🎯 Local Testing

If you want to test locally first:

```bash
# Make sure your local database is set up
npx prisma migrate dev

# Start dev server
npm run dev

# Test signup at http://localhost:3000/signup
```

---

## 💡 Alternative: Test with Existing Database

If you already have a local database with data:

1. Export your local data
2. Import to Neon
3. Or use your local database temporarily by tunneling

---

## 🆘 Still Not Working?

Check these files for more help:
- `DATABASE_SETUP.md` - Detailed database setup guide
- `DEPLOYMENT_QUICK_START.md` - Complete deployment guide
- `GITHUB_DEPLOYMENT.md` - Step-by-step deployment instructions

Or check the Vercel logs for the specific error message!


